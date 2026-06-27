import { useState } from 'react'
import useSeedStore from '../../stores/seedStore'
import { SEED_TYPES } from '../../lib/constants'

const PLACEHOLDERS = {
  prayer:         'Escribe tu petición...',
  message:        'Escribe tu mensaje para el jardín...',
  verse:          'Escribe el versículo...',
  gratitude:      'Escribe por qué estás agradecido...',
  special_moment: 'Describe este momento especial...',
}

export default function SeedBottomSheet({ gardenId, onClose, onSown }) {
  const { createSeed } = useSeedStore()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [privacy, setPrivacy] = useState('shared')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const needsTitle = selectedType && ['verse', 'special_moment'].includes(selectedType.key)

  const handleCreate = async () => {
    if (!content.trim()) {
      setError('El contenido no puede estar vacío.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const seed = await createSeed({
        garden: gardenId,
        type: selectedType.key,
        title: title.trim(),
        content: content.trim(),
        privacy,
      })
      onSown?.(seed.id)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
          maxHeight: '90svh',
          overflowY: 'auto',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--color-bg)' }} />

        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              ¿Qué quieres sembrar?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Cada semilla es una ofrenda al jardín compartido.
            </p>

            <div className="flex flex-col gap-3">
              {SEED_TYPES.map((type) => (
                <button
                  key={type.key}
                  onClick={() => { setSelectedType(type); setStep(2) }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left transition-transform active:scale-[0.98]"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                      {type.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {type.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{ background: 'var(--color-bg)' }}
              >
                ←
              </button>
              <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                {selectedType.emoji} {selectedType.label}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {needsTitle && (
                <input
                  type="text"
                  placeholder={selectedType.key === 'verse' ? 'Referencia (ej. Juan 3:16)' : 'Título (opcional)'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1.5px solid transparent',
                    color: 'var(--color-text)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              )}

              <textarea
                placeholder={PLACEHOLDERS[selectedType.key]}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                style={{
                  background: 'var(--color-bg)',
                  border: '1.5px solid transparent',
                  color: 'var(--color-text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />

              {/* Privacy toggle */}
              <div
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                style={{ background: 'var(--color-bg)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    Solo yo
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {privacy === 'private'
                      ? 'Solo tú verás esta semilla'
                      : 'Visible para todos en el jardín'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacy(privacy === 'private' ? 'shared' : 'private')}
                  className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
                  style={{
                    background: privacy === 'private' ? 'var(--color-primary)' : 'var(--color-earth)',
                  }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: privacy === 'private' ? 'translateX(26px)' : 'translateX(2px)',
                    }}
                  />
                </button>
              </div>

              {error && (
                <p className="text-sm text-center" style={{ color: 'var(--color-error)' }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleCreate}
                disabled={loading || !content.trim()}
                className="w-full py-4 rounded-2xl text-white font-medium text-sm mt-1 disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}
              >
                {loading ? 'Sembrando...' : '🌱 Sembrar'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
