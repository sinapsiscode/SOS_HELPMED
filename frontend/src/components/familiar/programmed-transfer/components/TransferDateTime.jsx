/**
 * Componente para mostrar fecha y hora seleccionada del traslado
 * Muestra la información de fecha y hora con validación de errores
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Date} props.selectedDate - Fecha seleccionada
 * @param {string} props.selectedTime - Hora seleccionada
 * @param {Object} props.errors - Errores de validación
 */
const TransferDateTime = ({ selectedDate, selectedTime, errors }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-800 mb-2">Fecha y Hora Programada</h4>
      <div className="text-blue-700">
        <p>
          📅{' '}
          {selectedDate?.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p>🕒 {selectedTime}</p>
      </div>
      {errors.selectedTime && (
        <p className="text-red-500 text-sm mt-2">
          <i className="fas fa-exclamation-triangle mr-1"></i>
          {errors.selectedTime}
        </p>
      )}
    </div>
  )
}

export default TransferDateTime
