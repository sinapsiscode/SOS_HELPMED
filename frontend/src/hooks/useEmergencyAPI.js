import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

const useEmergencyAPI = () => {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEmergencies = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getEmergencies(params)
      setEmergencies(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching emergencies:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getPendingEmergencies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getPendingEmergencies()
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching pending emergencies:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getActiveEmergencies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getActiveEmergencies()
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching active emergencies:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createEmergency = useCallback(async (emergencyData) => {
    setLoading(true)
    setError(null)
    try {
      const newEmergency = {
        ...emergencyData,
        id: `EMG-${Date.now()}`,
        code: `EMG-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      const data = await apiService.createEmergency(newEmergency)
      await fetchEmergencies()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error creating emergency:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchEmergencies])

  const updateEmergency = useCallback(async (id, updates) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.updateEmergency(id, updates)
      await fetchEmergencies()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating emergency:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchEmergencies])

  const updateEmergencyStatus = useCallback(async (id, status) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.updateEmergencyStatus(id, status)
      await fetchEmergencies()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating emergency status:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchEmergencies])

  const assignAmbulance = useCallback(async (emergencyId, ambulanceId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.assignAmbulanceToEmergency(emergencyId, ambulanceId)
      await fetchEmergencies()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error assigning ambulance:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchEmergencies])

  const completeEmergency = useCallback(async (emergencyId, ambulanceId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.completeEmergency(emergencyId, ambulanceId)
      await fetchEmergencies()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error completing emergency:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchEmergencies])

  const searchEmergencies = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.searchEmergencies(query)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error searching emergencies:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getEmergencyHistory = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getEmergencyHistory(userId)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching emergency history:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmergencies()
  }, [fetchEmergencies])

  return {
    emergencies,
    loading,
    error,
    fetchEmergencies,
    getPendingEmergencies,
    getActiveEmergencies,
    createEmergency,
    updateEmergency,
    updateEmergencyStatus,
    assignAmbulance,
    completeEmergency,
    searchEmergencies,
    getEmergencyHistory
  }
}

export default useEmergencyAPI