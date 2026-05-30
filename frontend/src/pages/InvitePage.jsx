import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGardenStore from '../stores/gardenStore'

export default function InvitePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getInvitation } = useGardenStore()

  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getInvitation(id)
      .then(setInvitation)
      .finally(() => setLoading(false))
  }, [id, getInvitation])

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  const shareUrl = `${appUrl}/join?code=${invitation?.code}`

  const copyCode = async () => {
    await navigator.clipboard.writeText(invitation.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const text = `¡Te invito a mi jardín de oración "${invitation.garden_name}"! Usa este código: *${invitation.code}* o entra aquí: ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Jardín de Oraciones', text: `Código: ${invitation.code}`, url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
          Invitar personas
        </h1>
      </header>

      <main className="flex-1 px-5 flex flex-col items-center pt-4 pb-20">
        {loading ? (
          <div className="w-full h-40 rounded-[24px] animate-pulse" style={{ background: 'var(--color-surface)' }} />
        ) : invitation ? (
          <>
            <p className="text-sm text-center mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Comparte este código para que otros puedan unirse a <strong>{invitation.garden_name}</strong>
            </p>

            {/* Código grande */}
            <button
              onClick={copyCode}
              className="w-full flex flex-col items-center py-8 rounded-[24px] mb-3 transition-transform active:scale-[0.98]"
              style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}
            >
              <span className="text-4xl font-bold tracking-[0.3em]" style={{ color: 'var(--color-primary)' }}>
                {invitation.code}
              </span>
              <span className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
                {copied ? '✓ Copiado' : 'Toca para copiar'}
              </span>
            </button>

            {/* Expiración */}
            <p className="text-xs mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Válido hasta {new Date(invitation.expires_at).toLocaleDateString('es', { day: 'numeric', month: 'long' })}
            </p>

            {/* Acciones de compartir */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={shareWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-medium text-sm"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Compartir por WhatsApp
              </button>

              <button
                onClick={shareLink}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-medium text-sm"
                style={{ border: '1.5px solid var(--color-primary)', color: 'var(--color-primary)' }}
              >
                🔗 Copiar enlace de invitación
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-error)' }}>
            No se pudo cargar la invitación.
          </p>
        )}
      </main>
    </div>
  )
}
