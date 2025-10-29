import api from './api'

class CustomerService {
  // Buscar cliente por identificador
  async findByIdentifier(identifier) {
    try {
      const response = await api.get(`/customers/find/${identifier}`)
      return response.data
    } catch (error) {
      console.error('Error finding customer by identifier:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al buscar cliente' }
    }
  }

  // Buscar clientes (autocompletar)
  async searchCustomers(searchTerm, limit = 10) {
    try {
      const response = await api.get(`/customers/search`, {
        params: { q: searchTerm, limit }
      })
      return response.data
    } catch (error) {
      console.error('Error searching customers:', error)
      return { success: false, data: [], message: error.response?.data?.message || 'Error en la búsqueda' }
    }
  }

  // Crear o actualizar cliente
  async createOrUpdate(customerData) {
    try {
      const response = await api.post('/customers', customerData)
      return response.data
    } catch (error) {
      console.error('Error creating/updating customer:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al guardar cliente' }
    }
  }

  // Obtener cliente por ID
  async getCustomer(id) {
    try {
      const response = await api.get(`/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error getting customer:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al obtener cliente' }
    }
  }

  // Listar clientes
  async getCustomers(filters = {}, page = 1, limit = 20) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }

      const response = await api.get('/customers', { params })
      return response.data
    } catch (error) {
      console.error('Error getting customers:', error)
      return { success: false, data: [], pagination: null, message: error.response?.data?.message || 'Error al obtener clientes' }
    }
  }

  // Obtener estadísticas de clientes
  async getStats() {
    try {
      const response = await api.get('/customers/stats')
      return response.data
    } catch (error) {
      console.error('Error getting customer stats:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al obtener estadísticas' }
    }
  }

  // Cambiar estado del cliente
  async toggleStatus(id, status) {
    try {
      const response = await api.put(`/customers/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error toggling customer status:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al cambiar estado' }
    }
  }

  // Eliminar cliente
  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting customer:', error)
      return { success: false, data: null, message: error.response?.data?.message || 'Error al eliminar cliente' }
    }
  }
}

export default new CustomerService()
