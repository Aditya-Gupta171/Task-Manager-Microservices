import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  withCredentials: true,
})

// Task-specific API client
export const taskApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_API_URL,
  withCredentials: true,
})

const attachToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

api.interceptors.request.use(attachToken)
taskApi.interceptors.request.use(attachToken)

// Auth API methods
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
}

// Task API methods
export const tasks = {
  getAll: () => taskApi.get('/tasks'),
  getById: (id) => taskApi.get(`/tasks/${id}`),
  create: (data) => taskApi.post('/tasks', data),
  update: (id, data) => taskApi.put(`/tasks/${id}`, data),
  delete: (id) => taskApi.delete(`/tasks/${id}`),
  toggleComplete: (id, completed) => taskApi.put(`/tasks/${id}`, { completed }),
}