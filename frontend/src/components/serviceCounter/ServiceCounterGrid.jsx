import PropTypes from 'prop-types'
import ServiceCounterItem from './ServiceCounterItem'

/**
 * Grid de items del contador de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceCounterGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {stats.map((stat) => (
      <ServiceCounterItem key={stat.type} stat={stat} />
    ))}
  </div>
)

ServiceCounterGrid.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      used: PropTypes.number.isRequired,
      limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      percentage: PropTypes.number.isRequired
    })
  ).isRequired
}

export default ServiceCounterGrid