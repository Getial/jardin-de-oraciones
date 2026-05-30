import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GardensPage from './pages/GardensPage'
import CreateGardenPage from './pages/CreateGardenPage'
import JoinGardenPage from './pages/JoinGardenPage'
import InvitePage from './pages/InvitePage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Placeholder hasta Fase 5
function GardenPage() {
  return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Jardín — Fase 5</p>
    </div>
  )
}

// Placeholder hasta Fase 7
function SettingsPage() {
  const { signOut, user } = useAuthStore()
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'var(--color-bg)' }}>
      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{user?.email}</p>
      <button
        onClick={signOut}
        className="px-6 py-3 rounded-2xl text-sm"
        style={{ border: '1.5px solid var(--color-error)', color: 'var(--color-error)' }}
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
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protegidas */}
        <Route path="/gardens" element={<ProtectedRoute><GardensPage /></ProtectedRoute>} />
        <Route path="/gardens/new" element={<ProtectedRoute><CreateGardenPage /></ProtectedRoute>} />
        <Route path="/garden/:id" element={<ProtectedRoute><GardenPage /></ProtectedRoute>} />
        <Route path="/garden/:id/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedRoute><JoinGardenPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/gardens" replace />} />
        <Route path="*" element={<Navigate to="/gardens" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
