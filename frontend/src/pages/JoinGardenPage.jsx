import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'

export default function JoinGardenPage() {
  const [searchParams] = useSearchParams()
  const urlCode = searchParams.get('code')
  const [code, setCode] = useState(urlCode?.toUpperCase() || '')
  const [loading, setLoading] = useState(!!urlCode) // auto-unión → arranca cargando
  const [error, setError] = useState('')
  const { joinGarden } = useGardenStore()
  const navigate = useNavigate()

  const handleJoinWithCode = async (codeToJoin) => {
    setError('')
    setLoading(true)
    try {
      const garden = await joinGarden(codeToJoin.trim())
      navigate(`/garden/${garden.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Si viene el código en la URL, unirse automáticamente.
  // Se usa joinGarden directo (setState solo en callbacks async, no en el cuerpo del efecto).
  useEffect(() => {
    if (!urlCode) return
    let active = true
    joinGarden(urlCode.toUpperCase().trim())
      .then((garden) => { if (active) navigate(`/garden/${garden.id}`, { replace: true }) })
      .catch((err) => { if (active) { setError(err.message); setLoading(false) } })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleJoin = (e) => {
    e.preventDefault()
    handleJoinWithCode(code)
  }

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <header className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-surface)' }}
        >
          ←
        </button>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Unirse a un jardín
        </h1>
      </header>

      <main className="flex-1 px-5 flex flex-col items-center justify-center pb-20">
        {loading ? (
          <>
            <span className="text-5xl mb-4 animate-pulse">🌱</span>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Uniéndome al jardín...
            </p>
          </>
        ) : (
          <>
            <span className="text-6xl mb-6">🔑</span>
            <p className="text-sm text-center mb-8 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              Ingresa el código que te compartieron para unirte al jardín.
            </p>

            <form onSubmit={handleJoin} className="w-full flex flex-col gap-4">
              <input
                type="text"
                placeholder="Código de invitación"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                maxLength={8}
                className="w-full px-4 py-4 rounded-2xl text-center text-xl font-bold outline-none"
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1.5px solid transparent',
                  letterSpacing: '0.3em',
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
                disabled={loading || code.length < 4}
                className="w-full py-4 rounded-2xl text-white font-medium text-sm disabled:opacity-50"
                style={{ background: 'var(--color-primary)' }}
              >
                Unirme al jardín
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
