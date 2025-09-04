import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/**
 * Servicio especializado para manejo de servicios particular
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicio especializado con responsabilidad única
 * ✅ Regla #2: Lógica de negocio separada de componentes
 * ✅ Regla #6: Manejo centralizado de estado y operaciones
 *
 * Responsabilidades:
 * - Cálculo de precios con recargos
 * - Procesamiento de pagos simulado
 * - Gestión de encuestas de calidad
 * - Notificaciones y alertas
 */
class ParticularService {
  constructor() {
    // Configuración de precios para servicios sin plan
    this.servicePrices = {
      EMERGENCIA: {
        name: 'Emergencia Médica',
        basePrice: 850,
        nightSurcharge: 150, // Recargo nocturno (10pm - 6am)
        holidaySurcharge: 200,
        description: 'Ambulancia con equipo médico completo para emergencias'
      },
      URGENCIA: {
        name: 'Urgencia Médica',
        basePrice: 650,
        nightSurcharge: 100,
        holidaySurcharge: 150,
        description: 'Atención médica urgente con traslado si es necesario'
      },
      MEDICO_DOMICILIO: {
        name: 'Médico a Domicilio',
        basePrice: 450,
        nightSurcharge: 80,
        holidaySurcharge: 100,
        description: 'Consulta médica en su domicilio'
      },
      TRASLADO_PROGRAMADO: {
        name: 'Traslado Programado',
        basePrice: 550,
        nightSurcharge: 0,
        holidaySurcharge: 100,
        description: 'Traslado médico programado entre centros de salud'
      },
      ZONA_PROTEGIDA: {
        name: 'Zona Protegida',
        basePrice: 350,
        nightSurcharge: 50,
        holidaySurcharge: 75,
        description: 'Servicio de protección y respuesta rápida en su zona'
      }
    }
  }

  /**
   * Obtiene la configuración de precios
   */
  getServicePrices() {
    return this.servicePrices
  }

  /**
   * Calcula el precio total de un servicio aplicando recargos
   */
  calculateTotalPrice(service, details) {
    const baseService = this.servicePrices[service]
    if (!baseService) return 0

    let total = baseService.basePrice

    // Aplicar recargos según hora y día
    const now = new Date()
    const hour = now.getHours()
    const isNight = hour >= 22 || hour < 6
    const isWeekend = now.getDay() === 0 || now.getDay() === 6

    if (isNight && baseService.nightSurcharge > 0) {
      total += baseService.nightSurcharge
    }

    if (isWeekend && baseService.holidaySurcharge > 0) {
      total += baseService.holidaySurcharge
    }

    return total
  }

  /**
   * Genera un código de servicio único
   */
  generateServiceCode() {
    return `OD-${Date.now().toString().slice(-8)}`
  }

  /**
   * Simula el procesamiento de pago
   */
  async processPayment({ cardData, service, details, amount }) {
    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular 90% de éxito
    const success = Math.random() > 0.1
    const serviceCode = this.generateServiceCode()

    return {
      success,
      serviceCode,
      amount,
      service,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Muestra la confirmación de pago exitoso
   */
  async showPaymentSuccess({ service, amount, serviceCode }) {
    return await Swal.fire({
      icon: 'success',
      title: 'Pago Procesado',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Servicio:</strong> ${this.servicePrices[service].name}</p>
          <p class="mb-2"><strong>Total cobrado:</strong> S/ ${amount.toFixed(2)}</p>
          <p class="mb-2"><strong>Código de servicio:</strong> ${serviceCode}</p>
          <p class="text-sm text-gray-600 mt-3">Una ambulancia será despachada a su ubicación en los próximos minutos.</p>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Muestra el error de pago
   */
  async showPaymentError() {
    return await Swal.fire({
      icon: 'error',
      title: 'Error en el Pago',
      text: 'No se pudo procesar su pago. Por favor, verifique los datos de su tarjeta e intente nuevamente.',
      confirmButtonText: 'Reintentar',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Muestra la encuesta de calidad post-servicio
   */
  async showQualitySurvey(serviceType, serviceDescription = '') {
    const { value: surveyData } = await MySwal.fire({
      title: 'Tu Opinión es Importante',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-800 font-medium mb-2">📋 Evaluación del Servicio Particular</p>
            <p class="text-sm text-blue-700">Servicio completado: <strong>${serviceDescription}</strong></p>
            <p class="text-sm text-blue-700">Ayúdanos a mejorar con tu retroalimentación</p>
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
              ¿Qué aspecto consideras más importante mejorar? *
            </label>
            <select id="improvement-area" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecciona un aspecto</option>
              <option value="tiempo-respuesta">⏱️ Tiempo de respuesta</option>
              <option value="atencion-personal">👥 Atención del personal</option>
              <option value="facilidad-pago">💳 Facilidad de pago</option>
              <option value="precio-servicio">💰 Precio del servicio</option>
              <option value="disponibilidad">📍 Disponibilidad de servicio</option>
              <option value="comunicacion">📞 Comunicación durante el servicio</option>
              <option value="calidad-atencion">⚕️ Calidad de atención médica</option>
              <option value="otros">🔧 Otros aspectos</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Comentarios y sugerencias
            </label>
            <textarea 
              id="comments" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              rows="4" 
              placeholder="Comparte tus ideas y comentarios sobre este servicio..."
            ></textarea>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Esta encuesta es obligatoria y nos ayuda a mejorar nuestros servicios
            </p>
          </div>
        </div>
      `,
      width: 600,
      allowOutsideClick: false,
      showCloseButton: false,
      showCancelButton: false,
      confirmButtonText: 'Enviar Evaluación',
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
          serviceDescription,
          timestamp: new Date().toISOString(),
          surveyDate: new Date().toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          userRole: 'PARTICULAR'
        }
      }
    })

    if (surveyData) {
      // Mostrar confirmación de encuesta enviada
      await MySwal.fire({
        title: '¡Gracias por tu Retroalimentación!',
        html: `
          <div class="text-center">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
            <p class="text-gray-700 mb-2">Tu opinión sobre el servicio ha sido registrada exitosamente</p>
            <p class="text-sm text-gray-600">Usaremos tu retroalimentación para mejorar nuestros servicios</p>
          </div>
        `,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      console.log('Encuesta particular enviada:', surveyData)
    }

    return surveyData
  }
}

// Exportar instancia singleton
export const particularService = new ParticularService()
