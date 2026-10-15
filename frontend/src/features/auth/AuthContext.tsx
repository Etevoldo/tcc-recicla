import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setAuthToken, setOnUnauthorized } from '../../lib/api'
import { getMe, loginRequest } from './services/authApi'
import type { AuthUser } from './types'

const TOKEN_KEY = 'recicla.token'
const USER_KEY = 'recicla.user'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setSessionUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setAuthToken(null)
    setUser(null)
    setLoading(false)
  }, [])

  const setSessionUser = useCallback((next: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(next))
    setUser(next)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password)
    localStorage.setItem(TOKEN_KEY, result.token)
    setAuthToken(result.token)
    setSessionUser(result.user)
  }, [setSessionUser])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    setAuthToken(token)
    setOnUnauthorized(logout)
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    getMe()
      .then((current) => {
        if (cancelled) return
        localStorage.setItem(USER_KEY, JSON.stringify(current))
        setUser(current)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      setOnUnauthorized(null)
    }
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'ADMIN',
      login,
      logout,
      setSessionUser,
    }),
    [user, loading, login, logout, setSessionUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
