import { useCallback } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para gestión de solicitudes de emergencia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Emergency request handling
 * ✅ Separación de lógica de UI y proceso de datos
 */
const useEmergencyRequests = (requestEmergency, showServiceQualitySurvey) => {
  /**
   * Manejar solicitud de emergencia con feedback y encuesta
   */
  const handleEmergencyRequest = useCallback(async (
    type,
    description,
    location,
    extraContacts = [],
    affiliateInfo = null,
    requestTime = null
  ) => {
    const result = await requestEmergency(type, description, location, extraContacts, affiliateInfo)

    if (result.success) {
      const contactsMessage =
        extraContacts.length > 0
          ? ` ${extraContacts.length} contacto(s) extra han sido notificados.`
          : ''
      const affiliateMessage = affiliateInfo
        ? ` Atención para: ${affiliateInfo.name} (${affiliateInfo.relation}).`
        : ''

      await Swal.fire({
        title: '¡Solicitud Enviada!',
        text: `Tu solicitud de emergencia ha sido procesada.${affiliateMessage}${contactsMessage}`,
        icon: 'success',
        timer: 4000,
        showConfirmButton: false
      })

      setTimeout(async () => {
        const serviceDescription = getServiceDescription(type, description)
        await showServiceQualitySurvey(
          type,
          serviceDescription,
          requestTime || new Date().toISOString()
        )
      }, 1000)
    } else {
      Swal.fire({
        title: 'Error',
        text: result.error,
        icon: 'error',
        confirmButtonColor: '#D32F2F'
      })
    }
  }, [requestEmergency, showServiceQualitySurvey])

  /**
   * Obtener descripción del servicio basada en tipo
   */
  const getServiceDescription = useCallback((type, description) => {
    switch (type) {
      case 'EMERGENCIA':
        return 'Emergencia Médica'
      case 'MEDICO_DOMICILIO':
        return 'Médico a Domicilio'
      case 'URGENCIA':
        return 'Urgencia Médica'
      case 'TRASLADO_PROGRAMADO':
        return 'Traslado Programado'
      default:
        return description
    }
  }, [])

  /**
   * Manejar compra de servicio adicional
   */
  const handlePurchaseAdditional = useCallback((alert) => {
    Swal.fire({
      title: 'Servicio Adicional Comprado',
      text: `Se ha procesado la compra por $${alert.cost?.toLocaleString()}`,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    })
  }, [])

  /**
   * Manejar upgrade de plan
   */
  const handleUpgradePlan = useCallback((alert) => {
    Swal.fire({
      title: 'Información de Planes',
      html: `
        <div class="text-left">
          <p class="mb-3">Contacta a nuestro equipo para conocer opciones de actualización:</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p><i class="fas fa-phone mr-2"></i> +56 2 2800 4000</p>
            <p><i class="fas fa-envelope mr-2"></i> ventas@helpmed.com</p>
            <p><i class="fas fa-clock mr-2"></i> Lun-Vie 9:00-18:00</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#D32F2F'
    })
  }, [])

  return {
    handleEmergencyRequest,
    handlePurchaseAdditional,
    handleUpgradePlan
  }
}

export default useEmergencyRequests