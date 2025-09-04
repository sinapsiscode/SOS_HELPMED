import { useCallback } from 'react'
import MySwal from 'sweetalert2'

/**
 * Hook especializado para emergencias SOS
 *  Cumple reglas de tama�o: <100 l�neas
 *  Responsabilidad �nica: SOS emergency handling
 *  L�gica de UI y coordinaci�n de geolocalizaci�n
 */
const useSOSEmergency = (getHighPrecisionLocation, handleEmergencyRequest) => {
  /**
   * Manejar emergencia SOS con geolocalizaci�n precisa
   */
  const handleSOSEmergency = useCallback(async () => {
    const emergencyRequestTime = new Date().toISOString()
    
    try {
      MySwal.fire({
        title: 'Obteniendo ubicaci�n precisa...',
        html: `
          <div class="text-center">
            <i class="fas fa-satellite text-4xl text-blue-500 animate-pulse mb-4"></i>
            <p class="text-gray-600">Por favor, espera mientras obtenemos tu ubicaci�n exacta</p>
            <p class="text-sm text-gray-500 mt-2">Calibrando GPS para m�xima precisi�n</p>
            <div class="mt-3 bg-blue-50 rounded-lg p-2">
              <p class="text-xs text-blue-600">=� Para mejor precisi�n: ve cerca de una ventana o al exterior</p>
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
        title: '�Solicitar Emergencia M�dica?',
        html: createLocationConfirmationHTML(coordinates),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'S�, solicitar',
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
          title: '�Solicitud enviada!',
          html: createSuccessHTML(coordinates),
          icon: 'success',
          timer: 4000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error al obtener ubicaci�n',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#D32F2F'
      })
    }
  }, [getHighPrecisionLocation, handleEmergencyRequest])

  /**
   * Crear HTML de confirmaci�n de ubicaci�n
   */
  const createLocationConfirmationHTML = (coordinates) => `
    <div class="space-y-3">
      <p class="text-gray-700">Se enviar� una unidad m�dica a tu ubicaci�n actual.</p>
      <div class="bg-gray-100 rounded-lg p-3 text-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold text-gray-600">=� Ubicaci�n detectada:</span>
          <span class="text-green-600">Precisi�n: ${coordinates.accuracy.toFixed(1)}m</span>
        </div>
        <div class="text-gray-600 space-y-1">
          <div>Latitud: ${coordinates.latitude.toFixed(6)}</div>
          <div>Longitud: ${coordinates.longitude.toFixed(6)}</div>
        </div>
      </div>
    </div>
  `

  /**
   * Crear HTML de �xito
   */
  const createSuccessHTML = (coordinates) => `
    <div class="text-center">
      <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
      <p class="text-gray-700">Una unidad m�dica ha sido asignada y est� en camino.</p>
      <p class="text-sm text-gray-500 mt-2">Ubicaci�n registrada con precisi�n de ${coordinates.accuracy.toFixed(1)}m</p>
    </div>
  `

  return {
    handleSOSEmergency
  }
}

export default useSOSEmergency