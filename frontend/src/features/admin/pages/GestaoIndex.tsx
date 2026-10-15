import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export function GestaoIndex() {
  const { isAdmin } = useAuth()
  return <Navigate to={isAdmin ? 'compradores' : 'minha-area'} replace />
}
