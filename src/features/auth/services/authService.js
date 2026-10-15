import { STORAGE_KEYS } from '@/constants'

/**
 * Service simulating auth operations
 */
export const authService = {
  async login(email, password) {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }

    const mockUser = {
      id: 'usr_123',
      name: email.split('@')[0],
      email,
      role: 'developer',
      lastLogin: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock_jwt_token_xyz987')
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockUser))

    return mockUser
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE)
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
}
