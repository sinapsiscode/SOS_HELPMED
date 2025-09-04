import { useState, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { validateExpansionData } from '../schemas/serviceExpansionSchema'
import logger from '../utils/logger'

const MySwal = withReactContent(Swal)

/**
 * Hook para gestión de solicitudes de ampliación de servicios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae toda la lógica del componente
 * ✅ Regla #4: Validación de formularios
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @param {Object} user - Usuario actual
 * @param {string} initialServiceType - Tipo de servicio inicial
 * @returns {Object} Estados y funciones para manejo de expansión
 */
const useServiceExpansion = (user, initialServiceType = null) => {
  const { requestServiceExpansion, getCurrentUsage } = useAppStore()

  // Estados principales
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(initialServiceType || '')
  const [reason, setReason] = useState('')
  const [urgency, setUrgency] = useState('media')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener uso actual del servicio
  const currentUsage = useMemo(() => {
    if (!user || !selectedService) return null
    return getCurrentUsage(user, selectedService)
  }, [user, selectedService, getCurrentUsage])

  /**
   * Obtiene los servicios disponibles según el tipo de usuario
   */
  const availableServices = useMemo(() => {
    const services = []

    if (!user) return services

    if (user.role === 'FAMILIAR') {
      if (user.plan?.subtype === 'HELP') {
        services.push({
          type: 'GENERAL',
          name: 'Servicios Generales - Plan Help',
          description: 'Aumentar cantidad total de servicios',
          icon: 'fas fa-list'
        })
      } else {
        services.push(
          {
            type: 'URGENCIA',
            name: 'Urgencia Médica',
            description: 'Atención médica prioritaria',
            icon: 'fas fa-exclamation-triangle'
          },
          {
            type: 'MEDICO_DOMICILIO',
            name: 'Médico a Domicilio',
            description: 'Consultas en tu hogar',
            icon: 'fas fa-house-medical'
          },
          {
            type: 'TRASLADO_PROGRAMADO',
            name: 'Traslado Programado',
            description: 'Traslados médicos planificados',
            icon: 'fas fa-ambulance'
          },
          {
            type: 'ZONA_PROTEGIDA',
            name: 'Zona Protegida',
            description: 'Cobertura en área específica',
            icon: 'fas fa-shield-alt'
          }
        )
      }
    } else if (user.role === 'CORPORATIVO') {
      services.push({
        type: 'EMERGENCIA',
        name: 'Servicios de Emergencia Corporativos',
        description: 'Aumentar servicios para empleados',
        icon: 'fas fa-building'
      })
    } else if (user.role === 'EXTERNO') {
      services.push({
        type: 'INDIVIDUAL',
        name: 'Servicios Individuales',
        description: 'Aumentar límite personal anual',
        icon: 'fas fa-user'
      })
    }

    return services
  }, [user])

  /**
   * Obtiene el color según el nivel de urgencia
   */
  const getUrgencyColor = useCallback((level) => {
    const colors = {
      alta: 'text-red-600',
      media: 'text-yellow-600',
      baja: 'text-green-600'
    }
    return colors[level] || 'text-gray-600'
  }, [])

  /**
   * Obtiene información de urgencia
   */
  const urgencyInfo = useMemo(() => {
    const info = {
      alta: { icon: '⚡', text: 'Respuesta en 24 horas', priority: 3 },
      media: { icon: '📅', text: 'Respuesta en 48 horas', priority: 2 },
      baja: { icon: '📋', text: 'Respuesta en 3-5 días', priority: 1 }
    }
    return info[urgency] || info.media
  }, [urgency])

  /**
   * Valida el formulario usando esquema Yup
   * ✅ Regla #4: Validación con esquema
   * ✅ Regla #6: Documentación de función compleja
   */
  const validateForm = useCallback(async () => {
    const validationData = {
      selectedService,
      reason: reason.trim(),
      urgency,
      userInfo: user
        ? {
            phone: user.profile?.phone || '',
            email: user.profile?.email || ''
          }
        : undefined
    }

    logger.debug('Validando formulario de expansión', validationData)

    const result = await validateExpansionData(validationData)

    if (!result.isValid) {
      const firstError = Object.values(result.errors)[0]
      logger.warn('Validación falló', result.errors)

      MySwal.fire({
        title: 'Formulario Incompleto',
        text: firstError || 'Por favor completa todos los campos correctamente',
        icon: 'warning',
        confirmButtonColor: '#D32F2F'
      })
      return false
    }

    return true
  }, [selectedService, reason, urgency, user])

  /**
   * Muestra mensaje de éxito
   */
  const showSuccessMessage = useCallback(
    (requestId) => {
      MySwal.fire({
        title: '¡Solicitud Enviada!',
        html: `
        <div class="text-center">
          <i class="fas fa-paper-plane text-4xl text-green-500 mb-3"></i>
          <p class="text-gray-700 mb-3">Tu solicitud ha sido enviada al equipo administrativo</p>
          <div class="bg-blue-50 rounded-lg p-3 text-sm">
            <p class="text-blue-700"><strong>Número de solicitud:</strong> ${requestId}</p>
            <p class="text-blue-700"><strong>Tiempo estimado de respuesta:</strong> ${urgencyInfo.text}</p>
          </div>
          <div class="mt-3 text-xs text-gray-600">
            Recibirás una llamada o email del equipo comercial
          </div>
        </div>
      `,
        icon: 'success',
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Entendido'
      })
    },
    [urgencyInfo]
  )

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault()

      const isValid = await validateForm()
      if (!isValid) return

      setIsSubmitting(true)

      try {
        const result = requestServiceExpansion(selectedService, reason.trim(), urgency)

        if (result?.success) {
          showSuccessMessage(result.request.id)

          // Limpiar formulario
          setSelectedService(initialServiceType || '')
          setReason('')
          setUrgency('media')
          setIsOpen(false)
        } else {
          throw new Error(result?.error || 'Error desconocido')
        }
      } catch (error) {
        MySwal.fire({
          title: 'Error',
          text: error.message || 'No se pudo enviar la solicitud',
          icon: 'error',
          confirmButtonColor: '#D32F2F'
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      validateForm,
      requestServiceExpansion,
      selectedService,
      reason,
      urgency,
      showSuccessMessage,
      initialServiceType
    ]
  )

  /**
   * Abre el modal
   */
  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  /**
   * Cierra el modal
   */
  const closeModal = useCallback(() => {
    setIsOpen(false)
    // Limpiar formulario si no hay servicio inicial
    if (!initialServiceType) {
      setSelectedService('')
      setReason('')
      setUrgency('media')
    }
  }, [initialServiceType])

  /**
   * Reinicia el formulario
   */
  const resetForm = useCallback(() => {
    setSelectedService(initialServiceType || '')
    setReason('')
    setUrgency('media')
  }, [initialServiceType])

  return {
    // Estados
    isOpen,
    selectedService,
    reason,
    urgency,
    isSubmitting,

    // Datos calculados
    currentUsage,
    availableServices,
    urgencyInfo,

    // Funciones de estado
    setSelectedService,
    setReason,
    setUrgency,

    // Funciones de interacción
    openModal,
    closeModal,
    handleSubmit,
    resetForm,

    // Funciones auxiliares
    getUrgencyColor
  }
}

export default useServiceExpansion
