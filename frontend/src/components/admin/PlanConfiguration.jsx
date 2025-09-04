import React, { useState } from 'react'
import Swal from 'sweetalert2'
import AdditionalPricingModal from './planconfig/AdditionalPricingModal'

const PlanConfiguration = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingData, setPricingData] = useState(null)
  
  const familiarPlans = [
    {
      id: 'help',
      name: 'Plan Help',
      description: 'Plan básico de emergencias médicas',
      price: 650,
      priceYear: 650,
      characteristics: 5,
      activated: '2024-01-15',
      status: 'Activo',
      limits: {
        emergencias: 'ILIMITADO',
        medicosDom: 8,
        urgencias: 'ILIMITADO',
        traslados: 0
      }
    },
    {
      id: 'basico',
      name: 'Plan Básico',
      description: 'Plan familiar con servicios esenciales',
      price: 1500,
      priceYear: 1500,
      priceMonth: 125,
      characteristics: 2,
      activated: '2024-01-10',
      status: 'Activo',
      limits: {
        emergencias: 'ILIMITADO',
        medicosDom: 2,
        urgencias: 3,
        traslados: 1
      }
    },
    {
      id: 'vip',
      name: 'Plan VIP',
      description: 'Plan premium con beneficios adicionales',
      price: 2800,
      priceYear: 2800,
      priceMonth: 233,
      characteristics: 4,
      activated: '2024-01-12',
      status: 'Activo',
      limits: {
        emergencias: 'ILIMITADO',
        medicosDom: 4,
        urgencias: 6,
        traslados: 3
      }
    },
    {
      id: 'dorado',
      name: 'Plan Dorado',
      description: 'Plan de lujo con todos los beneficios',
      price: 4100,
      priceYear: 4100,
      priceMonth: 342,
      characteristics: 5,
      activated: '2024-01-08',
      status: 'Activo',
      limits: {
        emergencias: 'ILIMITADO',
        medicosDom: 8,
        urgencias: 10,
        traslados: 4
      }
    }
  ]

  const handleEditPlan = (plan) => {
    Swal.fire({
      title: `Editar ${plan.name}`,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
            <input class="w-full px-3 py-2 border rounded-lg" value="${plan.name}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Anual</label>
            <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.price}">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Emergencias</label>
              <input class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.emergencias}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Médico Dom.</label>
              <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.medicosDom}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Urgencias</label>
              <input class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.urgencias}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Traslados</label>
              <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.traslados}">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6'
    })
  }

  const handlePausePlan = (plan) => {
    Swal.fire({
      title: '¿Pausar plan?',
      text: `¿Deseas pausar el ${plan.name}? Los usuarios no podrán suscribirse mientras esté pausado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, pausar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#eab308'
    })
  }

  const handleDeletePlan = (plan) => {
    Swal.fire({
      title: '¿Eliminar plan?',
      text: `¿Estás seguro de eliminar el ${plan.name}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    })
  }

  const handleAddPlan = () => {
    Swal.fire({
      title: 'Agregar Nuevo Plan',
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Plan</label>
            <select class="w-full px-3 py-2 border rounded-lg">
              <option value="familiar">Familiar</option>
              <option value="corporativo">Corporativo</option>
              <option value="externo">Externo</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
            <input class="w-full px-3 py-2 border rounded-lg" placeholder="Ej: Plan Premium">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="Descripción del plan"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Anual (S/)</label>
            <input type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="0.00">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Plan',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      width: '500px'
    })
  }

  const handleExport = () => {
    Swal.fire({
      icon: 'success',
      title: 'Exportando',
      text: 'Los planes se están exportando a Excel...',
      timer: 2000,
      showConfirmButton: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configuración de Planes</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPricingModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-dollar-sign"></i>
              Precios Adicionales
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-file-export"></i>
              Exportar
            </button>
            <button 
              onClick={handleAddPlan}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Nuevo Plan
            </button>
          </div>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600 mt-1">Total Planes</div>
            <i className="fas fa-list text-blue-400 text-xl mt-2"></i>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600 mt-1">Familiares</div>
            <i className="fas fa-users text-green-400 text-xl mt-2"></i>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">2</div>
            <div className="text-sm text-gray-600 mt-1">Corporativos</div>
            <i className="fas fa-building text-purple-400 text-xl mt-2"></i>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600 mt-1">Externos</div>
            <i className="fas fa-handshake text-orange-400 text-xl mt-2"></i>
          </div>
        </div>
      </div>

      {/* Planes Familiares */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Planes Familiares (4)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fila 1 */}
          <div className="space-y-6">
            {/* Plan Help */}
            <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Plan Help</h4>
                  <p className="text-sm text-gray-500">Plan básico de emergencias médicas</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Activo
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Precio:</div>
                <div className="text-2xl font-bold text-blue-600">S/ 650/año</div>
                <div className="text-xs text-gray-500">S/ 54/mes</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Características:</div>
                  <div className="text-lg font-semibold">5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Actualizado:</div>
                  <div className="text-sm">2024-01-15</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Límites Principales:</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Emergencias:</span>
                    <span className="font-semibold ml-1">ILIMITADO</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Urgencias:</span>
                    <span className="font-semibold ml-1">ILIMITADO</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Médico Dom:</span>
                    <span className="font-semibold ml-1">8</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Traslados:</span>
                    <span className="font-semibold ml-1">0</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan(familiarPlans[0])}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-edit"></i>
                  Editar
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[0])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  Pausar
                </button>
                <button
                  onClick={() => handleDeletePlan(familiarPlans[0])}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* Plan Dorado */}
            <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Plan Dorado</h4>
                  <p className="text-sm text-gray-500">Plan de lujo con todos los beneficios</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Activo
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Precio:</div>
                <div className="text-2xl font-bold text-blue-600">S/ 4100/año</div>
                <div className="text-xs text-gray-500">S/ 342/mes</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Características:</div>
                  <div className="text-lg font-semibold">5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Actualizado:</div>
                  <div className="text-sm">2024-01-08</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Límites Principales:</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Emergencias:</span>
                    <span className="font-semibold ml-1">ILIMITADO</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Urgencias:</span>
                    <span className="font-semibold ml-1">10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Médico Dom:</span>
                    <span className="font-semibold ml-1">8</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Traslados:</span>
                    <span className="font-semibold ml-1">4</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan(familiarPlans[3])}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-edit"></i>
                  Editar
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[3])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  Pausar
                </button>
                <button
                  onClick={() => handleDeletePlan(familiarPlans[3])}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="space-y-6">
            {/* Plan Básico */}
            <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Plan Básico</h4>
                  <p className="text-sm text-gray-500">Plan familiar con servicios esenciales</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Activo
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Precio:</div>
                <div className="text-2xl font-bold text-blue-600">S/ 1500/año</div>
                <div className="text-xs text-gray-500">S/ 125/mes</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Características:</div>
                  <div className="text-lg font-semibold">2</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Actualizado:</div>
                  <div className="text-sm">2024-01-10</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Límites Principales:</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Emergencias:</span>
                    <span className="font-semibold ml-1">ILIMITADO</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Urgencias:</span>
                    <span className="font-semibold ml-1">3</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Médico Dom:</span>
                    <span className="font-semibold ml-1">2</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Traslados:</span>
                    <span className="font-semibold ml-1">1</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan(familiarPlans[1])}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-edit"></i>
                  Editar
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[1])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  Pausar
                </button>
                <button
                  onClick={() => handleDeletePlan(familiarPlans[1])}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* Plan VIP */}
            <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Plan VIP</h4>
                  <p className="text-sm text-gray-500">Plan premium con beneficios adicionales</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Activo
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Precio:</div>
                <div className="text-2xl font-bold text-blue-600">S/ 2800/año</div>
                <div className="text-xs text-gray-500">S/ 233/mes</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Características:</div>
                  <div className="text-lg font-semibold">4</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Actualizado:</div>
                  <div className="text-sm">2024-01-12</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Límites Principales:</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Emergencias:</span>
                    <span className="font-semibold ml-1">ILIMITADO</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Urgencias:</span>
                    <span className="font-semibold ml-1">6</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Médico Dom:</span>
                    <span className="font-semibold ml-1">4</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Traslados:</span>
                    <span className="font-semibold ml-1">3</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan(familiarPlans[2])}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-edit"></i>
                  Editar
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[2])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  Pausar
                </button>
                <button
                  onClick={() => handleDeletePlan(familiarPlans[2])}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Precios Adicionales */}
      <AdditionalPricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onSave={(data) => {
          setPricingData(data)
          console.log('Datos de precios guardados:', data)
          Swal.fire({
            icon: 'success',
            title: 'Configuración guardada',
            text: 'Los precios adicionales han sido actualizados correctamente',
            timer: 2000,
            showConfirmButton: false
          })
        }}
        initialData={pricingData}
      />
    </div>
  )
}

export default PlanConfiguration