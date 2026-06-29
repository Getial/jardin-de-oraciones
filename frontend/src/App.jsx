import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import useThemeStore from './stores/themeStore'
import ProtectedRoute from './components/ProtectedRoute'

// Code splitting por ruta — cada página se descarga solo cuando se visita
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const GardensPage = lazy(() => import('./pages/GardensPage'))
const CreateGardenPage = lazy(() => import('./pages/CreateGardenPage'))
const JoinGardenPage = lazy(() => import('./pages/JoinGardenPage'))
const InvitePage = lazy(() => import('./pages/InvitePage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const GardenDetailPage = lazy(() => import('./pages/GardenDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function PageFallback() {
  return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <span className="text-4xl animate-pulse">🌱</span>
    </div>
  )
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  const initTheme = useThemeStore((s) => s.init)

  useEffect(() => {
    initTheme()
    init()
  }, [init, initTheme])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protegidas */}
          <Route path="/gardens" element={<ProtectedRoute><GardensPage /></ProtectedRoute>} />
          <Route path="/gardens/new" element={<ProtectedRoute><CreateGardenPage /></ProtectedRoute>} />
          <Route path="/garden/:id" element={<ProtectedRoute><GardenDetailPage /></ProtectedRoute>} />
          <Route path="/garden/:id/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
          <Route path="/join" element={<ProtectedRoute><JoinGardenPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/gardens" replace />} />
          <Route path="*" element={<Navigate to="/gardens" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
