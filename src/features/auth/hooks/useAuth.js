import { useState } from 'react'
import { authService } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const loggedUser = await authService.login(email, password)
      setUser(loggedUser)
      return loggedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    isAuthenticated: Boolean(user),
    loading,
    error,
    login,
    logout,
  }
}
