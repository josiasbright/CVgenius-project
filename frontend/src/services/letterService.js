import api from './api'

const letterService = {
  createFromCv: async (cvId, letterData) => {
    const response = await api.post(`/cover-letters/cv/${cvId}`, letterData)
    return response.data
  },

  getLettersByCv: async (cvId) => {
    const response = await api.get(`/cover-letters/cv/${cvId}`)
    return response.data
  },

  getAllLetters: async () => {
    const response = await api.get('/cover-letters')
    return response.data
  },

  getLetterById: async (id) => {
    const response = await api.get(`/cover-letters/${id}`)
    return response.data
  },

  updateLetter: async (id, updates) => {
    const response = await api.put(`/cover-letters/${id}`, updates)
    return response.data
  },

  deleteLetter: async (id) => {
    const response = await api.delete(`/cover-letters/${id}`)
    return response.data
  },


  generatePdf: async (id) => {
    const response = await api.post(`/cover-letters/${id}/generate-pdf`, {}, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default letterService