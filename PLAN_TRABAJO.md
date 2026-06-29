# Jardín de Oraciones — Plan de Trabajo

**Última actualización:** 2026-07-02
**Estado general:** 🟢 En progreso — Fase 5 (pulido) · deploy backend a Railway en curso

---

## Stack Tecnológico

| Capa | Tecnología | Deploy |
|------|-----------|--------|
| Frontend | React + Vite JS (PWA) | Vercel |
| Backend | Django + Django REST Framework | Railway |
| Base de datos | Supabase PostgreSQL | Supabase |
| Auth | Supabase Auth (JWT validado por Django) | Supabase |
| Storage | Supabase Storage | Supabase |
| Realtime | Supabase Realtime | Supabase |
| Animaciones | CSS/SVG placeholders → Rive (fase posterior) | — |

---

## Resumen de fases

| Fase | Nombre | Estado |
|------|--------|--------|
| 1 | Fundaciones y Setup | ✅ Completa |
| 2 | Autenticación | ✅ Completa |
| 3 | Jardines e Invitaciones | ✅ Completa |
| 4 | Semillas e Interacciones | ✅ Completa |
| 5 | Jardín Visual + Realtime | 🟡 En progreso |
| 6 | Notificaciones y PWA | ⬜ Pendiente |
| 7 | Pulido y MVP Launch | ⬜ Pendiente |

---

## Fase 1 — Fundaciones y Setup

**Objetivo:** Tener la base del proyecto corriendo end-to-end en local y con deploy inicial en staging.

### Frontend
- [x] Scaffold React + Vite (JavaScript)
- [x] Configurar PWA (vite-plugin-pwa, manifest, service worker base)
- [x] Instalar y configurar Tailwind CSS v4
- [x] Definir design tokens (colores, tipografía, spacing, bordes)
- [x] Configurar ESLint + Prettier
- [x] Deploy inicial en Vercel (rama `master`) — https://jardin-de-oraciones.vercel.app

### Backend
- [x] Scaffold Django + Django REST Framework
- [x] Conectar Django a Supabase PostgreSQL (DATABASE_URL)
- [x] Integración de Supabase Auth: middleware para validar JWT de Supabase en Django
- [x] Configurar variables de entorno (.env local y en Railway)
- [x] Backend listo para Railway: settings por entorno, whitenoise (estáticos), Procfile (migrate + collectstatic + gunicorn), CSRF/seguridad de proxy
- [ ] Deploy del backend en Railway *(en curso — pruebas de producción)*

### Supabase
- [x] Crear proyecto en Supabase
- [x] Habilitar Auth (email/password)
- [x] Crear bucket en Storage para imágenes de jardines y semillas *(SQL listo en supabase/01_setup.sql)*
- [x] Configurar Row Level Security (RLS) base *(SQL listo en supabase/01_setup.sql)*

---

## Fase 2 — Autenticación

**Objetivo:** Flujo completo de auth desde la app.

### Pantallas
- [x] Pantalla de Login
  - [x] Logo + ilustración de planta (placeholder SVG)
  - [x] Frase bíblica rotativa
  - [x] Form: email + contraseña
  - [x] Link a registro y recuperar contraseña
- [x] Pantalla de Registro
- [x] Recuperar contraseña (flujo Supabase)
- [ ] Perfil básico de usuario (nombre, avatar) *(movido a Fase 7 — Ajustes)*

### Lógica
- [x] Auth store global (Zustand)
- [x] Protección de rutas autenticadas (ProtectedRoute)
- [x] Persistencia de sesión (refresh token de Supabase)
- [x] Onboarding mínimo post-registro (pantalla de confirmación de email)

---

## Fase 3 — Jardines e Invitaciones

**Objetivo:** Un usuario puede crear jardines, invitar personas y gestionar miembros.

### Modelos Django
- [x] `Garden` (nombre, tipo, descripción, privacidad, owner)
- [x] `GardenMembership` (usuario, jardín, rol: admin/miembro, fecha de unión)
- [x] `Invitation` (jardín, código, link, estado, expiración)

### Pantallas
- [x] Mis Jardines (lista de jardines con card: nombre, tipo, miembros, última actividad)
- [x] Crear Jardín (selección de tipo, nombre, descripción, imagen opcional, privacidad)
- [x] Invitar Miembros (generar código, link compartible, opciones: WhatsApp, correo)
- [x] Unirse a jardín por código/link (auto-join desde URL `?code=`)
- [ ] Ajustes del jardín (editar, gestionar miembros, salir) *(movido a Fase 7)*

