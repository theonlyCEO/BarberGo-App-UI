import api from './api'

export const reviewService = {
  // Create review
  async createReview(data) {
    const response = await api.post('/reviews', data)
    return response.data.data.review
  },

  // Get shop reviews with pagination and filters
  async getShopReviews(shopId, params = {}) {
    const response = await api.get(`/reviews/shop/${shopId}`, { params })
    return response.data.data
  },

  // Get my reviews (customer)
  async getMyReviews(params) {
    const response = await api.get('/reviews/my', { params })
    return response.data.data
  },

  // Get review by ID
  async getReviewById(id) {
    const response = await api.get(`/reviews/${id}`)
    return response.data.data.review
  },

  // Update review
  async updateReview(id, data) {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data.data.review
  },

  // Delete review
  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`)
    return response.data.data
  },

  // Respond to review (barber)
  async respondToReview(id, responseText) {
    const response = await api.post(`/reviews/${id}/respond`, { response: responseText })
    return response.data.data.review
  },

  // Mark review as helpful
  async markHelpful(id) {
    const response = await api.post(`/reviews/${id}/helpful`)
    return response.data.data.review
  }
}