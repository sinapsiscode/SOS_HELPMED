import React from 'react'

/**
 * Selección de afiliado para atención médica
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.affiliates - Lista de afiliados disponibles
 * @param {string} props.selectedAffiliate - ID del afiliado seleccionado
 * @param {Function} props.onSelectAffiliate - Función para seleccionar afiliado
 * @returns {JSX.Element} Selección de afiliados
 */
const AffiliateSelection = ({ affiliates, selectedAffiliate, onSelectAffiliate }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3 font-exo">
        <i className="fas fa-user mr-2 text-blue-600"></i>
        ¿A quién se va a atender?
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {affiliates.map((affiliate) => (
          <AffiliateCard
            key={affiliate.id}
            affiliate={affiliate}
            isSelected={selectedAffiliate === affiliate.id}
            onSelect={() => onSelectAffiliate(affiliate.id)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2 font-roboto">
        Selecciona quién va a recibir la atención médica
      </p>
    </div>
  )
}

/**
 * Tarjeta individual de afiliado
 */
const AffiliateCard = ({ affiliate, isSelected, onSelect }) => {
  const getRelationIcon = (relation) => {
    const icons = {
      Titular: 'fas fa-user-tie',
      Cónyuge: 'fas fa-heart',
      'Hijo/a': 'fas fa-child',
      Madre: 'fas fa-user-nurse',
      Padre: 'fas fa-user',
      'Hermano/a': 'fas fa-users',
      'Abuelo/a': 'fas fa-user-clock',
      'Nieto/a': 'fas fa-baby',
      Otro: 'fas fa-user-friends'
    }
    return icons[relation] || 'fas fa-user'
  }

  const getRelationColor = (relation) => {
    if (relation === 'Titular') {
      return isSelected
        ? 'bg-green-500 text-white border-green-500'
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    }
    return isSelected
      ? 'bg-blue-500 text-white border-blue-500'
      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 border rounded-lg text-left transition-all duration-200 ${getRelationColor(affiliate.relation)} ${
        isSelected ? 'ring-2 ring-offset-2 ring-current transform scale-105' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isSelected ? 'bg-white bg-opacity-20' : 'bg-current bg-opacity-10'
            }`}
          >
            <i
              className={`${getRelationIcon(affiliate.relation)} ${
                isSelected ? 'text-white' : 'text-current'
              }`}
            ></i>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate font-exo">{affiliate.name}</h4>
            <p
              className={`text-sm ${isSelected ? 'text-white text-opacity-80' : 'opacity-75'} font-roboto`}
            >
              {affiliate.relation}
            </p>
          </div>
        </div>

        {isSelected && (
          <div className="flex-shrink-0 ml-2">
            <i className="fas fa-check-circle text-xl text-white"></i>
          </div>
        )}
      </div>

      {/* Información adicional para el titular */}
      {affiliate.relation === 'Titular' && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <div className="flex items-center space-x-2">
            <i
              className={`fas fa-crown text-xs ${isSelected ? 'text-white text-opacity-70' : 'text-current text-opacity-70'}`}
            ></i>
            <span
              className={`text-xs font-medium ${isSelected ? 'text-white text-opacity-80' : 'text-current text-opacity-80'} font-roboto`}
            >
              Titular del plan
            </span>
          </div>
        </div>
      )}
    </button>
  )
}

export default AffiliateSelection
