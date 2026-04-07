import axios from 'axios'

const api = axios.create({
  // L'adresse de ton serveur Node
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // ✅ CRUCIAL : C'est cette ligne qui dit au navigateur : 
  // "Prends le cookie 'token' et envoie-le au serveur"
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json'
  }
})

// Pas besoin d'intercepteur de requête (Request Interceptor) !
// Le badge (cookie) est géré automatiquement par le navigateur.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le serveur répond 401, cela veut dire que le cookie est absent ou expiré
    if (error.response && error.response.status === 401) {
      console.warn("Session expirée ou utilisateur non connecté.");
    }
    return Promise.reject(error)
  }
)

export default api