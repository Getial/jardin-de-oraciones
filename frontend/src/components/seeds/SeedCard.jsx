import { useState } from 'react'
import useSeedStore from '../../stores/seedStore'
import { SEED_TYPES, getGrowthStage, timeAgo } from '../../lib/constants'

export default function SeedCard({ seed, currentUserId: _currentUserId, onTap }) {
  const { praySeed } = useSeedStore()
  const [prayLoading, setPrayLoading] = useState(false)

  const seedType = SEED_TYPES.find((t) => t.key === seed.type) || SEED_TYPES[0]
  const stage = getGrowthStage(seed.pray_count)
  const isAnswered = seed.state === 'answered'

  const handlePray = async (e) => {
    e.stopPropagation()
    if (prayLoading) return
    setPrayLoading(true)
    try {
      await praySeed(seed.id)
    } finally {
      setPrayLoading(false)
    }
  }

  return (
    <div
      onClick={onTap}
      role="button"
      className="w-full text-left flex gap-3 p-4 rounded-3xl transition-transform active:scale-[0.98] cursor-pointer select-none"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        opacity: seed.state === 'archived' ? 0.5 : 1,
      }}
    >
      {/* Growth stage */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: 'var(--color-bg)' }}
      >
        {stage.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
          >
            {seedType.emoji} {seedType.label}
          </span>
          {isAnswered && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#EDF7ED', color: '#4a7c59' }}
            >
              ✨ Respondida
            </span>
          )}
        </div>

        {seed.title && (
          <p className="font-medium text-sm truncate mb-0.5" style={{ color: 'var(--color-text)' }}>
            {seed.title}
          </p>
        )}

        <p
          className="text-sm"
          style={{
            color: 'var(--color-text)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {seed.content}
        </p>

        <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
          {seed.author_name} · {timeAgo(seed.created_at)}
        </p>
      </div>

      {/* Pray button */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1 ml-1">
        <button
          onClick={handlePray}
          disabled={prayLoading}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-transform active:scale-90 disabled:opacity-50"
          style={{
            background: seed.has_prayed ? 'var(--color-primary)' : 'var(--color-bg)',
          }}
        >
          🙏
        </button>
        {seed.pray_count > 0 && (
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {seed.pray_count}
          </span>
        )}
      </div>
    </div>
  )
}
