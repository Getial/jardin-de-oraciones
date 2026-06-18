import { useState, useEffect } from 'react'
import useSeedStore from '../../stores/seedStore'
import { api } from '../../services/api'
import { SEED_TYPES, timeAgo } from '../../lib/constants'

export default function SeedDetailSheet({ seed, currentUserId, onClose }) {
  const { praySeed, answerSeed, deleteSeed } = useSeedStore()
  const [events, setEvents] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [prayLoading, setPrayLoading] = useState(false)
  const [prayed, setPrayed] = useState(seed.has_prayed)
  const [prayCount, setPrayCount] = useState(seed.pray_count)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isAuthor = seed.author_id === currentUserId
  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]

  const handlePray = async () => {
    if (prayLoading) return
    setPrayLoading(true)
    try {
      const result = await praySeed(seed.id)
      setPrayed(result.prayed)
      setPrayCount(result.pray_count)
    } finally {
      setPrayLoading(false)
    }
  }

  useEffect(() => {
    api.get(`/api/seeds/${seed.id}/`)
      .then((data) => setEvents(data.events || []))
      .catch(() => {})
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
        </p>

        {/* Orar (regar) */}
        <button
          onClick={handlePray}
          disabled={prayLoading}
          className="w-full py-3.5 rounded-2xl font-medium text-sm mb-6 disabled:opacity-60 transition-colors"
          style={{
            background: prayed ? 'var(--color-primary)' : 'var(--color-bg)',
            color: prayed ? 'white' : 'var(--color-primary)',
            border: prayed ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-primary)',
          }}
        >
          {prayed ? '🙏 Oraste por esta semilla' : '🙏 Orar por esta semilla'}
        </button>

        {/* Events timeline */}
        {events.length > 0 && (
          <div className="mb-6 px-4 py-4 rounded-2xl" style={{ background: 'var(--color-bg)' }}>
            <p
              className="text-xs font-medium mb-3 uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Historial
            </p>
            <div className="flex flex-col gap-3">
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
          </div>
        )}

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
