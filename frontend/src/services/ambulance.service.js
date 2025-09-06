import apiService from './api.service'
import { API_ENDPOINTS } from '../config/api'
import { MOCK_DATA } from '../config/mockData'

class AmbulanceService {
  async getAmbulances() {
    try {
      return await apiService.get(API_ENDPOINTS.ambulances.list)
    } catch (error) {
      console.error('Error fetching ambulances:', error)
      return MOCK_DATA.ambulances
    }
  }

  async getAmbulanceById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.ambulances.get(id))
    } catch (error) {
      console.error('Error fetching ambulance:', error)
      return MOCK_DATA.ambulances.find(a => a.id === id) || MOCK_DATA.ambulances[0]
    }
  }

  async createAmbulance(data) {
    try {
      return await apiService.post(API_ENDPOINTS.ambulances.create, data)
    } catch (error) {
      console.error('Error creating ambulance:', error)
      return { ...data, id: `AMB-${Date.now()}` }
    }
  }

  async updateAmbulance(id, data) {
    try {
      return await apiService.put(API_ENDPOINTS.ambulances.update(id), data)
    } catch (error) {
      console.error('Error updating ambulance:', error)
      return { ...data, id }
    }
  }

  async updateStatus(id, status) {
    try {
      return await apiService.patch(API_ENDPOINTS.ambulances.updateStatus(id), { status })
    } catch (error) {
      console.error('Error updating ambulance status:', error)
      return { success: true, status }
    }
  }

  async updateLocation(id, location) {
    try {
      return await apiService.patch(API_ENDPOINTS.ambulances.updateLocation(id), { location })
    } catch (error) {
      console.error('Error updating ambulance location:', error)
      return { success: true, location }
    }
  }

  async getAvailableAmbulances() {
    try {
      return await apiService.get(API_ENDPOINTS.ambulances.available)
    } catch (error) {
      console.error('Error fetching available ambulances:', error)
      return MOCK_DATA.ambulances.filter(a => a.status === 'available')
    }
  }
}

export default new AmbulanceService()