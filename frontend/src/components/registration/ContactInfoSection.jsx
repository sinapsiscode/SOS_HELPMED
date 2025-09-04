import PropTypes from 'prop-types'

/**
 * Sección de información de contacto
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ContactInfoSection = ({ formData, onInputChange }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
      Información de Contacto
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>
      {/* Solo mostrar dirección para planes no corporativos */}
      {formData.planType !== 'corporativo' && (
        <div className="md:col-span-2">
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Distrito *
        </label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Ciudad *
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
      </div>
    </div>
  </div>
)

ContactInfoSection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string,
    district: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default ContactInfoSection