import { useState, useCallback } from 'react'

/**
 * Hook especializado para formulario de servicio externo
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Form management
 * ✅ Validación centralizada
 */
const useExternalServiceForm = (currentUser) => {
  // Estados para formulario de servicio
  const [serviceFormData, setServiceFormData] = useState({
    serviceType: '',
    description: '',
    location: '',
    requesterName: currentUser?.profile?.name || '',
    requesterAddress: currentUser?.profile?.address || ''
  })
  
  const [formErrors, setFormErrors] = useState({})

  // Validación del formulario de servicio
  const validateServiceForm = useCallback(() => {
    const newErrors = {}

    if (!serviceFormData.serviceType.trim()) {
      newErrors.serviceType = 'Selecciona un tipo de servicio'
    }

    if (!serviceFormData.description.trim()) {
      newErrors.description = 'Describe la situación médica'
    }

    if (!serviceFormData.location.trim()) {
      newErrors.location = 'Indica la ubicación'
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [serviceFormData])

  // Actualizar datos del formulario de servicio
  const updateServiceFormData = useCallback(
    (field, value) => {
      setServiceFormData((prev) => ({
        ...prev,
        [field]: value
      }))

      // Limpiar error específico del campo
      if (formErrors[field]) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: undefined
        }))
      }
    },
    [formErrors]
  )

  // Usar dirección registrada
  const useRegisteredAddress = useCallback(() => {
    if (currentUser?.profile?.address) {
      setServiceFormData((prev) => ({
        ...prev,
        location: currentUser.profile.address
      }))
    }
  }, [currentUser])

  // Limpiar formulario
  const clearForm = useCallback(() => {
    setServiceFormData({
      serviceType: '',
      description: '',
      location: '',
      requesterName: currentUser?.profile?.name || '',
      requesterAddress: currentUser?.profile?.address || ''
    })
    setFormErrors({})
  }, [currentUser])

  // Actualizar ubicación con coordenadas GPS
  const updateLocationWithGPS = useCallback((coordinates) => {
    if (!coordinates) return

    const locationString = `Lat: ${coordinates.latitude.toFixed(6)}, Lon: ${coordinates.longitude.toFixed(6)} (Precisión: ${coordinates.accuracy.toFixed(1)}m)`
    
    setServiceFormData((prev) => ({
      ...prev,
      location: locationString
    }))
  }, [])

  return {
    // Estado del formulario
    serviceFormData,
    formErrors,

    // Funciones del formulario
    validateServiceForm,
    updateServiceFormData,
    useRegisteredAddress,
    clearForm,
    updateLocationWithGPS
  }
}

export default useExternalServiceForm