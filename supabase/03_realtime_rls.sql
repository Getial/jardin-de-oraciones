-- ============================================================
-- RLS + Realtime seguro para las semillas
--
-- Contexto:
--  - Django se conecta como el rol "postgres" (dueño de las tablas),
--    por lo que NO se ve afectado por RLS (el dueño queda exento mientras
--    no usemos FORCE ROW LEVEL SECURITY). El API sigue funcionando igual.
--  - El cliente del navegador (anon / authenticated) sí queda restringido.
--
-- PRE-REQUISITO: confirmar que las tablas son propiedad de "postgres"
--   (ver consulta de verificación en el chat) antes de ejecutar.
-- ============================================================

-- 1) Habilitar RLS en las tablas de la app.
--    Sin políticas, anon/authenticated no pueden leer NADA vía PostgREST
--    (cierra cualquier acceso directo accidental). Django (dueño) sigue igual.
alter table public.gardens_garden           enable row level security;
alter table public.gardens_gardenmembership enable row level security;
alter table public.gardens_invitation       enable row level security;
alter table public.seeds_seed               enable row level security;
alter table public.seeds_seedinteraction    enable row level security;
alter table public.seeds_seedevent          enable row level security;

-- 2) Función de visibilidad de una semilla (SECURITY DEFINER):
--    corre como "postgres" para poder leer membresías/usuarios sin chocar
--    con la RLS de esas tablas. Devuelve true si el usuario autenticado
--    puede ver la semilla (miembro del jardín + compartida, o es el autor).
create or replace function public.can_read_seed(
  seed_garden uuid,
  seed_privacy text,
  seed_author uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    exists (
      select 1
      from gardens_gardenmembership m
      join users u on u.id = m.user_id
      where m.garden_id = seed_garden
        and u.supabase_uid = auth.uid()
    )
    and (
      seed_privacy = 'shared'
      or exists (
        select 1 from users au
        where au.id = seed_author
          and au.supabase_uid = auth.uid()
      )
    );
$$;

grant execute on function public.can_read_seed(uuid, text, uuid) to authenticated;

-- 3) Política de SELECT sobre seeds_seed para Realtime
grant select on public.seeds_seed to authenticated;

drop policy if exists "realtime_seeds_select" on public.seeds_seed;
create policy "realtime_seeds_select"
on public.seeds_seed
for select
to authenticated
using ( public.can_read_seed(garden_id, privacy, author_id) );

-- 4) Publicar seeds_seed en Realtime (es la tabla que escucha el frontend)
alter publication supabase_realtime add table public.seeds_seed;
