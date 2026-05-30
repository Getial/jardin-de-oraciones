import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import PlantIllustration from '../components/auth/PlantIllustration'
import BiblicalPhrase from '../components/auth/BiblicalPhrase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const { signIn, resetPassword } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/gardens')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Área superior — logo + ilustración */}
      <div className="flex flex-col items-center justify-end flex-1 pb-8 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🌱</span>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Jardín de Oraciones
          </h1>
        </div>

        {/* Ilustración */}
        <PlantIllustration />

        {/* Tagline */}
        <p
          className="mt-4 text-sm text-center max-w-xs leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Un espacio íntimo donde la fe y el cuidado crecen juntos
        </p>
      </div>

      {/* Área inferior — formulario */}
      <div
        className="rounded-t-[28px] px-6 pt-8 pb-10 shadow-[0_-4px_24px_0_rgba(45,45,45,0.06)]"
        style={{ background: 'var(--color-surface)' }}
      >
        {!resetMode ? (
          <>
            <h2
              className="text-xl font-semibold mb-6 text-center"
              style={{ color: 'var(--color-text)' }}
            >
              Bienvenido de vuelta
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-bg)',
                  border: '1.5px solid transparent',
                  color: 'var(--color-text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'transparent')}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-bg)',
                  border: '1.5px solid transparent',
                  color: 'var(--color-text)',
                }}
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
                className="w-full py-4 rounded-2xl text-white font-medium text-sm mt-1 transition-opacity disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}
              >
                {loading ? 'Entrando...' : 'Iniciar sesión'}
              </button>
            </form>

            <button
              onClick={() => setResetMode(true)}
              className="w-full text-center text-sm mt-3 py-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--color-gold)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-gold)' }} />
            </div>

            <Link
              to="/register"
              className="block w-full py-4 rounded-2xl text-sm font-medium text-center transition-opacity"
              style={{
                border: '1.5px solid var(--color-primary)',
                color: 'var(--color-primary)',
              }}
            >
              Crear cuenta nueva
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => { setResetMode(false); setResetSent(false); setError('') }}
              className="flex items-center gap-1 text-sm mb-6"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Volver
            </button>

            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Recuperar contraseña
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {resetSent ? (
              <div
                className="rounded-2xl px-4 py-4 text-sm text-center"
                style={{ background: 'var(--color-bg)', color: 'var(--color-success)' }}
              >
                ✓ Revisa tu correo — enviamos el enlace a <strong>{email}</strong>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                  style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
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
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Frase bíblica */}
        <div className="mt-8">
          <BiblicalPhrase />
        </div>
      </div>
    </div>
  )
}

function friendlyError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de ingresar.'
  if (msg.includes('Too many requests')) return 'Demasiados intentos. Espera un momento.'
  return 'Ocurrió un error. Intenta de nuevo.'
}
