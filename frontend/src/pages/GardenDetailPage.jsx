import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'
import useSeedStore from '../stores/seedStore'
import useAuthStore from '../stores/authStore'
import PlantSVG from '../components/garden/PlantSVG'
import Fireflies from '../components/garden/Fireflies'
import SeedBottomSheet from '../components/seeds/SeedBottomSheet'
import SeedDetailSheet from '../components/seeds/SeedDetailSheet'
import { GARDEN_META, SEED_TYPES, getPlantStage } from '../lib/constants'
import fondoDia from '../assets/fondo_jardin.png'
import fondoAmanecer from '../assets/fondo_jardin_amanecer.png'
import fondoAtardecer from '../assets/fondo_jardin_atardecer.png'
import fondoNocturno from '../assets/fondo_jardin_nocturno.png'

const BACKGROUNDS = {
  amanecer: fondoAmanecer,
  dia: fondoDia,
  atardecer: fondoAtardecer,
  nocturno: fondoNocturno,
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5 && h < 8) return 'amanecer'
  if (h >= 8 && h < 17) return 'dia'
  if (h >= 17 && h < 19) return 'atardecer'
  return 'nocturno'
}

const PERIOD_LABELS = {
  amanecer: '🌅',
  dia: '☀️',
  atardecer: '🌇',
  nocturno: '🌙',
}

// Hash estable (FNV-1a) a partir del id
function hashId(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

// Posición base a partir del hash del id (sin resolver colisiones)
function basePosition(id) {
  const h = hashId(id)
  const r1 = (h % 1000) / 1000
  const r2 = ((h >>> 10) % 1000) / 1000
  // Zona de pradera: vertical 52%–82%
  const top = 52 + r1 * 30
  // Dos franjas de pasto a los lados del camino central (evita el sendero)
  const onLeft = r2 < 0.5
  const t = onLeft ? r2 * 2 : (r2 - 0.5) * 2
  const left = onLeft ? 12 + t * 24 : 60 + t * 28
  return { top, left }
}

const scaleForTop = (top) => 0.7 + ((top - 52) / 30) * 0.45

// Distancia "elíptica" (las plantas son más anchas que altas en %)
function tooClose(a, b) {
  const dl = (a.left - b.left) / 15
  const dt = (a.top - b.top) / 9
  return dl * dl + dt * dt < 1
}

// Calcula posiciones evitando solapamientos. Procesa las semillas de la más
// antigua a la más nueva: las antiguas conservan su lugar y cada nueva, si cae
// muy cerca de otra, se desplaza por una espiral determinista hasta un hueco.
function computeLayout(seeds) {
  const ordered = [...seeds].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const placed = []
  const layout = {}
  for (const s of ordered) {
    const base = basePosition(s.id)
    const a0 = (hashId(s.id) % 360) * (Math.PI / 180)
    let pos = base
    let tries = 0
    while (tries < 40 && placed.some((p) => tooClose(p, pos))) {
      const r = 4 + tries * 1.6
      const ang = a0 + tries * 2.399963 // ángulo áureo
      pos = {
        top: clamp(base.top + Math.sin(ang) * r * 0.65, 52, 82),
        left: clamp(base.left + Math.cos(ang) * r, 8, 90),
      }
      tries++
    }
    placed.push(pos)
    layout[s.id] = { top: pos.top, left: pos.left, scale: scaleForTop(pos.top) }
  }
  return layout
}

function Plant({ seed, night, onTap, watering, pos, justSown }) {
  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]
  const { top, left, scale } = pos
  const width = `clamp(40px, 13vw, 60px)`
  const showBadge = seed.state === 'answered' || seed.pray_count > 0

  const isWatering = watering?.seedId === seed.id
  const phase = isWatering ? watering.phase : null
  // Durante la lluvia se sostiene la etapa anterior; al crecer (pop) se muestra la nueva
  const stage = phase === 'rain' ? watering.fromStage : getPlantStage(seed)

  return (
    <button
      onClick={onTap}
      className="absolute flex flex-col items-center transition-transform active:scale-95"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: 'bottom center',
        zIndex: isWatering ? 100 : Math.round(top),
        // pequeña sombra de contacto en el pasto
        filter: 'drop-shadow(0 3px 3px rgba(40,50,20,0.25))',
        // aparición suave al cargar / al sembrarse
        animation: 'plantAppear 0.5s ease-out both',
      }}
      aria-label={`${seedType.label}: ${seed.content.slice(0, 40)}`}
    >
      {/* Nube + lluvia mientras se riega */}
      {isWatering && phase === 'rain' && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ top: '-30px', width: '64px', zIndex: 5 }}
        >
          <div
            className="text-center leading-none"
            style={{ fontSize: '24px', animation: 'cloudIn 0.3s ease-out', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))' }}
          >
            ☁️
          </div>
          <div className="relative" style={{ height: '28px' }}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${24 + i * 17}%`,
                  top: 0,
                  width: '2.5px',
                  height: '9px',
                  borderRadius: '2px',
                  background: 'rgba(96,156,224,0.85)',
                  animation: `rainDrop 0.7s linear ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <span
        style={{
          width,
          display: 'block',
          transformOrigin: 'bottom center',
          animation:
            isWatering && phase === 'grow'
              ? 'growPop 0.85s ease-out'
              : justSown
                ? 'sproutIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
        }}
      >
        <PlantSVG stage={stage} night={night} />
      </span>

      {/* Badge — compacto: respondida (✨) o nº de oraciones con racha opcional (🔥) */}
      {showBadge && (
        <span
          className="mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none flex items-center gap-0.5"
          style={{
            background: night ? 'rgba(8,14,6,0.55)' : 'rgba(255,255,255,0.5)',
            color: night ? '#c8e0a8' : '#4a5f38',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {seed.state === 'answered' ? (
            <span>✨</span>
          ) : (
            <>
              <span>🙏{seed.pray_count}</span>
              {seed.current_streak > 1 && <span>🔥</span>}
            </>
          )}
        </span>
      )}
    </button>
  )
}

