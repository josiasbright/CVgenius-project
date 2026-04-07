import api from './api'

const letterService = {
  // Créer une lettre depuis un CV
  createFromCv: async (cvId, letterData) => {
    const response = await api.post(`/cover-letters/cv/${cvId}`, letterData)
    return response.data
  },

  // Récupérer toutes les lettres d'un CV
  getLettersByCv: async (cvId) => {
    const response = await api.get(`/cover-letters/cv/${cvId}`)
    return response.data
  },

  // Récupérer toutes les lettres de l'utilisateur
  getAllLetters: async () => {
    const response = await api.get('/cover-letters')
    return response.data
  },

  // Récupérer une lettre spécifique
  getLetterById: async (id) => {
    const response = await api.get(`/cover-letters/${id}`)
    return response.data
  },

  // Modifier une lettre
  updateLetter: async (id, updates) => {
    const response = await api.put(`/cover-letters/${id}`, updates)
    return response.data
  },

  // Supprimer une lettre
  deleteLetter: async (id) => {
    const response = await api.delete(`/cover-letters/${id}`)
    return response.data
  },

  // Générer PDF
  generatePdf: async (id) => {
    const response = await api.post(`/cover-letters/${id}/generate-pdf`, {}, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default letterService