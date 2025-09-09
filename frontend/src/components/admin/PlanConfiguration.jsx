import React, { useState } from 'react'
import Swal from 'sweetalert2'
import AdditionalPricingModal from './planconfig/AdditionalPricingModal'
import { LABELS } from '../../config/labels'

const PlanConfiguration = () => {
  const labels = LABELS.admin.planConfiguration
  const [activeFilter, setActiveFilter] = useState('all')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingData, setPricingData] = useState(null)
  
  const familiarPlans = [
    {
      id: 'help',
      name: 'Plan Help',
      description: labels.plans.help.description,
      price: 650,
      priceYear: 650,
      characteristics: 5,
      activated: '2024-01-15',
      status: labels.status.active,
      limits: {
        emergencias: labels.values.unlimited,
        medicosDom: 8,
        urgencias: labels.values.unlimited,
        traslados: 0
      }
    },
    {
      id: 'basico',
      name: 'Plan Básico',
      description: labels.plans.basic.description,
      price: 1500,
      priceYear: 1500,
      priceMonth: 125,
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
      name: 'Plan VIP',
      description: labels.plans.vip.description,
      price: 2800,
      priceYear: 2800,
      priceMonth: 233,
      characteristics: 4,
      activated: '2024-01-12',
      status: labels.status.active,
      limits: {
        emergencias: labels.values.unlimited,
        medicosDom: 4,
        urgencias: 6,
        traslados: 3
      }
    },
    {
      id: 'dorado',
      name: 'Plan Dorado',
      description: labels.plans.gold.description,
      price: 4100,
      priceYear: 4100,
      priceMonth: 342,
      characteristics: 5,
      activated: '2024-01-08',
      status: labels.status.active,
      limits: {
        emergencias: labels.values.unlimited,
        medicosDom: 8,
        urgencias: 10,
        traslados: 4
      }
    }
  ]

  const handleEditPlan = (plan) => {
    Swal.fire({
      title: `${labels.modals.editPlan.title.replace('{planName}', plan.name)}`,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.planName}</label>
            <input class="w-full px-3 py-2 border rounded-lg" value="${plan.name}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.annualPrice}</label>
            <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.price}">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.emergencies}</label>
              <input class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.emergencias}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.medicalDom}</label>
              <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.medicosDom}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.urgencies}</label>
              <input class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.urgencias}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.editPlan.fields.transfers}</label>
              <input type="number" class="w-full px-3 py-2 border rounded-lg" value="${plan.limits.traslados}">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: labels.modals.editPlan.buttons.save,
      cancelButtonText: labels.modals.editPlan.buttons.cancel,
      confirmButtonColor: '#3b82f6'
    })
  }

  const handlePausePlan = (plan) => {
    Swal.fire({
      title: labels.modals.pausePlan.title,
      text: `${labels.modals.pausePlan.message.replace('{planName}', plan.name)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labels.modals.pausePlan.buttons.confirm,
      cancelButtonText: labels.modals.pausePlan.buttons.cancel,
      confirmButtonColor: '#eab308'
    })
  }

  const handleDeletePlan = (plan) => {
    Swal.fire({
      title: labels.modals.deletePlan.title,
      text: `${labels.modals.deletePlan.message.replace('{planName}', plan.name)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labels.modals.deletePlan.buttons.confirm,
      cancelButtonText: labels.modals.deletePlan.buttons.cancel,
      confirmButtonColor: '#dc2626'
    })
  }

  const handleAddPlan = () => {
    Swal.fire({
      title: labels.modals.addPlan.title,
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.planType}</label>
            <select class="w-full px-3 py-2 border rounded-lg">
              <option value="familiar">${labels.modals.addPlan.options.familiar}</option>
              <option value="corporativo">${labels.modals.addPlan.options.corporate}</option>
              <option value="externo">${labels.modals.addPlan.options.external}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.planName}</label>
            <input class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.addPlan.placeholders.planName}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.description}</label>
            <textarea class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="${labels.modals.addPlan.placeholders.description}"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.addPlan.fields.annualPrice}</label>
            <input type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.addPlan.placeholders.price}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: labels.modals.addPlan.buttons.create,
      cancelButtonText: labels.modals.addPlan.buttons.cancel,
      confirmButtonColor: '#dc2626',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{labels.title}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPricingModal(true)}
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

        {/* Contadores */}
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {`${labels.subtitle} (4)`}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fila 1 */}
          <div className="space-y-6">
            {/* Plan Help */}
            <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">{labels.plans.help.name}</h4>
                  <p className="text-sm text-gray-500">Plan básico de emergencias médicas</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {labels.status.active}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">{labels.fields.price}</div>
                <div className="text-2xl font-bold text-blue-600">S/ 650{labels.formats.year}</div>
                <div className="text-xs text-gray-500">S/ 54{labels.formats.month}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.characteristics}</div>
                  <div className="text-lg font-semibold">5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.updated}</div>
                  <div className="text-sm">2024-01-15</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">{labels.fields.mainLimits}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">{labels.fields.emergencies}</span>
                    <span className="font-semibold ml-1">{labels.values.unlimited}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.urgencies}</span>
                    <span className="font-semibold ml-1">{labels.values.unlimited}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.medicalDom}</span>
                    <span className="font-semibold ml-1">8</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.transfers}</span>
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
                  {labels.buttons.edit}
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[0])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  {labels.buttons.pause}
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
                  <h4 className="font-semibold text-gray-800 text-lg">{labels.plans.gold.name}</h4>
                  <p className="text-sm text-gray-500">Plan de lujo con todos los beneficios</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {labels.status.active}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">{labels.fields.price}</div>
                <div className="text-2xl font-bold text-blue-600">S/ 4100{labels.formats.year}</div>
                <div className="text-xs text-gray-500">S/ 342{labels.formats.month}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.characteristics}</div>
                  <div className="text-lg font-semibold">5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.updated}</div>
                  <div className="text-sm">2024-01-08</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">{labels.fields.mainLimits}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">{labels.fields.emergencies}</span>
                    <span className="font-semibold ml-1">{labels.values.unlimited}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.urgencies}</span>
                    <span className="font-semibold ml-1">10</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.medicalDom}</span>
                    <span className="font-semibold ml-1">8</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.transfers}</span>
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
                  {labels.buttons.edit}
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[3])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  {labels.buttons.pause}
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
                  <h4 className="font-semibold text-gray-800 text-lg">{labels.plans.basic.name}</h4>
                  <p className="text-sm text-gray-500">Plan familiar con servicios esenciales</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {labels.status.active}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">{labels.fields.price}</div>
                <div className="text-2xl font-bold text-blue-600">S/ 1500{labels.formats.year}</div>
                <div className="text-xs text-gray-500">S/ 125{labels.formats.month}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.characteristics}</div>
                  <div className="text-lg font-semibold">2</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.updated}</div>
                  <div className="text-sm">2024-01-10</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">{labels.fields.mainLimits}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">{labels.fields.emergencies}</span>
                    <span className="font-semibold ml-1">{labels.values.unlimited}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.urgencies}</span>
                    <span className="font-semibold ml-1">3</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.medicalDom}</span>
                    <span className="font-semibold ml-1">2</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.transfers}</span>
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
                  {labels.buttons.edit}
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[1])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  {labels.buttons.pause}
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
                  <h4 className="font-semibold text-gray-800 text-lg">{labels.plans.vip.name}</h4>
                  <p className="text-sm text-gray-500">Plan premium con beneficios adicionales</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {labels.status.active}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">{labels.fields.price}</div>
                <div className="text-2xl font-bold text-blue-600">S/ 2800{labels.formats.year}</div>
                <div className="text-xs text-gray-500">S/ 233{labels.formats.month}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.characteristics}</div>
                  <div className="text-lg font-semibold">4</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{labels.fields.updated}</div>
                  <div className="text-sm">2024-01-12</div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">{labels.fields.mainLimits}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">{labels.fields.emergencies}</span>
                    <span className="font-semibold ml-1">{labels.values.unlimited}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.urgencies}</span>
                    <span className="font-semibold ml-1">6</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.medicalDom}</span>
                    <span className="font-semibold ml-1">4</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{labels.fields.transfers}</span>
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
                  {labels.buttons.edit}
                </button>
                <button
                  onClick={() => handlePausePlan(familiarPlans[2])}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1"
                >
                  <i className="fas fa-pause"></i>
                  {labels.buttons.pause}
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
          console.log(labels.console.pricesSaved, data)
          Swal.fire({
            icon: 'success',
            title: labels.modals.saved.title,
            text: labels.modals.saved.message,
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