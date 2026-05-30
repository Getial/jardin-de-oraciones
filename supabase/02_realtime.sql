-- ============================================================
-- Realtime: habilitar publicaciones para las tablas que
-- el frontend escucha en vivo.
-- Ejecutar después de que Django haya corrido sus migraciones.
-- ============================================================

-- Publicar cambios de semillas e interacciones para el jardín en vivo
alter publication supabase_realtime add table seeds_seed;
alter publication supabase_realtime add table seeds_seedinteraction;
alter publication supabase_realtime add table gardens_garden;
