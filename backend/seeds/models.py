import uuid
from django.db import models
from django.conf import settings


class Seed(models.Model):
    TYPE_PRAYER = 'prayer'
    TYPE_MESSAGE = 'message'
    TYPE_VERSE = 'verse'
    TYPE_GRATITUDE = 'gratitude'
    TYPE_SPECIAL_MOMENT = 'special_moment'

    TYPES = [
        (TYPE_PRAYER, 'Petición'),
        (TYPE_MESSAGE, 'Mensaje'),
        (TYPE_VERSE, 'Versículo'),
        (TYPE_GRATITUDE, 'Gratitud'),
        (TYPE_SPECIAL_MOMENT, 'Momento especial'),
    ]

    STATE_ACTIVE = 'active'
    STATE_ANSWERED = 'answered'
    STATE_ARCHIVED = 'archived'

    STATES = [
        (STATE_ACTIVE, 'Activa'),
        (STATE_ANSWERED, 'Respondida'),
        (STATE_ARCHIVED, 'Archivada'),
    ]

    PRIVACY_SHARED = 'shared'
    PRIVACY_PRIVATE = 'private'

    PRIVACY = [
        (PRIVACY_SHARED, 'Compartida'),
        (PRIVACY_PRIVATE, 'Solo yo'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    garden = models.ForeignKey(
        'gardens.Garden', on_delete=models.CASCADE, related_name='seeds'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seeds'
    )
    type = models.CharField(max_length=20, choices=TYPES, default=TYPE_PRAYER)
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    privacy = models.CharField(max_length=10, choices=PRIVACY, default=PRIVACY_SHARED)
    state = models.CharField(max_length=10, choices=STATES, default=STATE_ACTIVE)
    pray_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'seeds_seed'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.get_type_display()} — {self.garden}'


class SeedInteraction(models.Model):
    TYPE_PRAYED = 'prayed'

    TYPES = [
        (TYPE_PRAYED, 'Oré'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seed = models.ForeignKey(Seed, on_delete=models.CASCADE, related_name='interactions')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seed_interactions'
    )
    type = models.CharField(max_length=10, choices=TYPES, default=TYPE_PRAYED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'seeds_seedinteraction'
        unique_together = ('seed', 'user', 'type')

    def __str__(self):
        return f'{self.user} oró → {self.seed}'


class SeedEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seed = models.ForeignKey(Seed, on_delete=models.CASCADE, related_name='events')
    description = models.CharField(max_length=300)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='seed_events'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'seeds_seedevent'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.seed} — {self.description[:50]}'