### Lógica
- [x] Roles: admin puede editar/invitar/eliminar; miembro puede sembrar e interactuar
- [x] Expiración de invitaciones (configurable, default 7 días)
- [x] Edge case: usuario que sale del jardín
- [x] Edge case: eliminar jardín (solo admin)
- [x] JWT RS256 validado via JWKS (`PyJWKClient` → Supabase JWKS endpoint)
- [x] Pantalla de recuperación de contraseña (`/reset-password`) con flujo `PASSWORD_RECOVERY`

---

## Fase 4 — Semillas e Interacciones

**Objetivo:** Núcleo funcional — sembrar, orar (regar), y ver historial espiritual.

### Modelos Django
- [x] `Seed` (jardín, tipo, contenido, autor, privacidad, estado, fecha)
  - Tipos: `prayer`, `message`, `verse`, `gratitude`, `special_moment`
  - Estados: `active`, `answered`, `archived`
- [x] `SeedInteraction` (semilla, usuario, tipo: `prayed`)
- [x] `SeedEvent` (semilla, descripción del evento, fecha) — historial espiritual

### Pantallas
- [x] Bottom sheet "Sembrar" (selección de tipo + form según tipo)
- [x] Detalle de semilla (contenido + historial de eventos)
- [x] Acción "Orar hoy 🙏" (acumulativa, 1 vez al día, sin deshacer)
- [x] Marcar oración como respondida ✨ (solo el autor)
- [x] Semillas privadas vs compartidas

### Lógica
- [x] Historial espiritual por semilla (timeline de eventos) — carga lazy con skeleton
- [x] Sistema de permisos: autor o admin puede borrar
- [x] `display_name` sincronizado desde JWT Supabase en cada request
- [x] `author_id` expone el `supabase_uid` (coincide con la sesión del front)

---

## Fase 5 — Jardín Visual + Realtime

**Objetivo:** La pantalla principal del jardín es inmersiva, viva y se actualiza en tiempo real.

### Sistema de crecimiento (rediseñado)
- [x] Crecimiento por `growth_points` acumulativos (nunca baja, no se marchita)
- [x] Etapas: 0→tierra, 1-3→semilla, 4-9→brote, 10-19→planta, 20-39→flor, 40+→árbol
- [x] Orar = regar, **máx. 1 vez al día** por usuario y semilla (campo `prayed_today`)
- [x] **Racha por semilla** (días consecutivos): bonus de +1 punto/día hasta +4 por oración
- [x] Oración respondida → la planta llega como mínimo a Flor (`getPlantStage`)
- [x] Backfill de `growth_points = pray_count` para semillas existentes (migración 0002)

### Pantalla jardín (Home)
- [x] Layout inmersivo full-screen (imagen de fondo, sin tarjetas)
- [x] Plantas pequeñas dispersas en la pradera con perspectiva (posición estable por hash del id)
- [x] Header flotante con nombre, tipo, miembros
- [x] FAB "+ Sembrar"
- [x] Sin bottom nav en el jardín (volver con ← del header)
- [x] Plantas como elementos tocables (SVG animado por estado)
- [x] Bottom sheet al tocar planta (info + historial + orar + acciones)
- [x] Badge por planta con 🙏 oraciones, 🔥 racha y ✨ respondida

### Fondos por hora del día (CSS/SVG + imágenes)
- [x] 4 fondos ilustrados: amanecer (5-8h), día (8-17h), atardecer (17-19h), nocturno (19-5h)
- [x] Selección automática según hora del sistema
- [x] Selector manual oculto para desarrollo (long-press en el nombre del jardín)
- [x] Plantas con paleta nocturna en el periodo nocturno

### Animaciones placeholder (CSS/SVG)
- [x] Estado `tierra` — montículo de tierra con semilla
- [x] Estado `semilla` — brote pequeño emergiendo
- [x] Estado `brote` — tallo con 2 hojas, animación sway
- [x] Estado `planta` — tallo alto con 4 hojas, sway
- [x] Estado `flor` — planta con pétalos, sway + bloom
- [x] Estado `árbol` — árbol con copa completa + destellos
- [x] Animación de regar al orar (nube + lluvia + pop de crecimiento)
- [x] Brote (`sproutIn`) + halo de luz al sembrar una semilla nueva
- [x] Entrada suave de plantas al cargar / estado de carga del jardín
- [x] Luciérnagas flotantes en modo nocturno

