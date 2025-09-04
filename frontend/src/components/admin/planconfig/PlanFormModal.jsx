import React, { useState, useEffect } from 'react'

/**
 * Modal para crear/editar planes
 * ENFOQUE BALANCEADO: Lógica de formulario simple con validación de props
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Object|null} editingPlan - Plan en edición o null para crear nuevo
 * @param {Function} onClose - Función para cerrar modal
 * @param {Function} onSave - Función para guardar plan
 * @param {boolean} isLoading - Estado de carga
 * @returns {JSX.Element} Modal de formulario para planes
 */
const PlanFormModal = ({ isOpen, editingPlan, onClose, onSave, isLoading }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error('PlanFormModal: isOpen debe ser boolean')
    return null
  }

  if (editingPlan && typeof editingPlan !== 'object') {
    console.error('PlanFormModal: editingPlan debe ser objeto o null')
    return null
  }

  if (typeof onClose !== 'function') {
    console.error('PlanFormModal: onClose debe ser una función')
    return null
  }

  if (typeof onSave !== 'function') {
    console.error('PlanFormModal: onSave debe ser una función')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('PlanFormModal: isLoading debe ser boolean')
    return null
  }

  // ============================================
  // ESTADOS DEL FORMULARIO
  // ============================================
  const [formData, setFormData] = useState({
    category: 'familiar',
    key: '',
    name: '',
    description: '',
    active: true,
    pricing: {
      monthly: '',
      quarterly: '',
      annually: '',
      per_employee: '',
      minimum_employees: '',
      setup_fee: '',
      currency: 'PEN'
    },
    limits: {
      EMERGENCIA: 'ILIMITADO',
      URGENCIA: 0,
      MEDICO_DOMICILIO: 0,
      TRASLADO_PROGRAMADO: 0,
      ZONA_PROTEGIDA: 0,
      ORIENTACION_TELEFONICA: 'ILIMITADO',
      EXAMENES_LABORATORIO: 0
    },
    benefits: {
      emergencias_ilimitadas: true,
      orientacion_telefonica: true,
      zona_protegida: false,
      seguro_accidentes: false,
      examenes_laboratorio: false
    },
    features: {
      cobertura_24_7: true,
      tiempo_respuesta_max: 10,
      red_hospitales: 'básica',
      app_movil: true,
      seguimiento_gps: false
    },
    target_market: ''
  })

  // ============================================
  // EFECTO PARA CARGAR DATOS DE EDICIÓN
  // ============================================
  useEffect(() => {
    if (editingPlan && isOpen) {
      setFormData({
        category: editingPlan.category || 'familiar',
        key: editingPlan.key || '',
        name: editingPlan.name || '',
        description: editingPlan.description || '',
        active: editingPlan.active !== undefined ? editingPlan.active : true,
        pricing: {
          monthly: editingPlan.pricing?.monthly || '',
          quarterly: editingPlan.pricing?.quarterly || '',
          annually: editingPlan.pricing?.annually || '',
          per_employee: editingPlan.pricing?.per_employee || '',
          minimum_employees: editingPlan.pricing?.minimum_employees || '',
          setup_fee: editingPlan.pricing?.setup_fee || '',
          currency: editingPlan.pricing?.currency || 'PEN'
        },
        limits: editingPlan.limits || {},
        benefits: editingPlan.benefits || {},
        features: editingPlan.features || {},
        target_market: editingPlan.target_market || ''
      })
    } else if (isOpen && !editingPlan) {
      // Reset para nuevo plan
      setFormData({
        category: 'familiar',
        key: '',
        name: '',
        description: '',
        active: true,
        pricing: {
          monthly: '',
          quarterly: '',
          annually: '',
          per_employee: '',
          minimum_employees: '',
          setup_fee: '',
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          URGENCIA: 0,
          MEDICO_DOMICILIO: 0,
          TRASLADO_PROGRAMADO: 0,
          ZONA_PROTEGIDA: 0,
          ORIENTACION_TELEFONICA: 'ILIMITADO',
          EXAMENES_LABORATORIO: 0
        },
        benefits: {
          emergencias_ilimitadas: true,
          orientacion_telefonica: true,
          zona_protegida: false,
          seguro_accidentes: false,
          examenes_laboratorio: false
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 10,
          red_hospitales: 'básica',
          app_movil: true,
          seguimiento_gps: false
        },
        target_market: ''
      })
    }
  }, [editingPlan, isOpen])

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData.category, formData.key, formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  required
                >
                  <option value="familiar">Familiar</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clave del Plan *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => handleInputChange('key', e.target.value.toUpperCase())}
                  disabled={isLoading}
                  placeholder="Ej: BASICO, VIP, PREMIUM"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Plan *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  placeholder="Plan Básico"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mercado Objetivo
                </label>
                <input
                  type="text"
                  value={formData.target_market}
                  onChange={(e) => handleInputChange('target_market', e.target.value)}
                  disabled={isLoading}
                  placeholder="Familias clase media"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isLoading}
                rows={3}
                placeholder="Descripción detallada del plan..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              />
            </div>

            {/* Configuración de precios */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Configuración de Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.category === 'familiar' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Mensual (S/)
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.monthly}
                        onChange={(e) => handleInputChange('pricing', e.target.value, 'monthly')}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Trimestral (S/)
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.quarterly}
                        onChange={(e) => handleInputChange('pricing', e.target.value, 'quarterly')}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Anual (S/)
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.annually}
                        onChange={(e) => handleInputChange('pricing', e.target.value, 'annually')}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio por Empleado/Mes (S/)
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.per_employee}
                        onChange={(e) =>
                          handleInputChange('pricing', e.target.value, 'per_employee')
                        }
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mínimo de Empleados
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.minimum_employees}
                        onChange={(e) =>
                          handleInputChange('pricing', e.target.value, 'minimum_employees')
                        }
                        disabled={isLoading}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tarifa de Configuración (S/)
                      </label>
                      <input
                        type="number"
                        value={formData.pricing.setup_fee}
                        onChange={(e) => handleInputChange('pricing', e.target.value, 'setup_fee')}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Estado activo */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">
                  Plan activo para nuevas suscripciones
                </span>
              </label>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{editingPlan ? 'Actualizar' : 'Crear'} Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanFormModal
