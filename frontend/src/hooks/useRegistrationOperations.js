import { useState, useCallback } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para operaciones CRUD de registros
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: CRUD operations
 * ✅ Manejo de errores incluido
 */
const useRegistrationOperations = (approveRegistrationRequest, rejectRegistrationRequest, activateUserServices) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Aprobar una solicitud de registro
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

  return {
    loading,
    error,
    handleApprove,
    handleReject,
    handleActivateServices,
    clearError: () => setError(null)
  }
}

export default useRegistrationOperations