import PropTypes from 'prop-types'

/**
 * Sección de datos personales
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PersonalDataSection = ({ formData, onInputChange }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
      {formData.planType === 'corporativo'
        ? 'Datos del Contacto Principal'
        : 'Datos Personales'}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Nombres *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Apellidos *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>

      {formData.planType === 'corporativo' && (
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Cargo en la Empresa *
          </label>
          <input
            type="text"
            name="contactPosition"
            value={formData.contactPosition}
            onChange={onInputChange}
            placeholder="Ej: Gerente de RRHH"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required={formData.planType === 'corporativo'}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          DNI *
        </label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>

      {formData.planType !== 'corporativo' && (
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required={formData.planType !== 'corporativo'}
          />
        </div>
      )}
    </div>
  </div>
)

PersonalDataSection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    dni: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    contactPosition: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default PersonalDataSection