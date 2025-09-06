import apiService from './api.service'
import { API_ENDPOINTS } from '../config/api'
import { MOCK_DATA } from '../config/mockData'

class EmergencyService {
  async getEmergencies() {
    try {
      return await apiService.get(API_ENDPOINTS.emergencies.list)
    } catch (error) {
      console.error('Error fetching emergencies:', error)
      // Retornar datos mock si hay error
      return [MOCK_DATA.emergencyExample]
    }
  }

  async getEmergencyById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.emergencies.get(id))
    } catch (error) {
      console.error('Error fetching emergency:', error)
      return MOCK_DATA.emergencyExample
    }
  }

  async createEmergency(data) {
    try {
      return await apiService.post(API_ENDPOINTS.emergencies.create, data)
    } catch (error) {
      console.error('Error creating emergency:', error)
      return { ...MOCK_DATA.emergencyExample, ...data, id: Date.now() }
    }
  }

  async updateEmergency(id, data) {
    try {
      return await apiService.put(API_ENDPOINTS.emergencies.update(id), data)
    } catch (error) {
      console.error('Error updating emergency:', error)
      return { ...MOCK_DATA.emergencyExample, ...data, id }
    }
  }

  async assignEmergency(id, ambulanceId) {
    try {
      return await apiService.post(API_ENDPOINTS.emergencies.assign(id), { ambulanceId })
    } catch (error) {
      console.error('Error assigning emergency:', error)
      return { success: true, message: 'Emergency assigned (mock)' }
    }
  }

  async completeEmergency(id) {
    try {
      return await apiService.post(API_ENDPOINTS.emergencies.complete(id))
    } catch (error) {
      console.error('Error completing emergency:', error)
      return { success: true, message: 'Emergency completed (mock)' }
    }
  }

  async cancelEmergency(id, reason) {
    try {
      return await apiService.post(API_ENDPOINTS.emergencies.cancel(id), { reason })
    } catch (error) {
      console.error('Error cancelling emergency:', error)
      return { success: true, message: 'Emergency cancelled (mock)' }
    }
  }

  async trackEmergency(id) {
    try {
      return await apiService.get(API_ENDPOINTS.emergencies.track(id))
    } catch (error) {
      console.error('Error tracking emergency:', error)
      return {
        id,
        status: 'in_progress',
        ambulance: MOCK_DATA.ambulances[0],
        eta: '5 min',
        distance: '1.5 km'
      }
    }
  }
}

export default new EmergencyService()