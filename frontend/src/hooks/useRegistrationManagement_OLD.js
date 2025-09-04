import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook personalizado para gestión completa de solicitudes de registro
 * Siguiendo Regla #2: Toda la lógica compleja extraída del componente
 *
 * Funcionalidades principales:
 * - Gestión completa de solicitudes de registro
 * - Filtrado y búsqueda de solicitudes
 * - Aprobación/rechazo con confirmaciones
 * - Activación de servicios para usuarios aprobados
 * - Cálculo de estadísticas en tiempo real
 * - Manejo consistente de errores y feedback
 *
 * Estados principales:
 * - filter: Filtro actual aplicado (all, pending, approved, rejected)
 * - selectedRequest: Solicitud seleccionada para ver detalle
 * - loading: Estado de carga para operaciones asíncronas
 * - error: Estado de error global
 *
 * Operaciones principales:
 * - handleApprove: Aprobar solicitud con confirmación
 * - handleReject: Rechazar solicitud con motivo requerido
 * - handleActivateServices: Activar servicios del plan del usuario
 *
 * Utilidades:
 * - getStatusColor: Obtener clases CSS según estado
 * - getStatusIcon: Obtener icono Font Awesome según estado
 * - getPlanTypeName: Formatear nombre del plan para mostrar
 *
 * @returns {Object} Estados y funciones del sistema de registro
 *
 * @example
 * const {
 *   filteredRequests,
 *   requestStats,
 *   filter,
 *   handleApprove,
 *   handleReject
 * } = useRegistrationManagement()
 *
 * Cumple reglas de refactorización:
 * - Regla #2: Lógica compleja en hook personalizado
 * - Regla #4: Validación exhaustiva de inputs
 * - Regla #8: Manejo consistente de errores
 * - Regla #13: Optimización con useMemo y useCallback
 */
