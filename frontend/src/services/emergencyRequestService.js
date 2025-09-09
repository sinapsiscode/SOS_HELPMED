import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/**
 * Servicio especializado para solicitudes de emergencia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicios especializados para lógica compleja
 * ✅ Regla #8: Separación clara de responsabilidades
 * ✅ Regla #9: Funciones puras y optimizadas
 * ✅ Regla #11: Manejo centralizado de errores
 *
 * Responsabilidades:
 * - Gestión de ubicación GPS de alta precisión
 * - Validación de servicios médicos disponibles
 * - Detección de síntomas no urgentes
 * - Manejo de límites de servicios
 * - Gestión de afiliados y contactos
 */
class EmergencyRequestService {
  /**
   * Obtiene lista de afiliados disponibles
   * @param {Object} user - Usuario actual
   * @returns {Array} Lista de afiliados disponibles
   */
  getAvailableAffiliates(user) {
    const affiliates = [
      {
        id: 'titular',
        name: user.profile.name,
        relation: 'Titular',
        status: 'active'
      }
    ]

    if (user?.affiliates && user.affiliates.length > 0) {
      const activeAffiliates = user.affiliates.filter((affiliate) => affiliate.status === 'active')
      const affiliatesWithRelation = activeAffiliates.map((affiliate) => ({
        ...affiliate,
        relation: this.getRelationDisplayName(affiliate.relationship)
      }))
      affiliates.push(...affiliatesWithRelation)
    }

    return affiliates
  }

  /**
   * Obtiene servicios disponibles según el plan del usuario
   * @param {Object} user - Usuario actual
   * @returns {Array} Lista de servicios disponibles
   */
  getAvailableServices(user) {
    const services = []
    
    // Manejo defensivo para evitar errores si user.plan es undefined
    if (!user || !user.plan) {
      return services
    }

    if (user.plan.subtype === 'HELP') {
      // Plan Help: todos los servicios del límite total
      if (user.service_usage?.current_period?.remaining_services > 0) {
        services.push(
          {
            type: 'EMERGENCIA',
            name: 'Emergencia Médica',
            icon: 'fas fa-ambulance',
            color: 'red',
            urgent: true
          },
          {
            type: 'URGENCIA',
            name: 'Urgencia Médica',
            icon: 'fas fa-clock',
            color: 'orange',
            urgent: false
          },
          {
            type: 'MEDICO_DOMICILIO',
            name: 'Médico a Domicilio',
            icon: 'fas fa-user-md',
            color: 'blue',
            urgent: false
          }
        )
      }
    } else {
      // Otros planes: servicios específicos
      const breakdown = user.service_usage?.current_period?.breakdown || {}

      // Emergencias (siempre disponibles en planes Básico, VIP, Dorado)
      if (breakdown.EMERGENCIA === 'ILIMITADO') {
        services.push({
          type: 'EMERGENCIA',
          name: 'Emergencia Médica',
          icon: 'fas fa-ambulance',
          color: 'red',
          urgent: true,
          available: true
        })
      }

      // Urgencias
      if (breakdown.URGENCIA && breakdown.URGENCIA.used < breakdown.URGENCIA.limit) {
        services.push({
          type: 'URGENCIA',
          name: 'Urgencia Médica',
          icon: 'fas fa-clock',
          color: 'orange',
          urgent: false,
          available: true,
          remaining: breakdown.URGENCIA.limit - breakdown.URGENCIA.used
        })
      }

      // Médico a domicilio
      if (
        breakdown.MEDICO_DOMICILIO &&
        breakdown.MEDICO_DOMICILIO.used < breakdown.MEDICO_DOMICILIO.limit
      ) {
        services.push({
          type: 'MEDICO_DOMICILIO',
          name: 'Médico a Domicilio',
          icon: 'fas fa-user-md',
          color: 'blue',
          urgent: false,
          available: true,
          remaining: breakdown.MEDICO_DOMICILIO.limit - breakdown.MEDICO_DOMICILIO.used
        })
      }

      // Traslado programado (excluir para Plan Básico y Plan Dorado)
      if (
        user.plan?.subtype !== 'BASICO' &&
        user.plan?.subtype !== 'DORADO' &&
        breakdown.TRASLADO_PROGRAMADO &&
        breakdown.TRASLADO_PROGRAMADO.used < breakdown.TRASLADO_PROGRAMADO.limit
      ) {
        services.push({
          type: 'TRASLADO_PROGRAMADO',
          name: 'Traslado Programado',
          icon: 'fas fa-route',
          color: 'purple',
          urgent: false,
          available: true,
          remaining: breakdown.TRASLADO_PROGRAMADO.limit - breakdown.TRASLADO_PROGRAMADO.used
        })
      }

      // Zona protegida (solo VIP y Dorado)
      if (
        breakdown.ZONA_PROTEGIDA &&
        breakdown.ZONA_PROTEGIDA.used < breakdown.ZONA_PROTEGIDA.limit
      ) {
        services.push({
          type: 'ZONA_PROTEGIDA',
          name: 'Zona Protegida',
          icon: 'fas fa-shield-alt',
          color: 'green',
          urgent: false,
          available: true,
          remaining: breakdown.ZONA_PROTEGIDA.limit - breakdown.ZONA_PROTEGIDA.used
        })
      }
    }

    return services
  }

