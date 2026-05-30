import jwt
from jwt import PyJWKClient
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User

_jwks_client = None


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(
            f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json",
            cache_keys=True,
        )
    return _jwks_client


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Valida el JWT emitido por Supabase Auth via JWKS (soporta RS256 y HS256).
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
        if not settings.SUPABASE_URL:
            raise AuthenticationFailed('SUPABASE_URL no configurado.')
        try:
            signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=['RS256', 'HS256', 'ES256'],
                options={'verify_exp': True, 'verify_aud': False},
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expirado.')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Token inválido: {e}')
        except Exception as e:
            raise AuthenticationFailed(f'Error de autenticación: {e}')

    def _get_or_create_user(self, payload):
        supabase_uid = payload.get('sub')
        email = payload.get('email', '')
        if not supabase_uid:
            raise AuthenticationFailed('Token sin sub (uid).')

        user, _ = User.objects.get_or_create(
            supabase_uid=supabase_uid,
            defaults={'email': email},
        )
        if user.email != email and email:
            user.email = email
            user.save(update_fields=['email'])

        return user
