import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import PlantIllustration from '../components/auth/PlantIllustration'
import BiblicalPhrase from '../components/auth/BiblicalPhrase'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const { session } = await signUp(email, password, displayName)
      // Si Supabase tiene confirmación de email activa, session es null
      if (session) {
        navigate('/gardens')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center px-6" style={{ background: 'var(--color-bg)' }}>
        <PlantIllustration />
        <div className="mt-8 text-center max-w-xs">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            ¡Ya casi! 🌱
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Te enviamos un correo de confirmación a <strong>{email}</strong>. Ábrelo para activar tu cuenta.
          </p>
          <Link
            to="/login"
            className="block w-full py-4 rounded-2xl text-white font-medium text-sm text-center"
            style={{ background: 'var(--color-primary)' }}
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Área superior */}
      <div className="flex flex-col items-center justify-end flex-1 pb-8 px-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🌱</span>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Jardín de Oraciones
          </h1>
        </div>
        <PlantIllustration />
        <p className="mt-4 text-sm text-center max-w-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Comienza tu jardín hoy
        </p>
      </div>

      {/* Área inferior — formulario */}
      <div
        className="rounded-t-[28px] px-6 pt-8 pb-10 shadow-[0_-4px_24px_0_rgba(45,45,45,0.06)]"
        style={{ background: 'var(--color-surface)' }}
      >
        <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--color-text)' }}>
          Crear cuenta
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="¿Cómo te llamas?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
            style={{ background: 'var(--color-bg)', border: '1.5px solid transparent', color: 'var(--color-text)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
            style={{ background: 'var(--color-bg)', border: '1.5px solid transparent', color: 'var(--color-text)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            className="w-full py-4 rounded-2xl text-white font-medium text-sm mt-1 transition-opacity disabled:opacity-60"
            style={{ background: 'var(--color-primary)' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--color-gold)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>o</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-gold)' }} />
        </div>

        <Link
          to="/login"
          className="block w-full py-4 rounded-2xl text-sm font-medium text-center"
          style={{ border: '1.5px solid var(--color-primary)', color: 'var(--color-primary)' }}
        >
          Ya tengo cuenta
        </Link>

        <div className="mt-8">
          <BiblicalPhrase />
        </div>
      </div>
    </div>
  )
}

function friendlyError(msg) {
  if (msg.includes('already registered')) return 'Ya existe una cuenta con ese correo.'
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('invalid email')) return 'El correo no es válido.'
  return 'Ocurrió un error. Intenta de nuevo.'
}
