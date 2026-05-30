import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <span className="text-3xl animate-pulse">🌱</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
