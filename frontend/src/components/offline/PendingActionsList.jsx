import PropTypes from 'prop-types'
import PendingActionItem from './PendingActionItem'

/**
 * Lista de acciones pendientes de sincronización
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PendingActionsList = ({ items, totalCount }) => (
  <div className="border-t pt-3">
    <h4 className="text-sm font-medium text-gray-800 mb-2">Acciones Pendientes:</h4>
    <div className="max-h-32 overflow-y-auto space-y-1">
      {items.map((item) => (
        <PendingActionItem key={item.id} item={item} />
      ))}
      {totalCount > items.length && (
        <div className="text-xs text-gray-500 text-center pt-1">
          +{totalCount - items.length} más...
        </div>
      )}
    </div>
  </div>
)

PendingActionsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      action: PropTypes.shape({
        type: PropTypes.string.isRequired
      }).isRequired,
      retryCount: PropTypes.number
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired
}

export default PendingActionsList