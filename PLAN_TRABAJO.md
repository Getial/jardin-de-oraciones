# Jardín de Oraciones — Plan de Trabajo

**Última actualización:** 2026-05-30
**Estado general:** 🟢 En progreso — Fase 3

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
| 3 | Jardines e Invitaciones | 🟡 En progreso |
| 4 | Semillas e Interacciones | ⬜ Pendiente |
| 5 | Jardín Visual + Realtime | ⬜ Pendiente |
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
- [ ] Deploy inicial en Railway *(pendiente para Fase 3)*

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
- [ ] `Garden` (nombre, tipo, descripción, privacidad, owner)
- [ ] `GardenMembership` (usuario, jardín, rol: admin/miembro, fecha de unión)
- [ ] `Invitation` (jardín, código, link, estado, expiración)

### Pantallas
- [ ] Mis Jardines (lista de jardines con card: nombre, tipo, miembros, última actividad)
- [ ] Crear Jardín (selección de tipo, nombre, descripción, imagen opcional, privacidad)
- [ ] Invitar Miembros (generar código, link compartible, opciones: WhatsApp, correo)
- [ ] Unirse a jardín por código/link
- [ ] Ajustes del jardín (editar, gestionar miembros, salir)

### Lógica
- [ ] Roles: admin puede editar/invitar/eliminar; miembro puede sembrar e interactuar
- [ ] Expiración de invitaciones (configurable, default 7 días)
- [ ] Edge case: usuario que sale del jardín
- [ ] Edge case: eliminar jardín (solo admin)

---

## Fase 4 — Semillas e Interacciones

**Objetivo:** Núcleo funcional — sembrar, orar (regar), y ver historial espiritual.

### Modelos Django
- [ ] `Seed` (jardín, tipo, contenido, autor, privacidad, estado, fecha)
  - Tipos: `prayer`, `message`, `verse`, `gratitude`, `special_moment`
  - Estados: `active`, `answered`, `archived`
- [ ] `SeedInteraction` (semilla, usuario, tipo: `prayed`, `liked`, `commented`)
- [ ] `SeedEvent` (semilla, descripción del evento, fecha) — historial espiritual

### Pantallas
- [ ] Bottom sheet "Sembrar" (selección de tipo + form según tipo)
- [ ] Detalle de semilla (contenido + historial de eventos)
- [ ] Acción "Oré por esta petición 🙏" (regar)
- [ ] Marcar oración como respondida ✨
- [ ] Semillas privadas vs compartidas

### Lógica
- [ ] Historial espiritual por semilla (timeline de eventos)
- [ ] Sistema de permisos: ¿quién puede borrar semillas?
- [ ] Edge case: conflictos de edición simultánea

---

## Fase 5 — Jardín Visual + Realtime

**Objetivo:** La pantalla principal del jardín es inmersiva, viva y se actualiza en tiempo real.

### Sistema de crecimiento
- [ ] Definir fórmula de crecimiento por semilla (tiempo + interacciones + actividad)
- [ ] Estados: `tierra` → `semilla` → `brote` → `planta` → `flor` → `árbol` → `árbol especial`
- [ ] Lógica en Django para calcular y actualizar el estado de crecimiento

### Pantalla jardín (Home)
- [ ] Layout inmersivo (jardín ocupa casi toda la pantalla)
- [ ] Header: nombre del jardín, participantes, notificaciones
- [ ] FAB "+ Sembrar"
- [ ] Bottom nav: Jardines / Ajustes
- [ ] Plantas como elementos tocables (CSS/SVG animado por estado)
- [ ] Bottom sheet al tocar planta (info + historial + acciones)

### Animaciones placeholder (CSS/SVG)
- [ ] Estado `tierra vacía` — espacio disponible
- [ ] Estado `semilla` — punto pequeño
- [ ] Estado `brote 🌱` — animación suave de aparición
- [ ] Estado `planta 🌿` — movimiento de hojas (CSS keyframes)
- [ ] Estado `flor 🌸` — pétalos con ligera oscilación
- [ ] Estado `árbol 🌳` — presencia estable y cálida
- [ ] Animación de "regar" (agua cae, planta se mueve)
- [ ] Modo nocturno automático (por hora del sistema)

### Realtime
- [ ] Suscripción a Supabase Realtime: cuando alguien siembra o riega → jardín actualiza en vivo
- [ ] Indicador de quién está en el jardín en este momento (presencia)

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
