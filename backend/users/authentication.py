import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Valida el JWT emitido por Supabase Auth.
    El frontend envía: Authorization: Bearer <supabase_access_token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1]
        payload = self._decode_token(token)

        user = self._get_or_create_user(payload)
        return (user, token)

    def _decode_token(self, token):
        secret = settings.SUPABASE_JWT_SECRET
        if not secret:
            raise AuthenticationFailed('SUPABASE_JWT_SECRET no configurado.')
        try:
            return jwt.decode(
                token,
                secret,
                algorithms=['HS256'],
                options={'verify_exp': True},
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expirado.')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Token inválido: {e}')

    def _get_or_create_user(self, payload):
        supabase_uid = payload.get('sub')
        email = payload.get('email', '')
        if not supabase_uid:
            raise AuthenticationFailed('Token sin sub (uid).')

        user, _ = User.objects.get_or_create(
            supabase_uid=supabase_uid,
            defaults={'email': email},
        )
        # Sincronizar email si cambió en Supabase
        if user.email != email and email:
            user.email = email
            user.save(update_fields=['email'])

        return user
