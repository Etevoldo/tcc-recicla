import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '../../../components/ui/Spinner'
import { useAuth } from '../AuthContext'
import type { UserRole } from '../types'

export function RequireAuth({
  role,
  allowPasswordChange = false,
}: {
  role?: UserRole
  allowPasswordChange?: boolean
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="Verificando sessão..." />
  if (!user) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }
  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/trocar-senha" replace />
  }
  if (role && user.role !== role) {
    return <Navigate to="/gestao" replace />
  }
  return <Outlet />
}
