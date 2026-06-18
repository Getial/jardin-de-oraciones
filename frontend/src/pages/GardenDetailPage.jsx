import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'
import useSeedStore from '../stores/seedStore'
import useAuthStore from '../stores/authStore'
import PlantSVG from '../components/garden/PlantSVG'
import SeedBottomSheet from '../components/seeds/SeedBottomSheet'
import SeedDetailSheet from '../components/seeds/SeedDetailSheet'
import { GARDEN_META, SEED_TYPES, getGrowthStage } from '../lib/constants'
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

// Hash estable a partir del id → dos pseudo-aleatorios en [0,1)
function seedPosition(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const r1 = ((h >>> 0) % 1000) / 1000
  const r2 = (((h >>> 10) >>> 0) % 1000) / 1000

  // Zona de pradera: vertical 52%–82%
  const top = 52 + r1 * 30
  // Dos franjas de pasto a los lados del camino central (evita el sendero)
  const onLeft = r2 < 0.5
  const t = onLeft ? r2 * 2 : (r2 - 0.5) * 2
  const left = onLeft ? 12 + t * 24 : 60 + t * 28
  // Perspectiva: arriba (lejos) más pequeño, abajo (cerca) más grande
  const depth = (top - 52) / 30
  const scale = 0.7 + depth * 0.45
  return { top, left, scale }
}

function Plant({ seed, night, onTap }) {
  const stage = getGrowthStage(seed.pray_count)
  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]
  const { top, left, scale } = seedPosition(seed.id)
  const width = `clamp(40px, 13vw, 60px)`

  return (
    <button
      onClick={onTap}
      className="absolute flex flex-col items-center transition-transform active:scale-95"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: 'bottom center',
        zIndex: Math.round(top),
        // pequeña sombra de contacto en el pasto
        filter: 'drop-shadow(0 3px 3px rgba(40,50,20,0.25))',
      }}
      aria-label={`${seedType.label}: ${seed.content.slice(0, 40)}`}
    >
      <span style={{ width, display: 'block' }}>
        <PlantSVG stage={stage.stage} night={night} />
      </span>

      {/* Badges */}
      {(seed.state === 'answered' || seed.pray_count > 0) && (
        <span
          className="mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none flex items-center gap-0.5"
          style={{
            background: night ? 'rgba(8,14,6,0.7)' : 'rgba(255,255,255,0.85)',
            color: night ? '#c8e0a8' : '#5a7040',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          {seed.state === 'answered' ? '✨' : '🙏'}
          {seed.pray_count > 0 && seed.pray_count}
        </span>
      )}
    </button>
  )
}

export default function GardenDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gardens, fetchGardens } = useGardenStore()
  const { seeds, loading, fetchSeeds, clearSeeds, subscribeToGarden } = useSeedStore()
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
  const activeSeeds = seeds.filter((s) => s.state !== 'archived')
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

      {/* Plantas dispersas en la pradera */}
      <div className="absolute inset-0 z-10">
        {!loading &&
          activeSeeds.map((seed) => (
            <Plant key={seed.id} seed={seed} night={night} onTap={() => setSelectedSeed(seed)} />
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
        <SeedBottomSheet gardenId={id} onClose={() => setShowCreateSheet(false)} />
      )}

      {selectedSeed && (
        <SeedDetailSheet
          seed={selectedSeed}
          currentUserId={currentUserId}
          onClose={() => setSelectedSeed(null)}
        />
      )}
    </div>
  )
}
