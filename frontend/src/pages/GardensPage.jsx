import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useGardenStore from '../stores/gardenStore'
import BottomNav from '../components/layout/BottomNav'

const GARDEN_META = {
  personal:      { emoji: '🌱', label: 'Personal',          bg: '#EDF2E8' },
  couple:        { emoji: '❤️',  label: 'Pareja',            bg: '#FAEDEE' },
  family:        { emoji: '👨‍👩‍👧', label: 'Familia',           bg: '#FDF3E7' },
  friends:       { emoji: '🫂',  label: 'Amigos',            bg: '#EBF0F8' },
  prayer_group:  { emoji: '🙏',  label: 'Grupo de oración',  bg: '#F3EDF8' },
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

function GardenCard({ garden, onClick }) {
  const meta = GARDEN_META[garden.type] || GARDEN_META.personal

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 p-4 rounded-[20px] transition-transform active:scale-[0.98]"
      style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Icono tipo jardín */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: meta.bg }}
      >
        {meta.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base truncate" style={{ color: 'var(--color-text)' }}>
          {garden.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {meta.label} · {garden.member_count} {garden.member_count === 1 ? 'miembro' : 'miembros'}
        </p>
      </div>

      {/* Última actividad */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {timeAgo(garden.last_activity_at)}
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--color-primary)' }}
        />
      </div>
    </button>
  )
}

function EmptyState({ onCreateGarden }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span className="text-5xl mb-4">🌱</span>
      <p className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
        Aún no tienes jardines
      </p>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Crea tu primer espacio de oración o únete al de alguien más.
      </p>
      <button
        onClick={onCreateGarden}
        className="px-6 py-3 rounded-2xl text-white text-sm font-medium"
        style={{ background: 'var(--color-primary)' }}
      >
        Crear jardín
      </button>
    </div>
  )
}

export default function GardensPage() {
  const { user } = useAuthStore()
  const { gardens, loading, fetchGardens } = useGardenStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchGardens()
  }, [fetchGardens])

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'tú'

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Hola, {displayName} 👋
        </p>
        <h1 className="text-2xl font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
          Mis jardines ✨
        </h1>
      </header>

      {/* Unirse con código */}
      <div className="px-5 mb-4">
        <button
          onClick={() => navigate('/join')}
          className="w-full py-3 rounded-2xl text-sm font-medium text-center"
          style={{
            border: '1.5px dashed var(--color-primary)',
            color: 'var(--color-primary)',
            background: 'transparent',
          }}
        >
          Tengo un código de invitación
        </button>
      </div>

      {/* Lista de jardines */}
      <main className="flex-1 px-5 pb-24">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[82px] rounded-[20px] animate-pulse"
                style={{ background: 'var(--color-surface)' }}
              />
            ))}
          </div>
        ) : gardens.length === 0 ? (
          <EmptyState onCreateGarden={() => navigate('/gardens/new')} />
        ) : (
          <div className="flex flex-col gap-3">
            {gardens.map((garden) => (
              <GardenCard
                key={garden.id}
                garden={garden}
                onClick={() => navigate(`/garden/${garden.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => navigate('/gardens/new')}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full text-white text-2xl shadow-[0_4px_16px_0_rgba(122,143,99,0.35)] flex items-center justify-center transition-transform active:scale-95"
        style={{ background: 'var(--color-primary)' }}
        aria-label="Crear jardín"
      >
        +
      </button>

      <BottomNav />
    </div>
  )
}
