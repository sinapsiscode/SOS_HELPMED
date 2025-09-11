// Hook personalizado para usar el servicio de base de datos
import { useState, useEffect, useCallback } from 'react'
import databaseService from '../services/database.service'
import useAppStore from '../stores/useAppStore'

export const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Obtener funciones del store
  const setAllUsers = useAppStore(state => state.setAllUsers)
  const setActiveEmergencies = useAppStore(state => state.setActiveEmergencies)
  const setAmbulanceUsers = useAppStore(state => state.setAmbulanceUsers)
  const setSurveyResponses = useAppStore(state => state.setSurveyResponses)
  const setNotifications = useAppStore(state => state.setNotifications)

  // ========== CARGAR DATOS INICIALES ==========
  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await databaseService.loadAllData()
      
      // Actualizar el store con los datos cargados
      if (data.users) {
        const usersByRole = {
          admin: data.users.filter(u => u.role === 'ADMIN'),
          familiar: data.users.filter(u => u.role === 'FAMILIAR'),
          corporativo: data.users.filter(u => u.role === 'CORPORATIVO'),
          externo: data.users.filter(u => u.role === 'EXTERNO')
        }
        setAllUsers(usersByRole)
      }

      if (data.emergencies) {
        setActiveEmergencies(data.emergencies)
      }

      if (data.ambulances) {
        // Filtrar usuarios de ambulancia
        const ambulanceDrivers = data.users?.filter(u => u.role === 'AMBULANCE') || []
        setAmbulanceUsers(ambulanceDrivers)
      }

      if (data.surveyResponses) {
        setSurveyResponses(data.surveyResponses)
      }

      if (data.notifications) {
        setNotifications(data.notifications)
      }

      return data
    } catch (err) {
      console.error('Error loading initial data:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAllUsers, setActiveEmergencies, setAmbulanceUsers, setSurveyResponses, setNotifications])

  // ========== USUARIOS ==========
  const createUser = useCallback(async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newUser = await databaseService.createUser(userData)
      
      // Actualizar el store
      const users = await databaseService.getUsers()
      const usersByRole = {
        admin: users.filter(u => u.role === 'ADMIN'),
        familiar: users.filter(u => u.role === 'FAMILIAR'),
        corporativo: users.filter(u => u.role === 'CORPORATIVO'),
        externo: users.filter(u => u.role === 'EXTERNO')
      }
      setAllUsers(usersByRole)
      
      return newUser
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAllUsers])

  const updateUser = useCallback(async (id, userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updatedUser = await databaseService.updateUser(id, userData)
      
      // Actualizar el store
      const users = await databaseService.getUsers()
      const usersByRole = {
        admin: users.filter(u => u.role === 'ADMIN'),
        familiar: users.filter(u => u.role === 'FAMILIAR'),
        corporativo: users.filter(u => u.role === 'CORPORATIVO'),
        externo: users.filter(u => u.role === 'EXTERNO')
      }
      setAllUsers(usersByRole)
      
      return updatedUser
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAllUsers])

  const deleteUser = useCallback(async (id) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await databaseService.deleteUser(id)
      
      // Actualizar el store
      const users = await databaseService.getUsers()
      const usersByRole = {
        admin: users.filter(u => u.role === 'ADMIN'),
        familiar: users.filter(u => u.role === 'FAMILIAR'),
        corporativo: users.filter(u => u.role === 'CORPORATIVO'),
        externo: users.filter(u => u.role === 'EXTERNO')
      }
      setAllUsers(usersByRole)
      
      return true
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAllUsers])

  // ========== EMERGENCIAS ==========
  const createEmergency = useCallback(async (emergencyData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newEmergency = await databaseService.createEmergency(emergencyData)
      
      // Actualizar el store
      const emergencies = await databaseService.getEmergencies()
      setActiveEmergencies(emergencies)
      
      return newEmergency
    } catch (err) {
      console.error('Error creating emergency:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setActiveEmergencies])

  const updateEmergency = useCallback(async (id, emergencyData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updatedEmergency = await databaseService.updateEmergency(id, emergencyData)
      
      // Actualizar el store
      const emergencies = await databaseService.getEmergencies()
      setActiveEmergencies(emergencies)
      
      return updatedEmergency
    } catch (err) {
      console.error('Error updating emergency:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setActiveEmergencies])

  const assignAmbulanceToEmergency = useCallback(async (emergencyId, ambulanceId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Obtener la emergencia actual
      const emergency = await databaseService.getEmergencyById(emergencyId)
      
      // Actualizar la emergencia con la ambulancia asignada
      const updatedEmergency = await databaseService.updateEmergency(emergencyId, {
        ...emergency,
        status: 'in_progress',
        assignedAmbulance: ambulanceId,
        assignedAt: new Date().toISOString()
      })
      
      // Actualizar el estado de la ambulancia
      const ambulance = await databaseService.getAmbulanceById(ambulanceId)
      await databaseService.updateAmbulance(ambulanceId, {
        ...ambulance,
        status: 'busy',
        currentEmergency: emergencyId
      })
      
      // Actualizar el store
      const emergencies = await databaseService.getEmergencies()
      setActiveEmergencies(emergencies)
      
      return updatedEmergency
    } catch (err) {
      console.error('Error assigning ambulance:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setActiveEmergencies])

  // ========== ENCUESTAS ==========
  const createSurveyResponse = useCallback(async (surveyData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newResponse = await databaseService.createSurveyResponse(surveyData)
      
      // Actualizar el store
      const responses = await databaseService.getSurveyResponses()
      setSurveyResponses(responses)
      
      return newResponse
    } catch (err) {
      console.error('Error creating survey response:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setSurveyResponses])

  // ========== NOTIFICACIONES ==========
  const createNotification = useCallback(async (notificationData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newNotification = await databaseService.createNotification(notificationData)
      
      // Actualizar el store
      const notifications = await databaseService.getNotifications()
      setNotifications(notifications)
      
      return newNotification
    } catch (err) {
      console.error('Error creating notification:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setNotifications])

  const markNotificationAsRead = useCallback(async (id) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await databaseService.markNotificationAsRead(id)
      
      // Actualizar el store
      const notifications = await databaseService.getNotifications()
      setNotifications(notifications)
      
      return true
    } catch (err) {
      console.error('Error marking notification as read:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setNotifications])

  // ========== AFILIADOS ==========
  const createAffiliate = useCallback(async (affiliateData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newAffiliate = await databaseService.createAffiliate(affiliateData)
      return newAffiliate
    } catch (err) {
      console.error('Error creating affiliate:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateAffiliate = useCallback(async (id, affiliateData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updatedAffiliate = await databaseService.updateAffiliate(id, affiliateData)
      return updatedAffiliate
    } catch (err) {
      console.error('Error updating affiliate:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ========== CONTRATOS ==========
  const createContract = useCallback(async (contractData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newContract = await databaseService.createContract(contractData)
      return newContract
    } catch (err) {
      console.error('Error creating contract:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateContract = useCallback(async (id, contractData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updatedContract = await databaseService.updateContract(id, contractData)
      return updatedContract
    } catch (err) {
      console.error('Error updating contract:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  return {
    isLoading,
    error,
    // Funciones de carga
    loadInitialData,
    // Funciones de usuarios
    createUser,
    updateUser,
    deleteUser,
    // Funciones de emergencias
    createEmergency,
    updateEmergency,
    assignAmbulanceToEmergency,
    // Funciones de encuestas
    createSurveyResponse,
    // Funciones de notificaciones
    createNotification,
    markNotificationAsRead,
    // Funciones de afiliados
    createAffiliate,
    updateAffiliate,
    // Funciones de contratos
    createContract,
    updateContract,
    // Servicio directo para casos especiales
    databaseService
  }
}

export default useDatabase