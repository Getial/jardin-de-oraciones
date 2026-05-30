-- ============================================================
-- Jardín de Oraciones — Supabase setup inicial
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Extensiones ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Tabla users (espejo de auth.users) ───────────────────────
-- Django maneja sus propias migraciones para esta tabla.
-- Aquí solo configuramos RLS para que Supabase Realtime
-- y Storage puedan referenciarla.

-- ── Storage: bucket de imágenes ──────────────────────────────
insert into storage.buckets (id, name, public)
values ('garden-images', 'garden-images', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('seed-media', 'seed-media', false)
on conflict do nothing;

-- ── RLS: Storage garden-images ────────────────────────────────
-- Cualquier usuario autenticado puede subir su propia imagen
create policy "Authenticated users can upload garden images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'garden-images');

create policy "Garden images are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'garden-images');

create policy "Users can delete own garden images"
on storage.objects for delete
to authenticated
using (bucket_id = 'garden-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── RLS: Storage seed-media ───────────────────────────────────
create policy "Authenticated users can upload seed media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'seed-media');

create policy "Authenticated users can read seed media"
on storage.objects for select
to authenticated
using (bucket_id = 'seed-media');
