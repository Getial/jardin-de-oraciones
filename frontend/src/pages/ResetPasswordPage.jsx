import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PlantIllustration from '../components/auth/PlantIllustration'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  // Supabase envía el token en el hash — el cliente lo procesa automáticamente
  // y dispara PASSWORD_RECOVERY en onAuthStateChange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      navigate('/gardens', { replace: true })
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      <div className="flex flex-col items-center justify-end flex-1 pb-8 px-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🌱</span>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Jardín de Oraciones
          </h1>
        </div>
        <PlantIllustration />
        <p className="mt-4 text-sm text-center max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          Crea tu nueva contraseña
        </p>
      </div>

      <div
        className="rounded-t-[28px] px-6 pt-8 pb-10 shadow-[0_-4px_24px_0_rgba(45,45,45,0.06)]"
        style={{ background: 'var(--color-surface)' }}
      >
        {!ready ? (
          <div className="text-center py-4">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Verificando enlace...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--color-text)' }}>
              Nueva contraseña
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{ background: 'var(--color-bg)', border: '1.5px solid transparent', color: 'var(--color-text)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{ background: 'var(--color-bg)', border: '1.5px solid transparent', color: 'var(--color-text)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />

              {error && (
                <p className="text-sm text-center" style={{ color: 'var(--color-error)' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-medium text-sm mt-1 disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
