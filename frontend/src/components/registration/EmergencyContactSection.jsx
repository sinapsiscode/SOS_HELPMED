import PropTypes from 'prop-types'

/**
 * Sección de contacto de emergencia
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const EmergencyContactSection = ({ formData, onInputChange }) => {
  if (formData.planType === 'corporativo') return null

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
        Contacto de Emergencia
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
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
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Relación *
          </label>
          <select
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required
          >
            <option value="">Seleccionar relación</option>
            <option value="padre">Padre</option>
            <option value="madre">Madre</option>
            <option value="conyuge">Cónyuge</option>
            <option value="hijo">Hijo/a</option>
            <option value="hermano">Hermano/a</option>
            <option value="amigo">Amigo/a</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
    </div>
  )
}

EmergencyContactSection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    emergencyContactName: PropTypes.string.isRequired,
    emergencyContactPhone: PropTypes.string.isRequired,
    emergencyContactRelation: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default EmergencyContactSection