import api from './api'

export const adminService = {
  // Get all shops with filters
  async getAllShops(params) {
    const response = await api.get('/admin/shops', { params })
    return response.data.data
  },

  // Update shop status
  async updateShopStatus(shopId, status, reason = null) {
    // Clean up data before sending
    const payload = { status };
    
    // Only add reason if it's provided and not empty
    if (reason && reason.trim() !== '') {
      payload.reason = reason.trim();
    }
    
    const response = await api.patch(`/admin/shops/${shopId}/status`, payload)
    return response.data.data.shop
  },

  // Get all users with filters
  async getAllUsers(params) {
    const response = await api.get('/admin/users', { params })
    return response.data.data
  },

  // Deactivate user
  async deactivateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/deactivate`)
    return response.data.data.user
  },

  // Activate user
  async activateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/activate`)
    return response.data.data.user
  },

  // Get all reviews with filters
  async getAllReviews(params) {
    const response = await api.get('/admin/reviews', { params })
    return response.data.data
  },

  // Moderate review
  async moderateReview(reviewId, action) {
    const response = await api.patch(`/admin/reviews/${reviewId}/moderate`, { action })
    return response.data.data.review
  },

  // Delete review
  async deleteReview(reviewId) {
    const response = await api.delete(`/admin/reviews/${reviewId}`)
    return response.data.data
  },

  // Get platform statistics
  async getPlatformStats() {
    const response = await api.get('/admin/stats')
    return response.data.data
  },

  // Get all appointments
  async getAllAppointments(params) {
    const response = await api.get('/admin/appointments', { params })
    return response.data.data
  }
}