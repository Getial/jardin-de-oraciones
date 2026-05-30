import base64
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

        # Supabase firma con el secreto base64-decodificado.
        # Intentamos primero con los bytes decodificados y luego con el string raw.
        keys_to_try = []
        try:
            keys_to_try.append(base64.b64decode(secret))
        except Exception:
            pass
        keys_to_try.append(secret)

        # Obtener el algoritmo real del header del token
        try:
            header = jwt.get_unverified_header(token)
            alg = header.get('alg', 'HS256')
        except jwt.exceptions.DecodeError as e:
            raise AuthenticationFailed(f'Token malformado: {e}')

        last_error = None
        for key in keys_to_try:
            try:
                return jwt.decode(
                    token,
                    key,
                    algorithms=[alg],
                    options={'verify_exp': True},
                )
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Token expirado.')
            except jwt.InvalidTokenError as e:
                last_error = e
                continue

        raise AuthenticationFailed(f'Token inválido: {last_error}')

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
