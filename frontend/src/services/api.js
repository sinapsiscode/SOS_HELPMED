// Configuración de API para producción
// En desarrollo, usar /api para el proxy de Vite
// En producción, usar la URL completa desde variable de entorno
const API_URL = process.env.REACT_APP_API_URL || '/api'

class ApiService {
  async fetchData(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  async postData(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  async updateData(endpoint, id, data) {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  async patchData(endpoint, id, data) {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  async deleteData(endpoint, id) {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return response.status === 204 ? true : await response.json()
  }

  async getUsers() {
    return this.fetchData('users')
  }

  async getUserById(id) {
    return this.fetchData(`users/${id}`)
  }

  async createUser(user) {
    return this.postData('users', user)
  }

  async updateUser(id, user) {
    return this.updateData('users', id, user)
  }

  async deleteUser(id) {
    return this.deleteData('users', id)
  }

  async getEmergencies(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.fetchData(`emergencies${queryParams ? `?${queryParams}` : ''}`)
  }

  async getEmergencyById(id) {
    return this.fetchData(`emergencies/${id}`)
  }

  async createEmergency(emergency) {
    return this.postData('emergencies', emergency)
  }

  async updateEmergency(id, emergency) {
    return this.updateData('emergencies', id, emergency)
  }

  async updateEmergencyStatus(id, status) {
    return this.patchData('emergencies', id, { status })
  }

  async getAmbulances(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.fetchData(`ambulances${queryParams ? `?${queryParams}` : ''}`)
  }

  async getAmbulanceById(id) {
    return this.fetchData(`ambulances/${id}`)
  }

  async updateAmbulance(id, ambulance) {
    return this.updateData('ambulances', id, ambulance)
  }

  async updateAmbulanceStatus(id, status) {
    return this.patchData('ambulances', id, { status })
  }

  async getAffiliates(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.fetchData(`affiliates${queryParams ? `?${queryParams}` : ''}`)
  }

  async getAffiliateById(id) {
    return this.fetchData(`affiliates/${id}`)
  }

  async createAffiliate(affiliate) {
    return this.postData('affiliates', affiliate)
  }

  async updateAffiliate(id, affiliate) {
    return this.updateData('affiliates', id, affiliate)
  }

  async deleteAffiliate(id) {
    return this.deleteData('affiliates', id)
  }

  async getContracts(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return this.fetchData(`contracts${queryParams ? `?${queryParams}` : ''}`)
  }

  async getContractById(id) {
    return this.fetchData(`contracts/${id}`)
  }

  async createContract(contract) {
    return this.postData('contracts', contract)
  }

  async updateContract(id, contract) {
    return this.updateData('contracts', id, contract)
  }

  async getNotifications(userId) {
    return this.fetchData(`notifications?userId=${userId}`)
  }

  async markNotificationAsRead(id) {
    return this.patchData('notifications', id, { read: true })
  }

  async createNotification(notification) {
    return this.postData('notifications', notification)
  }

  async getPlans() {
    return this.fetchData('plans')
  }

  async getPlanById(id) {
    return this.fetchData(`plans/${id}`)
  }

  async updatePlan(id, plan) {
    return this.updateData('plans', id, plan)
  }

  async getDistricts() {
    return this.fetchData('districts')
  }

  async getStats() {
    return this.fetchData('stats')
  }

  async getDashboardStats() {
    // JSON Server usa rutas planas, no anidadas
    return this.fetchData('dashboard')
  }

  async getPendingEmergencies() {
    return this.fetchData('emergencies?status=pending')
  }

  async getActiveEmergencies() {
    return this.fetchData('emergencies?status=in_progress')
  }

  async getAvailableAmbulances() {
    return this.fetchData('ambulances?status=available')
  }

  async assignAmbulanceToEmergency(emergencyId, ambulanceId) {
    const updates = await Promise.all([
      this.patchData('emergencies', emergencyId, { 
        status: 'in_progress', 
        assignedAmbulance: ambulanceId 
      }),
      this.patchData('ambulances', ambulanceId, { 
        status: 'busy', 
        currentEmergency: emergencyId 
      })
    ])
    return updates
  }

  async completeEmergency(emergencyId, ambulanceId) {
    const updates = await Promise.all([
      this.patchData('emergencies', emergencyId, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      }),
      this.patchData('ambulances', ambulanceId, { 
        status: 'available', 
        currentEmergency: null 
      })
    ])
    return updates
  }

  async login(email, password) {
    return this.postData('auth/login', { email, password })
  }

  async logout() {
    return this.postData('auth/logout', {})
  }

  async register(userData) {
    return this.postData('auth/register', userData)
  }

  async refreshToken(token) {
    return this.postData('auth/refresh', { token })
  }

  async searchEmergencies(query) {
    return this.fetchData(`emergencies/search?q=${query}`)
  }

  async searchAffiliates(query) {
    return this.fetchData(`affiliates/search?q=${query}`)
  }

  async getEmergencyHistory(userId) {
    return this.fetchData(`emergencies/history/${userId}`)
  }

  async getAmbulanceHistory(ambulanceId) {
    return this.fetchData(`ambulances/history/${ambulanceId}`)
  }
}

export const apiService = new ApiService()
export default apiService