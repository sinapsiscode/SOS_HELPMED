import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import emergencyRequestService from '../services/emergencyRequestService'

/**
 * Hook para manejo del formulario de solicitud de emergencia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica del componente principal
 * ✅ Regla #5: Gestión completa de estados
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #9: Uso de callbacks para optimización
 *
 * @param {Object} user - Usuario actual
 * @param {Function} onSubmit - Callback para enviar solicitud
 * @returns {Object} Estados y funciones del formulario de emergencia
 */
const useEmergencyRequestForm = (user, onSubmit) => {
  const { validateServiceLimits } = useAppStore()

  // Estados del formulario
  const [selectedService, setSelectedService] = useState('')
  const [selectedAffiliate, setSelectedAffiliate] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  // Estados de ubicación GPS
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState(null)

  // Estados de contactos adicionales
  const [extraContacts, setExtraContacts] = useState([{ name: '', phone: '' }])

  // Estados de advertencias y validación
  const [showReclassificationWarning, setShowReclassificationWarning] = useState(false)
  const [pendingSubmission, setPendingSubmission] = useState(null)

  // Referencia para control de GPS
  const watchIdRef = useRef(null)

  // Lista de afiliados disponibles
  const availableAffiliates = useMemo(() => {
    return emergencyRequestService.getAvailableAffiliates(user)
  }, [user])

  // Servicios disponibles según el plan del usuario
  const availableServices = useMemo(() => {
    return emergencyRequestService.getAvailableServices(user)
  }, [user])

  // Actualizar contacto adicional
  const handleExtraContactChange = useCallback((index, field, value) => {
    setExtraContacts((prev) =>
      prev.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact))
    )
  }, [])

  // Obtener ubicación GPS de alta precisión
  const handleGetLocation = useCallback(async () => {
    try {
      setIsGettingLocation(true)
      const coordinates = await emergencyRequestService.getHighPrecisionLocation(
        setCurrentCoordinates,
        watchIdRef
      )

      setLocation(
        `Lat: ${coordinates.latitude.toFixed(6)}, Lon: ${coordinates.longitude.toFixed(6)} (Precisión: ${coordinates.accuracy.toFixed(1)}m)`
      )

      emergencyRequestService.showLocationSuccess(coordinates)
    } catch (error) {
      emergencyRequestService.showLocationError(error.message)
    } finally {
      setIsGettingLocation(false)
    }
  }, [])

  // Usar dirección registrada
  const handleUseRegisteredAddress = useCallback(() => {
    setLocation(user.profile.address)
    setCurrentCoordinates(null)
  }, [user.profile.address])

  // Autocompletar dirección según el tipo de servicio
  useEffect(() => {
    if (selectedService === 'URGENCIA' || selectedService === 'MEDICO_DOMICILIO') {
      setLocation(user.profile.address)
      setCurrentCoordinates(null)
    } else if (selectedService === 'EMERGENCIA') {
      setLocation('')
    }
  }, [selectedService, user.profile.address])

  // Limpiar GPS watcher al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Validar formulario
  const validateForm = useCallback(() => {
    const errors = []

    if (!selectedService) errors.push('Debe seleccionar un tipo de servicio')
    if (!description.trim()) errors.push('Debe proporcionar una descripción')
    
    // Solo validar afiliado si NO es zona protegida (ya que zona protegida es para terceros)
    if (selectedService !== 'ZONA_PROTEGIDA' && !selectedAffiliate) {
      errors.push('Debe seleccionar el afiliado a tratar')
    }

    // Validar ubicación según el tipo de servicio
    if ((selectedService === 'URGENCIA' || selectedService === 'MEDICO_DOMICILIO') && !location) {
      errors.push('Este servicio requiere una dirección válida')
    }

    if (selectedService === 'EMERGENCIA' && !location && !currentCoordinates) {
      errors.push('Por favor proporciona una ubicación o usa el GPS')
    }

    return errors
  }, [selectedService, description, selectedAffiliate, location, currentCoordinates])

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const requestTime = new Date().toISOString()

      // Validar formulario
      const errors = validateForm()
      if (errors.length > 0) {
        emergencyRequestService.showFormErrors(errors)
        return
      }

      // Verificar síntomas no urgentes para emergencias
      if (
        selectedService === 'EMERGENCIA' &&
        emergencyRequestService.checkForNonEmergencySymptoms(description)
      ) {
        setPendingSubmission({
          selectedService,
          selectedAffiliate,
          description,
          location,
          isUrgent,
          currentCoordinates,
          extraContacts
        })
        setShowReclassificationWarning(true)
        return
      }

      // Validar límites de servicio
      const validation = validateServiceLimits(user, selectedService)
      if (!validation.allowed) {
        const shouldProceed = await emergencyRequestService.handleServiceLimitValidation(validation)
        if (!shouldProceed) return
      }

      // Procesar envío
      await processSubmission(
        {
          selectedService,
          selectedAffiliate,
          description,
          location,
          isUrgent,
          currentCoordinates,
          extraContacts
        },
        requestTime
      )
    },
    [
      selectedService,
      selectedAffiliate,
      description,
      location,
      isUrgent,
      currentCoordinates,
      extraContacts,
      validateForm,
      user,
      validateServiceLimits
    ]
  )

  // Procesar el envío de la solicitud
  const processSubmission = useCallback(
    async (submissionData, requestTime) => {
      const {
        selectedService,
        selectedAffiliate,
        description,
        location,
        currentCoordinates,
        extraContacts
      } = submissionData

      // Preparar datos finales
      const finalLocation = currentCoordinates || location
      const validExtraContacts = extraContacts.filter(
        (contact) => contact.name.trim() && contact.phone.trim()
      )
      const selectedAffiliateInfo = availableAffiliates.find(
        (affiliate) => affiliate.id === selectedAffiliate
      )

      // Enviar solicitud
      await onSubmit(
        selectedService,
        description,
        finalLocation,
        validExtraContacts,
        selectedAffiliateInfo,
        requestTime
      )

      // Limpiar formulario
      clearForm()
    },
    [availableAffiliates, onSubmit]
  )

  // Limpiar formulario
  const clearForm = useCallback(() => {
    setSelectedService('')
    setSelectedAffiliate('')
    setDescription('')
    setLocation('')
    setIsUrgent(false)
    setCurrentCoordinates(null)
    setExtraContacts([{ name: '', phone: '' }])
  }, [])

  // Aceptar advertencia de reclasificación
  const handleAcceptWarning = useCallback(async () => {
    setShowReclassificationWarning(false)
    if (pendingSubmission) {
      const modifiedSubmission = {
        ...pendingSubmission,
        description: pendingSubmission.description + ' [ADVERTENCIA ACEPTADA]'
      }

      await processSubmission(modifiedSubmission, new Date().toISOString())
      setPendingSubmission(null)
    }
  }, [pendingSubmission, processSubmission])

  // Cancelar advertencia de reclasificación
  const handleCancelWarning = useCallback(() => {
    setShowReclassificationWarning(false)
    setPendingSubmission(null)
    setSelectedService('')
  }, [])

  // Verificar si requiere ubicación GPS
  const requiresGPS = useMemo(() => {
    return selectedService === 'EMERGENCIA'
  }, [selectedService])

  // Verificar si es servicio domiciliario
  const isDomiciliaryService = useMemo(() => {
    return ['URGENCIA', 'MEDICO_DOMICILIO', 'ZONA_PROTEGIDA'].includes(selectedService)
  }, [selectedService])

  // Información de ubicación formateada
  const locationInfo = useMemo(() => {
    return {
      hasGPS: !!currentCoordinates,
      precision: currentCoordinates?.accuracy,
      registeredAddress: user.profile.address,
      requiresGPS,
      isDomiciliary: isDomiciliaryService
    }
  }, [currentCoordinates, user.profile.address, requiresGPS, isDomiciliaryService])

  // Contacto adicional válido
  const hasValidExtraContact = useMemo(() => {
    return extraContacts[0]?.name.trim() && extraContacts[0]?.phone.trim()
  }, [extraContacts])

  return {
    // Estados del formulario
    selectedService,
    setSelectedService,
    selectedAffiliate,
    setSelectedAffiliate,
    description,
    setDescription,
    location,
    setLocation,
    isUrgent,
    setIsUrgent,

    // Estados de ubicación
    isGettingLocation,
    currentCoordinates,

    // Estados de contactos
    extraContacts,
    handleExtraContactChange,
    hasValidExtraContact,

    // Estados de advertencias
    showReclassificationWarning,
    pendingSubmission,

    // Datos calculados
    availableAffiliates,
    availableServices,
    locationInfo,

    // Funciones de interacción
    handleSubmit,
    handleGetLocation,
    handleUseRegisteredAddress,
    handleAcceptWarning,
    handleCancelWarning,

    // Datos del usuario
    user
  }
}

export default useEmergencyRequestForm
