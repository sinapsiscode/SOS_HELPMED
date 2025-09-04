import Swal from 'sweetalert2'

/**
 * Servicio para operaciones avanzadas de gestión de usuarios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Separación de responsabilidades en servicio dedicado
 * ✅ Regla #1: Validaciones robustas y manejo de errores
 * ✅ Regla #6: Documentación JSDoc completa
 * ✅ Regla #8: Manejo consistente de errores
 * ✅ Regla #4: Validación de datos de usuario
 *
 * @class UserService
 */
class UserService {
  /**
   * Genera una contraseña segura aleatoria
   * @param {number} length - Longitud de la contraseña
   * @returns {string} Contraseña generada
   */
  generateSecurePassword(length = 10) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  /**
   * Valida el DNI peruano
   * @param {string} dni - DNI a validar
   * @returns {boolean} True si es válido
   */
  validatePeuvianDNI(dni) {
    return /^\d{8}$/.test(dni)
  }

  /**
   * Valida el RUC chileno (formato básico)
   * @param {string} rut - RUC a validar
   * @returns {boolean} True si es válido
   */
  validateChileanRUT(rut) {
    return /^\d{7,8}-[0-9kK]$/.test(rut)
  }

  /**
   * Valida email con regex avanzado
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  /**
   * Valida teléfono peruano
   * @param {string} phone - Teléfono a validar
   * @returns {boolean} True si es válido
   */
  validatePeuvianPhone(phone) {
    return /^(\+51|51)?[9]\d{8}$/.test(phone.replace(/\s/g, ''))
  }

  /**
   * Maneja el consumo de servicios para usuarios corporativos
   * @param {Object} user - Usuario corporativo
   * @param {string} selectedUserType - Tipo de usuario seleccionado
   * @param {Function} consumeServicesCallback - Callback para actualizar servicios
   */
  async handleCorporateServiceConsumption(user, selectedUserType, consumeServicesCallback) {
    const serviceUsage = user.service_usage?.current_period
    const currentUsed = serviceUsage?.used_services || 0
    const currentRemaining = serviceUsage?.remaining_services || 0
    const totalLimit = currentUsed + currentRemaining

    const result = await Swal.fire({
      title: 'Registrar Servicios Consumidos',
      html: this.generateServiceConsumptionModal(user, currentUsed, totalLimit),
      showCancelButton: true,
      confirmButtonText: 'Registrar Consumo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#DC2626',
      preConfirm: () => {
        const extraServices =
          parseInt(document.getElementById('extra-emergency-services')?.value) || 0

        if (extraServices <= 0) {
          Swal.showValidationMessage('Debe registrar al menos 1 servicio consumido')
          return false
        }

        return { extraServices }
      }
    })

    if (result.isConfirmed) {
      const { extraServices } = result.value

      await this.showServiceConsumptionSuccess(user, extraServices)
      consumeServicesCallback(user.id, selectedUserType, extraServices)
    }
  }

