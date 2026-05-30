# Jardín de Oraciones 🌱

**Documento Funcional + Diseño + Arquitectura (PWA v1)**

**Versión:** 1.0
**Estado:** Planeación / Diseño UX
**Plataforma inicial:** PWA (Mobile First)

---

# 1. Visión del producto

## Propósito

**Jardín de Oraciones** es una aplicación enfocada en el crecimiento espiritual compartido mediante espacios colaborativos llamados **jardines**, donde los usuarios pueden sembrar:

- Oraciones 🙏
- Mensajes 💌
- Versículos 📖
- Gratitudes ✨
- Momentos especiales 🌸

El objetivo es transformar acciones espirituales y emocionales en una experiencia visual significativa, donde el jardín refleja el cuidado, acompañamiento y constancia.

La aplicación no está enfocada únicamente en parejas; puede usarse con:

- Pareja ❤️
- Familia 👨‍👩‍👧
- Amigos 🫂
- Mentor espiritual 📖
- Grupo de oración 🙏
- Uso personal 🌱

---

# 2. Filosofía de diseño del producto

La app debe transmitir:

### Sensaciones principales

- Paz
- Cercanía
- Calidez
- Crecimiento
- Fe
- Esperanza

### Lo que NO debe sentirse

- Infantil
- Excesivamente romántica
- Saturada visualmente
- Gamificada en exceso
- Artificial

La experiencia debe sentirse:

> íntima, acogedora y espiritual.

---

# 3. Concepto principal

Cada jardín es un espacio vivo.

Las acciones del usuario tienen impacto visual.

Ejemplo:

### Acción real

Una persona ora por una petición.

### Resultado emocional

La otra persona se siente acompañada.

### Resultado visual

La planta es regada y crece 🌱

---

# 4. Arquitectura conceptual

```txt
Usuario
 ├── Jardines
 │      ├── Semillas
 │      ├── Miembros
 │      ├── Actividad
 │      └── Configuración
```

Un usuario puede tener múltiples jardines.

Ejemplo:

```txt
🌱 Mi jardín personal
❤️ Felipe & Dayana
👨‍👩‍👧 Familia
🙏 Grupo de oración
🫂 Amigos
```

---

# 5. Tipos de jardines

## 🌱 Personal

Privado.

Enfoque:

- Reflexión
- Gratitud
- Peticiones personales
- Diario espiritual

---

## ❤️ Pareja

Más íntimo.

Funciones relevantes:

- Mensajes cortos
- Oraciones compartidas
- Momentos especiales
- Recuerdos

Visual:

- Flores suaves
- Iluminación cálida

---

## 👨‍👩‍👧 Familia

Enfoque familiar.

Ejemplos:

- Salud
- Situaciones familiares
- Celebraciones
- Gratitud

Visual:

- Árbol central fuerte

---

## 🫂 Amigos

Más casual.

Ejemplos:

- Exámenes
- Ánimo
- Trabajo
- Retos personales

---

## 🙏 Grupo de oración

Enfoque comunitario.

Ejemplos:

- Peticiones colectivas
- Seguimiento espiritual

---

# 6. Flujo de pantallas

```txt
Login
   ↓
Mis jardines
   ↓
Seleccionar jardín
   ↓
Jardín (Home)
   ↓
Detalle de semilla
   ↓
Interacciones
```

Accesos secundarios:

```txt
Mis jardines
   ├── Crear jardín
   ├── Invitar miembros
   └── Ajustes
```

---

# 7. Pantallas principales

## 7.1 Login

### Objetivo

Permitir autenticación.

### Componentes

- Logo
- Ilustración de planta
- Email
- Contraseña
- Recuperar contraseña
- Crear cuenta
- Frase bíblica rotativa

### Mensaje emocional

La pantalla debe sentirse acogedora.

Ejemplo:

> Un espacio para crecer juntos en fe.

---

## 7.2 Mis Jardines (Pantalla principal)

### Objetivo

Gestionar jardines.

### Componentes

#### Actividad reciente

Ejemplo:

> Dayana oró por una petición 🙏

---

#### Lista de jardines

Cada card contiene:

- Nombre
- Tipo
- Número de miembros
- Última actividad
- Miniatura visual
- Indicador de actividad

Ejemplo:

```txt
❤️ Felipe & Dayana
2 miembros
Última actividad: hoy
```

---

#### Botón principal

**Crear jardín**

---

## 7.3 Crear jardín

### Selección de tipo

Opciones:

- ❤️ Pareja
- 👨‍👩‍👧 Familia
- 🫂 Amigos
- 🙏 Grupo de oración
- 🌱 Personal

---

### Datos del jardín

Campos:

- Nombre
- Descripción corta
- Imagen opcional
- Configuración de privacidad

---

## 7.4 Invitar miembros

Métodos:

- Código
- Link compartido
- WhatsApp
- Correo

### Roles

#### Administrador

Puede:

- Editar jardín
- Invitar miembros
- Eliminar semillas
- Gestionar permisos

#### Miembro

Puede:

- Sembrar
- Interactuar
- Orar
- Ver actividad

---

## 7.5 Jardín (Home principal)

### Objetivo

Ser el alma emocional de la app.

### Diseño

Pantalla inmersiva.

El jardín ocupa casi toda la pantalla.

### UI mínima

Header:

- nombre del jardín
- participantes
- notificaciones

FAB:
**+ Sembrar**

Bottom nav:

- Jardines
- Ajustes

---

## Interacción principal

Se toca una planta.

Se abre:

### Bottom Sheet

Con:

- información
- historial
- acciones

---

# 8. Semillas

