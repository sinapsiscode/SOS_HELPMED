import React, { useState, useEffect } from 'react'

/**
 * Modal simple para crear/editar planes familiares
 * Diseño exacto según imagen proporcionada
 */
const PlanFormModal = ({ plan, planType, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
    pricing: {
      annually: 0,
      currency: 'PEN'
    },
    limits: {
      EMERGENCIA: 0,
      URGENCIA: 0,
      MEDICO_DOMICILIO: 0,
      TRASLADO_PROGRAMADO: 0,
      ZONA_PROTEGIDA: 0,
      EXAMENES_LABORATORIO: 0
    }
  })

  useEffect(() => {
    if (plan?.data) {
      setFormData({
        name: plan.data.name || '',
        description: plan.data.description || '',
        active: plan.data.active !== undefined ? plan.data.active : true,
        pricing: {
          annually: plan.data.pricing?.annually || 0,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: plan.data.limits?.EMERGENCIA || 0,
          URGENCIA: plan.data.limits?.URGENCIA || 0,
          MEDICO_DOMICILIO: plan.data.limits?.MEDICO_DOMICILIO || 0,
          TRASLADO_PROGRAMADO: plan.data.limits?.TRASLADO_PROGRAMADO || 0,
          ZONA_PROTEGIDA: plan.data.limits?.ZONA_PROTEGIDA || 0,
          EXAMENES_LABORATORIO: plan.data.limits?.EXAMENES_LABORATORIO || 0
        }
      })
    }
  }, [plan])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      alert('Nombre y descripción son obligatorios')
      return
    }

    onSave(formData)
  }

  const handleInputChange = (field, value, subfield = null) => {
    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Crear Plan Familiar
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Nombre del Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Configuración de Precios */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">Configuración de Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Anual * <span className="text-xs text-gray-500">(Suscripción mínima de 1 año)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={formData.pricing.annually}
                      onChange={(e) => {
                        const annual = parseInt(e.target.value) || 0
                        handleInputChange('pricing', annual, 'annually')
                      }}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equivalente Mensual <span className="text-xs text-gray-500">(Referencial)</span>
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">S/ {Math.round((formData.pricing.annually || 0) / 12)}</span>
                      <span className="text-sm text-gray-500">por mes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información importante */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Información importante:</p>
                    <ul className="mt-1 space-y-1 text-blue-700">
                      <li>• Los planes familiares requieren contratación anual (12 meses mínimo)</li>
                      <li>• El pago puede ser en cuotas mensuales de S/ {Math.round((formData.pricing.annually || 0) / 12)}</li>
                      <li>• La renovación es automática salvo cancelación expresa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Límites de Servicios */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">Límites de Servicios</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergencias</label>
                  <input
                    type="number"
                    value={formData.limits.EMERGENCIA}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'EMERGENCIA')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgencias</label>
                  <input
                    type="number"
                    value={formData.limits.URGENCIA}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'URGENCIA')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Médico a Domicilio</label>
                  <input
                    type="number"
                    value={formData.limits.MEDICO_DOMICILIO}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'MEDICO_DOMICILIO')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Traslado Programado</label>
                  <input
                    type="number"
                    value={formData.limits.TRASLADO_PROGRAMADO}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'TRASLADO_PROGRAMADO')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zona Protegida</label>
                  <input
                    type="number"
                    value={formData.limits.ZONA_PROTEGIDA}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'ZONA_PROTEGIDA')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exámenes de Laboratorio</label>
                  <input
                    type="number"
                    value={formData.limits.EXAMENES_LABORATORIO}
                    onChange={(e) => handleInputChange('limits', parseInt(e.target.value) || 0, 'EXAMENES_LABORATORIO')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Plan activo */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Plan activo
                </span>
              </label>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Crear Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanFormModal
