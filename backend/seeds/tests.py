import uuid
from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from users.models import User
from gardens.models import Garden, GardenMembership
from seeds.models import Seed, SeedInteraction


def make_user(email):
    return User.objects.create(email=email, supabase_uid=uuid.uuid4())


class SeedPrayTests(APITestCase):
    def setUp(self):
        self.author = make_user('autor@test.com')
        self.garden = Garden.objects.create(
            name='Jardín', type=Garden.TYPE_PERSONAL, owner=self.author,
        )
        GardenMembership.objects.create(
            garden=self.garden, user=self.author, role=GardenMembership.ROLE_ADMIN,
        )
        self.seed = Seed.objects.create(
            garden=self.garden, author=self.author,
            type=Seed.TYPE_PRAYER, content='Una petición', privacy=Seed.PRIVACY_SHARED,
        )
        self.url = f'/api/seeds/{self.seed.id}/pray/'
        self.client.force_authenticate(user=self.author)

    def _simulate_prior_day(self, days_ago, **fields):
        """Deja la semilla como si la última oración hubiera sido hace N días."""
        Seed.objects.filter(pk=self.seed.pk).update(
            last_pray_date=timezone.localdate() - timedelta(days=days_ago), **fields,
        )

    def test_una_oracion_suma_un_punto(self):
        r = self.client.post(self.url)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.data['prayed_today'])
        self.assertFalse(r.data['already'])
        self.assertEqual(r.data['pray_count'], 1)
        self.assertEqual(r.data['growth_points'], 1)
        self.assertEqual(r.data['current_streak'], 1)

    def test_segunda_oracion_mismo_dia_no_suma(self):
        self.client.post(self.url)
        r = self.client.post(self.url)
        self.assertTrue(r.data['already'])
        self.assertEqual(r.data['growth_points'], 1)
        self.seed.refresh_from_db()
        self.assertEqual(self.seed.pray_count, 1)

    def test_dias_consecutivos_aumentan_la_racha_y_el_bonus(self):
        # Día 1
        self.client.post(self.url)  # points=1, streak=1
        # Simular que esa oración fue ayer (racha activa, sin oración hoy)
        self._simulate_prior_day(1)
        SeedInteraction.objects.filter(seed=self.seed).update(
            created_at=timezone.now() - timedelta(days=1),
        )
        # Día 2 (consecutivo)
        r = self.client.post(self.url)
        self.assertEqual(r.data['current_streak'], 2)
        self.assertEqual(r.data['growth_points'], 3)  # 1 + (1 + bonus 1)

    def test_bonus_topa_en_cuatro(self):
        # Racha de 5 días previa → esta oración da 1 + min(5,4) = 5 puntos
        self._simulate_prior_day(1, current_streak=5, growth_points=10, pray_count=5)
        r = self.client.post(self.url)
        self.assertEqual(r.data['current_streak'], 6)
        self.assertEqual(r.data['growth_points'], 15)

    def test_racha_se_reinicia_pero_los_puntos_no_bajan(self):
        # Última oración hace 3 días → la racha se corta pero el crecimiento se mantiene
        self._simulate_prior_day(3, current_streak=3, growth_points=6, pray_count=3)
        r = self.client.post(self.url)
        self.assertEqual(r.data['current_streak'], 1)
        self.assertEqual(r.data['growth_points'], 7)  # 6 + 1, nunca baja

    def test_no_miembro_no_puede_orar(self):
        intruso = make_user('intruso@test.com')
        self.client.force_authenticate(user=intruso)
        r = self.client.post(self.url)
        self.assertEqual(r.status_code, 403)
        self.seed.refresh_from_db()
        self.assertEqual(self.seed.pray_count, 0)


class SeedAnswerTests(APITestCase):
    def setUp(self):
        self.author = make_user('autor@test.com')
        self.garden = Garden.objects.create(
            name='Jardín', type=Garden.TYPE_PERSONAL, owner=self.author,
        )
        GardenMembership.objects.create(
            garden=self.garden, user=self.author, role=GardenMembership.ROLE_ADMIN,
        )
        self.seed = Seed.objects.create(
            garden=self.garden, author=self.author,
            type=Seed.TYPE_PRAYER, content='Petición', privacy=Seed.PRIVACY_SHARED,
        )
        self.url = f'/api/seeds/{self.seed.id}/answer/'

    def test_autor_marca_como_respondida(self):
        self.client.force_authenticate(user=self.author)
        r = self.client.post(self.url)
        self.assertEqual(r.status_code, 200)
        self.seed.refresh_from_db()
        self.assertEqual(self.seed.state, Seed.STATE_ANSWERED)

    def test_no_autor_no_puede_marcar_respondida(self):
        otro = make_user('otro@test.com')
        GardenMembership.objects.create(
            garden=self.garden, user=otro, role=GardenMembership.ROLE_MEMBER,
        )
        self.client.force_authenticate(user=otro)
        r = self.client.post(self.url)
        self.assertEqual(r.status_code, 403)
        self.seed.refresh_from_db()
        self.assertEqual(self.seed.state, Seed.STATE_ACTIVE)
