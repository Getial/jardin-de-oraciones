import useAuthStore from '../stores/authStore'
import useThemeStore from '../stores/themeStore'
import BottomNav from '../components/layout/BottomNav'

const THEME_OPTIONS = [
  { value: 'light', label: 'Claro', icon: '☀️' },
  { value: 'dark', label: 'Oscuro', icon: '🌙' },
  { value: 'auto', label: 'Automático', icon: '🌗' },
]

export default function SettingsPage() {
  const { user, signOut } = useAuthStore()
  const { mode, setMode } = useThemeStore()

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'tú'

  return (
    <div className="min-h-svh flex flex-col pb-24" style={{ background: 'var(--color-bg)' }}>
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Ajustes
        </h1>
      </header>

      <main className="flex-1 px-5 flex flex-col gap-6">
        {/* Cuenta */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Cuenta
          </p>
          <div className="rounded-2xl p-4" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-soft)' }}>
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{displayName}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
          </div>
        </section>

        {/* Apariencia */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Apariencia
          </p>
          <div
            className="rounded-2xl p-1.5 flex gap-1.5"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-soft)' }}
          >
            {THEME_OPTIONS.map((opt) => {
              const active = mode === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-muted)',
                  }}
                >
                  <span className="text-lg leading-none">{opt.icon}</span>
                  {opt.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs mt-2 px-1" style={{ color: 'var(--color-text-muted)' }}>
            En automático, sigue el tema de tu dispositivo.
          </p>
        </section>

        {/* Cerrar sesión */}
        <button
          onClick={signOut}
          className="w-full py-3.5 rounded-2xl text-sm font-medium mt-2"
          style={{ border: '1.5px solid var(--color-error)', color: 'var(--color-error)' }}
        >
          Cerrar sesión
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
