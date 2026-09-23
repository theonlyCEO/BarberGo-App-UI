import api from './api'

export const appointmentService = {
  // Create appointment
  async createAppointment(data) {
    const response = await api.post('/appointments', data)
    return response.data.data.appointment
  },

  // Get my appointments (customer)
  async getMyAppointments(params) {
    const response = await api.get('/appointments/my', { params })
    return response.data.data
  },

  // Get barber appointments
  async getBarberAppointments(params) {
    const response = await api.get('/appointments/barber/all', { params })
    return response.data.data
  },

  // Get appointment by ID
  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`)
    return response.data.data.appointment
  },

  // Cancel appointment
  async cancelAppointment(id, reason) {
    const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason: reason })
    return response.data.data.appointment
  },

  // Update appointment status (barber)
  async updateAppointmentStatus(id, status, reason) {
    const response = await api.patch(`/appointments/${id}/status`, { status, cancellationReason: reason })
    return response.data.data.appointment
  },

  // Get availability
  async getAvailability(shopId, params) {
    const response = await api.get(`/shops/${shopId}/availability`, { params })
    return response.data.data
  },

  // Check specific slot
  async checkSlotAvailability(shopId, params) {
    const response = await api.get(`/shops/${shopId}/availability/check`, { params })
    return response.data.data
  }
}