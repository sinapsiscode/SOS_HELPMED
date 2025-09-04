import PropTypes from 'prop-types'
import MedicalInfo from './MedicalInfo'

/**
 * Sección de información médica
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const MedicalInformation = ({ medicalData, onUpdateMedicalInfo }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Información Médica</h3>

    <div className="space-y-3 text-sm">
      {medicalData.map((item, index) => (
        <MedicalInfo key={index} label={item.label} value={item.value} />
      ))}
    </div>

    <button
      onClick={onUpdateMedicalInfo}
      className="w-full mt-4 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-lg font-medium transition-colors"
    >
      <i className="fas fa-edit mr-2"></i>
      Actualizar Información Médica
    </button>
  </div>
)

MedicalInformation.propTypes = {
  medicalData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  onUpdateMedicalInfo: PropTypes.func.isRequired
}

export default MedicalInformation