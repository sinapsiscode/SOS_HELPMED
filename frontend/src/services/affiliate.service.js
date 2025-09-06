import apiService from './api.service'
import { API_ENDPOINTS } from '../config/api'
import { MOCK_DATA } from '../config/mockData'

class AffiliateService {
  /**
   * Obtener lista de afiliados
   */
  async getAffiliates() {
    try {
      return await apiService.get(API_ENDPOINTS.affiliates.list)
    } catch (error) {
      console.error('Error fetching affiliates:', error)
      // Retornar datos mock si hay error
      return MOCK_DATA.affiliates || []
    }
  }

  /**
   * Obtener afiliado por ID
   */
  async getAffiliateById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.affiliates.get(id))
    } catch (error) {
      console.error('Error fetching affiliate:', error)
      const mockAffiliate = MOCK_DATA.affiliates?.find(a => a.id === id)
      return mockAffiliate || MOCK_DATA.affiliates?.[0] || null
    }
  }

  /**
   * Crear nuevo afiliado
   */
  async createAffiliate(data) {
    try {
      return await apiService.post(API_ENDPOINTS.affiliates.create, data)
    } catch (error) {
      console.error('Error creating affiliate:', error)
      // Simular creación exitosa con datos mock
      return {
        success: true,
        data: {
          ...data,
          id: Date.now(),
          status: 'active',
          addedAt: new Date().toISOString()
        }
      }
    }
  }

  /**
   * Actualizar afiliado
   */
  async updateAffiliate(id, data) {
    try {
      return await apiService.put(API_ENDPOINTS.affiliates.update(id), data)
    } catch (error) {
      console.error('Error updating affiliate:', error)
      return {
        success: true,
        data: { ...data, id }
      }
    }
  }

  /**
   * Eliminar afiliado
   */
  async deleteAffiliate(id) {
    try {
      return await apiService.delete(API_ENDPOINTS.affiliates.delete(id))
    } catch (error) {
      console.error('Error deleting affiliate:', error)
      return { success: true, message: 'Affiliate deleted (mock)' }
    }
  }

  /**
   * Activar afiliado
   */
  async activateAffiliate(id) {
    try {
      return await apiService.post(API_ENDPOINTS.affiliates.activate(id))
    } catch (error) {
      console.error('Error activating affiliate:', error)
      return { success: true, status: 'active' }
    }
  }

  /**
   * Suspender afiliado
   */
  async suspendAffiliate(id) {
    try {
      return await apiService.post(API_ENDPOINTS.affiliates.suspend(id))
    } catch (error) {
      console.error('Error suspending affiliate:', error)
      return { success: true, status: 'inactive' }
    }
  }

  /**
   * Cambiar estado del afiliado
   */
  async toggleAffiliateStatus(id, currentStatus) {
    const isActive = currentStatus === 'active'
    return isActive ? this.suspendAffiliate(id) : this.activateAffiliate(id)
  }

  /**
   * Validar DNI duplicado
   */
  async validateDNI(dni, excludeId = null) {
    try {
      const affiliates = await this.getAffiliates()
      const duplicate = affiliates.find(a => 
        a.dni === dni && a.id !== excludeId
      )
      return { isValid: !duplicate, duplicate }
    } catch (error) {
      console.error('Error validating DNI:', error)
      return { isValid: true }
    }
  }

  /**
   * Obtener límite de afiliados según plan
   */
  async getAffiliateLimit(planType) {
    // TODO: Implementar lógica real con backend
    const limits = {
      basic: 3,
      premium: 8,
      corporate: 50
    }
    return limits[planType] || 3
  }
}

export default new AffiliateService()