import React, { useState } from 'react'
import Swal from 'sweetalert2'

const PlanConfigurationNew = () => {
  const [plans] = useState({
    familiar: [
      {
        id: 'help',
        name: 'Plan Help',
        description: 'Plan básico de emergencias médicas',
        price: 650,
        characteristics: 2,
        activated: '2024-01-15',
        status: 'Activo',
        limits: {
          emergencias: 'ILIMITADO',
          medicosDom: 8,
          urgencias: 'ILIMITADO',
          traslados: 6
        }
      },
      {
        id: 'basico',
        name: 'Plan Básico',
        description: 'Plan familiar con servicios esenciales',
        price: 1500,
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
        characteristics: 4,
        activated: '2024-01-12',
        status: 'Activo',
        limits: {
          emergencias: 'ILIMITADO',
          medicosDom: 4,
          urgencias: 5,
          traslados: 3
        }
      },
      {
        id: 'dorado',
        name: 'Plan Dorado',
        description: 'Plan de lujo con todos los beneficios',
        price: 4100,
        characteristics: 5,
        activated: '2024-01-08',
        status: 'Activo',
        limits: {
          emergencias: 'ILIMITADO',
          medicosDom: 6,
          urgencias: 10,
          traslados: 4
        }
      }
    ],
    corporativo: [],
    externo: []
  })

  const handleAddPlan = () => {
    Swal.fire({
      title: 'Agregar Nuevo Plan',
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
            <input id="plan-name" class="w-full px-3 py-2 border rounded-lg" placeholder="Ej: Plan Premium">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea id="plan-desc" class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="Descripción del plan"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Mensual (S/)</label>
            <input id="plan-price" type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="0.00">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Plan</label>
            <select id="plan-type" class="w-full px-3 py-2 border rounded-lg">
              <option value="familiar">Familiar</option>
              <option value="corporativo">Corporativo</option>
              <option value="externo">Externo</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Plan',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
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

  const handleEditPlan = (plan) => {
    Swal.fire({
      title: `Editar ${plan.name}`,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
            <input id="plan-name" class="w-full px-3 py-2 border rounded-lg" value="${plan.name}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Mensual (S/)</label>
            <input id="plan-price" type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.price}">
          </div>
          <div class="border-t pt-3">
            <h4 class="font-medium text-gray-700 mb-2">Límites del Plan</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600">Emergencias</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.emergencias}">
              </div>
              <div>
                <label class="text-xs text-gray-600">Médico Dom.</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.medicosDom}">
              </div>
              <div>
                <label class="text-xs text-gray-600">Urgencias</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.urgencias}">
              </div>
              <div>
                <label class="text-xs text-gray-600">Traslados</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.traslados}">
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      width: '500px'
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
      confirmButtonColor: '#ef4444'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Configuración de Planes</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddPlan}
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

        {/* Contadores de planes */}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Planes Familiares ({plans.familiar.length})
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            <i className="fas fa-users mr-1"></i>
            Planes Familiares
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.familiar.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{plan.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {plan.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-bold text-lg text-gray-900">
                    S/ {plan.price.toLocaleString()}/año
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  S/ {Math.round(plan.price/12)}/mes
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-600">Características:</span>
                  <span className="font-medium">{plan.characteristics}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Actualizado:</span>
                  <span className="text-gray-700">{plan.activated}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Límites Principales:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergencias:</span>
                      <span className="font-medium">{plan.limits.emergencias}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgencias:</span>
                      <span className="font-medium">{plan.limits.urgencias}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Médico Dom:</span>
                      <span className="font-medium">{plan.limits.medicosDom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Traslados:</span>
                      <span className="font-medium">{plan.limits.traslados}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-edit text-xs"></i>
                  Editar
                </button>
                <button
                  onClick={() => handlePausePlan(plan)}
                  className="flex-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause text-xs"></i>
                  Pausar
                </button>
                <button
                  onClick={() => handleDeletePlan(plan)}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanConfigurationNew