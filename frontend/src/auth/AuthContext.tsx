import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { session } from '../services/api'

interface AuthState {
  isLoggedIn: boolean
  userId: string | null
  login: (token: string, userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(session.token)
  const [userId, setUserId] = useState<string | null>(session.userId)

  const login = useCallback((newToken: string, newUserId: string) => {
    session.save(newToken, newUserId)
    setToken(newToken)
    setUserId(newUserId)
  }, [])

  const logout = useCallback(() => {
    session.clear()
    setToken(null)
    setUserId(null)
  }, [])

  const value = useMemo(
    () => ({ isLoggedIn: !!token, userId, login, logout }),
    [token, userId, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
