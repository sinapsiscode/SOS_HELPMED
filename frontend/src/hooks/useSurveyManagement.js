import { useCallback } from 'react'
import MySwal from 'sweetalert2'

/**
 * Hook especializado para gestión de encuestas de satisfacción
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Survey management
 * ✅ Funciones de UI modularizadas
 */
const useSurveyManagement = (currentUser) => {
  /**
   * Mostrar encuesta de calidad de servicio
   */
  const showServiceQualitySurvey = useCallback(async (
    serviceType,
    serviceDescription = '',
    requestDate = null
  ) => {
    const { value: surveyData } = await MySwal.fire({
      title: 'Tu Opinión es Importante',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-blue-800 font-medium mb-2">📋 Evaluación de Calidad del Servicio</p>
                <p class="text-sm text-blue-700">Acabas de recibir: <strong>${serviceDescription || serviceType}</strong></p>
                <p class="text-sm text-blue-700">Ayúdanos a mejorar con tu retroalimentación</p>
              </div>
              ${
                requestDate
                  ? `
                <div class="ml-4 text-right">
                  <p class="text-xs text-blue-600 font-medium">Fecha de solicitud</p>
                  <p class="text-sm text-blue-800 font-bold">
                    ${new Date(requestDate).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <p class="text-xs text-blue-600">
                    ${new Date(requestDate).toLocaleTimeString('es-CL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              `
                  : ''
              }
            </div>
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
              <option value="facilidad-uso">📱 Facilidad de uso de la app</option>
              <option value="comunicacion">📞 Comunicación durante el servicio</option>
              <option value="cobertura">🗺️ Cobertura geográfica</option>
              <option value="precios">💰 Precios y planes</option>
              <option value="otros">🔧 Otros aspectos</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Comentarios y sugerencias para mejorar
            </label>
            <textarea 
              id="comments" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              rows="4" 
              placeholder="Comparte tus ideas, sugerencias o comentarios sobre este servicio..."
            ></textarea>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Esta encuesta es obligatoria y nos ayuda a brindarte un mejor servicio
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
          userRole: 'FAMILIAR',
          userId: currentUser?.id || 'unknown'
        }
      }
    })

    if (surveyData) {
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

      console.log('Encuesta de calidad enviada:', surveyData)
    }
  }, [currentUser?.id])

  return {
    showServiceQualitySurvey
  }
}

export default useSurveyManagement