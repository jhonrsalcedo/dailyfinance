import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }
    return data
  },

  register: async (email: string, password: string, username?: string) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      username,
    })
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getCurrentUser: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    })
    return data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api