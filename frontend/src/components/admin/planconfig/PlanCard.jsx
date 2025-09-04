import React from 'react'

/**
 * Tarjeta individual de plan con todas sus características
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} plan - Datos del plan
 * @param {Function} onEdit - Función para editar plan
 * @param {Function} onDelete - Función para eliminar plan
 * @param {Function} onDuplicate - Función para duplicar plan
 * @param {Function} onSelect - Función para seleccionar plan
 * @param {boolean} isSelected - Si el plan está seleccionado
 * @param {boolean} isLoading - Estado de carga
 * @returns {JSX.Element} Tarjeta de plan con controles
 */
const PlanCard = ({ plan, onEdit, onDelete, onDuplicate, onSelect, isSelected, isLoading }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!plan || typeof plan !== 'object') {
    console.error('PlanCard: plan es requerido y debe ser un objeto')
    return null
  }

  if (typeof onEdit !== 'function') {
    console.error('PlanCard: onEdit debe ser una función')
    return null
  }

  if (typeof onDelete !== 'function') {
    console.error('PlanCard: onDelete debe ser una función')
    return null
  }

  if (typeof onDuplicate !== 'function') {
    console.error('PlanCard: onDuplicate debe ser una función')
    return null
  }

  if (typeof onSelect !== 'function') {
    console.error('PlanCard: onSelect debe ser una función')
    return null
  }

  if (typeof isSelected !== 'boolean') {
    console.error('PlanCard: isSelected debe ser boolean')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('PlanCard: isLoading debe ser boolean')
    return null
  }

  // ============================================
  // FUNCIONES UTILITARIAS
  // ============================================
  const getCategoryColor = (category) => {
    switch (category) {
      case 'familiar':
        return 'bg-orange-100 text-orange-800'
      case 'corporativo':
        return 'bg-purple-100 text-purple-800'
      case 'externo':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'familiar':
        return 'fas fa-home'
      case 'corporativo':
        return 'fas fa-building'
      case 'externo':
        return 'fas fa-globe'
      default:
        return 'fas fa-list'
    }
  }

  const formatPrice = (pricing) => {
    if (pricing.monthly) {
      return `S/ ${pricing.monthly}/mes`
    }
    if (pricing.per_employee) {
      return `S/ ${pricing.per_employee}/empleado`
    }
    return 'Precio personalizado'
  }

  const getStatusColor = (active) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getLimitDisplay = (limits) => {
    const displayLimits = []

    if (limits.EMERGENCIA === 'ILIMITADO') {
      displayLimits.push('Emergencias ilimitadas')
    }
    if (limits.URGENCIA && limits.URGENCIA !== 0) {
      displayLimits.push(`${limits.URGENCIA} urgencias`)
    }
    if (limits.MEDICO_DOMICILIO && limits.MEDICO_DOMICILIO !== 0) {
      displayLimits.push(`${limits.MEDICO_DOMICILIO} médicos a domicilio`)
    }

    return displayLimits.slice(0, 3) // Mostrar solo los primeros 3
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-medium p-4 transition-all hover:shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(plan)}
    >
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plan.category)}`}
          >
            <i className={`${getCategoryIcon(plan.category)} mr-1`}></i>
            {plan.category}
          </span>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.active)}`}
          >
            {plan.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Menú de acciones */}
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(plan)
            }}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            title="Editar plan"
          >
            <i className="fas fa-edit"></i>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(plan.category, plan.key)
            }}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
            title="Duplicar plan"
          >
            <i className="fas fa-copy"></i>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(plan.category, plan.key)
            }}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Eliminar plan"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Información principal */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{plan.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{plan.description}</p>
      </div>

      {/* Precio destacado */}
      <div className="mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatPrice(plan.pricing)}</div>
            <div className="text-xs text-blue-500 mt-1">
              {plan.pricing.currency || 'PEN'}
              {plan.pricing.setup_fee && (
                <span className="ml-2">+ S/ {plan.pricing.setup_fee} setup</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Límites principales */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Servicios Incluidos</h4>
        <div className="space-y-1">
          {getLimitDisplay(plan.limits).map((limit, index) => (
            <div key={index} className="flex items-center text-xs text-gray-600">
              <i className="fas fa-check text-green-500 mr-2"></i>
              {limit}
            </div>
          ))}
          {plan.limits && Object.keys(plan.limits).length > 3 && (
            <div className="text-xs text-gray-500 italic">
              + {Object.keys(plan.limits).length - 3} servicios más
            </div>
          )}
        </div>
      </div>

      {/* Beneficios destacados */}
      {plan.benefits && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Beneficios</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(plan.benefits).map(
              ([key, value]) =>
                value && (
                  <span
                    key={key}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                  >
                    {key.replace(/_/g, ' ')}
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {/* Footer con información adicional */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <i className="fas fa-calendar mr-1"></i>
            {plan.created_at}
          </div>
          <div>
            <i className="fas fa-users mr-1"></i>
            {plan.target_market}
          </div>
        </div>

        {plan.features?.tiempo_respuesta_max && (
          <div className="mt-2 text-xs text-gray-500">
            <i className="fas fa-clock mr-1"></i>
            Respuesta máxima: {plan.features.tiempo_respuesta_max} min
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanCard
