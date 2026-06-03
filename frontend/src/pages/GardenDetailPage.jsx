import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'
import useSeedStore from '../stores/seedStore'
import useAuthStore from '../stores/authStore'
import BottomNav from '../components/layout/BottomNav'
import SeedCard from '../components/seeds/SeedCard'
import SeedBottomSheet from '../components/seeds/SeedBottomSheet'
import SeedDetailSheet from '../components/seeds/SeedDetailSheet'
import { GARDEN_META } from '../lib/constants'

export default function GardenDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gardens, fetchGardens } = useGardenStore()
  const { seeds, loading, fetchSeeds, clearSeeds } = useSeedStore()
  const { user } = useAuthStore()

  const garden = gardens.find((g) => g.id === id)
  const [gardenLoading, setGardenLoading] = useState(!garden)
  const [showCreateSheet, setShowCreateSheet] = useState(false)
  const [selectedSeed, setSelectedSeed] = useState(null)

  useEffect(() => {
    if (!garden) {
      fetchGardens().finally(() => setGardenLoading(false))
    } else {
      setGardenLoading(false)
    }
    fetchSeeds(id)
    return () => clearSeeds()
  }, [id])

  if (gardenLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <span className="text-4xl animate-pulse">🌱</span>
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
    <div className="min-h-svh flex flex-col pb-24" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/gardens')}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--color-surface)' }}
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{meta.emoji}</span>
              <h1 className="text-xl font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                {garden.name}
              </h1>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {garden.member_count} {garden.member_count === 1 ? 'miembro' : 'miembros'}
              {activeSeeds.length > 0 && ` · ${activeSeeds.length} semillas`}
            </p>
          </div>
          <button
            onClick={() => navigate(`/garden/${id}/invite`)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base"
            style={{ background: 'var(--color-surface)' }}
            title="Invitar personas"
          >
            +👤
          </button>
        </div>
      </header>

      {/* Seeds */}
      <main className="flex-1 px-5">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-3xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : activeSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-6xl">🪨</span>
            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
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
          <div className="flex flex-col gap-3">
            {activeSeeds.map((seed) => (
              <SeedCard
                key={seed.id}
                seed={seed}
                currentUserId={currentUserId}
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
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full text-white text-2xl shadow-[0_4px_16px_0_rgba(122,143,99,0.35)] flex items-center justify-center transition-transform active:scale-95"
          style={{ background: 'var(--color-primary)' }}
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
