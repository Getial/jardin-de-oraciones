import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'
import useSeedStore from '../stores/seedStore'
import useAuthStore from '../stores/authStore'
import BottomNav from '../components/layout/BottomNav'
import PlantSVG from '../components/garden/PlantSVG'
import SeedBottomSheet from '../components/seeds/SeedBottomSheet'
import SeedDetailSheet from '../components/seeds/SeedDetailSheet'
import { GARDEN_META, SEED_TYPES, getGrowthStage } from '../lib/constants'

function useNightMode() {
  const hour = new Date().getHours()
  return hour < 6 || hour >= 20
}

function PlantCell({ seed, onTap, night }) {
  const { praySeed } = useSeedStore()
  const [prayLoading, setPrayLoading] = useState(false)
  const stage = getGrowthStage(seed.pray_count)
  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]

  const handlePray = async (e) => {
    e.stopPropagation()
    if (prayLoading) return
    setPrayLoading(true)
    try { await praySeed(seed.id) } finally { setPrayLoading(false) }
  }

  return (
    <div
      onClick={onTap}
      role="button"
      className="relative rounded-[20px] p-3 flex flex-col items-center cursor-pointer active:scale-[0.97] transition-transform select-none"
      style={{
        background: night ? 'rgba(20,35,15,0.65)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {seed.state === 'answered' && (
        <span className="absolute top-2 left-2 text-sm">✨</span>
      )}
      {seed.privacy === 'private' && (
        <span className="absolute top-2 right-2 text-xs" style={{ color: night ? '#a0b890' : '#7a8f63' }}>🔒</span>
      )}

      <div className="w-full">
        <PlantSVG stage={stage.stage} night={night} />
      </div>

      <div className="w-full flex items-center justify-between mt-1">
        <span className="text-base leading-none">{seedType.emoji}</span>
        <button
          onClick={handlePray}
          disabled={prayLoading}
          className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium disabled:opacity-50 transition-colors"
          style={{
            background: seed.has_prayed
              ? (night ? '#3a6030' : '#7a8f63')
              : (night ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'),
            color: seed.has_prayed
              ? 'white'
              : (night ? '#90c070' : '#5a7040'),
          }}
        >
          🙏{seed.pray_count > 0 && <span>{seed.pray_count}</span>}
        </button>
      </div>
    </div>
  )
}

export default function GardenDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gardens, fetchGardens } = useGardenStore()
  const { seeds, loading, fetchSeeds, clearSeeds, subscribeToGarden } = useSeedStore()
  const { user } = useAuthStore()
  const night = useNightMode()

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
      <div
        className="min-h-svh flex items-center justify-center"
        style={{ background: night ? '#0a0f06' : '#d4e8b8' }}
      >
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

  const dayBg = 'linear-gradient(180deg, #b8d890 0%, #cce8a8 20%, #dff0cc 55%, #ede5cc 100%)'
  const nightBg = 'linear-gradient(180deg, #06080e 0%, #0a1206 35%, #0f0e06 100%)'

  const headerBg = night ? 'rgba(8,14,6,0.70)' : 'rgba(255,255,255,0.72)'
  const textColor = night ? '#c8e0a8' : 'var(--color-text)'
  const mutedColor = night ? '#78a060' : 'var(--color-text-muted)'
  const btnBg     = night ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.80)'

  return (
    <div
      className="min-h-svh flex flex-col pb-24"
      style={{ background: night ? nightBg : dayBg }}
    >
      {/* Header flotante */}
      <header className="px-4 pt-12 pb-3">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: headerBg, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        >
          <button
            onClick={() => navigate('/gardens')}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: btnBg }}
          >
            <span style={{ color: textColor }}>←</span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{meta.emoji}</span>
              <h1 className="text-base font-semibold truncate" style={{ color: textColor }}>
                {garden.name}
              </h1>
            </div>
            <p className="text-xs" style={{ color: mutedColor }}>
              {garden.member_count} {garden.member_count === 1 ? 'miembro' : 'miembros'}
              {activeSeeds.length > 0 && ` · ${activeSeeds.length} semillas`}
            </p>
          </div>

          <button
            onClick={() => navigate(`/garden/${id}/invite`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
            style={{ background: btnBg, color: textColor }}
            title="Invitar"
          >
            +👤
          </button>
        </div>
      </header>

      {/* Jardín */}
      <main className="flex-1 px-4 pt-2">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-[20px] animate-pulse"
                style={{
                  aspectRatio: '3/4',
                  background: night ? 'rgba(20,35,15,0.4)' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        ) : activeSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-32 mx-auto opacity-80">
              <PlantSVG stage={0} night={night} />
            </div>
            <p className="text-sm max-w-xs" style={{ color: mutedColor }}>
              El jardín está vacío. Siembra una oración, versículo o mensaje para comenzar.
            </p>
            <button
              onClick={() => setShowCreateSheet(true)}
              className="px-6 py-3 rounded-2xl text-white text-sm font-medium"
              style={{ background: 'var(--color-primary)' }}
            >
              🌱 Sembrar algo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {activeSeeds.map((seed) => (
              <PlantCell
                key={seed.id}
                seed={seed}
                night={night}
                onTap={() => setSelectedSeed(seed)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      {activeSeeds.length > 0 && (
        <button
          onClick={() => setShowCreateSheet(true)}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center transition-transform active:scale-95"
          style={{
            background: 'var(--color-primary)',
            boxShadow: night
              ? '0 4px 20px rgba(90,160,50,0.4)'
              : '0 4px 16px rgba(122,143,99,0.45)',
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

      <BottomNav />
    </div>
  )
}
