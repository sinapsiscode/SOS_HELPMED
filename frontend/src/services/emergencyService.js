import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/**
 * Servicio especializado para manejo de emergencias
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicio especializado con responsabilidad única
 * ✅ Regla #2: Lógica de negocio separada de componentes
 * ✅ Regla #6: Manejo centralizado de modales y geolocalización
 *
 * Responsabilidades:
 * - Gestión de geolocalización de alta precisión
 * - Modales de emergencia y SOS
 * - Validación de contactos de emergencia
 * - Formateo de coordenadas
 * - Manejo de errores de ubicación
 */
class EmergencyService {
  constructor() {
    // Configuración de geolocalización
    this.locationOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }

    // Umbrales de precisión
    this.precisionThresholds = {
      good: 10, // Menos de 10m es buena precisión
      acceptable: 20 // Más de 20m necesita mejorar
    }

    // Configuración de intentos de mejora
    this.watchConfig = {
      maxAttempts: 5,
      targetAccuracy: 10
    }
  }

  /**
   * Obtiene las opciones de geolocalización
   */
  getLocationOptions() {
    return this.locationOptions
  }

  /**
   * Formatea las coordenadas desde la posición del navegador
   */
  formatCoordinates(position) {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: new Date(position.timestamp).toISOString()
    }
  }

  /**
   * Obtiene mensaje de error de geolocalización
   */
  getLocationErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.'
      case error.POSITION_UNAVAILABLE:
        return 'Información de ubicación no disponible'
      case error.TIMEOUT:
        return 'Tiempo de espera agotado al obtener la ubicación'
      default:
        return 'Error al obtener la ubicación'
    }
  }

  /**
   * Muestra el modal de carga de ubicación
   */
  async showLocationLoading() {
    return MySwal.fire({
      title: 'Obteniendo ubicación precisa...',
      html: `
        <div class="text-center">
          <i class="fas fa-map-marker-alt text-4xl text-blue-500 animate-bounce mb-4"></i>
          <p class="text-gray-600">Por favor, espera mientras obtenemos tu ubicación exacta</p>
          <p class="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos para máxima precisión</p>
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
   * Cierra el modal actual
   */
  closeModal() {
    MySwal.close()
  }

  /**
   * Muestra formulario de contactos para emergencia estándar
   */
  async showEmergencyContactForm(type, coordinates) {
    const emergencyTypes = {
      medical: 'Emergencia Médica',
      consultation: 'Consulta Médica'
    }

    const { value: contactInfo } = await MySwal.fire({
      title: `Solicitar ${emergencyTypes[type] || 'Servicio Médico'}`,
      html: this.buildEmergencyContactFormHTML(coordinates),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#D32F2F',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Solicitar Servicio',
      cancelButtonText: 'Cancelar',
      preConfirm: () => this.validateEmergencyContactForm()
    })

    return contactInfo
  }

  /**
   * Construye el HTML del formulario de contactos de emergencia
   */
  buildEmergencyContactFormHTML(coordinates) {
    return `
      <div class="text-left space-y-4">
        <div class="bg-gray-100 rounded-lg p-3 text-sm mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-600">📍 Ubicación detectada:</span>
            <span class="text-green-600">Precisión: ${coordinates.accuracy.toFixed(1)}m</span>
          </div>
          <div class="text-gray-600 space-y-1">
            <div>Latitud: ${coordinates.latitude.toFixed(6)}</div>
            <div>Longitud: ${coordinates.longitude.toFixed(6)}</div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción del problema (opcional)</label>
          <textarea id="swal-description" class="swal2-textarea" placeholder="Describe brevemente la situación médica..." rows="3"></textarea>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 class="font-medium text-blue-800 mb-3">📞 Contacto de Emergencia Adicional</h4>
          <div>
            <label class="block text-xs font-medium text-blue-700 mb-1">Contacto Adicional (Opcional)</label>
            <div class="flex space-x-2">
              <input id="swal-contact1-name" class="swal2-input text-sm" placeholder="Nombre" style="margin: 0; width: 50%;">
              <input id="swal-contact1-phone" class="swal2-input text-sm" placeholder="Teléfono" style="margin: 0; width: 50%;">
            </div>
          </div>
          <p class="text-xs text-blue-600 mt-2">Este contacto será notificado en caso de emergencia</p>
        </div>
      </div>
    `
  }

  /**
   * Valida el formulario de contactos de emergencia
   */
  validateEmergencyContactForm() {
    const description = document.getElementById('swal-description').value
    const contact1Name = document.getElementById('swal-contact1-name').value
    const contact1Phone = document.getElementById('swal-contact1-phone').value

    // Validar que si se proporciona un nombre, también se proporcione teléfono
    if (contact1Name && !contact1Phone) {
      MySwal.showValidationMessage(
        'Si proporcionas un nombre para el contacto, también debes incluir el teléfono'
      )
      return false
    }

    // Crear array de contacto extra (solo si tiene datos)
    const extraContacts = []
    if (contact1Name && contact1Phone) {
      extraContacts.push({ name: contact1Name, phone: contact1Phone })
    }

    return {
      description: description || 'Solicitud de emergencia',
      extraContacts
    }
  }

  /**
   * Muestra formulario de contactos SOS
   */
  async showSOSContactForm(coordinates) {
    const { value: contactInfo } = await MySwal.fire({
      title: '🚨 EMERGENCIA CRÍTICA - SOS',
      html: this.buildSOSContactFormHTML(coordinates),
      focusConfirm: false,
      showCancelButton: false,
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'ACTIVAR EMERGENCIA SOS',
      allowOutsideClick: false,
      preConfirm: () => this.validateSOSContactForm()
    })

    return contactInfo
  }

  /**
   * Construye el HTML del formulario SOS
   */
  buildSOSContactFormHTML(coordinates) {
    return `
      <div class="text-left space-y-3">
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div class="text-red-600 font-bold text-lg mb-2">PROTOCOLO SOS ACTIVADO</div>
          <p class="text-red-700 text-sm">Las unidades más cercanas están siendo notificadas</p>
        </div>
        
        <div class="bg-gray-100 rounded-lg p-3 text-sm">
          <div class="text-red-700 font-semibold mb-1">📍 Ubicación registrada:</div>
          <div class="text-gray-600">
            <div>Lat: ${coordinates.latitude.toFixed(6)}</div>
            <div>Lon: ${coordinates.longitude.toFixed(6)}</div>
            <div class="text-xs">Precisión: ${coordinates.accuracy.toFixed(1)}m</div>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 class="font-medium text-blue-800 mb-3">📞 Contactos de Emergencia (Opcional pero Recomendado)</h4>
          <div class="space-y-2">
            <div>
              <label class="block text-xs font-medium text-blue-700 mb-1">Contacto Extra 1</label>
              <div class="flex space-x-2">
                <input id="sos-contact1-name" class="swal2-input text-sm" placeholder="Nombre" style="margin: 0; width: 50%;">
                <input id="sos-contact1-phone" class="swal2-input text-sm" placeholder="Teléfono" style="margin: 0; width: 50%;">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-blue-700 mb-1">Contacto Extra 2</label>
              <div class="flex space-x-2">
                <input id="sos-contact2-name" class="swal2-input text-sm" placeholder="Nombre" style="margin: 0; width: 50%;">
                <input id="sos-contact2-phone" class="swal2-input text-sm" placeholder="Teléfono" style="margin: 0; width: 50%;">
              </div>
            </div>
          </div>
          <p class="text-xs text-blue-600 mt-2">Estos contactos serán notificados inmediatamente</p>
        </div>
        
        <div class="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <p class="text-xs text-yellow-700">⚡ Puedes continuar sin contactos extras si es muy urgente</p>
        </div>
      </div>
    `
  }

  /**
   * Valida el formulario de contactos SOS
   */
  validateSOSContactForm() {
    const contact1Name = document.getElementById('sos-contact1-name').value
    const contact1Phone = document.getElementById('sos-contact1-phone').value
    const contact2Name = document.getElementById('sos-contact2-name').value
    const contact2Phone = document.getElementById('sos-contact2-phone').value

    // Crear array de contactos extra (solo los que tengan datos completos)
    const extraContacts = []
    if (contact1Name && contact1Phone) {
      extraContacts.push({ name: contact1Name, phone: contact1Phone })
    }
    if (contact2Name && contact2Phone) {
      extraContacts.push({ name: contact2Name, phone: contact2Phone })
    }

    return {
      description: 'EMERGENCIA CRÍTICA - SOS',
      extraContacts
    }
  }

  /**
   * Muestra confirmación de emergencia exitosa
   */
  async showEmergencySuccess(coordinates, extraContacts) {
    return MySwal.fire({
      title: '¡Solicitud enviada!',
      html: `
        <div class="text-center">
          <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
          <p class="text-gray-700">Una unidad médica ha sido asignada y está en camino.</p>
          <p class="text-sm text-gray-500 mt-2">Ubicación registrada con precisión de ${coordinates.accuracy.toFixed(1)}m</p>
          ${
            extraContacts.length > 0
              ? `<div class="bg-blue-50 rounded-lg p-2 mt-3">
              <p class="text-sm text-blue-700">📞 ${extraContacts.length} contacto(s) adicional(es) registrado(s)</p>
            </div>`
              : ''
          }
        </div>
      `,
      icon: 'success',
      timer: 4000,
      showConfirmButton: false
    })
  }

  /**
   * Muestra confirmación de SOS exitoso
   */
  async showSOSSuccess(coordinates, extraContacts) {
    return MySwal.fire({
      title: '🚨 EMERGENCIA CRÍTICA ACTIVADA',
      html: `
        <div class="text-center space-y-3">
          <div class="text-red-600 font-bold text-lg">PROTOCOLO SOS INICIADO</div>
          <p class="text-gray-700">Las unidades más cercanas han sido notificadas.</p>
          <div class="bg-red-50 rounded-lg p-3 text-sm">
            <div class="text-red-700 font-semibold mb-2">📍 Ubicación registrada:</div>
            <div class="text-red-600">
              <div>Lat: ${coordinates.latitude.toFixed(6)}</div>
              <div>Lon: ${coordinates.longitude.toFixed(6)}</div>
              <div class="text-xs mt-1">Precisión: ${coordinates.accuracy.toFixed(1)}m</div>
            </div>
          </div>
          ${
            extraContacts.length > 0
              ? `<div class="bg-blue-50 rounded-lg p-2">
              <p class="text-sm text-blue-700">📞 ${extraContacts.length} contacto(s) de emergencia notificado(s)</p>
              ${extraContacts
                .map(
                  (contact) =>
                    `<p class="text-xs text-blue-600">• ${contact.name}: ${contact.phone}</p>`
                )
                .join('')}
            </div>`
              : `<div class="bg-yellow-50 rounded-lg p-2">
              <p class="text-sm text-yellow-700">⚠️ Sin contactos extras registrados</p>
            </div>`
          }
          <p class="text-sm text-gray-600 font-medium">Mantén la calma. La ayuda está en camino.</p>
        </div>
      `,
      icon: 'warning',
      confirmButtonColor: '#D32F2F',
      confirmButtonText: 'Entendido'
    })
  }

  /**
   * Muestra error de ubicación
   */
  async showLocationError(errorMessage) {
    return MySwal.fire({
      title: 'Error al obtener ubicación',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Muestra fallback de SOS sin ubicación
   */
  async showSOSErrorFallback() {
    return MySwal.fire({
      title: '🚨 EMERGENCIA CRÍTICA',
      text: 'Se ha activado el protocolo de emergencia crítica. Las unidades más cercanas han sido notificadas. (Sin coordenadas precisas)',
      icon: 'warning',
      confirmButtonColor: '#D32F2F',
      confirmButtonText: 'Entendido'
    })
  }
}

// Exportar instancia singleton
export const emergencyService = new EmergencyService()
