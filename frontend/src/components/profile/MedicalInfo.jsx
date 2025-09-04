import PropTypes from 'prop-types'

/**
 * Item individual de información médica
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const MedicalInfo = ({ label, value }) => (
  <div className="flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
)

MedicalInfo.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default MedicalInfo