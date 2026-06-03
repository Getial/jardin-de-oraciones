from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from gardens.models import Garden, GardenMembership
from .models import Seed, SeedInteraction, SeedEvent
from .serializers import SeedSerializer, SeedCreateSerializer, SeedEventSerializer


def _assert_member(garden, user):
    if not GardenMembership.objects.filter(garden=garden, user=user).exists():
        raise PermissionDenied('No eres miembro de este jardín.')


class GardenSeedListView(APIView):
    def get(self, request, garden_id):
        garden = get_object_or_404(Garden, pk=garden_id)
        _assert_member(garden, request.user)
        seeds = Seed.objects.filter(
            Q(garden=garden, privacy=Seed.PRIVACY_SHARED) |
            Q(garden=garden, author=request.user)
        ).select_related('author').distinct()
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
    def post(self, request, pk):
        seed = get_object_or_404(Seed, pk=pk)
        _assert_member(seed.garden, request.user)
        interaction, created = SeedInteraction.objects.get_or_create(
            seed=seed, user=request.user, type=SeedInteraction.TYPE_PRAYED,
        )
        if created:
            seed.pray_count += 1
            seed.save(update_fields=['pray_count'])
            seed.garden.touch()
            display = request.user.display_name or request.user.email
            SeedEvent.objects.create(
                seed=seed,
                description=f'{display} oró 🙏',
                created_by=request.user,
            )
        else:
            interaction.delete()
            seed.pray_count = max(0, seed.pray_count - 1)
            seed.save(update_fields=['pray_count'])
        return Response({'prayed': created, 'pray_count': seed.pray_count})


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
