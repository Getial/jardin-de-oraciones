import uuid
import secrets
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Garden(models.Model):
    TYPE_PERSONAL = 'personal'
    TYPE_COUPLE = 'couple'
    TYPE_FAMILY = 'family'
    TYPE_FRIENDS = 'friends'
    TYPE_PRAYER_GROUP = 'prayer_group'

    TYPES = [
        (TYPE_PERSONAL, 'Personal'),
        (TYPE_COUPLE, 'Pareja'),
        (TYPE_FAMILY, 'Familia'),
        (TYPE_FRIENDS, 'Amigos'),
        (TYPE_PRAYER_GROUP, 'Grupo de oración'),
    ]

    PRIVACY_PRIVATE = 'private'
    PRIVACY_INVITE = 'invite_only'

    PRIVACY = [
        (PRIVACY_PRIVATE, 'Privado'),
        (PRIVACY_INVITE, 'Solo invitados'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPES, default=TYPE_PERSONAL)
    description = models.CharField(max_length=300, blank=True)
    image_url = models.URLField(blank=True)
    privacy = models.CharField(max_length=20, choices=PRIVACY, default=PRIVACY_INVITE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_gardens'
    )
    last_activity_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gardens_garden'
        ordering = ['-last_activity_at']

    def __str__(self):
        return self.name

    def touch(self):
        self.last_activity_at = timezone.now()
        self.save(update_fields=['last_activity_at'])


class GardenMembership(models.Model):
    ROLE_ADMIN = 'admin'
    ROLE_MEMBER = 'member'

    ROLES = [
        (ROLE_ADMIN, 'Administrador'),
        (ROLE_MEMBER, 'Miembro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    garden = models.ForeignKey(Garden, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships'
    )
    role = models.CharField(max_length=10, choices=ROLES, default=ROLE_MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gardens_gardenmembership'
        unique_together = ('garden', 'user')

    def __str__(self):
        return f'{self.user} — {self.garden} ({self.role})'


class Invitation(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_USED = 'used'
    STATUS_EXPIRED = 'expired'

    STATUSES = [
        (STATUS_ACTIVE, 'Activa'),
        (STATUS_USED, 'Usada'),
        (STATUS_EXPIRED, 'Vencida'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    garden = models.ForeignKey(Garden, on_delete=models.CASCADE, related_name='invitations')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_invitations'
    )
    code = models.CharField(max_length=8, unique=True, db_index=True)
    status = models.CharField(max_length=10, choices=STATUSES, default=STATUS_ACTIVE)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gardens_invitation'

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self._generate_unique_code()
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def _generate_unique_code(self):
        while True:
            code = secrets.token_urlsafe(6)[:8].upper()
            if not Invitation.objects.filter(code=code).exists():
                return code

    @property
    def is_valid(self):
        return self.status == self.STATUS_ACTIVE and self.expires_at > timezone.now()

    def __str__(self):
        return f'{self.code} → {self.garden}'