const useRegistrationManagement = () => {
  // ============================================
  // CONEXIÓN CON STORE (Regla #10)
  // ============================================
  const {
    registrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    activateUserServices
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [filter, setFilter] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // DATOS CALCULADOS (Regla #13)
  // ============================================
  const filteredRequests = useMemo(() => {
    if (filter === 'all') return registrationRequests
    return registrationRequests.filter((request) => request.status === filter)
  }, [registrationRequests, filter])

  const requestStats = useMemo(() => {
    const stats = {
      total: registrationRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0
    }

    registrationRequests.forEach((request) => {
      switch (request.status) {
        case 'pending':
          stats.pending++
          break
        case 'approved':
          stats.approved++
          break
        case 'rejected':
          stats.rejected++
          break
      }
    })

    return stats
  }, [registrationRequests])

  // ============================================
  // OPERACIONES PRINCIPALES (Regla #8)
  // ============================================

  /**
   * Aprobar una solicitud de registro
   * Incluye confirmación del usuario y feedback visual
   *
   * @param {string} requestId - ID de la solicitud a aprobar
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const handleApprove = useCallback(
    async (requestId) => {
      try {
        const result = await Swal.fire({
          title: '¿Aprobar Solicitud?',
          text: 'Se creará una cuenta para este cliente y se activarán sus servicios',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#10B981',
          cancelButtonColor: '#6B7280'
        })

        if (result.isConfirmed) {
          setLoading(true)
          setError(null)

          await approveRegistrationRequest(requestId)

          await Swal.fire({
            title: '¡Solicitud Aprobada!',
            text: 'El cliente ha sido registrado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })

          return true
        }

        return false
      } catch (error) {
        console.error('Error aprobando solicitud:', error)
        setError('Hubo un problema al aprobar la solicitud')

        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al aprobar la solicitud',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return false
      } finally {
        setLoading(false)
      }
    },
    [approveRegistrationRequest]
  )

  /**
   * Rechazar una solicitud de registro
   * Requiere motivo del rechazo y valida entrada
   *
   * @param {string} requestId - ID de la solicitud a rechazar
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const handleReject = useCallback(
    async (requestId) => {
      try {
        const { value: reason } = await Swal.fire({
          title: 'Rechazar Solicitud',
          input: 'textarea',
          inputLabel: 'Motivo del rechazo',
          inputPlaceholder: 'Explica brevemente por qué se rechaza esta solicitud...',
          inputAttributes: {
            'aria-label': 'Motivo del rechazo'
          },
          showCancelButton: true,
          confirmButtonText: 'Rechazar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          inputValidator: (value) => {
            if (!value) {
              return 'Debes proporcionar un motivo para el rechazo'
            }
            if (value.length < 10) {
              return 'El motivo debe tener al menos 10 caracteres'
            }
          }
        })

        if (reason) {
          setLoading(true)
          setError(null)

          await rejectRegistrationRequest(requestId, reason)

          await Swal.fire({
            title: 'Solicitud Rechazada',
            text: 'Se ha notificado al cliente sobre el rechazo',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          })

          return true
        }

        return false
      } catch (error) {
        console.error('Error rechazando solicitud:', error)
        setError('Hubo un problema al rechazar la solicitud')

        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al rechazar la solicitud',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return false
      } finally {
        setLoading(false)
      }
    },
    [rejectRegistrationRequest]
  )

  /**
   * Activar servicios para un usuario aprobado
   * Habilita todos los beneficios del plan contratado
   *
   * @param {string} userId - ID del usuario para activar servicios
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const handleActivateServices = useCallback(
    async (userId) => {
      try {
        const result = await Swal.fire({
          title: 'Activar Servicios',
          text: '¿Deseas activar todos los beneficios del plan para este cliente?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Activar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#1D44D1'
        })

        if (result.isConfirmed) {
          setLoading(true)
          setError(null)

          await activateUserServices(userId)

          await Swal.fire({
            title: '¡Servicios Activados!',
            text: 'Todos los beneficios del plan han sido activados',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })

          return true
        }

        return false
      } catch (error) {
        console.error('Error activando servicios:', error)
        setError('Hubo un problema al activar los servicios')

        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al activar los servicios',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return false
      } finally {
        setLoading(false)
      }
    },
    [activateUserServices]
  )

  // ============================================
  // FUNCIONES UTILITARIAS (Regla #2: lógica simple permitida)
  // ============================================

  /**
   * Obtener clases CSS según el estado de la solicitud
   * @param {string} status - Estado de la solicitud
   * @returns {string} Clases CSS para styling
   */
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  /**
   * Obtener icono Font Awesome según el estado
   * @param {string} status - Estado de la solicitud
   * @returns {string} Clases de icono Font Awesome
   */
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock text-yellow-600'
      case 'approved':
        return 'fas fa-check-circle text-green-600'
      case 'rejected':
        return 'fas fa-times-circle text-red-600'
      default:
        return 'fas fa-question-circle text-gray-600'
    }
  }, [])

  /**
   * Formatear nombre del plan para mostrar
   * @param {string} planType - Tipo de plan (familiar, corporativo)
   * @param {string} planSubtype - Subtipo específico del plan
   * @returns {string} Nombre formateado del plan
   */
  const getPlanTypeName = useCallback((planType, planSubtype) => {
    const planNames = {
      familiar: {
        help: 'Plan Help',
        basico: 'Plan Básico',
        vip: 'Plan VIP',
        dorado: 'Plan Dorado'
      },
      corporativo: {
        area_protegida: 'Área Protegida',
        empresarial_basico: 'Empresarial Básico',
        empresarial_premium: 'Empresarial Premium'
      }
    }
    return planNames[planType]?.[planSubtype] || 'Plan No Especificado'
  }, [])

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter)
  }, [])

  const openRequestDetail = useCallback((request) => {
    setSelectedRequest(request)
  }, [])

  const closeRequestDetail = useCallback(() => {
    setSelectedRequest(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Datos principales
    filteredRequests,
    requestStats,
    registrationRequests,

    // Estados de control
    filter,
    selectedRequest,
    loading,
    error,

    // Operaciones principales
    handleApprove,
    handleReject,
    handleActivateServices,

    // Funciones utilitarias
    getStatusColor,
    getStatusIcon,
    getPlanTypeName,

    // Control de estado
    handleFilterChange,
    openRequestDetail,
    closeRequestDetail,
    clearError
  }
}

export default useRegistrationManagement
