import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { LABELS } from '../../config/labels'

const PlanConfigurationNew = () => {
  const labels = LABELS.admin.planConfiguration
  const [plans] = useState({
    familiar: [
      {
        id: 'help',
        name: labels.plans.help.name,
        description: labels.plans.help.description,
        price: 650,
        characteristics: 2,
        activated: '2024-01-15',
        status: labels.status.active,
        limits: {
          emergencias: labels.values.unlimited,
          medicosDom: 8,
          urgencias: labels.values.unlimited,
          traslados: 6
        }
      },
      {
        id: 'basico',
        name: labels.plans.basic.name,
        description: labels.plans.basic.description,
        price: 1500,
        characteristics: 2,
        activated: '2024-01-10',
        status: labels.status.active,
        limits: {
          emergencias: labels.values.unlimited,
          medicosDom: 2,
          urgencias: 3,
          traslados: 1
        }
      },
      {
        id: 'vip',
        name: labels.plans.vip.name,
        description: labels.plans.vip.description,
        price: 2800,
        characteristics: 4,
        activated: '2024-01-12',
        status: labels.status.active,
        limits: {
          emergencias: labels.values.unlimited,
          medicosDom: 4,
          urgencias: 5,
          traslados: 3
        }
      },
      {
        id: 'dorado',
        name: labels.plans.gold.name,
        description: labels.plans.gold.description,
        price: 4100,
        characteristics: 5,
        activated: '2024-01-08',
        status: labels.status.active,
        limits: {
          emergencias: labels.values.unlimited,
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
      title: labels.modals.addPlan.title,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.planName}</label>
            <input id="plan-name" class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.addPlan.placeholders.planName}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.description}</label>
            <textarea id="plan-desc" class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="${labels.modals.addPlan.placeholders.description}"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.monthlyPrice}</label>
            <input id="plan-price" type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.addPlan.placeholders.price}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.planType}</label>
            <select id="plan-type" class="w-full px-3 py-2 border rounded-lg">
              <option value="familiar">${labels.modals.addPlan.options.familiar}</option>
              <option value="corporativo">${labels.modals.addPlan.options.corporate}</option>
              <option value="externo">${labels.modals.addPlan.options.external}</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: labels.modals.addPlan.buttons.create,
      cancelButtonText: labels.modals.addPlan.buttons.cancel,
      confirmButtonColor: '#3b82f6',
      width: '500px'
    })
  }

  const handleExport = () => {
    Swal.fire({
      icon: 'success',
      title: labels.modals.export.title,
      text: labels.modals.export.message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleEditPlan = (plan) => {
    Swal.fire({
      title: labels.modals.editPlan.title.replace('{planName}', plan.name),
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.planName}</label>
            <input id="plan-name" class="w-full px-3 py-2 border rounded-lg" value="${plan.name}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.monthlyPrice}</label>
            <input id="plan-price" type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.price}">
          </div>
          <div class="border-t pt-3">
            <h4 class="font-medium text-gray-700 mb-2">${labels.modals.editPlan.fields.planLimits}</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-600">${labels.modals.editPlan.fields.emergencies}</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.emergencias}">
              </div>
              <div>
                <label class="text-xs text-gray-600">${labels.modals.editPlan.fields.medicalDom}</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.medicosDom}">
              </div>
              <div>
                <label class="text-xs text-gray-600">${labels.modals.editPlan.fields.urgencies}</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.urgencias}">
              </div>
              <div>
                <label class="text-xs text-gray-600">${labels.modals.editPlan.fields.transfers}</label>
                <input class="w-full px-2 py-1 border rounded text-sm" value="${plan.limits.traslados}">
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: labels.modals.editPlan.buttons.save,
      cancelButtonText: labels.modals.editPlan.buttons.cancel,
      confirmButtonColor: '#3b82f6',
      width: '500px'
    })
  }

  const handlePausePlan = (plan) => {
    Swal.fire({
      title: labels.modals.pausePlan.title,
      text: labels.modals.pausePlan.message.replace('{planName}', plan.name),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labels.modals.pausePlan.buttons.confirm,
      cancelButtonText: labels.modals.pausePlan.buttons.cancel,
      confirmButtonColor: '#ef4444'
    })
  }

  const handleDeletePlan = (plan) => {
    Swal.fire({
      title: labels.modals.deletePlan.title,
      text: labels.modals.deletePlan.message.replace('{planName}', plan.name),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labels.modals.deletePlan.buttons.confirm,
      cancelButtonText: labels.modals.deletePlan.buttons.cancel,
      confirmButtonColor: '#dc2626'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{labels.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddPlan}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-dollar-sign"></i>
              {labels.buttons.additionalPrices}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-file-export"></i>
              {labels.buttons.export}
            </button>
            <button
              onClick={handleAddPlan}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              {labels.buttons.newPlan}
            </button>
          </div>
        </div>

        {/* Contadores de planes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600 mt-1">{labels.counters.totalPlans}</div>
            <i className="fas fa-list text-blue-400 text-xl mt-2"></i>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600 mt-1">{labels.counters.familiar}</div>
            <i className="fas fa-users text-green-400 text-xl mt-2"></i>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">2</div>
            <div className="text-sm text-gray-600 mt-1">{labels.counters.corporate}</div>
            <i className="fas fa-building text-purple-400 text-xl mt-2"></i>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600 mt-1">{labels.counters.external}</div>
            <i className="fas fa-handshake text-orange-400 text-xl mt-2"></i>
          </div>
        </div>
      </div>

      {/* Planes Familiares */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {labels.subtitle} ({plans.familiar.length})
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            <i className="fas fa-users mr-1"></i>
            {labels.subtitle}
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
                  <span className="text-gray-600">{labels.fields.price}</span>
                  <span className="font-bold text-lg text-gray-900">
                    {labels.formats.currency} {plan.price.toLocaleString()}{labels.formats.year}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {labels.formats.currency} {Math.round(plan.price/12)}{labels.formats.month}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-600">{labels.fields.characteristics}</span>
                  <span className="font-medium">{plan.characteristics}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{labels.fields.updated}</span>
                  <span className="text-gray-700">{plan.activated}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">{labels.fields.mainLimits}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{labels.fields.emergencies}</span>
                      <span className="font-medium">{plan.limits.emergencias}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{labels.fields.urgencies}</span>
                      <span className="font-medium">{plan.limits.urgencias}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{labels.fields.medicalDom}</span>
                      <span className="font-medium">{plan.limits.medicosDom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{labels.fields.transfers}</span>
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
                  {labels.buttons.edit}
                </button>
                <button
                  onClick={() => handlePausePlan(plan)}
                  className="flex-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause text-xs"></i>
                  {labels.buttons.pause}
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