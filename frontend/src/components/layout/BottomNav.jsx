import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/gardens',
    label: 'Jardines',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C9 2 6 5 6 9c0 2.5 1.2 4.7 3 6.1V20h6v-4.9c1.8-1.4 3-3.6 3-6.1 0-4-3-7-6-7z"
          fill={active ? 'var(--color-primary)' : 'none'}
          stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9 20h6"
          stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Ajustes',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
          strokeWidth="1.8"
        />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-6 pb-safe"
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-gold)',
        height: '64px',
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className="flex flex-col items-center gap-1 px-6"
        >
          {({ isActive }) => (
            <>
              {tab.icon(isActive)}
              <span
                className="text-xs"
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
