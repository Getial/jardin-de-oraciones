from datetime import timedelta
from django.conf import settings
from django.db.models import Q, Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from gardens.models import Garden, GardenMembership
from .models import Seed, SeedInteraction, SeedEvent
from .serializers import SeedSerializer, SeedCreateSerializer, SeedEventSerializer

# Tope de bonificación por racha (puntos extra por oración)
STREAK_BONUS_CAP = 4


def _assert_member(garden, user):
    if not GardenMembership.objects.filter(garden=garden, user=user).exists():
        raise PermissionDenied('No eres miembro de este jardín.')


class GardenSeedListView(APIView):
    def get(self, request, garden_id):
        garden = get_object_or_404(Garden, pk=garden_id)
        _assert_member(garden, request.user)
        # Prefetch de las oraciones de HOY del usuario → evita 1 query por semilla
        # para calcular prayed_today (ver SeedSerializer.get_prayed_today).
        my_today = SeedInteraction.objects.filter(
            user=request.user,
            type=SeedInteraction.TYPE_PRAYED,
            created_at__date=timezone.localdate(),
        )
        seeds = Seed.objects.filter(
            Q(garden=garden, privacy=Seed.PRIVACY_SHARED) |
            Q(garden=garden, author=request.user)
        ).select_related('author').prefetch_related(
            Prefetch('interactions', queryset=my_today, to_attr='my_today_prayers')
        ).distinct()
        return Response(SeedSerializer(seeds, many=True, context={'request': request}).data)


class SeedListCreateView(APIView):
    def post(self, request):
        serializer = SeedCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        garden = serializer.validated_data['garden']
        _assert_member(garden, request.user)
        seed = serializer.save(author=request.user)
        garden.touch()
        SeedEvent.objects.create(
            seed=seed,
            description='Semilla sembrada 🌱',
            created_by=request.user,
        )
        return Response(
            SeedSerializer(seed, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class SeedDetailView(APIView):
    def _get_seed(self, pk, user):
        seed = get_object_or_404(Seed, pk=pk)
        _assert_member(seed.garden, user)
        if seed.privacy == Seed.PRIVACY_PRIVATE and seed.author != user:
            raise NotFound()
        return seed

    def get(self, request, pk):
        seed = self._get_seed(pk, request.user)
        data = SeedSerializer(seed, context={'request': request}).data
        data['events'] = SeedEventSerializer(seed.events.all(), many=True).data
        return Response(data)

    def patch(self, request, pk):
        seed = self._get_seed(pk, request.user)
        if seed.author != request.user:
            raise PermissionDenied('Solo el autor puede editar esta semilla.')
        serializer = SeedCreateSerializer(seed, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        seed = serializer.save()
        return Response(SeedSerializer(seed, context={'request': request}).data)

    def delete(self, request, pk):
        seed = self._get_seed(pk, request.user)
        is_admin = GardenMembership.objects.filter(
            garden=seed.garden, user=request.user, role=GardenMembership.ROLE_ADMIN
        ).exists()
        if seed.author != request.user and not is_admin:
            raise PermissionDenied('No tienes permiso para eliminar esta semilla.')
        seed.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SeedPrayView(APIView):
    """
    Orar = regar. Máximo una vez al día por usuario y semilla.
    El crecimiento es acumulativo (nunca baja) y la racha de días consecutivos
    da puntos extra por oración.
    """

    def post(self, request, pk):
        seed = get_object_or_404(Seed, pk=pk)
        _assert_member(seed.garden, request.user)
        today = timezone.localdate()

        # Solo en desarrollo: ?dev=1 ignora el límite de 1 oración/día (para testear crecimiento)
        force = settings.DEBUG and request.query_params.get('dev') == '1'

        already = not force and SeedInteraction.objects.filter(
            seed=seed, user=request.user, type=SeedInteraction.TYPE_PRAYED,
            created_at__date=today,
        ).exists()
        if already:
            return Response(self._state(seed, prayed_today=True, already=True))

        SeedInteraction.objects.create(
            seed=seed, user=request.user, type=SeedInteraction.TYPE_PRAYED,
        )

        # Racha por semilla: cuenta los días-calendario con actividad
        if seed.last_pray_date == today:
            pass  # ya hubo oraciones hoy; la racha no avanza otra vez
        elif seed.last_pray_date == today - timedelta(days=1):
            seed.current_streak += 1
        else:
            seed.current_streak = 1
        seed.last_pray_date = today

        bonus = min(max(seed.current_streak - 1, 0), STREAK_BONUS_CAP)
        seed.growth_points += 1 + bonus
        seed.pray_count += 1
        seed.save(update_fields=[
            'growth_points', 'pray_count', 'current_streak', 'last_pray_date',
        ])
        seed.garden.touch()

        display = request.user.display_name or request.user.email
        racha = f' · racha {seed.current_streak} días 🔥' if seed.current_streak > 1 else ''
        SeedEvent.objects.create(
            seed=seed,
            description=f'{display} oró 🙏{racha}',
            created_by=request.user,
        )
        return Response(self._state(seed, prayed_today=True, already=False))

    def _state(self, seed, prayed_today, already):
        return {
            'prayed_today': prayed_today,
            'already': already,
            'pray_count': seed.pray_count,
            'growth_points': seed.growth_points,
            'current_streak': seed.current_streak,
        }


class SeedAnswerView(APIView):
    def post(self, request, pk):
        seed = get_object_or_404(Seed, pk=pk)
        if seed.author != request.user:
            raise PermissionDenied('Solo el autor puede marcar como respondida.')
        seed.state = Seed.STATE_ANSWERED
        seed.save(update_fields=['state'])
        SeedEvent.objects.create(
            seed=seed,
            description='¡Oración respondida! ✨',
            created_by=request.user,
        )
        return Response(SeedSerializer(seed, context={'request': request}).data)
