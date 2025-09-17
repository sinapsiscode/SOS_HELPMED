import React, { useState } from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.planconfig.additionalPricingModal.comments.title}
 * ${LABELS.admin.planconfig.additionalPricingModal.comments.description}
 */
const AdditionalPricingModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const labels = LABELS.admin.planconfig.additionalPricingModal

  // Estado inicial con valores por defecto
  const [formData, setFormData] = useState({
    costosBase: {
      emergencia: initialData?.costosBase?.emergencia || 365,
      urgenciaMedica: initialData?.costosBase?.urgenciaMedica || 250,
      medicoDomicilio: initialData?.costosBase?.medicoDomicilio || 280,
      trasladoProgramado: initialData?.costosBase?.trasladoProgramado || 194,
      zonaProtegida: initialData?.costosBase?.zonaProtegida || 0
    }
  })

  if (!isOpen) return null

  const handleInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleCancel = () => {
    // Resetear a valores iniciales
    setFormData({
      costosBase: {
        emergencia: initialData?.costosBase?.emergencia || 365,
        urgenciaMedica: initialData?.costosBase?.urgenciaMedica || 250,
        medicoDomicilio: initialData?.costosBase?.medicoDomicilio || 280,
        trasladoProgramado: initialData?.costosBase?.trasladoProgramado || 194,
        zonaProtegida: initialData?.costosBase?.zonaProtegida || 0
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {labels.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sección de Costos Base por Servicio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {labels.sections.baseCosts.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EMERGENCIA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.baseCosts.services.emergency.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{labels.sections.summary.currency}</span>
                  <input
                    type="number"
                    value={formData.costosBase.emergencia}
                    onChange={(e) => handleInputChange('costosBase', 'emergencia', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{labels.sections.baseCosts.services.emergency.description}</p>
              </div>

              {/* URGENCIA MÉDICA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.baseCosts.services.urgentMedical.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{labels.sections.summary.currency}</span>
                  <input
                    type="number"
                    value={formData.costosBase.urgenciaMedica}
                    onChange={(e) => handleInputChange('costosBase', 'urgenciaMedica', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{labels.sections.baseCosts.services.urgentMedical.description}</p>
              </div>

              {/* MÉDICO DOMICILIO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.baseCosts.services.homeDoctor.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{labels.sections.summary.currency}</span>
                  <input
                    type="number"
                    value={formData.costosBase.medicoDomicilio}
                    onChange={(e) => handleInputChange('costosBase', 'medicoDomicilio', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{labels.sections.baseCosts.services.homeDoctor.description}</p>
              </div>

              {/* TRASLADO PROGRAMADO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.baseCosts.services.scheduledTransfer.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{labels.sections.summary.currency}</span>
                  <input
                    type="number"
                    value={formData.costosBase.trasladoProgramado}
                    onChange={(e) => handleInputChange('costosBase', 'trasladoProgramado', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{labels.sections.baseCosts.services.scheduledTransfer.description}</p>
              </div>

              {/* ZONA PROTEGIDA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.baseCosts.services.protectedZone.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{labels.sections.summary.currency}</span>
                  <input
                    type="number"
                    value={formData.costosBase.zonaProtegida}
                    onChange={(e) => handleInputChange('costosBase', 'zonaProtegida', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{labels.sections.baseCosts.services.protectedZone.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {labels.buttons.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {labels.buttons.save}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdditionalPricingModal