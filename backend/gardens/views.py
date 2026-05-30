from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError

from .models import Garden, GardenMembership, Invitation
from .serializers import (
    GardenSerializer, GardenCreateSerializer,
    MemberSerializer, InvitationSerializer,
)


class GardenListCreateView(APIView):
    def get(self, request):
        gardens = Garden.objects.filter(
            memberships__user=request.user
        ).prefetch_related('memberships__user')
        return Response(GardenSerializer(gardens, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = GardenCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        garden = serializer.save()
        return Response(
            GardenSerializer(garden, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class GardenDetailView(APIView):
    def _get_garden_and_membership(self, pk, user):
        try:
            garden = Garden.objects.prefetch_related('memberships__user').get(pk=pk)
        except Garden.DoesNotExist:
            raise NotFound('Jardín no encontrado.')
        membership = garden.memberships.filter(user=user).first()
        if not membership:
            raise PermissionDenied('No eres miembro de este jardín.')
        return garden, membership

    def get(self, request, pk):
        garden, _ = self._get_garden_and_membership(pk, request.user)
        return Response(GardenSerializer(garden, context={'request': request}).data)

    def patch(self, request, pk):
        garden, membership = self._get_garden_and_membership(pk, request.user)
        if membership.role != GardenMembership.ROLE_ADMIN:
            raise PermissionDenied('Solo los administradores pueden editar el jardín.')
        serializer = GardenSerializer(garden, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        garden, _ = self._get_garden_and_membership(pk, request.user)
        if garden.owner != request.user:
            raise PermissionDenied('Solo el dueño puede eliminar el jardín.')
        garden.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GardenMembersView(APIView):
    def get(self, request, pk):
        try:
            garden = Garden.objects.get(pk=pk, memberships__user=request.user)
        except Garden.DoesNotExist:
            raise NotFound('Jardín no encontrado.')
        members = garden.memberships.select_related('user').all()
        return Response(MemberSerializer(members, many=True).data)


class GardenLeaveView(APIView):
    def post(self, request, pk):
        try:
            membership = GardenMembership.objects.get(garden_id=pk, user=request.user)
        except GardenMembership.DoesNotExist:
            raise NotFound('No eres miembro de este jardín.')
        if membership.garden.owner == request.user:
            raise ValidationError('El dueño no puede salir del jardín. Elimínalo o transfiere la propiedad.')
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GardenInviteView(APIView):
    def get(self, request, pk):
        """Obtiene o crea la invitación activa del jardín."""
        try:
            garden = Garden.objects.get(pk=pk, memberships__user=request.user)
        except Garden.DoesNotExist:
            raise NotFound('Jardín no encontrado.')

        membership = garden.memberships.get(user=request.user)
        if membership.role != GardenMembership.ROLE_ADMIN:
            raise PermissionDenied('Solo los administradores pueden generar invitaciones.')

        invitation = garden.invitations.filter(status=Invitation.STATUS_ACTIVE).first()
        if not invitation or not invitation.is_valid:
            if invitation:
                invitation.status = Invitation.STATUS_EXPIRED
                invitation.save(update_fields=['status'])
            invitation = Invitation.objects.create(garden=garden, created_by=request.user)

        return Response(InvitationSerializer(invitation).data)


class JoinGardenView(APIView):
    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        if not code:
            raise ValidationError('Se requiere el código de invitación.')

        try:
            invitation = Invitation.objects.select_related('garden').get(code=code)
        except Invitation.DoesNotExist:
            raise NotFound('Código de invitación no válido.')

        if not invitation.is_valid:
            raise ValidationError('Esta invitación ya venció o fue usada.')

        if GardenMembership.objects.filter(garden=invitation.garden, user=request.user).exists():
            raise ValidationError('Ya eres miembro de este jardín.')

        GardenMembership.objects.create(
            garden=invitation.garden,
            user=request.user,
            role=GardenMembership.ROLE_MEMBER,
        )
        invitation.garden.touch()

        return Response(
            GardenSerializer(invitation.garden, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )
