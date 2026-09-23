import api from './api'

const getDefaultOpeningHours = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    isOpen: i !== 0,
    periods: i === 0 ? [] : [{ start: '09:00', end: '18:00' }]
  }))
}

export const shopService = {
  // ... existing methods ...

  // Upload shop photo
  async uploadPhoto(shopId, file) {
    const formData = new FormData()
    formData.append('photo', file)
    
    const response = await api.post(`/upload/shop/${shopId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },

  // Delete shop photo
  async deletePhoto(shopId, photoUrl) {
    const response = await api.delete(`/upload/shop/${shopId}`, {
      data: { photoUrl }
    })
    return response.data.data
  },

  // Get nearby shops with pagination
  async getNearbyShops(params) {
    const response = await api.get('/shops/nearby', { params })
    const data = response.data.data
    
    if (data.shops) {
      data.shops = data.shops.map(shop => ({
        ...shop,
        id: shop.id || shop._id || null
      }))
    }
    
    return data
  },

  // Get shop by ID
  async getShopById(id, params = {}) {
    if (typeof id === 'object' && id !== null) {
      id = id.id || id._id || null
    }
    
    if (id && typeof id !== 'string') {
      id = String(id)
    }
    
    if (!id || id === 'undefined' || id === 'null' || id === '[object Object]') {
      throw new Error('Invalid shop ID')
    }
    
    const response = await api.get(`/shops/${id}`, { params })
    const shop = response.data.data.shop
    
    if (shop && !shop.id) {
      shop.id = shop._id
    }
    
    return shop
  },

  // Get shop services
  async getServices(shopId, params = {}) {
    if (!shopId || shopId === 'undefined' || shopId === '[object Object]') {
      console.error('getServices called with invalid shop ID')
      return { services: [], pagination: {} }
    }
    
    const response = await api.get(`/shops/${shopId}/services`, { params })
    return response.data.data
  },

  // Create service
  async createService(shopId, data) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const cleanData = {
      name: data.name?.trim() || '',
      description: data.description?.trim() || '',
      price: parseFloat(data.price) || 0,
      durationMinutes: parseInt(data.durationMinutes) || 30,
      active: data.active !== undefined ? data.active : true,
      category: data.category?.trim() || 'General',
      sortOrder: data.sortOrder || 0
    }
    
    const response = await api.post(`/shops/${shopId}/services`, cleanData)
    return response.data.data.service
  },

  // Update service
  async updateService(serviceId, data) {
    const response = await api.put(`/services/${serviceId}`, data)
    return response.data.data.service
  },

  // Toggle service active
  async toggleServiceActive(serviceId) {
    const response = await api.patch(`/services/${serviceId}/toggle-active`)
    return response.data.data.service
  },

  // Delete service
  async deleteService(serviceId) {
    const response = await api.delete(`/services/${serviceId}`)
    return response.data.data
  },

  // Create shop
  async createShop(data) {
    const cleanData = {
      name: data.name?.trim() || '',
      description: data.description?.trim() || '',
      phone: data.phone?.trim() || '+27000000000',
      email: data.email?.trim() || undefined,
      address: {
        street: data.address?.street?.trim() || '',
        city: data.address?.city?.trim() || '',
        province: data.address?.province?.trim() || '',
        postalCode: data.address?.postalCode?.trim() || '',
        country: data.address?.country || 'South Africa'
      },
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(data.location?.coordinates?.[0]) || 0,
          parseFloat(data.location?.coordinates?.[1]) || 0
        ]
      },
      timezone: data.timezone || 'Africa/Johannesburg',
      openingHours: data.openingHours || getDefaultOpeningHours()
    }
    
    const response = await api.post('/shops', cleanData)
    return response.data.data.shop
  },

  // Update shop
  async updateShop(id, data) {
    const response = await api.put(`/shops/${id}`, data)
    return response.data.data.shop
  },

  // Get my shop
  async getMyShop() {
    const response = await api.get('/shops/my')
    const shop = response.data.data.shop
    
    if (shop && !shop.id) {
      shop.id = shop._id
    }
    
    return shop
  },

  // Update opening hours
  async updateOpeningHours(shopId, data) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    
    const payload = data.openingHours ? data : { openingHours: data }
    
    const response = await api.put(`/shops/${shopId}/opening-hours`, payload)
    return response.data.data.openingHours
  },

  // Get opening hours
  async getOpeningHours(shopId) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const response = await api.get(`/shops/${shopId}/opening-hours`)
    return response.data.data
  },

  // Check if shop is open
  async checkIfOpen(shopId, dateTime) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const response = await api.get(`/shops/${shopId}/is-open`, { 
      params: { dateTime } 
    })
    return response.data.data
  },

  // Get availability
  async getAvailability(shopId, params) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const response = await api.get(`/shops/${shopId}/availability`, { params })
    return response.data.data
  },

  // Get available dates
  async getAvailableDates(shopId, params) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const response = await api.get(`/shops/${shopId}/availability/dates`, { params })
    return response.data.data
  },

  // Check specific slot
  async checkSlotAvailability(shopId, params) {
    if (!shopId || shopId === 'undefined') {
      throw new Error('Shop ID is required')
    }
    const response = await api.get(`/shops/${shopId}/availability/check`, { params })
    return response.data.data
  }
}

export default shopService