import PropTypes from 'prop-types'

/**
 * Botones de acción para facturación
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ActionButtons = ({ user, isLoading, onDownload, onChangePayment, onUpgradePlan }) => (
  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
    <button
      onClick={onDownload}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <i className="fas fa-download mr-2"></i>
      {isLoading ? 'Descargando...' : 'Descargar Factura'}
    </button>

    {user.role === 'FAMILIAR' && (
      <>
        <button
          onClick={onChangePayment}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i className="fas fa-edit mr-2"></i>
          Cambiar Método de Pago
        </button>

        <button
          onClick={onUpgradePlan}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i className="fas fa-arrow-up mr-2"></i>
          Actualizar Plan
        </button>
      </>
    )}
  </div>
)

ActionButtons.propTypes = {
  user: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDownload: PropTypes.func.isRequired,
  onChangePayment: PropTypes.func.isRequired,
  onUpgradePlan: PropTypes.func.isRequired
}

export default ActionButtons