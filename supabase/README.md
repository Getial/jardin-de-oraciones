# Supabase — Setup

## Orden de ejecución

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Habilitar **Auth > Providers > Email** (habilitado por default)
3. Ir a **SQL Editor** y ejecutar en orden:
   - `01_setup.sql` — extensiones, buckets de storage y políticas RLS
4. Copiar las variables al `.env` del backend:
   - `DATABASE_URL` → Settings > Database > Connection string (Session mode)
   - `SUPABASE_JWT_SECRET` → Settings > API > JWT Secret
   - `SUPABASE_URL` → Settings > API > Project URL
5. Copiar las variables al `.env` del frontend:
   - `VITE_SUPABASE_URL` → Settings > API > Project URL
   - `VITE_SUPABASE_ANON_KEY` → Settings > API > anon/public key
6. Correr migraciones de Django: `python manage.py migrate`
7. Ejecutar `02_realtime.sql` (después de las migraciones Django)

## Notas

- Django es dueño del schema — las migraciones las maneja Django, no Supabase.
- Supabase Auth es la fuente de verdad de identidad (UUID del usuario).
- Supabase Realtime escucha cambios en las tablas de Django directamente.
