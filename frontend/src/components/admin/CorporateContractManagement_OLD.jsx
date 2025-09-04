import React, { useState } from 'react'
import useAppStore from '../../stores/useAppStore'
import Swal from 'sweetalert2'

const CorporateContractManagement = () => {
  const { allUsers, addCorporateContract, addExtraServices, consumeServices } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const corporateUsers = allUsers.corporativo || []

  // Validación de duplicados
  const checkDuplicateRUT = (rut) => {
    return corporateUsers.some((user) => user.company.rut === rut)
  }

  const checkDuplicateEmail = (email) => {
    return corporateUsers.some((user) => user.profile.email.toLowerCase() === email.toLowerCase())
  }

  const checkDuplicateCompanyName = (name) => {
    return corporateUsers.some(
      (user) => user.company.name.toLowerCase().trim() === name.toLowerCase().trim()
    )
  }

  const filteredContracts = corporateUsers.filter((user) => {
    const matchesSearch =
      user.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.rut.includes(searchTerm)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && new Date(user.plan.renewal_date) > new Date()) ||
      (filter === 'expiring' &&
        new Date(user.plan.renewal_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesFilter
  })

  const handleViewContract = (contract) => {
    const renewalDate = new Date(contract.plan.renewal_date)
    const startDate = new Date(contract.plan.start_date)
    const isExpiring = renewalDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    Swal.fire({
      title: `Contrato: ${contract.company.name}`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-bold text-gray-800 mb-2">Información del Contrato</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div><strong>ID Contrato:</strong> ${contract.plan.contract_id}</div>
              <div><strong>Plan:</strong> ${contract.plan.name}</div>
              <div><strong>Servicios:</strong> ${contract.plan.contract_services}</div>
              <div><strong>Inicio:</strong> ${startDate.toLocaleDateString('es-CL')}</div>
              <div><strong>Renovación:</strong> ${renewalDate.toLocaleDateString('es-CL')}</div>
              <div><strong>Costo Mensual:</strong> S/ ${contract.billing.monthly_cost.toLocaleString()}</div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-bold text-gray-800 mb-2">Información de la Empresa</h4>
            <div class="text-sm space-y-1">
              <div><strong>Empresa:</strong> ${contract.company.name}</div>
              <div><strong>RUC:</strong> ${contract.company.rut}</div>
              <div><strong>Industria:</strong> ${contract.company.industry}</div>
              <div><strong>Contacto:</strong> ${contract.company.contact_person.name} (${contract.company.contact_person.position})</div>
            </div>
          </div>

          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-bold text-gray-800 mb-2">Uso de Servicios</h4>
            <div class="text-sm space-y-1">
              <div><strong>Servicios Usados:</strong> ${contract.service_usage.current_period.used_services}</div>
              <div><strong>Servicios Restantes:</strong> ${contract.service_usage.current_period.remaining_services}</div>
              <div><strong>Porcentaje de Uso:</strong> ${contract.service_usage.current_period.usage_percentage}%</div>
            </div>
          </div>

          ${
            isExpiring
              ? `
            <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 class="font-bold text-red-800 mb-2">⚠️ Contrato por Vencer</h4>
              <p class="text-red-700 text-sm">Este contrato vence el ${renewalDate.toLocaleDateString('es-CL')}. Contacte al cliente para renovación.</p>
            </div>
          `
              : ''
          }
        </div>
      `,
      width: 600,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Editar Contrato',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#3B82F6'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowAddForm(true)
        // Aquí se podría implementar la edición del contrato
      }
    })
  }

  const handleRenewContract = (contract) => {
    Swal.fire({
      title: '¿Renovar Contrato?',
      text: `¿Está seguro que desea renovar el contrato de ${contract.company.name} por un año más?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Renovar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10B981'
    }).then((result) => {
      if (result.isConfirmed) {
        const newRenewalDate = new Date(contract.plan.renewal_date)
        newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1)

        Swal.fire({
          title: '¡Contrato Renovado!',
          text: `El contrato se ha renovado hasta ${newRenewalDate.toLocaleDateString('es-CL')}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const getContractStatus = (contract) => {
    const renewalDate = new Date(contract.plan.renewal_date)
    const now = new Date()
    const daysUntilRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24))

    if (daysUntilRenewal < 0) {
      return { status: 'expired', color: 'red', text: 'Vencido' }
    } else if (daysUntilRenewal <= 30) {
      return { status: 'expiring', color: 'orange', text: `${daysUntilRenewal} días` }
    } else {
      return { status: 'active', color: 'green', text: 'Activo' }
    }
  }

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-green-600'
  }

  const handleManageServices = (contract, action = 'default') => {
    if (action === 'consume') {
      // Funcionalidad para registrar servicios consumidos
      const serviceUsage = contract.service_usage?.current_period
      const currentUsed = serviceUsage?.used_services || 0
      const currentRemaining = serviceUsage?.remaining_services || 0
      const totalLimit = currentUsed + currentRemaining

      Swal.fire({
        title: 'Registrar Servicios Consumidos',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="font-semibold text-blue-800 mb-2">Empresa: ${contract.company?.name}</p>
              <p class="text-sm text-blue-600">Plan: ${contract.plan?.name}</p>
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
        `,
        showCancelButton: true,
        confirmButtonText: 'Registrar Consumo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#DC2626',
        preConfirm: () => {
          const extraServices =
            parseInt(document.getElementById('extra-emergency-services').value) || 0

          if (extraServices <= 0) {
            Swal.showValidationMessage('Debe registrar al menos 1 servicio consumido')
            return false
          }

          return { extraServices }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { extraServices } = result.value

          Swal.fire({
            title: '¡Servicios Registrados!',
            html: `
              <div class="text-center">
                <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
                <p class="text-lg">Se han registrado exitosamente:</p>
                <p class="font-bold text-2xl text-blue-600 mt-2">${extraServices} servicio${extraServices > 1 ? 's' : ''} consumido${extraServices > 1 ? 's' : ''}</p>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <p class="text-sm text-gray-700">Para: ${contract.company?.name}</p>
                  <p class="text-sm text-gray-700">Servicios utilizados actualizados</p>
                  <p class="text-xs text-gray-500 mt-2">El contador de uso se ha incrementado</p>
                </div>
              </div>
            `,
            icon: 'success',
            timer: 4000,
            showConfirmButton: false
          })

          // Actualizar el store con los servicios consumidos
          consumeServices(contract.id, 'corporativo', extraServices)
        }
      })
    } else if (action === 'add') {
      // Funcionalidad para gestionar servicios adicionales
      const serviceUsage = contract.service_usage?.current_period
      const currentUsed = serviceUsage?.used_services || 0
      const currentRemaining = serviceUsage?.remaining_services || 0

      Swal.fire({
        title: 'Gestionar Servicios Adicionales',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="font-semibold text-blue-800 mb-2">Usuario: ${contract.company?.name}</p>
              <p class="text-sm text-blue-600">Plan: ${contract.plan?.name || 'Área Protegida'}</p>
            </div>
            
            <div class="space-y-4">
              <h4 class="font-medium text-gray-800 mb-3">Agregar servicios adicionales:</h4>
              
              <!-- Emergencias adicionales -->
              <div class="bg-white border border-gray-200 rounded-lg p-3">
                <div class="flex items-center space-x-3 mb-2">
                  <i class="fas fa-ambulance text-red-600 text-lg"></i>
                  <label class="font-medium text-gray-700">Emergencias adicionales</label>
                </div>
                <input type="number" id="emergency-additional" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0" min="0" value="0">
                <p class="text-xs text-gray-500 mt-1">Ya tiene emergencias ilimitadas</p>
              </div>
              
              <!-- Urgencias adicionales -->
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
              
              <!-- Médico a domicilio adicionales -->
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
              
              <!-- Traslados programados adicionales -->
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
              
              <!-- Exámenes de laboratorio adicionales -->
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
              
              <!-- Aviso importante -->
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
        `,
        showCancelButton: true,
        confirmButtonText: 'Asignar Servicios',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        width: '600px',
        preConfirm: () => {
          // Para corporativos solo emergencias
          const emergencyServices =
            parseInt(document.getElementById('emergency-additional')?.value) || 0

          if (emergencyServices <= 0) {
            Swal.showValidationMessage('Debe asignar al menos 1 servicio de emergencia adicional')
            return false
          }

          return {
            emergency: emergencyServices,
            urgency: 0,
            doctor: 0,
            transfer: 0,
            lab: 0,
            total: emergencyServices
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const services = result.value

          Swal.fire({
            title: '¡Servicios Asignados!',
            html: `
              <div class="text-center">
                <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
                <p class="text-lg">Se han asignado exitosamente los siguientes servicios adicionales:</p>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 text-left">
                  <p class="font-semibold text-gray-800 mb-2">Para: ${contract.company?.name}</p>
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

          // Actualizar el store con los nuevos servicios adicionales
          addExtraServices(contract.id, 'corporativo', services)
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Contratos Corporativos</h2>
            <p className="text-gray-600">Administra contratos de área protegida para empresas</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mt-4 md:mt-0"
          >
            <i className="fas fa-plus"></i>
            <span>Subir Contrato PDF</span>
          </button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Buscar por empresa, contacto o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Todos los Contratos</option>
            <option value="active">Contratos Activos</option>
            <option value="expiring">Por Vencer (30 días)</option>
          </select>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{corporateUsers.length}</div>
            <div className="text-sm text-blue-700">Total Contratos</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {corporateUsers.filter((u) => new Date(u.plan.renewal_date) > new Date()).length}
            </div>
            <div className="text-sm text-green-700">Contratos Activos</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                corporateUsers.filter((u) => {
                  const days = Math.ceil(
                    (new Date(u.plan.renewal_date) - new Date()) / (1000 * 60 * 60 * 24)
                  )
                  return days <= 30 && days >= 0
                }).length
              }
            </div>
            <div className="text-sm text-orange-700">Por Vencer</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              S/{' '}
              {corporateUsers
                .reduce((sum, u) => sum + (u.billing?.monthly_cost || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-purple-700">Ingresos Mensuales</div>
          </div>
        </div>
      </div>

      {/* Lista de Contratos */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Contratos Corporativos ({filteredContracts.length})
          </h3>
        </div>

        {filteredContracts.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-file-contract text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay contratos</h3>
            <p className="text-gray-600">No se encontraron contratos con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContracts.map((contract) => {
              const contractStatus = getContractStatus(contract)
              const usagePercentage = contract.service_usage.current_period.usage_percentage

              return (
                <React.Fragment key={contract.id}>
                  {/* Vista Desktop */}
                  <div className="hidden sm:block p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {contract.company.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              contractStatus.color === 'red'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : contractStatus.color === 'orange'
                                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                            }`}
                          >
                            {contractStatus.text}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {contract.company.industry}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Contacto:</strong> {contract.company.contact_person.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>RUC:</strong> {contract.company.rut}
                            </p>
                          </div>
                          <div></div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Uso:</strong>
                              <span
                                className={`ml-1 font-medium ${getUsageColor(usagePercentage)}`}
                              >
                                {contract.service_usage.current_period.used_services}/
                                {contract.plan.contract_services} ({usagePercentage}%)
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Renovación:</strong>{' '}
                              {new Date(contract.plan.renewal_date).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Costo Mensual:</strong> S/ $
                              {contract.billing.monthly_cost.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>ID:</strong> {contract.plan.contract_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Teléfono: {contract.company.contact_person.phone} • Email:{' '}
                            {contract.company.contact_person.email}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewContract(contract)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                            >
                              <i className="fas fa-eye"></i>
                              <span>Ver Detalle</span>
                            </button>
                            {contractStatus.status === 'expiring' && (
                              <button
                                onClick={() => handleRenewContract(contract)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                              >
                                <i className="fas fa-sync-alt"></i>
                                <span>Renovar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vista Mobile - Sin desbordamiento */}
                  <div
                    key={`${contract.id}-mobile`}
                    className="block sm:hidden bg-white border border-gray-200 rounded-lg shadow-sm mx-2 mb-3 max-w-full overflow-hidden"
                  >
                    <div className="p-3">
                      {/* Header con badges */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                              {contract.company.name}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {contract.company.contact_person.name}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contractStatus.color === 'red'
                                  ? 'bg-red-100 text-red-700'
                                  : contractStatus.color === 'orange'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {contractStatus.text}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {contract.company.industry}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información compacta */}
                      <div className="space-y-2 mt-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">RUC:</span>
                            <p className="font-medium text-gray-900">{contract.company.rut}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Uso:</span>
                            <span className={`font-semibold ${getUsageColor(usagePercentage)}`}>
                              {usagePercentage}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Costo:</span>
                            <p className="font-bold text-green-600">
                              S/ ${contract.billing.monthly_cost.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Renovación:</span>
                            <p className="font-medium text-gray-900">
                              {new Date(contract.plan.renewal_date).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-500">ID:</span>
                          <p className="font-mono text-gray-700 text-xs">
                            {contract.plan.contract_id}
                          </p>
                        </div>

                        <div>
                          <span className="text-gray-500">Tel:</span>
                          <a
                            href={`tel:${contract.company.contact_person.phone}`}
                            className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
                          >
                            {contract.company.contact_person.phone}
                          </a>
                        </div>

                        <div>
                          <span className="text-gray-500">Email:</span>
                          <a
                            href={`mailto:${contract.company.contact_person.email}`}
                            className="text-blue-600 hover:text-blue-800 ml-1 font-medium break-all text-xs"
                          >
                            {contract.company.contact_person.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Acciones - NO desbordamiento */}
                    <div className="bg-gray-50 border-t border-gray-200 p-2">
                      <div className="space-y-2">
                        <button
                          onClick={() => handleViewContract(contract)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
                        >
                          Ver Detalle
                        </button>

                        {contractStatus.status === 'expiring' && (
                          <button
                            onClick={() => handleRenewContract(contract)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium"
                          >
                            Renovar Contrato
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Nuevo Contrato */}
      {showAddForm && (
        <AddContractModal
          onClose={() => setShowAddForm(false)}
          isLoading={isLoading}
          corporateUsers={corporateUsers}
          onSave={(contractData) => {
            console.log('Contrato subido:', contractData)
            setShowAddForm(false)
            Swal.fire({
              title: '¡Contrato Subido!',
              text: 'El contrato PDF ha sido subido exitosamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
          }}
        />
      )}
    </div>
  )
}

const AddContractModal = ({ onClose, onSave, isLoading: parentIsLoading, corporateUsers }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    contractFile: null
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Validar que se seleccione un cliente
    if (!formData.clientId) {
      newErrors.clientId = 'Debe seleccionar un cliente corporativo'
    }

    // Validar que se suba un archivo PDF
    if (!formData.contractFile) {
      newErrors.contractFile = 'Debe subir un archivo PDF del contrato'
    } else {
      if (formData.contractFile.type !== 'application/pdf') {
        newErrors.contractFile = 'Solo se permiten archivos PDF'
      } else if (formData.contractFile.size > 10 * 1024 * 1024) {
        // 10MB
        newErrors.contractFile = 'El archivo no puede exceder 10MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    try {
      if (!validateForm()) {
        setIsLoading(false)
        return
      }

      const selectedClient = corporateUsers.find((user) => user.id === formData.clientId)

      const contractData = {
        clientId: formData.clientId,
        clientName: selectedClient?.company.name,
        contractFile: formData.contractFile,
        uploadDate: new Date().toISOString()
      }

      // Simular procesamiento (en producción sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSave(contractData)
    } catch (error) {
      console.error('Error al subir contrato:', error)
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al subir el contrato. Por favor, inténtelo nuevamente.',
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar errores cuando se hace un cambio
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Subir Contrato PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleccionar Cliente Corporativo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Cliente</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente Corporativo *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.clientId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cliente...</option>
                {corporateUsers.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company.name} - {client.company.rut}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-red-600 text-sm mt-1">{errors.clientId}</p>}
            </div>
          </div>

          {/* Subir Contrato PDF */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Documento del Contrato</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contrato PDF *</label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  errors.contractFile
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleChange('contractFile', e.target.files[0])}
                  className="hidden"
                  id="contractFile"
                />
                <label htmlFor="contractFile" className="cursor-pointer">
                  {formData.contractFile ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-file-pdf text-red-500 text-3xl"></i>
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{formData.contractFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(formData.contractFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          handleChange('contractFile', null)
                        }}
                        className="text-red-500 hover:text-red-700 text-sm underline"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl"></i>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Arrastra y suelta tu archivo PDF aquí
                        </p>
                        <p className="text-gray-500">o haz clic para seleccionar</p>
                      </div>
                      <p className="text-sm text-gray-400">Solo archivos PDF, máximo 10MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.contractFile && (
                <p className="text-red-600 text-sm mt-1">{errors.contractFile}</p>
              )}
            </div>
          </div>

          {/* Información del Cliente Seleccionado */}
          {formData.clientId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Cliente Seleccionado</h4>
              {(() => {
                const client = corporateUsers.find((c) => c.id === formData.clientId)
                return client ? (
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>Empresa:</strong> {client.company.name}
                    </p>
                    <p>
                      <strong>RUC:</strong> {client.company.rut}
                    </p>
                    <p>
                      <strong>Contacto:</strong> {client.company.contact_person.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {client.company.contact_person.email}
                    </p>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* Resumen de Validación */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <h4 className="text-red-800 font-semibold">Errores de Validación</h4>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isLoading || Object.keys(errors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{isLoading ? 'Subiendo Contrato...' : 'Subir Contrato'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CorporateContractManagement
