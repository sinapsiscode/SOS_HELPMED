import apiService from './api.service'
import { API_ENDPOINTS } from '../config/api'
import { MOCK_DATA } from '../config/mockData'

class UserService {
  async getUsers() {
    try {
      return await apiService.get(API_ENDPOINTS.users.list)
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  async getUserById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.users.get(id))
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async createUser(data) {
    try {
      return await apiService.post(API_ENDPOINTS.users.create, data)
    } catch (error) {
      console.error('Error creating user:', error)
      return { ...data, id: Date.now() }
    }
  }

  async updateUser(id, data) {
    try {
      return await apiService.put(API_ENDPOINTS.users.update(id), data)
    } catch (error) {
      console.error('Error updating user:', error)
      return { ...data, id }
    }
  }

  async deleteUser(id) {
    try {
      return await apiService.delete(API_ENDPOINTS.users.delete(id))
    } catch (error) {
      console.error('Error deleting user:', error)
      return { success: true, message: 'User deleted (mock)' }
    }
  }

  async getUserProfile() {
    try {
      return await apiService.get(API_ENDPOINTS.users.profile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async updateProfile(data) {
    try {
      return await apiService.put(API_ENDPOINTS.users.profile, data)
    } catch (error) {
      console.error('Error updating profile:', error)
      return data
    }
  }
}

export default new UserService()