### Realtime
- [x] Suscripción Supabase Realtime a `seeds_seed` filtrada por `garden_id`
- [x] `02_realtime.sql` ejecutado (habilitar publicación de tablas)
- [ ] Indicador de presencia (v2)

### UX / Pulido
- [x] Cierre optimista al orar y al sembrar (no espera al backend)
- [x] Anti-solapamiento de plantas (las nuevas se reubican; las viejas no se mueven)
- [x] Badge compacto (✨ respondida · 🙏 oraciones · 🔥 racha)
- [x] Toast de error (ej. al fallar el sembrado)
- [x] Atajo de dev: orar sin límite diario (`?dev=1`, solo en DEBUG)

### Accesibilidad / Contraste (WCAG AA)
- [x] Colores de marca oscurecidos para ≥4.5:1 (`primary`, `error`, `success`)
- [x] Opacidad de paneles del jardín ajustada (header, badges, vacío) verificada al peor caso de fondo

### Performance (frontend)
- [x] Code splitting por ruta (React.lazy + Suspense)
- [x] Vendor chunks separados (react, supabase) para mejor caché
- [x] Fondos optimizados a WebP (~8.5 MB → ~543 KB total, −94%)

---

## Fase 6 — Notificaciones y PWA

**Objetivo:** La app funciona offline, es instalable y envía notificaciones push.

### PWA
- [ ] Service Worker con estrategia de caché (jardín reciente offline)
- [ ] Web App Manifest completo (iconos, splash, colores)
- [ ] Installable prompt
- [ ] Offline: ver jardín e historial reciente sin conexión

### Notificaciones
- [ ] Web Push API (VAPID keys en Django)
- [ ] Suscripción al push desde el frontend
- [ ] Notificaciones clave:
  - [ ] "Dayana oró por tu petición 🙏"
  - [ ] "Tu jardín floreció hoy 🌸"
  - [ ] Invitación recibida

---

## Fase 7 — Pulido y MVP Launch

**Objetivo:** Todo el MVP funciona, está pulido y listo para primeros usuarios reales.

### Edge cases y robustez
- [ ] Jardines abandonados (sin actividad por N días — visual tranquilo, no castigo)
- [ ] Invitaciones vencidas
- [ ] Manejo de errores global (toasts, estados vacíos, loading states)
- [ ] Validaciones de formularios

### Ajustes
- [ ] Ajustes de usuario (nombre, avatar, cambiar contraseña)
- [ ] Ajustes del jardín (editar, permisos, notificaciones del jardín)

### Calidad
- [ ] Revisión de accesibilidad (contraste, navegación por teclado)
- [ ] Pruebas manuales del flujo completo (golden path + edge cases)
- [ ] Optimización de performance (Lighthouse PWA score)
- [ ] Variables de entorno de producción revisadas

### Deploy final
- [ ] Frontend en Vercel (producción)
- [ ] Backend en Railway (producción)
- [ ] Supabase en tier adecuado para producción

---

## Notas y decisiones de arquitectura

### Auth: Supabase Auth + Django
Django valida los JWT emitidos por Supabase Auth usando la clave JWKS pública de Supabase.
El usuario existe en Supabase Auth y en la DB (tabla `users` de Django sincronizada).

### Realtime
Las actualizaciones del jardín (nuevas semillas, nuevas interacciones) se publican via Supabase Realtime.
El frontend se suscribe directamente a los canales de Supabase Realtime (sin pasar por Django para este caso).

### Animaciones Rive
Los placeholders CSS/SVG se diseñan con la misma state machine conceptual que tendrá Rive:
`idle → wind → grow → water → flourish → night_mode → sparkle`
para facilitar la migración posterior.

### Supabase como DB de Django
Django se conecta a Supabase PostgreSQL via `DATABASE_URL` con `dj-database-url`.
Las migraciones las maneja Django. Supabase RLS se configura para las tablas que necesitan acceso directo desde el cliente (Realtime, Storage).

---

## Ideas v2 (fuera del MVP)

- App móvil nativa con React Native + Expo
- Notificaciones push avanzadas (programadas, recordatorios)
- Audio en semillas
- Banco del jardín 🪑
- Cápsula del tiempo ⏳
- Árbol de promesas bíblicas 🌳
- IA para sugerir versículos
- Widgets móviles
- Estadísticas espirituales suaves
