import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, supabase_uid, email, **extra):
        user = self.model(supabase_uid=supabase_uid, email=email, **extra)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, supabase_uid, email, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(supabase_uid, email, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Mismo UUID que Supabase Auth — es la fuente de verdad de identidad
    supabase_uid = models.UUIDField(unique=True, db_index=True)
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=80, blank=True)
    avatar_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['supabase_uid']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.display_name or self.email
