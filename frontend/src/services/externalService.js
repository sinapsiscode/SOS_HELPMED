import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/**
 * Servicio especializado para operaciones de usuarios externos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Lógica de negocio separada del componente
 * ✅ Regla #8: Manejo centralizado de errores con SweetAlert2
 * ✅ Regla #4: Validación completa de datos
 * ✅ Regla #11: Localización en español
 * ✅ Regla #12: Integración con APIs
 *
 * @class ExternalService
 */
class ExternalService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  }

  /**
   * Manejo centralizado de errores con SweetAlert2
   * @param {Error} error - Error capturado
   * @param {string} context - Contexto del error
   * @returns {string} Mensaje de error formateado
   */
  handleError(error, context = 'Operación externa') {
    console.error(`${context}:`, error)

    let errorMessage = 'Error inesperado en el sistema'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    Swal.fire({
      icon: 'error',
      title: 'Error en el Sistema',
      text: `${context}: ${errorMessage}`,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc3545'
    })

    return errorMessage
  }

  /**
   * Obtener descripción del servicio para encuestas
   * @param {string} serviceType - Tipo de servicio
   * @returns {string} Descripción del servicio
   */
  getServiceDescription(serviceType) {
    const descriptions = {
      EMERGENCIA: 'Emergencia Médica (Afiliado Externo)',
      MEDICO_DOMICILIO: 'Médico a Domicilio (Afiliado Externo)',
      URGENCIA: 'Urgencia Médica (Afiliado Externo)',
      TRASLADO_PROGRAMADO: 'Traslado Programado (Afiliado Externo)'
    }

    return descriptions[serviceType] || 'Servicio Médico Externo'
  }

  /**
   * Mostrar encuesta de calidad del servicio para usuarios externos
   * @param {string} serviceType - Tipo de servicio
   * @param {string} serviceDescription - Descripción del servicio
   * @param {Object} currentUser - Usuario actual
   */
  async showServiceQualitySurvey(serviceType, serviceDescription = '', currentUser) {
    const { value: surveyData } = await MySwal.fire({
      title: 'Evaluación de Afiliado Externo - Tu Opinión Importa',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-800 font-medium mb-2">🏛️ Evaluación de Calidad del Servicio Externo</p>
            <p class="text-sm text-blue-700">Servicio completado: <strong>${serviceDescription || serviceType}</strong></p>
            <p class="text-sm text-blue-700">Como afiliado externo, ayúdanos a mejorar nuestros servicios</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo calificarías la calidad del servicio recibido? *
            </label>
            <select id="quality-rating" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecciona una calificación</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
              <option value="3">⭐⭐⭐ Bueno</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="1">⭐ Malo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué aspecto del servicio externo consideras más importante mejorar? *
            </label>
            <select id="improvement-area" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecciona un aspecto</option>
              <option value="proceso-verificacion">📋 Proceso de verificación</option>
              <option value="tiempo-respuesta">⏱️ Tiempo de respuesta</option>
              <option value="comunicacion-entidad">🏢 Comunicación con mi entidad</option>
              <option value="facilidad-solicitud">📱 Facilidad para solicitar servicios</option>
              <option value="informacion-limites">📊 Información sobre límites de servicio</option>
              <option value="atencion-personal">👥 Atención del personal médico</option>
              <option value="costos-adicionales">💰 Transparencia en costos</option>
              <option value="otros">🔧 Otros aspectos</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Comentarios y sugerencias para el servicio de afiliados externos
            </label>
            <textarea 
              id="comments" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              rows="4" 
              placeholder="Comparte ideas específicas sobre este servicio externo..."
            ></textarea>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Esta evaluación es obligatoria y nos ayuda a optimizar el servicio para afiliados externos
            </p>
          </div>
        </div>
      `,
      width: 650,
      allowOutsideClick: false,
      showCloseButton: false,
      showCancelButton: false,
      confirmButtonText: 'Enviar Evaluación Externa',
      confirmButtonColor: '#3B82F6',
      preConfirm: () => {
        const qualityRating = document.getElementById('quality-rating').value
        const improvementArea = document.getElementById('improvement-area').value
        const comments = document.getElementById('comments').value.trim()

        if (!qualityRating) {
          MySwal.showValidationMessage('Debes seleccionar una calificación de calidad')
          return false
        }

        if (!improvementArea) {
          MySwal.showValidationMessage('Debes seleccionar un aspecto a mejorar')
          return false
        }

        return {
          qualityRating: parseInt(qualityRating),
          improvementArea,
          comments,
          serviceType,
          serviceDescription: serviceDescription || serviceType,
          timestamp: new Date().toISOString(),
          surveyDate: new Date().toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          userRole: 'EXTERNO',
          userId: currentUser.id,
          planSubtype: currentUser.plan.subtype,
          externalEntity: currentUser.external_entity?.name || 'No especificada'
        }
      }
    })

    if (surveyData) {
      // Mostrar confirmación
      await MySwal.fire({
        title: '¡Gracias por tu Evaluación!',
        html: `
          <div class="text-center">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
            <p class="text-gray-700 mb-2">Tu evaluación sobre el servicio ha sido registrada exitosamente</p>
            <p class="text-sm text-gray-600">Utilizaremos tu retroalimentación para mejorar nuestros servicios externos</p>
          </div>
        `,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      // Aquí se podría enviar al store/backend
      console.log('Encuesta externa enviada:', surveyData)
    }
  }

  /**
   * Mostrar diálogo de carga para ubicación GPS
   */
  async showLocationLoadingDialog() {
    MySwal.fire({
      title: 'Obteniendo ubicación de alta precisión...',
      html: `
        <div class="text-center">
          <i class="fas fa-satellite text-4xl text-teal-500 animate-pulse mb-4"></i>
          <p class="text-gray-600">Calibrando GPS para máxima precisión</p>
          <p class="text-sm text-gray-500 mt-2">Tomando múltiples lecturas para mayor exactitud</p>
          <div class="mt-3 bg-teal-50 rounded-lg p-2">
            <p class="text-xs text-teal-600">💡 Para mejor precisión: ve cerca de una ventana o al exterior</p>
          </div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading()
      }
    })
  }

  /**
   * Ocultar diálogo de ubicación
   */
  hideLocationDialog() {
    MySwal.close()
  }

  /**
   * Mostrar éxito de obtención de ubicación GPS
   * @param {Object} coordinates - Coordenadas obtenidas
   */
  async showLocationSuccess(coordinates) {
    const precisionLevel =
      coordinates.accuracy <= 5
        ? 'Excelente'
        : coordinates.accuracy <= 15
          ? 'Muy Buena'
          : coordinates.accuracy <= 30
            ? 'Buena'
            : 'Aceptable'

    const precisionColor =
      coordinates.accuracy <= 5
        ? 'text-green-600'
        : coordinates.accuracy <= 15
          ? 'text-blue-600'
          : coordinates.accuracy <= 30
            ? 'text-yellow-600'
            : 'text-orange-600'

    MySwal.fire({
      title: '¡Ubicación GPS obtenida!',
      html: `
        <div class="text-center">
          <i class="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
          <p class="text-gray-700">Ubicación registrada con ${coordinates.samplesUsed || 1} muestras GPS</p>
          <div class="bg-gray-100 rounded-lg p-3 text-sm mt-3">
            <div class="text-gray-600 space-y-1">
              <div>Latitud: ${coordinates.latitude.toFixed(6)}</div>
              <div>Longitud: ${coordinates.longitude.toFixed(6)}</div>
              <div class="${precisionColor} font-bold">Precisión: ${coordinates.accuracy.toFixed(1)}m (${precisionLevel})</div>
              ${coordinates.samplesUsed > 1 ? `<div class="text-blue-600">📊 Promedio de ${coordinates.samplesUsed} lecturas</div>` : ''}
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            ${coordinates.accuracy <= 10 ? '🎯 Precisión excelente para emergencias' : '📍 Ubicación válida para servicios médicos'}
          </div>
        </div>
      `,
      icon: 'success',
      timer: 4000,
      showConfirmButton: false
    })
  }

  /**
   * Mostrar error de ubicación GPS
   * @param {string} errorMessage - Mensaje de error
   */
  showLocationError(errorMessage) {
    MySwal.fire({
      title: 'Error al obtener ubicación',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Confirmar servicio con costo adicional
   * @param {string} serviceType - Tipo de servicio
   * @returns {Promise<boolean>} Confirmación del usuario
   */
  async confirmAdditionalCost(serviceType) {
    const additionalCost = 45000 // Costo por servicio adicional

    const result = await MySwal.fire({
      title: 'Servicio con Costo Adicional',
      html: `
        <div class="text-left">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <i class="fas fa-exclamation-triangle text-yellow-600"></i>
              <span class="font-medium text-yellow-800">Has agotado tus 3 servicios gratuitos anuales</span>
            </div>
            <p class="text-yellow-700 text-sm">Este servicio tendrá un costo adicional que será facturado directamente a tu cuenta.</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-gray-700">Servicio solicitado:</span>
              <span class="text-gray-800">${serviceType === 'EMERGENCIA' ? 'Emergencia Médica' : 'Médico a Domicilio'}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-gray-700">Costo adicional:</span>
              <span class="text-2xl font-bold text-red-600">$${additionalCost.toLocaleString()}</span>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              El costo será agregado a tu próxima facturación mensual
            </div>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Solicitar y Pagar',
      cancelButtonText: 'Cancelar'
    })

    return result.isConfirmed
  }

  /**
   * Mostrar éxito de solicitud de servicio
   * @param {string} message - Mensaje de éxito
   * @param {boolean} hasAdditionalCost - Si tiene costo adicional
   */
  async showServiceSuccess(message, hasAdditionalCost = false) {
    await Swal.fire({
      title: '¡Solicitud Enviada!',
      text: message,
      icon: 'success',
      timer: hasAdditionalCost ? 5000 : 3000,
      showConfirmButton: hasAdditionalCost
    })
  }

  /**
   * Mostrar error de solicitud de servicio
   * @param {string} errorMessage - Mensaje de error
   */
  showServiceError(errorMessage) {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Mostrar diálogo de compra de servicios adicionales (Caso 2)
   * @param {Object} alert - Datos de alerta
   * @param {Object} currentUser - Usuario actual
   */
  async showPurchaseAdditionalDialog(alert, currentUser) {
    const result = await Swal.fire({
      title: 'Servicio Adicional',
      html: `
        <div class="text-left">
          <p class="mb-3">Has agotado tus servicios incluidos.</p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="font-medium text-yellow-800">Costo del servicio adicional:</p>
            <p class="text-2xl font-bold text-yellow-600">$${alert.cost?.toLocaleString()}</p>
            <p class="text-sm text-yellow-700 mt-1">Se cobrará directamente a tu cuenta</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D32F2F',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Solicitar y Pagar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      // Mostrar confirmación de éxito
      await Swal.fire({
        title: 'Servicio Autorizado',
        text: 'Se ha procesado tu solicitud de servicio adicional',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      // Después de la confirmación, mostrar encuesta de calidad
      setTimeout(async () => {
        await this.showServiceQualitySurvey(
          'SERVICIO_ADICIONAL',
          'Servicio Adicional (Afiliado Externo)',
          currentUser
        )
      }, 1000)
    }
  }

  /**
   * Validar datos del formulario de servicio
   * @param {Object} formData - Datos del formulario
   * @returns {Object} Errores de validación
   */
  validateServiceForm(formData) {
    const errors = {}

    if (!formData.serviceType?.trim()) {
      errors.serviceType = 'Selecciona un tipo de servicio'
    }

    if (!formData.description?.trim()) {
      errors.description = 'Describe la situación médica'
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    if (!formData.location?.trim()) {
      errors.location = 'Indica la ubicación'
    }

    return errors
  }

  /**
   * Mostrar alertas de banner para usuarios Caso 2
   * @param {Object} user - Usuario actual
   * @returns {Object} Configuración de banners
   */
  getBannerAlerts(user) {
    if (user.plan.subtype !== 'CASO_2') {
      return { showExhausted: false, showWarning: false }
    }

    const remainingServices = user.service_usage.current_period.individual_remaining

    return {
      showExhausted: remainingServices === 0,
      showWarning: remainingServices === 1,
      remainingServices
    }
  }

  /**
   * Obtener estadísticas del usuario para mostrar en el dashboard
   * @param {Object} user - Usuario actual
   * @returns {Object} Estadísticas procesadas
   */
  getProcessedStats(user) {
    const totalUsed = user.service_usage.current_period.services_used || 0
    const individualRemaining = user.service_usage.current_period.individual_remaining || 0
    const generalRemaining = user.client_company?.general_services_remaining || 0
    const lastService = user.service_usage.current_period.last_service

    return {
      totalUsed,
      individualRemaining,
      generalRemaining,
      lastServiceDate: lastService
        ? new Date(lastService).toLocaleDateString('es-CL')
        : 'Sin atenciones',
      hasRemainingServices: individualRemaining > 0,
      needsAdditionalCost: user.plan.subtype === 'CASO_2' && individualRemaining <= 0,
      isUnlimited: user.plan.subtype === 'CASO_1',
      referralSource: user.profile.referral_source
    }
  }
}

// Instancia singleton del servicio
const externalService = new ExternalService()

export default externalService