## 🙏 Oración

Representación:
Planta verde.

### Acción principal

**“Oré por esta petición”**

La planta se riega.

### Animación

- agua cae
- planta se mueve
- pequeño crecimiento

---

## 💌 Mensaje

Representación:
Flor.

### Acción

**“Me alegró el día ❤️”**

---

## 📖 Versículo

Representación:
Planta luminosa.

### Acción

**“Este versículo me habló ✨”**

---

## ✨ Gratitud

Representación:
Flor clara.

### Acción

**“También agradezco 🙌”**

---

## 🌸 Momento especial

Representación:
Flor o árbol especial.

Puede incluir:

- imagen
- audio
- nota
- fecha

---

# 9. Sistema de crecimiento

Las plantas NO crecen solo por tiempo.

Se combinan factores.

### Variables

```txt
Tiempo +
Interacciones +
Actividad +
Estado espiritual
```

---

## Estados de crecimiento

### 0. Tierra vacía

Espacio disponible.

---

### 1. Semilla

Recién plantada.

---

### 2. Brote 🌱

Primeras interacciones.

---

### 3. Planta 🌿

Cuidado constante.

---

### 4. Flor 🌸

Mucho acompañamiento.

---

### 5. Árbol 🌳

Oración respondida.

---

### 6. Árbol especial ✨

Evento muy significativo.

Ejemplo:

- matrimonio
- sanidad
- meta cumplida

---

# 10. Mecánica principal

## Orar = Regar

La interacción más importante del sistema.

Cuando alguien presiona:

> 🙏 Oré por esta petición

Sucede:

1. Registro de interacción.
2. Animación de agua.
3. Planta se nutre.
4. Crecimiento progresivo.

Mensaje opcional:

> Dayana oró por esta petición 🙏

---

# 11. Historial espiritual

Cada semilla guarda eventos.

Ejemplo:

```txt
29 mayo
Felipe sembró esta oración

30 mayo
Dayana oró 🙏

2 junio
Felipe volvió a orar 🙏

5 junio
Marcada como respondida ✨
```

Esto convierte el jardín en memoria.

---

# 12. Sistema emocional del jardín

El jardín refleja actividad.

### Más actividad

- más flores
- luz cálida
- maripositas
- brillo suave

### Menos actividad

- ambiente tranquilo
- menos movimiento

No se debe percibir como castigo.

---

## Jardín nocturno 🌙

Automático.

Elementos:

- luciérnagas
- cielo nocturno
- iluminación cálida
- estrellas suaves

---

# 13. Rive (Jardín)

## Uso

Rive se usará exclusivamente para:

### Jardín interactivo

Elementos animados:

- plantas
- agua
- viento
- hojas
- partículas
- clima
- crecimiento

---

## State Machine sugerida

```txt
idle
wind
grow
water
flourish
night_mode
sparkle
```

---

## Eventos

```txt
plantSeed
waterPlant
grow
answeredPrayer
night
day
```

---

# 14. Paleta de colores

## Fondo principal

`#F7F5EF`

---

## Verde oliva principal

`#7A8F63`

---

## Verde suave

`#A8B79A`

---

## Tierra cálida

`#C7B299`

---

## Dorado suave

`#D9C7A2`

---

## Texto principal

`#2D2D2D`

---

## Texto secundario

`#6E6E6E`

---

## Error

`#D66A5E`

---

## Éxito

`#7CA26A`

---

# 15. Reglas de diseño

## Estilo visual

Debe sentirse:

```txt
cozy
minimalista
espiritual
cálido
moderno
orgánico
```

---

## Bordes

Rounded:
`20px–28px`

---

## Sombras

Muy suaves.

Nunca agresivas.

---

## Animaciones

Lentas y suaves.

Evitar:

- rebotes exagerados
- flashes
- saturación visual

---

## Espaciado

Sistema base:

```txt
4
8
12
16
24
32
```

---

## Tipografía

Estilo:
minimalista y amigable.

Evitar:
tipografías infantiles.

---

# 16. Cosas fáciles de pasar por alto

## 1. Permisos

¿Quién puede borrar semillas?

---

## 2. Jardines abandonados

¿Qué pasa si nadie interactúa?

---

## 3. Invitaciones vencidas

---

## 4. Usuarios que salen del jardín

---

## 5. Privacidad

Semillas:

- privadas
- compartidas

---

## 6. Conflictos de edición

Dos personas interactúan al mismo tiempo.

---

## 7. Notificaciones

Ejemplos:

> Dayana oró por tu petición 🙏

> Tu jardín floreció hoy 🌸

---

## 8. Offline mode (PWA)

Debe permitir:

- abrir jardín
- ver historial reciente

aunque no haya internet.

---

# 17. MVP (v1)

Incluir:

✅ Login
✅ Mis jardines
✅ Crear jardín
✅ Invitaciones
✅ Jardín interactivo con Rive
✅ Oraciones
✅ Mensajes
✅ Versículos
✅ Gratitud
✅ Orar = regar
✅ Historial
✅ Jardín nocturno
✅ Ajustes

---

# 18. Ideas futuras (v2)

- App móvil nativa
- React Native + Expo
- Notificaciones push avanzadas
- Audio en semillas
- Banco del jardín 🪑
- Cápsula del tiempo ⏳
- Árbol de promesas bíblicas 🌳
- IA para sugerir versículos
- Widgets móviles
- Estadísticas espirituales suaves

---

# 19. Principio de producto

La app no debe sentirse como una red social.

Debe sentirse como:

> un espacio íntimo donde la fe y el cuidado crecen juntos 🌱
