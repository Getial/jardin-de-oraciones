# Code Review — Jardín de Oraciones

**Fecha:** 2026-07-02
**Revisado por:** Claude (code-review skill) · nivel **high**
**Stack:** React 19 + Vite + Zustand (frontend) · Django 6 + DRF (backend) · Supabase (Auth, PostgreSQL, Realtime, Storage)
**Alcance:** Revisión arquitectural + módulos núcleo (auth, jardines, semillas/crecimiento, jardín visual, tema) y cambios recientes (modo oscuro, PlantSVG, prep de deploy a Railway).

> **Actualización 2026-07-02:** resueltos **todos los Altos** (A1, A2, A3, A4, A5 — ver estado en cada hallazgo). Pendientes: los Medios (M1–M6) y Bajos.

---

## 1. Resumen ejecutivo

El proyecto está **sólido y bien organizado**: separación limpia de capas (stores Zustand → servicio `api` → vistas DRF → modelos), configuración de producción manejada por entorno, y una pasada reciente de accesibilidad (AA) y performance (WebP −94 %, code splitting) que eleva la calidad.

Los hallazgos más importantes son de **seguridad y rendimiento**, no de funcionamiento:

- **A1** — la validación de JWT acepta `HS256` junto a llaves públicas de JWKS (confusión de algoritmos).
- **A2** — el frontend se suscribe a **Supabase Realtime con la anon key**, saltándose la capa de permisos de Django; si las tablas de semillas no tienen RLS, se pueden filtrar semillas privadas de otros jardines.
- **A3** — N+1 queries en los listados de jardines y semillas.

Ninguno bloquea el deploy de **pruebas**, pero A1 y A2 deben resolverse **antes de abrir a usuarios reales**. La mayor deuda estructural es la **ausencia total de tests** sobre la lógica nueva de crecimiento/racha.

---

## 2. Hallazgos críticos y altos

### A1 ✅ Resuelto (2026-07-02) — Se permitía `HS256` con llaves asimétricas de JWKS
**Archivo:** `backend/users/authentication.py:45`
**Estado:** corregido → `algorithms=['RS256', 'ES256']` (se quitó HS256) + docstring actualizado.

```python
signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
return jwt.decode(
    token, signing_key.key,
    algorithms=['RS256', 'HS256', 'ES256'],   # ← HS256 sobra
    options={'verify_exp': True, 'verify_aud': False},
)
```

**Problema:** `signing_key.key` es una **llave pública** (RS256/ES256) obtenida del JWKS de Supabase — información pública. Incluir `HS256` habilita el patrón clásico de *algorithm confusion*: un atacante podría firmar un token con `alg: HS256` usando esa llave pública como secreto HMAC y forjar la identidad de cualquier usuario (`sub`/`email`). En PyJWT 2.13.0 el intento probablemente falle porque la llave es un objeto y no bytes, pero **depender de ese detalle de implementación es frágil** — es seguridad por accidente.

**Fix:** dejar solo algoritmos asimétricos (los que Supabase realmente emite) y actualizar el docstring (línea 23):
```python
algorithms=['RS256', 'ES256'],
```

---

### A2 ✅ Resuelto (2026-07-02) — Realtime con anon key podía exponer semillas privadas
**Archivo:** `frontend/src/stores/seedStore.js` (`subscribeToGarden`) · tablas `seeds_seed`
**Estado:** corregido vía `supabase/03_realtime_rls.sql` → RLS habilitada en todas las tablas de la app; política `realtime_seeds_select` (función `can_read_seed`, SECURITY DEFINER, mapea `auth.uid()`→`users.supabase_uid`) restringe la lectura por Realtime a miembros del jardín (compartidas) o autor (privadas). El frontend pasa el token del usuario a Realtime (`setAuth`). Django (dueño `postgres`) queda exento de RLS.

```js
supabase.channel(`garden-seeds-${gardenId}`)
  .on('postgres_changes',
      { event: '*', schema: 'public', table: 'seeds_seed', filter: `garden_id=eq.${gardenId}` },
      () => get().fetchSeeds(gardenId))
  .subscribe()
```

**Problema:** la suscripción Realtime corre **directo contra Supabase con la anon key**, sin pasar por la capa de permisos de Django (`_assert_member`, privacidad de semillas). Las tablas de semillas se crearon vía migraciones de Django, que **no habilitan RLS**. Con `postgres_changes` y RLS deshabilitada, cualquier cliente con la anon key puede suscribirse a **cualquier `garden_id`** y recibir el contenido de filas — incluidas **semillas privadas de jardines ajenos**.

