/**
 * Header del formulario de traslado programado
 * Componente simple de presentación con título y botón cerrar
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClose - Función para cerrar el modal
 */
const TransferFormHeader = ({ onClose }) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-800">Nuevo Traslado Programado</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        type="button"
      >
        <i className="fas fa-times text-xl"></i>
      </button>
    </div>
  )
}

export default TransferFormHeader
