import PropTypes from 'prop-types'

/**
 * Barra de progreso para límites
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ProgressBar = ({ percentage, colors }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`h-2 rounded-full transition-all duration-300 ${colors.progress}`}
      style={{ width: `${Math.min(percentage, 100)}%` }}
    ></div>
  </div>
)

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  colors: PropTypes.shape({
    progress: PropTypes.string.isRequired
  }).isRequired
}

export default ProgressBar