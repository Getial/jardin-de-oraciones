import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Placeholder hasta Fase 3
function GardensPage() {
  const { signOut, user } = useAuthStore()
  return (
    <div
      className="min-h-svh flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <span className="text-5xl">🌱</span>
      <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>
        Hola, {user?.user_metadata?.display_name || user?.email}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Mis jardines — Fase 3
      </p>
      <button
        onClick={signOut}
        className="mt-4 px-6 py-2 rounded-2xl text-sm"
        style={{ border: '1.5px solid var(--color-primary)', color: 'var(--color-primary)' }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default function App() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/gardens"
          element={
            <ProtectedRoute>
              <GardensPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/gardens" replace />} />
        <Route path="*" element={<Navigate to="/gardens" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