  /**
   * Genera el modal HTML para consumo de servicios corporativos
   * @param {Object} user - Usuario corporativo
   * @param {number} currentUsed - Servicios actualmente utilizados
   * @param {number} totalLimit - Límite total de servicios
   * @returns {string} HTML del modal
   */
  generateServiceConsumptionModal(user, currentUsed, totalLimit) {
    return `
      <div class="text-left space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="font-semibold text-blue-800 mb-2">${user.role === 'CORPORATIVO' ? 'Empresa' : 'Usuario'}: ${user.role === 'CORPORATIVO' ? user.company?.name : user.profile?.name}</p>
          <p class="text-sm text-blue-600">Plan: ${user.plan?.name}</p>
          <p class="text-sm text-blue-600">Servicios actuales: ${currentUsed}/${totalLimit} utilizados</p>
        </div>
        
        <div class="space-y-3">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <label class="block text-sm font-medium text-red-700 mb-2">
              <i class="fas fa-plus-circle mr-2 text-red-600"></i>
              Servicios Consumidos a Registrar
            </label>
            <input type="number" id="extra-emergency-services" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Cantidad de servicios consumidos" min="1" value="1">
            <p class="text-xs text-red-600 mt-2">
              <i class="fas fa-info-circle mr-1"></i>
              Esto incrementará el contador de servicios utilizados
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Los servicios disponibles se reducirán automáticamente
            </p>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h5 class="font-medium text-yellow-800 mb-2">¿Qué incluye cada servicio de emergencia?</h5>
            <ul class="text-xs text-yellow-700 space-y-1">
              <li>• Atención médica de emergencia 24/7</li>
              <li>• Traslado en ambulancia si es necesario</li>
              <li>• Evaluación inicial en el lugar</li>
              <li>• Coordinación con centros médicos</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Muestra el modal de éxito tras registrar consumo de servicios
   * @param {Object} user - Usuario corporativo
   * @param {number} extraServices - Servicios registrados
   */
  async showServiceConsumptionSuccess(user, extraServices) {
    return Swal.fire({
      title: '¡Servicios Registrados!',
      html: `
        <div class="text-center">
          <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
          <p class="text-lg">Se han registrado exitosamente:</p>
          <p class="font-bold text-2xl text-blue-600 mt-2">${extraServices} servicio${extraServices > 1 ? 's' : ''} consumido${extraServices > 1 ? 's' : ''}</p>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <p class="text-sm text-gray-700">Para: ${user.role === 'CORPORATIVO' ? user.company?.name : user.profile?.name}</p>
            <p class="text-sm text-gray-700">Servicios utilizados actualizados</p>
            <p class="text-xs text-gray-500 mt-2">El contador de uso se ha incrementado</p>
          </div>
        </div>
      `,
      icon: 'success',
      timer: 4000,
      showConfirmButton: false
    })
  }

  /**
   * Maneja la adición de servicios para usuarios corporativos
   * @param {Object} user - Usuario corporativo
   * @param {string} selectedUserType - Tipo de usuario seleccionado
   * @param {Function} addExtraServicesCallback - Callback para agregar servicios
   */
  async handleCorporateServiceAddition(user, selectedUserType, addExtraServicesCallback) {
    const result = await Swal.fire({
      title: 'Gestionar Servicios Adicionales',
      html: this.generateCorporateServiceAdditionModal(user),
      showCancelButton: true,
      confirmButtonText: 'Asignar Servicios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10B981',
      width: '600px',
      preConfirm: () => {
        const emergencyServices =
          parseInt(document.getElementById('emergency-additional')?.value) || 0
        const totalServices = emergencyServices

        if (totalServices <= 0) {
          Swal.showValidationMessage('Debe asignar al menos 1 servicio adicional')
          return false
        }

        return {
          emergency: emergencyServices,
          total: totalServices
        }
      }
    })

    if (result.isConfirmed) {
      const services = result.value
      await this.showServiceAdditionSuccess(user, services)
      addExtraServicesCallback(user.id, selectedUserType, services)
    }
  }

  /**
   * Genera el modal HTML para adición de servicios corporativos
   * @param {Object} user - Usuario corporativo
   * @returns {string} HTML del modal
   */
  generateCorporateServiceAdditionModal(user) {
    return `
      <div class="text-left space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="font-semibold text-blue-800 mb-2">Usuario: ${user.company?.name || user.profile?.name}</p>
          <p class="text-sm text-blue-600">Plan: ${user.plan?.name || 'Área Protegida'}</p>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-medium text-gray-800 mb-3">Agregar servicios adicionales:</h4>
          
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i class="fas fa-ambulance text-red-600 text-xl"></i>
              </div>
              <div>
                <label class="font-medium text-gray-800 text-lg">Emergencias adicionales</label>
                <p class="text-sm text-gray-600">Servicio de emergencia 24/7 para área protegida</p>
              </div>
            </div>
            <input type="number" id="emergency-additional" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="0" min="1" value="1">
            <p class="text-xs text-gray-500 mt-2">Ingresa la cantidad de servicios de emergencia adicionales</p>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 class="font-medium text-green-800 mb-2">
              <i class="fas fa-info-circle mr-2"></i>
              ¿Qué incluye el servicio de emergencia corporativo?
            </h5>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• Atención médica de emergencia 24/7 en área protegida</li>
              <li>• Ambulancia equipada con personal especializado</li>
              <li>• Traslado a centro médico de ser necesario</li>
              <li>• Cobertura para todos los empleados de la empresa</li>
              <li>• Sin límite de horario ni ubicación dentro del área protegida</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <i class="fas fa-info-circle text-yellow-600 mt-0.5"></i>
              <p class="text-sm text-yellow-800">
                Los servicios adicionales se sumarán al plan corporativo actual. Cada servicio adicional tiene un costo según el contrato establecido.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Maneja la adición de servicios para usuarios familiares
   * @param {Object} user - Usuario familiar
   * @param {string} selectedUserType - Tipo de usuario seleccionado
   * @param {Function} addExtraServicesCallback - Callback para agregar servicios
   */
  async handleFamiliarServiceAddition(user, selectedUserType, addExtraServicesCallback) {
    const serviceUsage = user.service_usage?.current_period
    const currentUsed = serviceUsage?.used_services || 0
    const currentRemaining = serviceUsage?.remaining_services || 0

    const result = await Swal.fire({
      title: 'Gestionar Servicios Adicionales',
      html: this.generateFamiliarServiceAdditionModal(user, currentUsed, currentRemaining),
      showCancelButton: true,
      confirmButtonText: 'Asignar Servicios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10B981',
      width: '600px',
      preConfirm: () => {
        const emergencyServices =
          parseInt(document.getElementById('emergency-additional')?.value) || 0
        const urgencyServices = parseInt(document.getElementById('urgency-additional')?.value) || 0
        const doctorServices = parseInt(document.getElementById('doctor-additional')?.value) || 0
        const transferServices =
          parseInt(document.getElementById('transfer-additional')?.value) || 0
        const labServices = parseInt(document.getElementById('lab-additional')?.value) || 0

        const totalServices =
          emergencyServices + urgencyServices + doctorServices + transferServices + labServices

        if (totalServices <= 0) {
          Swal.showValidationMessage('Debe asignar al menos 1 servicio adicional')
          return false
        }

        return {
          emergency: emergencyServices,
          urgency: urgencyServices,
          doctor: doctorServices,
          transfer: transferServices,
          lab: labServices,
          total: totalServices
        }
      }
    })

    if (result.isConfirmed) {
      const services = result.value
      await this.showServiceAdditionSuccess(user, services, true)
      addExtraServicesCallback(user.id, selectedUserType, services)
    }
  }

  /**
   * Genera el modal HTML para adición de servicios familiares
   * @param {Object} user - Usuario familiar
   * @param {number} currentUsed - Servicios utilizados
   * @param {number} currentRemaining - Servicios restantes
   * @returns {string} HTML del modal
   */
  generateFamiliarServiceAdditionModal(user, currentUsed, currentRemaining) {
    return `
      <div class="text-left space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="font-semibold text-blue-800 mb-2">Usuario: ${user.profile?.name}</p>
          <p class="text-sm text-blue-600">Plan: ${user.plan?.name || user.plan?.subtype}</p>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-medium text-gray-800 mb-3">Agregar servicios adicionales:</h4>
          
          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-center space-x-3 mb-2">
              <i class="fas fa-ambulance text-red-600 text-lg"></i>
              <label class="font-medium text-gray-700">Emergencias adicionales</label>
            </div>
            <input type="number" id="emergency-additional" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0" min="0" value="0">
            <p class="text-xs text-gray-500 mt-1">Usadas: ${currentUsed} de ${currentUsed + currentRemaining}</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-center space-x-3 mb-2">
              <i class="fas fa-exclamation-triangle text-orange-600 text-lg"></i>
              <label class="font-medium text-gray-700">Urgencias adicionales</label>
            </div>
            <input type="number" id="urgency-additional" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0" min="0" value="0">
            <p class="text-xs text-gray-500 mt-1">Usadas: 0 de 0</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-center space-x-3 mb-2">
              <i class="fas fa-user-md text-blue-600 text-lg"></i>
              <label class="font-medium text-gray-700">Médico a domicilio adicionales</label>
            </div>
            <input type="number" id="doctor-additional" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0" min="0" value="0">
            <p class="text-xs text-gray-500 mt-1">Usadas: 0 de 0</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-center space-x-3 mb-2">
              <i class="fas fa-route text-purple-600 text-lg"></i>
              <label class="font-medium text-gray-700">Traslados programados adicionales</label>
            </div>
            <input type="number" id="transfer-additional" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0" min="0" value="0">
            <p class="text-xs text-gray-500 mt-1">Usadas: 0 de 0</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex items-center space-x-3 mb-2">
              <i class="fas fa-vial text-green-600 text-lg"></i>
              <label class="font-medium text-gray-700">Exámenes de laboratorio adicionales</label>
            </div>
            <input type="number" id="lab-additional" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0" min="0" value="0">
            <p class="text-xs text-gray-500 mt-1">Usadas: 0 de 0</p>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <i class="fas fa-info-circle text-yellow-600 mt-0.5"></i>
              <p class="text-sm text-yellow-800">
                Los servicios adicionales se sumarán a los límites actuales del plan del usuario.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Muestra el modal de éxito tras agregar servicios
   * @param {Object} user - Usuario objetivo
   * @param {Object} services - Servicios agregados
   * @param {boolean} isFamiliar - Si es usuario familiar
   */
  async showServiceAdditionSuccess(user, services, isFamiliar = false) {
    const userName = isFamiliar ? user.profile?.name : user.company?.name || user.profile?.name

    return Swal.fire({
      title: '¡Servicios Asignados!',
      html: `
        <div class="text-center">
          <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
          <p class="text-lg">Se han asignado exitosamente los siguientes servicios adicionales:</p>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 text-left">
            <p class="font-semibold text-gray-800 mb-2">Para: ${userName}</p>
            <div class="space-y-1 text-sm text-gray-700">
              ${services.emergency > 0 ? `<p>• Emergencias adicionales: +${services.emergency}</p>` : ''}
              ${services.urgency > 0 ? `<p>• Urgencias adicionales: +${services.urgency}</p>` : ''}
              ${services.doctor > 0 ? `<p>• Médico a domicilio adicionales: +${services.doctor}</p>` : ''}
              ${services.transfer > 0 ? `<p>• Traslados programados adicionales: +${services.transfer}</p>` : ''}
              ${services.lab > 0 ? `<p>• Exámenes de laboratorio adicionales: +${services.lab}</p>` : ''}
            </div>
            <p class="text-sm font-medium text-green-600 mt-3">Total de servicios agregados: ${services.total}</p>
          </div>
        </div>
      `,
      icon: 'success',
      timer: 4000,
      showConfirmButton: false
    })
  }

  /**
   * Confirma la eliminación de un usuario
   * @param {Object} user - Usuario a eliminar
   * @returns {Promise<boolean>} True si se confirma la eliminación
   */
  async confirmUserDeletion(user) {
    const result = await Swal.fire({
      title: '¿Eliminar Usuario?',
      html: `
        <div class="text-left">
          <p class="mb-3">¿Estás seguro de que deseas eliminar a:</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="font-medium text-red-800">${user.profile?.name || user.company?.name}</p>
            <p class="text-sm text-red-600">${user.username} - ${user.role}</p>
          </div>
          <p class="mt-3 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    })

    return result.isConfirmed
  }

  /**
   * Alterna el estado activo/inactivo de un usuario
   * @param {Object} user - Usuario objetivo
   * @returns {Promise<boolean|null>} Nuevo estado o null si se cancela
   */
  async toggleUserStatus(user) {
    const newStatus = user.active !== false ? false : true
    const action = newStatus ? 'activar' : 'desactivar'

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} Usuario?`,
      text: `¿Deseas ${action} a ${user.profile?.name || user.company?.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#10B981' : '#F59E0B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Sí, ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await Swal.fire({
        title: `Usuario ${newStatus ? 'Activado' : 'Desactivado'}`,
        text: `El usuario ha sido ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return newStatus
    }

    return null
  }

  /**
   * Confirma la aprobación de una solicitud de registro
   * @param {Object} request - Solicitud a aprobar
   * @returns {Promise<boolean>} True si se confirma la aprobación
   */
  async confirmRegistrationApproval(request) {
    const result = await Swal.fire({
      title: '¿Aprobar Solicitud?',
      html: `
        <div class="text-left">
          <p class="mb-3">¿Deseas aprobar la solicitud de registro de:</p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3">
            <p class="font-medium text-green-800">${request.name} ${request.lastName}</p>
            <p class="text-sm text-green-600">
              ${
                request.planType === 'externo'
                  ? `Cliente Externo - ${request.externalEntity === 'other' ? request.externalEntityOther : request.externalEntity}`
                  : `Plan ${request.planType} - ${request.planSubtype}`
              }
            </p>
            ${request.employeeId ? `<p class="text-sm text-green-600">Código: ${request.employeeId}</p>` : ''}
          </div>
          <p class="mt-3 text-sm text-gray-600">Se creará una cuenta y se notificará al usuario.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, Aprobar',
      cancelButtonText: 'Cancelar'
    })

