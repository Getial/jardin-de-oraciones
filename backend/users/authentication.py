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
    Valida el JWT emitido por Supabase Auth contra la llave pública del JWKS.
    Solo se aceptan algoritmos asimétricos (RS256/ES256): incluir HS256 sería
    inseguro porque la llave del JWKS es pública (riesgo de algorithm confusion).
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
                algorithms=['RS256', 'ES256'],
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
        display_name = (payload.get('user_metadata') or {}).get('display_name', '')
        if not supabase_uid:
            raise AuthenticationFailed('Token sin sub (uid).')

        user, created = User.objects.get_or_create(
            supabase_uid=supabase_uid,
            defaults={'email': email, 'display_name': display_name},
        )
        if not created:
            fields = []
            if user.email != email and email:
                user.email = email
                fields.append('email')
            if display_name and user.display_name != display_name:
                user.display_name = display_name
                fields.append('display_name')
            if fields:
                user.save(update_fields=fields)

        return user
