const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/v1'

/**
 * Base API client with standard fetch wrapper
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('app_auth_token')

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}