> En el flujo actual solo se usa el payload para disparar un `fetchSeeds` (que sí filtra en Django), así que la UI no muestra datos ajenos. Pero el **canal de Realtime sí entrega las filas completas** a quien escuche; un cliente malicioso puede leerlas directo. Si se confirma que RLS está deshabilitada, esto sube a **🔴 Crítico**.

**Fix (elegir uno):**
1. Habilitar **RLS** en `seeds_seed`/`seeds_seedinteraction` con políticas por membresía y activar la *Realtime Authorization* de Supabase (canales privados), o
2. No suscribirse a la tabla completa: usar un canal de *broadcast* que emita solo un "ping" (sin contenido) cuando cambie algo, y que Django/el front recarguen vía API.

---

### A3 ✅ Resuelto (2026-07-02) — N+1 queries en los listados
**Archivos:** `backend/gardens/serializers.py`, `backend/seeds/serializers.py`, `backend/seeds/views.py`
**Estado:** corregido → jardines usan la caché del `prefetch` (`len(memberships.all())` y recorrido en Python para `my_role`); semillas usan un `Prefetch` de las oraciones de hoy (`to_attr='my_today_prayers'`) con fallback puntual en el detalle. Verificado: jardines = 3 queries constantes, semillas = 2 queries constantes (antes crecía con N).

```python
def get_member_count(self, obj):
    return obj.memberships.count()           # 1 query por jardín
def get_my_role(self, obj):
    membership = obj.memberships.filter(user=request.user).first()  # otra query por jardín
```
Y en semillas, `get_prayed_today` hace `obj.interactions.filter(...).exists()` por cada semilla.

**Problema:** el `prefetch_related('memberships__user')` del list view no se aprovecha porque `.count()` y `.filter().first()` lanzan queries nuevas. Para N jardines → ~2N queries; para N semillas → N queries extra. Hoy con pocos datos no se nota, pero escala linealmente con el contenido por usuario.

**Fix (jardines):**
```python
# en la vista
gardens = (Garden.objects.filter(memberships__user=request.user)
           .annotate(member_count=Count('memberships'))
           .prefetch_related('memberships'))
# en el serializer: leer obj.member_count (annotate) y calcular my_role desde el prefetch en Python
```
Para semillas, prefetch de las interacciones del usuario del día y resolver `prayed_today` en memoria.

---

### A4 ✅ Resuelto (2026-07-02) — El fallback de `API_URL` rompía en producción
**Archivo:** `frontend/src/services/api.js:4-8`
**Estado:** corregido → el fallback no-local ya no inventa `http://host:8000`; usa mismo origen y emite `console.warn` si falta `VITE_API_URL`.

```js
const API_URL =
  import.meta.env.VITE_API_URL ||
  (hostname === 'localhost' || hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : `http://${hostname}:8000`)   // ← en vercel.app arma http://...vercel.app:8000
```

**Problema:** si falta `VITE_API_URL` en el build (ya ocurrió), en producción arma un host equivocado, puerto inexistente y **`http://` (mixed-content)** sobre una página HTTPS → falla silenciosa difícil de diagnosticar.

**Fix:** que el fallback de "no-localhost" no invente puerto (usar mismo origen o quedar vacío y advertir):
```js
const API_URL = import.meta.env.VITE_API_URL ||
  (hostname === 'localhost' || hostname === '127.0.0.1' ? 'http://localhost:8000' : '')
```

---

### A5 ✅ Resuelto (2026-07-02) — `SECRET_KEY` con default inseguro silencioso
**Archivo:** `backend/core/settings.py:10`
**Estado:** corregido → con `DEBUG=False`, si `SECRET_KEY` está vacía o es la insegura por defecto, el server lanza `RuntimeError` y no arranca.

```python
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-insecure-key-change-in-production')
```

**Problema:** si en Railway falta la variable, el server arranca con una clave **conocida/pública** (compromete firmas de sesión de admin, tokens CSRF, etc.) sin avisar.

**Fix:** exigirla cuando `DEBUG=False`:
```python
if not DEBUG and SECRET_KEY == 'dev-insecure-key-change-in-production':
    raise RuntimeError('DJANGO_SECRET_KEY no configurada en producción')
```

