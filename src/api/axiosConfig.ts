import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Optional: Log the base URL in development
if (import.meta.env.DEV) {
  console.log('🚀 API Base URL:', import.meta.env.VITE_API_BASE_URL)
}

export default apiClient
