import { useState, useEffect } from 'react'

/**
 * Hook personalizado para consumir datos de API
 * @param {Function} serviceMethod - Método del servicio a ejecutar
 * @param {Array} deps - Dependencias para re-ejecutar la consulta
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApiData = (serviceMethod, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await serviceMethod()
      setData(result)
    } catch (err) {
      setError(err.message || 'Error al cargar datos')
      console.error('useApiData error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, deps)

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook para realizar mutaciones (POST, PUT, DELETE)
 * @param {Function} serviceMethod - Método del servicio a ejecutar
 * @returns {Object} - { mutate, loading, error, data }
 */
export const useApiMutation = (serviceMethod) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await serviceMethod(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'Error en la operación')
      console.error('useApiMutation error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error, data }
}