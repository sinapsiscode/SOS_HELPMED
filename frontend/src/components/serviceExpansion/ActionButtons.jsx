import PropTypes from 'prop-types'

/**
 * Botones de acción del formulario (Cancelar/Enviar)
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ActionButtons = ({ onCancel, isSubmitting }) => (
  <div className="flex space-x-3 pt-4">
    <button
      type="button"
      onClick={onCancel}
      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
      disabled={isSubmitting}
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <i className="fas fa-spinner fa-spin" />
          <span>Enviando...</span>
        </>
      ) : (
        <>
          <i className="fas fa-paper-plane" />
          <span>Enviar Solicitud</span>
        </>
      )}
    </button>
  </div>
)

ActionButtons.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired
}

export default ActionButtons