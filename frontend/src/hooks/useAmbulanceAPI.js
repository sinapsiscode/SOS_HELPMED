import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

const useAmbulanceAPI = () => {
  const [ambulances, setAmbulances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAmbulances = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAmbulances(params)
      setAmbulances(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching ambulances:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getAvailableAmbulances = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAvailableAmbulances()
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching available ambulances:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getAmbulanceById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAmbulanceById(id)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching ambulance:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAmbulance = useCallback(async (id, updates) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.updateAmbulance(id, updates)
      await fetchAmbulances()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating ambulance:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAmbulances])

  const updateAmbulanceStatus = useCallback(async (id, status) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.updateAmbulanceStatus(id, status)
      await fetchAmbulances()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating ambulance status:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAmbulances])

  const updateAmbulanceLocation = useCallback(async (id, location) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.patchData('ambulances', id, { location })
      await fetchAmbulances()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating ambulance location:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAmbulances])

  const getAmbulanceHistory = useCallback(async (ambulanceId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAmbulanceHistory(ambulanceId)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching ambulance history:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createAmbulance = useCallback(async (ambulanceData) => {
    setLoading(true)
    setError(null)
    try {
      const newAmbulance = {
        ...ambulanceData,
        id: ambulanceData.id || `AMB-${Date.now()}`,
        status: ambulanceData.status || 'available'
      }
      const data = await apiService.postData('ambulances', newAmbulance)
      await fetchAmbulances()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error creating ambulance:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAmbulances])

  const deleteAmbulance = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.deleteData('ambulances', id)
      await fetchAmbulances()
      return { success: true }
    } catch (err) {
      setError(err.message)
      console.error('Error deleting ambulance:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAmbulances])

  const getAmbulanceStats = useCallback(() => {
    return {
      total: ambulances.length,
      available: ambulances.filter(a => a.status === 'available').length,
      busy: ambulances.filter(a => a.status === 'busy').length,
      maintenance: ambulances.filter(a => a.status === 'maintenance').length,
      basic: ambulances.filter(a => a.type === 'basic').length,
      advanced: ambulances.filter(a => a.type === 'advanced').length
    }
  }, [ambulances])

  useEffect(() => {
    fetchAmbulances()
  }, [fetchAmbulances])

  return {
    ambulances,
    loading,
    error,
    fetchAmbulances,
    getAvailableAmbulances,
    getAmbulanceById,
    updateAmbulance,
    updateAmbulanceStatus,
    updateAmbulanceLocation,
    getAmbulanceHistory,
    createAmbulance,
    deleteAmbulance,
    getAmbulanceStats
  }
}

export default useAmbulanceAPI