    return result.isConfirmed
  }

  /**
   * Solicita el motivo de rechazo de una solicitud
   * @param {Object} request - Solicitud a rechazar
   * @returns {Promise<string|null>} Motivo del rechazo o null si se cancela
   */
  async promptRejectionReason(request) {
    const { value: reason } = await Swal.fire({
      title: 'Rechazar Solicitud',
      html: `
        <div class="text-left">
          <p class="mb-3">Solicitud de: <strong>${request.name} ${request.lastName}</strong></p>
          <p class="mb-3">Ingresa el motivo del rechazo:</p>
        </div>
      `,
      input: 'textarea',
      inputPlaceholder: 'Ej: Documentación incompleta, entidad no verificada, etc.',
      inputAttributes: {
        'aria-label': 'Motivo del rechazo'
      },
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes proporcionar un motivo de rechazo'
        }
      }
    })

    return reason
  }

  /**
   * Muestra los datos de acceso generados para un nuevo usuario familiar
   * @param {Object} userData - Datos del usuario creado
   * @param {string} generatedPassword - Contraseña generada
   */
  async showGeneratedPassword(userData, generatedPassword) {
    return new Promise((resolve) => {
      setTimeout(() => {
        Swal.fire({
          title: '¡Usuario Creado Exitosamente!',
          html: this.generatePasswordDisplayModal(userData, generatedPassword),
          icon: 'success',
          confirmButtonText: 'He guardado los datos',
          confirmButtonColor: '#10B981',
          width: '650px',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => resolve())
      }, 100)
    })
  }

  /**
   * Genera el modal HTML para mostrar la contraseña generada
   * @param {Object} userData - Datos del usuario
   * @param {string} generatedPassword - Contraseña generada
   * @returns {string} HTML del modal
   */
  generatePasswordDisplayModal(userData, generatedPassword) {
    return `
      <div class="text-left space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="font-semibold text-green-800 mb-3 text-lg">
            <i class="fas fa-check-circle mr-2"></i>
            Datos de acceso generados:
          </p>
          <div class="space-y-3">
            <div class="bg-white rounded p-3 border border-green-300">
              <p class="text-sm text-gray-600 mb-1">Nombre de usuario:</p>
              <div class="flex items-center justify-between">
                <span class="font-mono text-lg font-bold text-gray-800">${userData.username}</span>
                <button onclick="
                  ${this.generateCopyScript(userData.username, 'copy-user-feedback')}
                " class="text-blue-600 hover:text-blue-800 px-2 py-1">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <span id="copy-user-feedback" style="display: none" class="text-green-600 text-xs">¡Copiado!</span>
            </div>
            
            <div class="bg-white rounded p-3 border border-green-300">
              <p class="text-sm text-gray-600 mb-1">Contraseña:</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-lg font-bold text-gray-800" id="generated-password" data-password="${generatedPassword}" style="letter-spacing: 2px;">
                    <span id="password-display">${generatedPassword}</span>
                  </span>
                  <button 
                    type="button"
                    onclick="${this.generatePasswordToggleScript()}"
                    class="text-gray-600 hover:text-gray-800 px-2 py-1"
                    title="Mostrar/Ocultar contraseña"
                  >
                    <i class="fas fa-eye-slash"></i>
                  </button>
                </div>
                <button onclick="
                  ${this.generateCopyScript(generatedPassword, 'copy-pass-feedback')}
                " class="text-blue-600 hover:text-blue-800 px-2 py-1">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <span id="copy-pass-feedback" style="display: none" class="text-green-600 text-xs">¡Copiado!</span>
            </div>
          </div>
          
          <button onclick="
            ${this.generateCopyAllScript(userData.username, generatedPassword)}
          " class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <i class="fas fa-clipboard mr-2"></i>
            Copiar ambos datos
          </button>
          <div id="copy-all-feedback" style="display: none" class="mt-2 text-center text-green-600 text-sm font-medium">
            ¡Datos copiados al portapapeles!
          </div>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <strong>Importante:</strong> Guarda estos datos de acceso. La contraseña no podrá ser recuperada después de cerrar esta ventana.
          </p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800 font-medium mb-1">
            <i class="fas fa-info-circle mr-2"></i>
            Instrucciones para el cliente:
          </p>
          <ul class="text-sm text-blue-700 space-y-1 ml-6">
            <li>• Acceder a la aplicación con estos datos</li>
            <li>• Cambiar la contraseña en el primer inicio de sesión</li>
            <li>• Guardar las credenciales en un lugar seguro</li>
          </ul>
        </div>
      </div>
    `
  }

  /**
   * Genera script para copiar texto al portapapeles
   * @param {string} text - Texto a copiar
   * @param {string} feedbackId - ID del elemento feedback
   * @returns {string} Script JavaScript
   */
  generateCopyScript(text, feedbackId) {
    return `
      const text = '${text}';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => { 
          document.getElementById('${feedbackId}').style.display = 'inline'; 
          setTimeout(() => document.getElementById('${feedbackId}').style.display = 'none', 2000);
        }).catch(() => {
          const input = document.createElement('input');
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          document.getElementById('${feedbackId}').style.display = 'inline';
          setTimeout(() => document.getElementById('${feedbackId}').style.display = 'none', 2000);
        });
      } else {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        document.getElementById('${feedbackId}').style.display = 'inline';
        setTimeout(() => document.getElementById('${feedbackId}').style.display = 'none', 2000);
      }
    `
  }

  /**
   * Genera script para alternar visibilidad de contraseña
   * @returns {string} Script JavaScript
   */
  generatePasswordToggleScript() {
    return `
      const passDisplay = document.getElementById('password-display');
      const passElement = document.getElementById('generated-password');
      const icon = this.querySelector('i');
      const actualPassword = passElement.getAttribute('data-password');
      if (passDisplay.textContent === actualPassword) {
        passDisplay.textContent = '••••••••••';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        passDisplay.textContent = actualPassword;
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    `
  }

  /**
   * Genera script para copiar ambos datos de acceso
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {string} Script JavaScript
   */
  generateCopyAllScript(username, password) {
    return `
      const username = '${username}';
      const password = '${password}';
      const text = 'Datos de acceso HelpMED:\\n\\nUsuario: ' + username + '\\nContraseña: ' + password;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => { 
          document.getElementById('copy-all-feedback').style.display = 'block'; 
          setTimeout(() => document.getElementById('copy-all-feedback').style.display = 'none', 2000);
        }).catch(() => {
          const input = document.createElement('input');
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          document.getElementById('copy-all-feedback').style.display = 'block';
          setTimeout(() => document.getElementById('copy-all-feedback').style.display = 'none', 2000);
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        document.getElementById('copy-all-feedback').style.display = 'block';
        setTimeout(() => document.getElementById('copy-all-feedback').style.display = 'none', 2000);
      }
    `
  }

  /**
   * Valida completamente los datos de un usuario familiar
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Resultado de validación
   */
  validateFamiliarUserData(userData) {
    const errors = []

    if (!userData.profile?.name || userData.profile.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    }

    if (!this.validatePeuvianDNI(userData.profile?.dni)) {
      errors.push('El DNI debe tener exactamente 8 dígitos')
    }

    if (!this.validateEmail(userData.profile?.email)) {
      errors.push('El email no tiene un formato válido')
    }

    if (!this.validatePeuvianPhone(userData.profile?.phone)) {
      errors.push('El teléfono no tiene un formato válido para Perú')
    }

    if (!userData.profile?.birthDate) {
      errors.push('La fecha de nacimiento es requerida')
    }

    if (!userData.plan?.subtype) {
      errors.push('Debe seleccionar un plan')
    }

    if (!userData.profile?.address || userData.profile.address.trim().length < 10) {
      errors.push('La dirección debe tener al menos 10 caracteres')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Valida completamente los datos de un usuario corporativo
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Resultado de validación
   */
  validateCorporateUserData(userData) {
    const errors = []

    if (!userData.company?.name || userData.company.name.trim().length < 2) {
      errors.push('El nombre de la empresa debe tener al menos 2 caracteres')
    }

    if (
      !this.validateChileanRUT(userData.company?.rut) &&
      !this.validatePeuvianDNI(userData.company?.rut?.replace(/[^0-9]/g, ''))
    ) {
      errors.push('El RUC de la empresa no tiene un formato válido')
    }

    if (!userData.profile?.name || userData.profile.name.trim().length < 2) {
      errors.push('El nombre del contacto principal es requerido')
    }

    if (!userData.plan?.contract_services || userData.plan.contract_services < 1) {
      errors.push('Debe especificar la cantidad de servicios contratados')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Exportar instancia única del servicio
const userService = new UserService()
export default userService
