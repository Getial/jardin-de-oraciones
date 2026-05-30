import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'

const TYPES = [
  { value: 'personal',     emoji: '🌱', label: 'Personal',         desc: 'Solo para ti' },
  { value: 'couple',       emoji: '❤️',  label: 'Pareja',           desc: 'Íntimo y especial' },
  { value: 'family',       emoji: '👨‍👩‍👧', label: 'Familia',          desc: 'Juntos en fe' },
  { value: 'friends',      emoji: '🫂',  label: 'Amigos',           desc: 'Con quienes confías' },
  { value: 'prayer_group', emoji: '🙏',  label: 'Grupo de oración', desc: 'Comunidad espiritual' },
]

export default function CreateGardenPage() {
  const [step, setStep] = useState(1)
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('invite_only')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { createGarden } = useGardenStore()
  const navigate = useNavigate()

  const selectedType = TYPES.find((t) => t.value === type)

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const garden = await createGarden({ name, type, description, privacy })
      navigate(`/garden/${garden.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-surface)' }}
        >
          ←
        </button>
        <div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Paso {step} de 2
          </p>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {step === 1 ? 'Tipo de jardín' : 'Datos del jardín'}
          </h1>
        </div>
      </header>

      {/* Paso 1 — Selección de tipo */}
      {step === 1 && (
        <main className="flex-1 px-5">
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            ¿Con quién vas a compartir este jardín?
          </p>
          <div className="flex flex-col gap-3">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setType(t.value); setStep(2) }}
                className="flex items-center gap-4 p-4 rounded-[20px] text-left transition-all active:scale-[0.98]"
                style={{
                  background: type === t.value ? 'var(--color-primary)' : 'var(--color-surface)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <span className="text-3xl w-12 text-center">{t.emoji}</span>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: type === t.value ? '#fff' : 'var(--color-text)' }}
                  >
                    {t.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: type === t.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)' }}
                  >
                    {t.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* Paso 2 — Formulario */}
      {step === 2 && (
        <main className="flex-1 px-5">
          {/* Tipo seleccionado */}
          <div
            className="flex items-center gap-3 p-3 rounded-2xl mb-6"
            style={{ background: 'var(--color-surface)' }}
          >
            <span className="text-2xl">{selectedType?.emoji}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {selectedType?.label}
            </span>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>
                Nombre del jardín *
              </label>
              <input
                type="text"
                placeholder={type === 'couple' ? 'Ej: Felipe & Dayana' : type === 'family' ? 'Ej: Familia García' : 'Mi jardín'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1.5px solid transparent' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>
                Descripción (opcional)
              </label>
              <textarea
                placeholder="¿De qué trata este jardín?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1.5px solid transparent' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            {/* Privacidad */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                Privacidad
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'invite_only', label: '🔒 Solo invitados' },
                  { value: 'private', label: '👁️ Privado' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPrivacy(opt.value)}
                    className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: privacy === opt.value ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: privacy === opt.value ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-4 rounded-2xl text-white font-medium text-sm mt-2 transition-opacity disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              {loading ? 'Creando...' : 'Crear jardín 🌱'}
            </button>
          </form>
        </main>
      )}
    </div>
  )
}