---

## 3. Hallazgos medios

| ID | Dimensión | Hallazgo | Archivo |
|----|-----------|----------|---------|
| M1 | Testabilidad | ✅ **Resuelto (2026-07-02).** 8 tests en `seeds/tests.py` cubren la lógica de crecimiento/racha (1/día, bonus, tope, monotonía) + permisos de orar/responder. Corren con SQLite (`DATABASE_URL="" DEBUG=True python manage.py test seeds`). | `backend/seeds/tests.py` |
| M2 | Consistencia | ✅ **Resuelto (2026-07-02).** `MemberSerializer.user_id` ahora expone `user.supabase_uid` (coincide con la sesión del frontend). | `gardens/serializers.py:8` |
| M3 | Calidad | ✅ **Resuelto (2026-07-02).** Reordenado + auto-unión con `.then/.catch`; lint del frontend 100% limpio (también se quitó el `get` sin usar en `gardenStore`). | `pages/JoinGardenPage.jsx` |
| M4 | Seguridad | `except Exception as e: AuthenticationFailed(f'... {e}')` filtra detalle interno al cliente; el docstring dice "soporta RS256 y HS256" (desactualizado). | `users/authentication.py:52` |
| M5 | UX/Robustez | `fetchGardens` guarda `error` en el store pero la UI no lo muestra → fallos de red silenciosos. Sin paginación en listados. | `stores/gardenStore.js:15`, `pages/GardensPage.jsx` |
| M6 | Calidad | `authStore.init` se suscribe a `onAuthStateChange` sin guardar/limpiar la suscripción; si `init` se llamara más de una vez, se acumulan listeners. | `stores/authStore.js:13` |

---

## 4. Hallazgos bajos

| ID | Hallazgo | Archivo |
|----|----------|---------|
| L1 | `computeLayout` es O(n²) con espiral de hasta 40 intentos por planta (ok a la escala actual). | `pages/GardenDetailPage.jsx` |
| L2 | `Object.values(err)[0]` puede ser un array (errores de campo DRF) → el mensaje se ve como `"a,b"`. | `services/api.js:27` |
| L3 | `GardenDetailPage` ~430 líneas mezcla layout, animación de regado, brote, luciérnagas y render; se podría dividir. | `pages/GardenDetailPage.jsx` |
| L4 | El código de invitación hace `secrets.token_urlsafe(6)[:8].upper()`: el `.upper()` reduce la entropía (colapsa mayúsc./minúsc.); hay reintento por unicidad, así que es menor. | `gardens/models.py` |

---

## 5. Fortalezas destacadas

- **Configuración de producción por entorno** bien hecha: `DEBUG`, `ALLOWED_HOSTS` (auto-agrega dominio de Railway), CORS, CSRF, whitenoise, `SECURE_PROXY_SSL_HEADER`.
- **Secretos fuera de git** — `.env` correctamente en `.gitignore`, ningún `.env` trackeado.
- **Permisos consistentes en la API** — `_assert_member`, autor/admin para borrar, privacidad de semillas en las vistas REST.
- **Accesibilidad AA verificada** (contraste calculado al peor caso) y **optimización real** (WebP, code splitting, vendor chunks).
- **UX cuidada** — cierre optimista al orar/sembrar, animaciones, anti-solapamiento de plantas con posiciones estables.

---

## 6. Recomendaciones priorizadas

1. ~~**Quitar `HS256`** de los algoritmos JWT (A1).~~ ✅ Hecho.
2. ~~**Asegurar Realtime** (A2) — RLS + política por membresía.~~ ✅ Hecho.
3. ~~**Arreglar el fallback de `API_URL`** (A4) y **endurecer `SECRET_KEY`** en prod (A5).~~ ✅ Hecho.
4. ~~**Resolver N+1** en los listados (A3).~~ ✅ Hecho.
5. ~~**Agregar tests** a `SeedPrayView` (M1) y unificar identidad por `supabase_uid` (M2).~~ ✅ Hecho.
6. ~~Limpiar el error de **ESLint** (M3).~~ ✅ Hecho. Falta: mostrar **errores de red** en la UI (M5), `except Exception` (M4), cleanup de listener (M6). **← siguiente**

---

_Generado por la skill de code-review (nivel high). Revisión basada en lectura estática; no se ejecutaron los tests porque no existen._
