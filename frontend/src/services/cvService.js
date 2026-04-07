import api from './api'

const cvService = {
  getAllCvs: async () => {
    const response = await api.get('/cvs')
    return response.data
  },

  getCvById: async (id) => {
    const response = await api.get(`/cvs/${id}`)
    return response.data
  },

  createCv: async (cvData) => {
    const response = await api.post('/cvs', cvData)
    return response.data
  },

  updateCv: async (id, cvData) => {
    const response = await api.put(`/cvs/${id}`, cvData)
    return response.data
  },

  deleteCv: async (id) => {
    const response = await api.delete(`/cvs/${id}`)
    return response.data
  },

  generatePdf: async (id) => {
    const response = await api.post(`/pdf/generate/${id}`, {}, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default cvService