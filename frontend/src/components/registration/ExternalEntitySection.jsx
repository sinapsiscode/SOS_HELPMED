import PropTypes from 'prop-types'

/**
 * Sección para afiliados externos
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ExternalEntitySection = ({ formData, externalEntities, onInputChange }) => {
  if (formData.planType !== 'externo') return null

  return (
    <>
      <div className="mt-4">
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Entidad de Procedencia *
        </label>
        <select
          name="externalEntity"
          value={formData.externalEntity}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        >
          <option value="">Selecciona una entidad</option>
          {externalEntities.map((entity) => (
            <option key={entity.value} value={entity.value}>
              {entity.label}
            </option>
          ))}
        </select>
      </div>

      {formData.externalEntity === 'other' && (
        <div className="mt-4">
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Especifica la Entidad *
          </label>
          <input
            type="text"
            name="externalEntityOther"
            value={formData.externalEntityOther}
            onChange={onInputChange}
            placeholder="Nombre de la entidad"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required
          />
        </div>
      )}

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
          <div>
            <p className="text-sm text-yellow-800 font-medium">
              Verificación requerida
            </p>
            <p className="text-sm text-yellow-700">
              Tu solicitud será verificada con la entidad indicada antes de ser
              aprobada. Este proceso puede tomar de 2 a 5 días hábiles.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

ExternalEntitySection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    externalEntity: PropTypes.string.isRequired,
    externalEntityOther: PropTypes.string.isRequired
  }).isRequired,
  externalEntities: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default ExternalEntitySection