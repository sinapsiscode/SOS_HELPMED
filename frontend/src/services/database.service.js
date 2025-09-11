// Servicio central para todas las operaciones con json-server
import apiService from './api.service'

class DatabaseService {
  // ========== USUARIOS ==========
  async getUsers() {
    try {
      return await apiService.get('/users')
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  async getUserById(id) {
    try {
      return await apiService.get(`/users/${id}`)
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async createUser(userData) {
    try {
      // Generar ID si no existe
      const data = {
        ...userData,
        id: userData.id || Date.now(),
        createdAt: new Date().toISOString()
      }
      return await apiService.post('/users', data)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(id, userData) {
    try {
      return await apiService.put(`/users/${id}`, userData)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(id) {
    try {
      return await apiService.delete(`/users/${id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // ========== EMERGENCIAS ==========
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

  async createEmergency(emergencyData) {
    try {
      const data = {
        ...emergencyData,
        id: emergencyData.id || `EMG-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: emergencyData.status || 'pending'
      }
      return await apiService.post('/emergencies', data)
    } catch (error) {
      console.error('Error creating emergency:', error)
      throw error
    }
  }

  async updateEmergency(id, emergencyData) {
    try {
      return await apiService.put(`/emergencies/${id}`, emergencyData)
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

  // ========== EMERGENCIAS PENDIENTES ==========
  async getPendingEmergencies() {
    try {
      return await apiService.get('/pendingEmergencies')
    } catch (error) {
      console.error('Error fetching pending emergencies:', error)
      return []
    }
  }

  async createPendingEmergency(emergencyData) {
    try {
      const data = {
        ...emergencyData,
        id: emergencyData.id || `PEMG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
      return await apiService.post('/pendingEmergencies', data)
    } catch (error) {
      console.error('Error creating pending emergency:', error)
      throw error
    }
  }

  async updatePendingEmergency(id, emergencyData) {
    try {
      return await apiService.put(`/pendingEmergencies/${id}`, emergencyData)
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

  // ========== AMBULANCIAS ==========
  async getAmbulances() {
    try {
      return await apiService.get('/ambulances')
    } catch (error) {
      console.error('Error fetching ambulances:', error)
      return []
    }
  }

  async getAmbulanceById(id) {
    try {
      return await apiService.get(`/ambulances/${id}`)
    } catch (error) {
      console.error('Error fetching ambulance:', error)
      return null
    }
  }

  async createAmbulance(ambulanceData) {
    try {
      const data = {
        ...ambulanceData,
        id: ambulanceData.id || `AMB-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      return await apiService.post('/ambulances', data)
    } catch (error) {
      console.error('Error creating ambulance:', error)
      throw error
    }
  }

  async updateAmbulance(id, ambulanceData) {
    try {
      return await apiService.put(`/ambulances/${id}`, ambulanceData)
    } catch (error) {
      console.error('Error updating ambulance:', error)
      throw error
    }
  }

  async deleteAmbulance(id) {
    try {
      return await apiService.delete(`/ambulances/${id}`)
    } catch (error) {
      console.error('Error deleting ambulance:', error)
      throw error
    }
  }

  // ========== ENCUESTAS ==========
  async getSurveyResponses() {
    try {
      return await apiService.get('/surveyResponses')
    } catch (error) {
      console.error('Error fetching survey responses:', error)
      return []
    }
  }

  async createSurveyResponse(surveyData) {
    try {
      const data = {
        ...surveyData,
        id: surveyData.id || Date.now(),
        date: new Date().toISOString(),
        completed: true
      }
      return await apiService.post('/surveyResponses', data)
    } catch (error) {
      console.error('Error creating survey response:', error)
      throw error
    }
  }

  async getSurveyQuestions() {
    try {
      return await apiService.get('/surveyQuestions')
    } catch (error) {
      console.error('Error fetching survey questions:', error)
      return []
    }
  }

  // ========== NOTIFICACIONES ==========
  async getNotifications() {
    try {
      return await apiService.get('/notifications')
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  async createNotification(notificationData) {
    try {
      const data = {
        ...notificationData,
        id: notificationData.id || Date.now(),
        createdAt: new Date().toISOString(),
        read: false
      }
      return await apiService.post('/notifications', data)
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  async markNotificationAsRead(id) {
    try {
      const notification = await this.getNotificationById(id)
      if (notification) {
        return await apiService.put(`/notifications/${id}`, {
          ...notification,
          read: true,
          readAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  async getNotificationById(id) {
    try {
      return await apiService.get(`/notifications/${id}`)
    } catch (error) {
      console.error('Error fetching notification:', error)
      return null
    }
  }

  // ========== AFILIADOS ==========
  async getAffiliates() {
    try {
      return await apiService.get('/affiliates')
    } catch (error) {
      console.error('Error fetching affiliates:', error)
      return []
    }
  }

  async createAffiliate(affiliateData) {
    try {
      const data = {
        ...affiliateData,
        id: affiliateData.id || Date.now(),
        joinDate: new Date().toISOString(),
        status: 'active'
      }
      return await apiService.post('/affiliates', data)
    } catch (error) {
      console.error('Error creating affiliate:', error)
      throw error
    }
  }

  async updateAffiliate(id, affiliateData) {
    try {
      return await apiService.put(`/affiliates/${id}`, affiliateData)
    } catch (error) {
      console.error('Error updating affiliate:', error)
      throw error
    }
  }

  async deleteAffiliate(id) {
    try {
      return await apiService.delete(`/affiliates/${id}`)
    } catch (error) {
      console.error('Error deleting affiliate:', error)
      throw error
    }
  }

  // ========== CONTRATOS ==========
  async getContracts() {
    try {
      return await apiService.get('/contracts')
    } catch (error) {
      console.error('Error fetching contracts:', error)
      return []
    }
  }

  async createContract(contractData) {
    try {
      const data = {
        ...contractData,
        id: contractData.id || Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active'
      }
      return await apiService.post('/contracts', data)
    } catch (error) {
      console.error('Error creating contract:', error)
      throw error
    }
  }

  async updateContract(id, contractData) {
    try {
      return await apiService.put(`/contracts/${id}`, contractData)
    } catch (error) {
      console.error('Error updating contract:', error)
      throw error
    }
  }

  async deleteContract(id) {
    try {
      return await apiService.delete(`/contracts/${id}`)
    } catch (error) {
      console.error('Error deleting contract:', error)
      throw error
    }
  }

  // ========== PLANES ==========
  async getPlans() {
    try {
      return await apiService.get('/plans')
    } catch (error) {
      console.error('Error fetching plans:', error)
      return []
    }
  }

  async getPlanConfiguration() {
    try {
      return await apiService.get('/planConfiguration')
    } catch (error) {
      console.error('Error fetching plan configuration:', error)
      return {}
    }
  }

  async getAdminPlanConfiguration() {
    try {
      return await apiService.get('/adminPlanConfiguration')
    } catch (error) {
      console.error('Error fetching admin plan configuration:', error)
      return {}
    }
  }

  async updateAdminPlanConfiguration(configData) {
    try {
      return await apiService.put('/adminPlanConfiguration', configData)
    } catch (error) {
      console.error('Error updating admin plan configuration:', error)
      throw error
    }
  }

  // ========== ESTADÍSTICAS ==========
  async getStats() {
    try {
      const response = await apiService.get('/stats')
      return response.dashboard || response || {}
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalEmergencies: 0,
        activeEmergencies: 0,
        availableAmbulances: 0,
        totalAmbulances: 0,
        monthlyRevenue: 0,
        totalUsers: 0,
        averageResponseTime: '0 min',
        satisfactionRate: 0,
        totalAffiliates: 0,
        activeContracts: 0
      }
    }
  }

  async updateStats(statsData) {
    try {
      return await apiService.put('/stats', statsData)
    } catch (error) {
      console.error('Error updating stats:', error)
      throw error
    }
  }

  // ========== ENTIDADES EXTERNAS ==========
  async getExternalEntities() {
    try {
      return await apiService.get('/externalEntities')
    } catch (error) {
      console.error('Error fetching external entities:', error)
      return []
    }
  }

  async createExternalEntity(entityData) {
    try {
      const data = {
        ...entityData,
        id: entityData.id || `EXT-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      return await apiService.post('/externalEntities', data)
    } catch (error) {
      console.error('Error creating external entity:', error)
      throw error
    }
  }

  async updateExternalEntity(id, entityData) {
    try {
      return await apiService.put(`/externalEntities/${id}`, entityData)
    } catch (error) {
      console.error('Error updating external entity:', error)
      throw error
    }
  }

  async deleteExternalEntity(id) {
    try {
      return await apiService.delete(`/externalEntities/${id}`)
    } catch (error) {
      console.error('Error deleting external entity:', error)
      throw error
    }
  }

  // ========== CONFIGURACIÓN DE PAGOS ==========
  async getPaymentConfig() {
    try {
      return await apiService.get('/paymentConfig')
    } catch (error) {
      console.error('Error fetching payment config:', error)
      return {}
    }
  }

  async updatePaymentConfig(configData) {
    try {
      return await apiService.put('/paymentConfig', configData)
    } catch (error) {
      console.error('Error updating payment config:', error)
      throw error
    }
  }

  // ========== HISTORIAL DE SERVICIOS ==========
  async getServiceHistory() {
    try {
      return await apiService.get('/service_history')
    } catch (error) {
      console.error('Error fetching service history:', error)
      return []
    }
  }

  async createServiceHistory(serviceData) {
    try {
      const data = {
        ...serviceData,
        id: serviceData.id || `SERV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status: 'completed'
      }
      return await apiService.post('/service_history', data)
    } catch (error) {
      console.error('Error creating service history:', error)
      throw error
    }
  }

  // ========== TRANSACCIONES (NO EXISTE EN DB.JSON - CREAR) ==========
  async getTransactions() {
    try {
      // Por ahora retornar array vacío hasta que se agregue a db.json
      return []
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  }

  async createTransaction(transactionData) {
    try {
      // Por ahora solo loguear hasta que se agregue a db.json
      console.log('Transaction to create:', transactionData)
      return transactionData
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  // ========== SOLICITUDES DE REGISTRO (NO EXISTE EN DB.JSON - CREAR) ==========
  async getRegistrationRequests() {
    try {
      // Por ahora retornar array vacío hasta que se agregue a db.json
      return []
    } catch (error) {
      console.error('Error fetching registration requests:', error)
      return []
    }
  }

  async createRegistrationRequest(requestData) {
    try {
      // Por ahora solo loguear hasta que se agregue a db.json
      console.log('Registration request to create:', requestData)
      return requestData
    } catch (error) {
      console.error('Error creating registration request:', error)
      throw error
    }
  }

  async updateRegistrationRequest(id, requestData) {
    try {
      // Por ahora solo loguear hasta que se agregue a db.json
      console.log('Registration request to update:', id, requestData)
      return requestData
    } catch (error) {
      console.error('Error updating registration request:', error)
      throw error
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  async loadAllData() {
    try {
      const [
        users,
        emergencies,
        pendingEmergencies,
        ambulances,
        surveyResponses,
        notifications,
        affiliates,
        contracts,
        plans,
        stats,
        externalEntities,
        serviceHistory
      ] = await Promise.all([
        this.getUsers(),
        this.getEmergencies(),
        this.getPendingEmergencies(),
        this.getAmbulances(),
        this.getSurveyResponses(),
        this.getNotifications(),
        this.getAffiliates(),
        this.getContracts(),
        this.getPlans(),
        this.getStats(),
        this.getExternalEntities(),
        this.getServiceHistory()
      ])

      return {
        users,
        emergencies,
        pendingEmergencies,
        ambulances,
        surveyResponses,
        notifications,
        affiliates,
        contracts,
        plans,
        stats,
        externalEntities,
        serviceHistory
      }
    } catch (error) {
      console.error('Error loading all data:', error)
      return {}
    }
  }
}

export default new DatabaseService()