  /**
   * Obtiene ubicación GPS de alta precisión
   * @param {Function} setCurrentCoordinates - Setter para coordenadas
   * @param {Object} watchIdRef - Referencia del watcher GPS
   * @returns {Promise<Object>} Coordenadas de alta precisión
   */
  async getHighPrecisionLocation(setCurrentCoordinates, watchIdRef) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada en este navegador'))
        return
      }

      // Mostrar diálogo de progreso
      MySwal.fire({
        title: 'Obteniendo ubicación de alta precisión...',
        html: `
          <div class="text-center">
            <i class="fas fa-satellite text-4xl text-blue-500 animate-pulse mb-4"></i>
            <p class="text-gray-600">Calibrando GPS para máxima precisión</p>
            <p class="text-sm text-gray-500 mt-2">Tomando múltiples lecturas para mayor exactitud</p>
            <div class="mt-3 bg-blue-50 rounded-lg p-2">
              <p class="text-xs text-blue-600">💡 Para mejor precisión: ve cerca de una ventana o al exterior</p>
            </div>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          MySwal.showLoading()
        }
      })

      const highAccuracyOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }

      const positionSamples = []
      let watchTimeout
      let fallbackTimeout

      // Función para calcular la mejor posición
      const calculateBestPosition = (samples) => {
        if (samples.length === 0) return null

        samples.sort((a, b) => a.accuracy - b.accuracy)
        const bestSamples = samples.slice(0, Math.min(3, samples.length))

        let totalWeight = 0
        let weightedLat = 0
        let weightedLon = 0
        const bestAccuracy = bestSamples[0].accuracy

        bestSamples.forEach((sample) => {
          const weight = 1 / (sample.accuracy || 1)
          totalWeight += weight
          weightedLat += sample.latitude * weight
          weightedLon += sample.longitude * weight
        })

        return {
          latitude: weightedLat / totalWeight,
          longitude: weightedLon / totalWeight,
          accuracy: bestAccuracy,
          altitude: bestSamples[0].altitude,
          altitudeAccuracy: bestSamples[0].altitudeAccuracy,
          heading: bestSamples[0].heading,
          speed: bestSamples[0].speed,
          timestamp: new Date().toISOString(),
          samplesUsed: bestSamples.length
        }
      }

      const finishPositioning = () => {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current)
          watchIdRef.current = null
        }
        if (watchTimeout) clearTimeout(watchTimeout)
        if (fallbackTimeout) clearTimeout(fallbackTimeout)

        const bestPosition = calculateBestPosition(positionSamples)
        if (bestPosition) {
          setCurrentCoordinates(bestPosition)
          MySwal.close()
          resolve(bestPosition)
        } else {
          MySwal.close()
          reject(new Error('No se pudo obtener ninguna posición válida'))
        }
      }

      // Timeout absoluto (45 segundos)
      fallbackTimeout = setTimeout(() => {
        console.warn('Timeout absoluto alcanzado')
        finishPositioning()
      }, 45000)

      // Primera lectura
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const sample = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          }

          positionSamples.push(sample)
          console.log(`Muestra inicial: ${sample.accuracy.toFixed(1)}m de precisión`)

          if (sample.accuracy <= 5) {
            console.log('Excelente precisión obtenida inmediatamente')
            finishPositioning()
            return
          }

          if (sample.accuracy <= 15) {
            watchTimeout = setTimeout(finishPositioning, 10000)
          } else {
            watchTimeout = setTimeout(finishPositioning, 25000)
          }

          // Iniciar watchPosition para más muestras
          watchIdRef.current = navigator.geolocation.watchPosition(
            (newPosition) => {
              const newSample = {
                latitude: newPosition.coords.latitude,
                longitude: newPosition.coords.longitude,
                accuracy: newPosition.coords.accuracy,
                altitude: newPosition.coords.altitude,
                altitudeAccuracy: newPosition.coords.altitudeAccuracy,
                heading: newPosition.coords.heading,
                speed: newPosition.coords.speed,
                timestamp: newPosition.timestamp
              }

              positionSamples.push(newSample)
              console.log(
                `Nueva muestra: ${newSample.accuracy.toFixed(1)}m, total: ${positionSamples.length}`
              )

              if (newSample.accuracy <= 3) {
                console.log('Precisión excelente alcanzada')
                finishPositioning()
              }

              if (positionSamples.length >= 8) {
                console.log('Máximo de muestras alcanzado')
                finishPositioning()
              }
            },
            (error) => {
              console.warn('Error en watchPosition:', error)
            },
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 1000
            }
          )
        },
        (error) => {
          if (fallbackTimeout) clearTimeout(fallbackTimeout)
          MySwal.close()

          let errorMessage = 'Error al obtener la ubicación'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                'Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                'GPS no disponible. Asegúrate de estar en un lugar con buena señal y tener la ubicación activada.'
              break
            case error.TIMEOUT:
              errorMessage =
                'Tiempo de espera agotado. Intenta desde una ventana o área abierta para mejor señal GPS.'
              break
          }
          reject(new Error(errorMessage))
        },
        highAccuracyOptions
      )
    })
  }

  /**
   * Detecta síntomas no urgentes en la descripción
   * @param {string} description - Descripción del problema
   * @returns {boolean} Si contiene síntomas no urgentes
   */
  checkForNonEmergencySymptoms(description) {
    const nonEmergencyKeywords = [
      'resfriado',
      'gripe',
      'catarro',
      'tos leve',
      'dolor de cabeza leve',
      'dolor muscular',
      'cansancio',
      'fatiga',
      'control',
      'chequeo',
      'revisión',
      'consulta',
      'receta',
      'medicamento',
      'pastillas',
      'dolor leve',
      'molestia',
      'incomodidad',
      'hace días',
      'hace semanas',
      'desde hace tiempo',
      'rutina',
      'preventivo'
    ]

    const descriptionLower = description.toLowerCase()
    return nonEmergencyKeywords.some((keyword) => descriptionLower.includes(keyword))
  }

  /**
   * Maneja la validación de límites de servicio
   * @param {Object} validation - Resultado de validación
   * @returns {Promise<boolean>} Si debe proceder con el servicio
   */
  async handleServiceLimitValidation(validation) {
    if (validation.canPurchaseAdditional) {
      const result = await Swal.fire({
        title: 'Límite Agotado',
        html: `
          <div class="text-left">
            <p class="mb-3">${validation.reason}</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="font-medium text-blue-800">¿Deseas comprar un servicio adicional?</p>
              <p class="text-2xl font-bold text-blue-600">$${validation.additionalCost?.toLocaleString()}</p>
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Comprar y Solicitar',
        cancelButtonText: 'Cancelar'
      })

      return result.isConfirmed
    } else {
      Swal.fire({
        title: 'Servicio No Disponible',
        text: validation.reason,
        icon: 'error',
        confirmButtonColor: '#D32F2F'
      })
      return false
    }
  }

  /**
   * Muestra errores de validación del formulario
   * @param {Array} errors - Lista de errores
   */
  showFormErrors(errors) {
    const errorMessage = errors.length === 1 ? errors[0] : errors.join('\n• ')

    Swal.fire({
      title: 'Campos Requeridos',
      text: errors.length === 1 ? errorMessage : `• ${errorMessage}`,
      icon: 'warning',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Muestra éxito al obtener ubicación GPS
   * @param {Object} coordinates - Coordenadas obtenidas
   */
  showLocationSuccess(coordinates) {
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
   * Muestra error al obtener ubicación GPS
   * @param {string} message - Mensaje de error
   */
  showLocationError(message) {
    MySwal.fire({
      title: 'Error al obtener ubicación',
      text: message,
      icon: 'error',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Obtiene el nombre de visualización de la relación
   * @param {string} relationship - Tipo de relación
   * @returns {string} Nombre de visualización
   */
  getRelationDisplayName(relationship) {
    const relationMap = {
      conyuge: 'Cónyuge',
      hijo: 'Hijo/a',
      madre: 'Madre',
      padre: 'Padre',
      hermano: 'Hermano/a',
      abuelo: 'Abuelo/a',
      nieto: 'Nieto/a',
      otro: 'Otro'
    }
    return relationMap[relationship] || relationship
  }

  /**
   * Obtiene colores para tipos de servicio
   * @param {string} serviceType - Tipo de servicio
   * @returns {Object} Configuración de colores
   */
  getServiceColors(serviceType) {
    const colorMap = {
      EMERGENCIA: {
        primary: 'red',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      },
      URGENCIA: {
        primary: 'orange',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200'
      },
      MEDICO_DOMICILIO: {
        primary: 'blue',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      TRASLADO_PROGRAMADO: {
        primary: 'purple',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200'
      },
      ZONA_PROTEGIDA: {
        primary: 'green',
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      }
    }

    return colorMap[serviceType] || colorMap['MEDICO_DOMICILIO']
  }

  /**
   * Valida formato de teléfono
   * @param {string} phone - Número de teléfono
   * @returns {boolean} Si es válido
   */
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  /**
   * Obtiene recomendaciones según el tipo de servicio
   * @param {string} serviceType - Tipo de servicio
   * @returns {Object} Recomendaciones
   */
  getServiceRecommendations(serviceType) {
    const recommendations = {
      EMERGENCIA: {
        title: 'Recomendaciones para Emergencias',
        items: [
          'Mantén la calma y sigue las instrucciones del operador',
          'Ten a mano documentos de identidad y historial médico',
          'Si es posible, acompaña al paciente hasta la llegada de la ambulancia',
          'Proporciona información clara sobre la ubicación exacta'
        ]
      },
      URGENCIA: {
        title: 'Preparación para Urgencia Médica',
        items: [
          'Prepara documentos de identidad y plan médico',
          'Anota síntomas y tiempo de evolución',
          'Mantén disponible la lista de medicamentos actuales',
          'Coordina el acceso a tu domicilio'
        ]
      },
      MEDICO_DOMICILIO: {
        title: 'Consulta Médica Domiciliaria',
        items: [
          'Prepara un espacio adecuado y bien iluminado',
          'Ten disponible el historial médico reciente',
          'Anota preguntas que quieras hacer al médico',
          'Asegura privacidad para la consulta'
        ]
      }
    }

    return recommendations[serviceType] || null
  }
}

// Instancia singleton del servicio
const emergencyRequestService = new EmergencyRequestService()

export default emergencyRequestService
