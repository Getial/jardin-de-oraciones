import { useState, useEffect } from 'react'
import useSeedStore from '../../stores/seedStore'
import { api } from '../../services/api'
import { SEED_TYPES, timeAgo } from '../../lib/constants'

export default function SeedDetailSheet({ seed, currentUserId, onClose, onPray }) {
  const { answerSeed, deleteSeed } = useSeedStore()
  const [events, setEvents] = useState(null) // null = cargando
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const prayedToday = seed.prayed_today
  const prayCount = seed.pray_count
  const streak = seed.current_streak || 0

  const isAuthor = seed.author_id === currentUserId
  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]

  // El cierre + animación lo maneja la página (cierre instantáneo, no espera al backend)
  const handlePray = () => {
    if (prayedToday) return
    onPray?.(seed)
  }

  const handleDevPray = () => {
    onPray?.(seed, { dev: true })
  }

  // Historial: lazy load — se carga aparte para no bloquear ni "saltar" el detalle
  useEffect(() => {
    let alive = true
    api.get(`/api/seeds/${seed.id}/`)
      .then((data) => { if (alive) setEvents(data.events || []) })
      .catch(() => { if (alive) setEvents([]) })
    return () => { alive = false }
  }, [seed.id])

  const handleAnswer = async () => {
    setActionLoading(true)
    try {
      await answerSeed(seed.id)
      onClose()
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setActionLoading(true)
    try {
      await deleteSeed(seed.id)
      onClose()
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(45,45,45,0.4)' }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] px-5 pt-4 pb-10"
        style={{
          background: 'var(--color-surface)',
          maxHeight: '85svh',
          overflowY: 'auto',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--color-bg)' }} />

        {/* Type + state chips */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
          >
            {seedType.emoji} {seedType.label}
          </span>
          {seed.state === 'answered' && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: '#EDF7ED', color: '#4a7c59' }}
            >
              ✨ Respondida
            </span>
          )}
          {seed.privacy === 'private' && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              🔒 Solo yo
            </span>
          )}
        </div>

        {/* Title */}
        {seed.title && (
          <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
            {seed.title}
          </h2>
        )}

        {/* Content */}
        <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-text)' }}>
          {seed.content}
        </p>

        <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
          {seed.author_name} · {timeAgo(seed.created_at)}
          {prayCount > 0 && ` · ${prayCount} ${prayCount === 1 ? 'oración' : 'oraciones'}`}
          {streak > 1 && ` · 🔥 racha de ${streak} días`}
        </p>

        {/* Orar (regar) — máximo una vez al día */}
        <button
          onClick={handlePray}
          disabled={prayedToday}
          className="w-full py-3.5 rounded-2xl font-medium text-sm mb-2 disabled:cursor-default transition-colors"
          style={{
            background: prayedToday ? 'var(--color-bg)' : 'var(--color-primary)',
            color: prayedToday ? 'var(--color-primary)' : 'white',
            border: '1.5px solid var(--color-primary)',
          }}
        >
          {prayedToday ? '🙏 Ya oraste hoy' : '🙏 Orar hoy'}
        </button>
        <p className="text-center text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          {prayedToday ? 'Vuelve mañana para seguir regando 🌱' : 'Cada día que oras, la planta crece'}
        </p>

        {/* Atajo de desarrollo: orar sin límite diario (solo en dev) */}
        {import.meta.env.DEV && (
          <button
            onClick={handleDevPray}
            className="w-full py-2 rounded-xl text-xs mb-6"
            style={{ border: '1px dashed var(--color-text-muted)', color: 'var(--color-text-muted)' }}
          >
            🧪 Orar (dev — sin límite diario)
          </button>
        )}

        {/* Historial (lazy) — la sección siempre está presente para evitar el salto */}
        <div className="mb-6 px-4 py-4 rounded-2xl" style={{ background: 'var(--color-bg)' }}>
          <p
            className="text-xs font-medium mb-3 uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Historial
          </p>

          {events === null ? (
            // Skeleton mientras carga
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary-soft)' }} />
                  <div className="flex-1">
                    <div className="h-3 rounded animate-pulse mb-1.5" style={{ background: 'rgba(0,0,0,0.07)', width: `${70 - i * 12}%` }} />
                    <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(0,0,0,0.05)', width: '40px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Aún no hay eventos.
            </p>
          ) : (
            <div className="flex flex-col gap-3" style={{ animation: 'fadeIn 0.25s ease-out' }}>
              {events.map((ev) => (
                <div key={ev.id} className="flex gap-3 items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: 'var(--color-primary)' }}
                  />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text)' }}>
                      {ev.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {timeAgo(ev.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions (solo para el autor) */}
        {isAuthor && (
          <div className="flex flex-col gap-2">
            {seed.state === 'active' && (
              <button
                onClick={handleAnswer}
                disabled={actionLoading}
                className="w-full py-3.5 rounded-2xl font-medium text-sm disabled:opacity-60"
                style={{ background: '#EDF7ED', color: '#4a7c59' }}
              >
                ✨ Marcar como respondida
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="w-full py-3.5 rounded-2xl font-medium text-sm disabled:opacity-60"
              style={{
                background: confirmDelete ? 'var(--color-error)' : 'var(--color-bg)',
                color: confirmDelete ? 'white' : 'var(--color-error)',
              }}
            >
              {confirmDelete ? 'Confirmar eliminación' : 'Eliminar semilla'}
            </button>

            {confirmDelete && (
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-3 rounded-2xl text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
