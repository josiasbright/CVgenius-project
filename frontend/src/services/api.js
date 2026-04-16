import axios from 'axios'

const api = axios.create({
  // ON FORCE L'URL DE RENDER ICI
  baseURL: 'https://cvgenius-backend.onrender.com/api',
  
  // ✅ INDISPENSABLE pour les cookies de session sur Render
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée ou utilisateur non connecté.");
    }
    return Promise.reject(error)
  }
)

export default api