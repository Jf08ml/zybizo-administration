import { apiOrder } from './api.js'

// Servicio para gestión de órdenes y POS
const orderService = {
  // Crear nueva orden (POS)
  async createOrder(orderData) {
    try {
      const response = await apiOrder.post('', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener órdenes con filtros
  async getOrders(filters = {}) {
    try {
      const params = new URLSearchParams()

      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key])
        }
      })

      const response = await apiOrder.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener orden por ID
  async getOrder(orderId) {
    try {
      const response = await apiOrder.get(`/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener órdenes de hoy
  async getTodaysOrders() {
    try {
      const response = await apiOrder.get('/today')
      return response.data
    } catch (error) {
      console.error('Error fetching today orders:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener dashboard del POS
  async getPOSDashboard() {
    try {
      const response = await apiOrder.get('/dashboard')
      return response.data
    } catch (error) {
      console.error('Error fetching POS dashboard:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener estadísticas de ventas
  async getSalesStats(dateFrom, dateTo) {
    try {
      const response = await apiOrder.get('/stats', {
        params: { dateFrom, dateTo }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching sales stats:', error)
      throw this.handleApiError(error)
    }
  },

  // Actualizar estado de orden
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiOrder.patch(`/${orderId}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw this.handleApiError(error)
    }
  },

  // Cancelar orden
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await apiOrder.patch(`/${orderId}/cancel`, { reason })
      return response.data
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw this.handleApiError(error)
    }
  },

  // Manejar errores de la API
  handleApiError(error) {
    if (error.response) {
      // Error del servidor con respuesta
      const message = error.response.data?.message || 'Error del servidor'
      return new Error(message)
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifique su conexión a internet.')
    } else {
      // Error en la configuración de la petición
      return new Error('Error al procesar la solicitud.')
    }
  }
}

export default orderService
