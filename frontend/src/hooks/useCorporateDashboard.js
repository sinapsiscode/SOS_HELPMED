import { useState, useEffect, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import corporateService from '../services/corporateService'

/**
 * Hook para gestión integral del dashboard corporativo
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica compleja del componente
 * ✅ Regla #5: Gestión completa de estados corporativos
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @returns {Object} Estados y funciones para el dashboard corporativo
 */
const useCorporateDashboard = () => {
  // Estados del store global
  const { currentUser, requestEmergency, systemSettings, logout, purchaseAdditionalServices } =
    useAppStore()

  // Estados locales para UI
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estados para formulario de emergencia
  const [emergencyFormData, setEmergencyFormData] = useState({
    patientName: '',
    patientAge: '',
    emergencyType: '',
    description: '',
    location: '',
    requesterName: currentUser?.profile?.name || '',
    requesterPosition: currentUser?.profile?.position || ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Validación del usuario corporativo
  const isValidCorporateUser = useMemo(() => {
    return currentUser && currentUser.role === 'CORPORATIVO'
  }, [currentUser])

  // Estadísticas calculadas con useMemo para optimización
  const companyStats = useMemo(() => {
    if (!currentUser) return null

    const usagePercentage = Math.round(
      (currentUser.service_usage.used_services /
        (currentUser.service_usage.used_services +
          currentUser.service_usage.remaining_services)) *
        100
    )

    // Calcular próxima fecha de reset según el ciclo del plan
    const getNextResetDate = () => {
      const renewalDate = new Date(currentUser.plan.renewal_date)
      const today = new Date()

      if (currentUser.plan.billing_cycle === 'monthly') {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        return nextMonth
      } else {
        return renewalDate
      }
    }

    const nextReset = getNextResetDate()
    const daysUntilReset = Math.ceil((nextReset - new Date()) / (1000 * 60 * 60 * 24))

    return {
      usagePercentage,
      nextReset,
      daysUntilReset,
      totalServices: currentUser.plan.contract_services,
      remainingServices: currentUser.service_usage.remaining_services,
      usedServices: currentUser.service_usage.used_services,
      billingCycle: currentUser.plan.billing_cycle,
      locationsCount: currentUser.company.locations?.length || 0
    }
  }, [currentUser])

  // Alertas de contrato
  const contractAlerts = useMemo(() => {
    if (!currentUser || !systemSettings)
      return { showContractAlert: false, showServicesAlert: false }

    // Alerta de vencimiento de contrato
    const alertDays = systemSettings.contractExpirationAlertDays || 15
    const contractEndDate = new Date(
      currentUser.plan.endDate || currentUser.billing?.next_billing_date || '2025-02-15'
    )
    const today = new Date()
    const timeDifference = contractEndDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24))
    const showContractAlert = daysRemaining <= alertDays && daysRemaining > 0

    // Alerta de servicios agotándose
    const alertThreshold = systemSettings.corporateServicesAlertThreshold || 2
    const remainingServices = currentUser.service_usage.remaining_services
    const showServicesAlert = remainingServices <= alertThreshold && remainingServices > 0

    return {
      showContractAlert,
      showServicesAlert,
      contractDaysRemaining: daysRemaining,
      contractEndDate,
      servicesRemaining: remainingServices
    }
  }, [currentUser, systemSettings])

  // Datos de reportes
  const reportData = useMemo(() => {
    if (!currentUser) return null

    return {
      usedServices: currentUser.service_usage.used_services,
      remainingServices: currentUser.service_usage.remaining_services,
      planInfo: `${currentUser.plan.contract_services}/${currentUser.plan.billing_cycle === 'monthly' ? 'mes' : 'año'}`,
      locationsCount: currentUser.company.locations?.length || 0,
      monthlyBreakdown: currentUser.service_usage.breakdown_by_month || {},
      locationBreakdown: currentUser.service_usage.breakdown_by_location || {}
    }
  }, [currentUser])

  // Inicialización del componente
  useEffect(() => {
    if (!isValidCorporateUser) {
      setError('Usuario corporativo no válido')
      return
    }

    initializeCorporateData()
  }, [isValidCorporateUser])

  // Inicializar datos corporativos
  const initializeCorporateData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Aquí se podrían cargar datos adicionales si es necesario
    } catch (err) {
      const errorMessage = corporateService.handleError(
        err,
        'Error al inicializar dashboard corporativo'
      )
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Validación del formulario de emergencia
  const validateEmergencyForm = useCallback(() => {
    const newErrors = {}

    // Validaciones campos del paciente
    if (!emergencyFormData.patientName.trim())
      newErrors.patientName = 'Ingresa el nombre del paciente'
    if (!emergencyFormData.patientAge.trim()) {
      newErrors.patientAge = 'Ingresa la edad del paciente'
    } else if (
      isNaN(emergencyFormData.patientAge) ||
      parseInt(emergencyFormData.patientAge) < 0 ||
      parseInt(emergencyFormData.patientAge) > 120
    ) {
      newErrors.patientAge = 'Ingresa una edad válida (0-120 años)'
    }
    if (!emergencyFormData.emergencyType.trim())
      newErrors.emergencyType = 'Especifica el tipo de emergencia'

    // Validaciones campos originales
    if (!emergencyFormData.description.trim()) newErrors.description = 'Describe la emergencia'
    if (!emergencyFormData.location.trim()) newErrors.location = 'Selecciona la ubicación'

    // Validaciones campos del solicitante
    if (!emergencyFormData.requesterName.trim()) newErrors.requesterName = 'Ingresa tu nombre'
    if (!emergencyFormData.requesterPosition.trim())
      newErrors.requesterPosition = 'Ingresa tu cargo'

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [emergencyFormData])

  // Manejar solicitud de emergencia
  const handleEmergencyRequest = useCallback(async () => {
    if (!validateEmergencyForm()) {
      return
    }

    try {
      setLoading(true)

      const emergencyData = {
        patient: {
          name: emergencyFormData.patientName,
          age: emergencyFormData.patientAge,
          emergencyType: emergencyFormData.emergencyType
        },
        requester: {
          name: emergencyFormData.requesterName,
          position: emergencyFormData.requesterPosition,
          company: currentUser.company.name
        }
      }

      const result = await requestEmergency(
        'EMERGENCIA',
        emergencyFormData.description,
        emergencyFormData.location,
        []
      )

      if (result.success) {
        // Limpiar formulario
        setEmergencyFormData({
          patientName: '',
          patientAge: '',
          emergencyType: '',
          description: '',
          location: '',
          requesterName: currentUser?.profile?.name || '',
          requesterPosition: currentUser?.profile?.position || ''
        })
        setFormErrors({})

        // Mostrar confirmación de éxito
        await corporateService.showEmergencySuccess()

        // Mostrar encuesta de calidad después de un delay
        setTimeout(async () => {
          await corporateService.showServiceQualitySurvey(
            'AREA_PROTEGIDA',
            'Servicio de Área Protegida - Emergencia Empresarial',
            currentUser
          )
        }, 1000)
      } else {
        corporateService.showEmergencyError(result.error)
      }
    } catch (err) {
      const errorMessage = corporateService.handleError(err, 'Error al reportar emergencia')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [emergencyFormData, validateEmergencyForm, requestEmergency, currentUser])

  // Actualizar datos del formulario
  const updateEmergencyFormData = useCallback(
    (field, value) => {
      setEmergencyFormData((prev) => ({
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

  // Manejar compra de servicios adicionales
  const handlePurchaseAdditional = useCallback((alert) => {
    corporateService.showPurchaseAdditionalDialog(alert)
  }, [])

  // Manejar renovación de contrato
  const handleContractRenewal = useCallback(() => {
    corporateService.showContractRenewalDialog(currentUser)
  }, [currentUser])

  // Manejar emergencia SOS
  const handleSOSEmergency = useCallback(async () => {
    try {
      // Obtener todas las direcciones disponibles (principal + sedes adicionales)
      const mainAddress = currentUser.company.address
      const additionalLocations = currentUser.company.sedes || currentUser.company.locations || []
      
      // Crear lista completa de ubicaciones
      const allLocations = []
      if (mainAddress) {
        allLocations.push({
          name: 'Sede Principal',
          address: mainAddress,
          coordinates: currentUser.company.coordinates || null
        })
      }
      
      // Agregar sedes adicionales
      additionalLocations.forEach((loc, index) => {
        if (typeof loc === 'string') {
          allLocations.push({
            name: `Sede ${index + 2}`,
            address: loc
          })
        } else if (loc.address) {
          allLocations.push({
            name: loc.name || `Sede ${index + 2}`,
            address: loc.address
          })
        }
      })
      
      let selectedLocation = null
      
      // Si hay múltiples ubicaciones, permitir selección
      if (allLocations.length > 1) {
        selectedLocation = await corporateService.selectCorporateLocation(allLocations)
        if (!selectedLocation) return // Usuario canceló
      } else if (allLocations.length === 1) {
        // Una sola ubicación, usar esa
        selectedLocation = allLocations[0].address
      } else {
        // No hay direcciones registradas - mostrar error
        await corporateService.showNoAddressError()
        return
      }
      
      // Mostrar confirmación con la sede seleccionada
      const confirmed = await corporateService.confirmSOSEmergencyWithCorporateLocation(
        selectedLocation, 
        currentUser.company.name,
        coordinates
      )
      
      if (!confirmed) return
      
      setLoading(true)
      
      // Obtener coordenadas si están disponibles
      const selectedLocationData = allLocations.find(loc => loc.address === selectedLocation)
      const coordinates = selectedLocationData?.coordinates || null
      
      // Datos de emergencia SOS con sede corporativa
      const sosData = {
        type: 'SOS_CORPORATE',
        company: currentUser.company.name,
        companyId: currentUser.company.id,
        requester: currentUser.profile?.name || 'Usuario Corporativo',
        position: currentUser.profile?.position || 'N/A',
        location: selectedLocation,
        coordinates: coordinates,
        locationMethod: 'corporate_headquarters',
        hasGPS: !!coordinates,
        priority: 'CRITICAL',
        timestamp: new Date().toISOString(),
        message: 'EMERGENCIA SOS CORPORATIVA - Ambulancia requerida en sede empresarial'
      }
      
      // Enviar alerta directa al administrador
      const result = await corporateService.sendSOSAlert(sosData)
      
      if (result.success) {
        // Mostrar confirmación de alerta enviada
        await corporateService.showSOSSuccessForCorporate(result.alertCode, selectedLocation, currentUser.company.name)
        
        // Registrar la emergencia en el sistema
        await requestEmergency(
          'EMERGENCIA',
          'Alerta SOS Corporativa - Ambulancia a sede empresarial',
          selectedLocation,
          []
        )
      } else {
        corporateService.showSOSError()
      }
    } catch (err) {
      console.error('Error en emergencia SOS:', err)
      corporateService.showSOSError()
    } finally {
      setLoading(false)
    }
  }, [currentUser, requestEmergency])

  // Manejar contacto comercial
  const handleContactSales = useCallback(() => {
    corporateService.showContactSalesDialog(currentUser)
  }, [currentUser])

  // Descargar contrato
  const handleDownloadContract = useCallback(() => {
    corporateService.downloadContract(currentUser)
  }, [currentUser])

  // Ver contrato
  const handleViewContract = useCallback(() => {
    corporateService.viewContract(currentUser)
  }, [currentUser])

  // Cambiar pestaña activa
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Función para procesar pago corporativo
  const processCorporatePayment = useCallback(
    async (paymentData) => {
      try {
        setLoading(true)
        const result = await purchaseAdditionalServices(
          currentUser.id,
          paymentData.quantity,
          paymentData
        )

        if (result.success) {
          await corporateService.showPaymentSuccess(paymentData, result)
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          corporateService.showPaymentError()
        }
      } catch (err) {
        corporateService.showPaymentError()
      } finally {
        setLoading(false)
      }
    },
    [currentUser, purchaseAdditionalServices]
  )

  return {
    // Estados básicos
    currentUser,
    activeTab,
    selectedEmployee,
    loading,
    error,
    isValidCorporateUser,

    // Estados del formulario
    emergencyFormData,
    formErrors,

    // Datos calculados
    companyStats,
    contractAlerts,
    reportData,

    // Funciones de navegación
    handleTabChange,
    setActiveTab,

    // Funciones del formulario de emergencia
    handleEmergencyRequest,
    updateEmergencyFormData,
    validateEmergencyForm,

    // Funciones de alertas y servicios
    handlePurchaseAdditional,
    handleContractRenewal,
    handleContactSales,
    handleSOSEmergency,

    // Funciones de contrato
    handleDownloadContract,
    handleViewContract,

    // Funciones de pagos
    processCorporatePayment,

    // Funciones de control
    clearError,
    logout,

    // Funciones de inicialización
    initializeCorporateData
  }
}

export default useCorporateDashboard
