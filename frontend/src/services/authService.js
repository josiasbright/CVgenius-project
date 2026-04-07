import api from "../services/api";

const authService = {
  // On ajoute fullName ici car ton backend et ton formulaire en ont besoin
  register: async (fullName, email, password) => {
    const response = await api.post('/auth/register', { fullName, email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    // ✅ On utilise /me comme défini dans ton backend
    const response = await api.get('/auth/me')
    return response.data
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }


}


export default authService