export default function GardenDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gardens, fetchGardens } = useGardenStore()
  const { seeds, loading, fetchSeeds, clearSeeds, subscribeToGarden, praySeed } = useSeedStore()
  const { user } = useAuthStore()
  const [manualPeriod, setManualPeriod] = useState(null)
  const [showDevSelector, setShowDevSelector] = useState(false)
  const longPressTimer = useRef(null)
  const period = manualPeriod || getTimeOfDay()
  const night = period === 'nocturno'

  // Long-press sobre el nombre del jardín: muestra/oculta el selector de fondos (dev)
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowDevSelector((s) => !s), 1700)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const garden = gardens.find((g) => g.id === id)
  const [gardenLoading, setGardenLoading] = useState(!garden)
  const [showCreateSheet, setShowCreateSheet] = useState(false)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [watering, setWatering] = useState(null) // { seedId, fromStage, phase }
  const [justSownId, setJustSownId] = useState(null)
  const wateringTimers = useRef([])
  const sownTimer = useRef(null)
  const RAIN_MS = 1900

  // Marca la semilla recién sembrada para que "brote" con animación
  const handleSown = (seedId) => {
    if (sownTimer.current) clearTimeout(sownTimer.current)
    setJustSownId(seedId)
    sownTimer.current = setTimeout(() => setJustSownId(null), 800)
  }

  // Orar con animación: cierra el detalle al instante, riega de inmediato y
  // decide el crecimiento cuando responde el backend (dentro de la ventana de lluvia)
  const prayWithAnimation = async (seedToPray, { dev = false } = {}) => {
    const fromStage = getPlantStage(seedToPray)
    setSelectedSeed(null)
    wateringTimers.current.forEach(clearTimeout)
    wateringTimers.current = []
    setWatering({ seedId: seedToPray.id, fromStage, phase: 'rain' })

    let result
    try {
      const [r] = await Promise.all([
        praySeed(seedToPray.id, dev),
        new Promise((res) => {
          wateringTimers.current.push(setTimeout(res, RAIN_MS))
        }),
      ])
      result = r
    } catch {
      setWatering(null)
      return
    }

    if (!result || result.already) {
      setWatering(null)
      return
    }
    const toStage = getPlantStage({ ...seedToPray, growth_points: result.growth_points })
    if (toStage > fromStage) {
      setWatering((w) => (w ? { ...w, phase: 'grow' } : null))
      wateringTimers.current.push(setTimeout(() => setWatering(null), 900))
    } else {
      setWatering(null)
    }
  }

  useEffect(() => () => {
    wateringTimers.current.forEach(clearTimeout)
    if (sownTimer.current) clearTimeout(sownTimer.current)
  }, [])

  const activeSeeds = useMemo(() => seeds.filter((s) => s.state !== 'archived'), [seeds])
  const layout = useMemo(() => computeLayout(activeSeeds), [activeSeeds])

  useEffect(() => {
    if (!garden) {
      fetchGardens().finally(() => setGardenLoading(false))
    }
    fetchSeeds(id)
    const unsubscribe = subscribeToGarden(id)
    return () => {
      clearSeeds()
      unsubscribe()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (gardenLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center" style={{ background: '#cce8a8' }}>
        <span className="text-5xl animate-pulse">🌱</span>
      </div>
    )
  }

  if (!garden) {
    navigate('/gardens', { replace: true })
    return null
  }

  const meta = GARDEN_META[garden.type] || GARDEN_META.personal
  const currentUserId = user?.id

  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Fondo del jardín según la hora del día */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${BACKGROUNDS[period]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      />

      {/* Luciérnagas (solo de noche) */}
      {night && <Fireflies />}

      {/* Header flotante */}
      <header className="relative z-20 px-4 pt-6 pb-3">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: night ? 'rgba(8,14,6,0.55)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <button
            onClick={() => navigate('/gardens')}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: night ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)' }}
          >
            <span style={{ color: night ? '#e8f0d8' : '#2d2d2d' }}>←</span>
          </button>

          <div
            className="flex-1 min-w-0 select-none"
            onPointerDown={startLongPress}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{meta.emoji}</span>
              <h1
                className="text-base font-semibold truncate"
                style={{ color: night ? '#e8f0d8' : '#2d2d2d' }}
              >
                {garden.name}
              </h1>
            </div>
            <p className="text-xs" style={{ color: night ? '#a8c088' : '#4a5a3a' }}>
              {garden.member_count} {garden.member_count === 1 ? 'miembro' : 'miembros'}
              {activeSeeds.length > 0 && ` · ${activeSeeds.length} semillas`}
            </p>
          </div>

          <button
            onClick={() => navigate(`/garden/${id}/invite`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
            style={{
              background: night ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)',
              color: night ? '#e8f0d8' : '#2d2d2d',
            }}
            title="Invitar"
          >
            +👤
          </button>
        </div>
      </header>

      {/* Selector de hora del día (oculto — long-press en el nombre del jardín para mostrarlo) */}
      {showDevSelector && (
        <div className="relative z-20 px-4 pb-2 flex justify-center gap-1.5">
          {Object.entries(PERIOD_LABELS).map(([key, emoji]) => (
            <button
              key={key}
              onClick={() => setManualPeriod(key)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform active:scale-90"
              style={{
                background:
                  period === key
                    ? 'rgba(122,143,99,0.9)'
                    : night
                      ? 'rgba(8,14,6,0.5)'
                      : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                outline: period === key ? '2px solid rgba(255,255,255,0.7)' : 'none',
              }}
              title={key}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setManualPeriod(null)}
            className="px-3 h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-transform active:scale-90"
            style={{
              background:
                manualPeriod === null
                  ? 'rgba(122,143,99,0.9)'
                  : night
                    ? 'rgba(8,14,6,0.5)'
                    : 'rgba(255,255,255,0.55)',
              color: manualPeriod === null ? 'white' : night ? '#e8f0d8' : '#2d2d2d',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            title="Automático según la hora"
          >
            Auto
          </button>
        </div>
      )}

      {/* Cargando semillas */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <span
            className="text-4xl animate-pulse"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
          >
            🌱
          </span>
        </div>
      )}

      {/* Plantas dispersas en la pradera */}
      <div className="absolute inset-0 z-10">
        {!loading &&
          activeSeeds.map((seed) => (
            <Plant
              key={seed.id}
              seed={seed}
              night={night}
              watering={watering}
              pos={layout[seed.id]}
              justSown={justSownId === seed.id}
              onTap={() => setSelectedSeed(seed)}
            />
          ))}
      </div>

      {/* Estado vacío */}
      {!loading && activeSeeds.length === 0 && (
        <div
          className="absolute inset-x-0 z-20 flex flex-col items-center text-center px-8"
          style={{ top: '58%' }}
        >
          <p
            className="text-sm max-w-xs mb-5 px-4 py-2 rounded-2xl"
            style={{
              color: night ? '#e8f0d8' : '#2d2d2d',
              background: night ? 'rgba(8,14,6,0.55)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            El jardín está vacío. Siembra una oración, versículo o mensaje para comenzar.
          </p>
          <button
            onClick={() => setShowCreateSheet(true)}
            className="px-6 py-3 rounded-2xl text-white text-sm font-medium shadow-lg"
            style={{ background: 'var(--color-primary)' }}
          >
            🌱 Sembrar algo
          </button>
        </div>
      )}

      {/* FAB */}
      {activeSeeds.length > 0 && (
        <button
          onClick={() => setShowCreateSheet(true)}
          className="fixed bottom-8 right-5 z-20 w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center transition-transform active:scale-95"
          style={{
            background: 'var(--color-primary)',
            boxShadow: '0 4px 16px rgba(122,143,99,0.55)',
          }}
          aria-label="Sembrar"
        >
          +
        </button>
      )}

      {showCreateSheet && (
        <SeedBottomSheet
          gardenId={id}
          onSown={handleSown}
          onClose={() => setShowCreateSheet(false)}
        />
      )}

      {selectedSeed && (
        <SeedDetailSheet
          key={selectedSeed.id}
          seed={selectedSeed}
          currentUserId={currentUserId}
          onClose={() => setSelectedSeed(null)}
          onPray={prayWithAnimation}
        />
      )}
    </div>
  )
}
