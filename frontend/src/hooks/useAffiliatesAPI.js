import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

const useAffiliatesAPI = () => {
  const [affiliates, setAffiliates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAffiliates = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAffiliates(params)
      setAffiliates(data)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching affiliates:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getAffiliateById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAffiliateById(id)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching affiliate:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAffiliate = useCallback(async (affiliateData) => {
    setLoading(true)
    setError(null)
    try {
      const newAffiliate = {
        ...affiliateData,
        id: affiliateData.id || Date.now(),
        joinDate: affiliateData.joinDate || new Date().toISOString(),
        status: affiliateData.status || 'active'
      }
      const data = await apiService.createAffiliate(newAffiliate)
      await fetchAffiliates()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error creating affiliate:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAffiliates])

  const updateAffiliate = useCallback(async (id, updates) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.updateAffiliate(id, updates)
      await fetchAffiliates()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating affiliate:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAffiliates])

  const deleteAffiliate = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.deleteAffiliate(id)
      await fetchAffiliates()
      return { success: true }
    } catch (err) {
      setError(err.message)
      console.error('Error deleting affiliate:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAffiliates])

  const searchAffiliates = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.searchAffiliates(query)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error searching affiliates:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAffiliateStatus = useCallback(async (id, status) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.patchData('affiliates', id, { status })
      await fetchAffiliates()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating affiliate status:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAffiliates])

  const updateAffiliatePlan = useCallback(async (id, plan) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.patchData('affiliates', id, { plan })
      await fetchAffiliates()
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      console.error('Error updating affiliate plan:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [fetchAffiliates])

  const getAffiliateStats = useCallback(() => {
    return {
      total: affiliates.length,
      active: affiliates.filter(a => a.status === 'active').length,
      inactive: affiliates.filter(a => a.status === 'inactive').length,
      suspended: affiliates.filter(a => a.status === 'suspended').length,
      basic: affiliates.filter(a => a.plan === 'basic').length,
      premium: affiliates.filter(a => a.plan === 'premium').length,
      vip: affiliates.filter(a => a.plan === 'vip').length
    }
  }, [affiliates])

  const getAffiliatesByPlan = useCallback((plan) => {
    return affiliates.filter(a => a.plan === plan)
  }, [affiliates])

  const getActiveAffiliates = useCallback(() => {
    return affiliates.filter(a => a.status === 'active')
  }, [affiliates])

  useEffect(() => {
    fetchAffiliates()
  }, [fetchAffiliates])

  return {
    affiliates,
    loading,
    error,
    fetchAffiliates,
    getAffiliateById,
    createAffiliate,
    updateAffiliate,
    deleteAffiliate,
    searchAffiliates,
    updateAffiliateStatus,
    updateAffiliatePlan,
    getAffiliateStats,
    getAffiliatesByPlan,
    getActiveAffiliates
  }
}

export default useAffiliatesAPI