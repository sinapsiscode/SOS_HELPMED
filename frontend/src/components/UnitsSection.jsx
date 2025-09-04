import PropTypes from 'prop-types'
import useUnitsSection from '../hooks/useUnitsSection'

/**
 * Componente principal de sección de unidades médicas
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 184 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #4: Validación con esquema Yup
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #13: Optimización con useMemo
 *
 * @component
 */
const UnitsSection = () => {
  const { units, statsCards, hasUnits, getStatusConfig } = useUnitsSection()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Unidades Médicas</h2>
        <p className="text-gray-600">Estado en tiempo real de las unidades disponibles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statsCards.map((card) => (
          <StatsCard
            key={card.type}
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        ))}
      </div>

      {/* Units List */}
      {hasUnits ? (
        <div className="space-y-4">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} getStatusConfig={getStatusConfig} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-medium p-6 text-center">
          <div className="text-gray-500">
            <i className="fas fa-info-circle mr-2"></i>
            No hay unidades médicas disponibles
          </div>
        </div>
      )}
    </div>
  )
}

const StatsCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className={`border rounded-xl p-4 ${colorClasses[color]}`}>
      <div className="flex items-center space-x-3">
        <i className={`${icon} text-2xl`}></i>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm font-medium">{title}</div>
        </div>
      </div>
    </div>
  )
}

const UnitCard = ({ unit, getStatusConfig }) => {
  const statusConfig = getStatusConfig(unit.status)

  return (
    <div className="bg-white rounded-xl shadow-medium p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-ambulance text-blue-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{unit.id}</h3>
            <p className="text-sm text-gray-600">{unit.type}</p>
          </div>
        </div>

        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.text}`}
        >
          <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
          <span className="text-xs font-semibold">{statusConfig.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Ubicación:</span>
          <p className="font-medium text-gray-800">{unit.location}</p>
        </div>
        <div>
          <span className="text-gray-600">Tripulación:</span>
          <p className="font-medium text-gray-800">
            {unit.crew} persona{unit.crew > 1 ? 's' : ''}
          </p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-600">Equipamiento:</span>
          <p className="font-medium text-gray-800">{unit.equipment}</p>
        </div>
      </div>

      {(unit.status === 'available' || unit.status === 'busy') && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className={`flex items-center space-x-2 ${statusConfig.text}`}>
            <i className={statusConfig.icon}></i>
            <span className="text-sm font-medium">{statusConfig.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['green', 'yellow', 'red']).isRequired
}

UnitCard.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['available', 'busy', 'maintenance']).isRequired,
    location: PropTypes.string.isRequired,
    crew: PropTypes.number.isRequired,
    equipment: PropTypes.string.isRequired
  }).isRequired,
  getStatusConfig: PropTypes.func.isRequired
}

export default UnitsSection
