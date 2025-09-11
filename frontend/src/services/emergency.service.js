import apiService from './api.service'

class EmergencyService {
  // Emergencias activas
  async getEmergencies() {
    try {
      return await apiService.get('/emergencies')
    } catch (error) {
      console.error('Error fetching emergencies:', error)
      return []
    }
  }

  async getEmergencyById(id) {
    try {
      return await apiService.get(`/emergencies/${id}`)
    } catch (error) {
      console.error('Error fetching emergency:', error)
      return null
    }
  }

  async createEmergency(data) {
    try {
      return await apiService.post('/emergencies', {
        ...data,
        id: `EMG-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      })
    } catch (error) {
      console.error('Error creating emergency:', error)
      throw error
    }
  }

  async updateEmergency(id, data) {
    try {
      return await apiService.put(`/emergencies/${id}`, data)
    } catch (error) {
      console.error('Error updating emergency:', error)
      throw error
    }
  }

  async deleteEmergency(id) {
    try {
      return await apiService.delete(`/emergencies/${id}`)
    } catch (error) {
      console.error('Error deleting emergency:', error)
      throw error
    }
  }

  // Emergencias pendientes
  async getPendingEmergencies() {
    try {
      return await apiService.get('/pendingEmergencies')
    } catch (error) {
      console.error('Error fetching pending emergencies:', error)
      return []
    }
  }

  async createPendingEmergency(data) {
    try {
      return await apiService.post('/pendingEmergencies', {
        ...data,
        id: `PEMG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      })
    } catch (error) {
      console.error('Error creating pending emergency:', error)
      throw error
    }
  }

  async updatePendingEmergency(id, data) {
    try {
      return await apiService.put(`/pendingEmergencies/${id}`, data)
    } catch (error) {
      console.error('Error updating pending emergency:', error)
      throw error
    }
  }

  async deletePendingEmergency(id) {
    try {
      return await apiService.delete(`/pendingEmergencies/${id}`)
    } catch (error) {
      console.error('Error deleting pending emergency:', error)
      throw error
    }
  }

  // Asignar ambulancia a emergencia
  async assignAmbulance(emergencyId, ambulanceId) {
    try {
      const emergency = await this.getEmergencyById(emergencyId)
      if (!emergency) throw new Error('Emergency not found')

      return await this.updateEmergency(emergencyId, {
        ...emergency,
        status: 'in_progress',
        assignedAmbulance: ambulanceId,
        assignedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error assigning ambulance:', error)
      throw error
    }
  }

  // Completar emergencia
  async completeEmergency(emergencyId) {
    try {
      const emergency = await this.getEmergencyById(emergencyId)
      if (!emergency) throw new Error('Emergency not found')

      return await this.updateEmergency(emergencyId, {
        ...emergency,
        status: 'completed',
        completedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error completing emergency:', error)
      throw error
    }
  }

  // Cancelar emergencia
  async cancelEmergency(emergencyId, reason) {
    try {
      const emergency = await this.getEmergencyById(emergencyId)
      if (!emergency) throw new Error('Emergency not found')

      return await this.updateEmergency(emergencyId, {
        ...emergency,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelReason: reason
      })
    } catch (error) {
      console.error('Error cancelling emergency:', error)
      throw error
    }
  }
}

export default new EmergencyService()