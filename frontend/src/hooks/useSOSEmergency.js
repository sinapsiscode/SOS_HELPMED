import { useCallback } from 'react'
import MySwal from 'sweetalert2'

/**
 * Hook especializado para emergencias SOS
 *  Cumple reglas de tamaño: <100 líneas
 *  Responsabilidad única: SOS emergency handling
 *  Lógica de UI y coordinación de geolocalización
 */
const useSOSEmergency = (getHighPrecisionLocation, handleEmergencyRequest) => {
  /**
   * Manejar emergencia SOS con geolocalización precisa
   */
  const handleSOSEmergency = useCallback(async () => {
    const emergencyRequestTime = new Date().toISOString()
    
    try {
      MySwal.fire({
        title: 'Obteniendo ubicación precisa...',
        html: `
          <div class="text-center">
            <i class="fas fa-satellite text-4xl text-blue-500 animate-pulse mb-4"></i>
            <p class="text-gray-600">Por favor, espera mientras obtenemos tu ubicación exacta</p>
            <p class="text-sm text-gray-500 mt-2">Calibrando GPS para máxima precisión</p>
            <div class="mt-3 bg-blue-50 rounded-lg p-2">
              <p class="text-xs text-blue-600">=¡ Para mejor precisión: ve cerca de una ventana o al exterior</p>
            </div>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          MySwal.showLoading()
        }
      })

      const coordinates = await getHighPrecisionLocation()
      MySwal.close()

      const result = await MySwal.fire({
        title: '¿Solicitar Emergencia Médica?',
        html: createLocationConfirmationHTML(coordinates),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, solicitar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        await handleEmergencyRequest(
          'EMERGENCIA',
          'Solicitud de emergencia',
          coordinates,
          [],
          null,
          emergencyRequestTime
        )

        MySwal.fire({
          title: '¡Solicitud enviada!',
          html: createSuccessHTML(coordinates),
          icon: 'success',
          timer: 4000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error al obtener ubicación',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#D32F2F'
      })
    }
  }, [getHighPrecisionLocation, handleEmergencyRequest])

  /**
   * Crear HTML de confirmación de ubicación
   */
  const createLocationConfirmationHTML = (coordinates) => `
    <div class="space-y-3">
      <p class="text-gray-700">Se enviará una unidad médica a tu ubicación actual.</p>
      <div class="bg-gray-100 rounded-lg p-3 text-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold text-gray-600">=Í Ubicación detectada:</span>
          <span class="text-green-600">Precisión: ${coordinates.accuracy.toFixed(1)}m</span>
        </div>
        <div class="text-gray-600 space-y-1">
          <div>Latitud: ${coordinates.latitude.toFixed(6)}</div>
          <div>Longitud: ${coordinates.longitude.toFixed(6)}</div>
        </div>
      </div>
    </div>
  `

  /**
   * Crear HTML de éxito
   */
  const createSuccessHTML = (coordinates) => `
    <div class="text-center">
      <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
      <p class="text-gray-700">Una unidad médica ha sido asignada y está en camino.</p>
      <p class="text-sm text-gray-500 mt-2">Ubicación registrada con precisión de ${coordinates.accuracy.toFixed(1)}m</p>
    </div>
  `

  return {
    handleSOSEmergency
  }
}

export default useSOSEmergency