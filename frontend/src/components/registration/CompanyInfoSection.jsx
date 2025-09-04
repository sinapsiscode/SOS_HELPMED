import PropTypes from 'prop-types'

/**
 * Sección de información de empresa (plan corporativo)
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const CompanyInfoSection = ({ formData, onInputChange }) => {
  if (formData.planType !== 'corporativo') return null

  return (
    <div className="bg-purple-50 rounded-lg p-6">
      <h3 className="text-lg font-exo font-semibold text-purple-800 mb-4">
        <i className="fas fa-building mr-2"></i>
        Información de la Empresa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Nombre de la Empresa *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required={formData.planType === 'corporativo'}
          />
        </div>
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            RUC *
          </label>
          <input
            type="text"
            name="ruc"
            value={formData.ruc}
            onChange={onInputChange}
            placeholder="Ej: 20123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required={formData.planType === 'corporativo'}
          />
        </div>
      </div>
    </div>
  )
}

CompanyInfoSection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    ruc: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default CompanyInfoSection