import React from 'react'

/**
 * Pantalla de confirmación de servicio completado
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.selectedService - Servicio seleccionado
 * @param {Object} props.serviceDetails - Detalles del servicio
 * @param {Object} props.servicePrices - Configuración de precios
 * @param {Function} props.calculateTotalPrice - Función para calcular precio total
 * @param {Function} props.onRequestNew - Función para solicitar otro servicio
 * @param {Function} props.onBack - Función para volver al inicio
 * @returns {JSX.Element} Pantalla de confirmación
 */
const ConfirmationScreen = ({
  selectedService,
  serviceDetails,
  servicePrices,
  calculateTotalPrice,
  onRequestNew,
  onBack
}) => {
  const serviceCode = `OD-${Date.now().toString().slice(-8)}`

  return (
    <div className="text-center py-12">
      {/* Icono de éxito */}
      <SuccessIcon />

      {/* Título y descripción */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-exo">¡Servicio Confirmado!</h3>
        <p className="text-gray-600 font-roboto">
          Su solicitud ha sido procesada exitosamente. Una ambulancia está en camino.
        </p>
      </div>

      {/* Detalles del servicio */}
      <ServiceDetails
        selectedService={selectedService}
        serviceDetails={serviceDetails}
        servicePrices={servicePrices}
        calculateTotalPrice={calculateTotalPrice}
        serviceCode={serviceCode}
      />

      {/* Botones de acción */}
      <ActionButtons onRequestNew={onRequestNew} onBack={onBack} />

      {/* Promoción de planes */}
      <PlanPromotion />
    </div>
  )
}

/**
 * Icono de éxito
 */
const SuccessIcon = () => {
  return (
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <i className="fas fa-check text-green-600 text-3xl"></i>
    </div>
  )
}

/**
 * Detalles del servicio confirmado
 */
const ServiceDetails = ({
  selectedService,
  serviceDetails,
  servicePrices,
  calculateTotalPrice,
  serviceCode
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
      <h4 className="font-semibold text-gray-800 mb-3 font-exo">Detalles del Servicio</h4>
      <div className="space-y-2 text-sm">
        <DetailRow label="Servicio:" value={servicePrices[selectedService].name} />
        <DetailRow label="Código:" value={serviceCode} isCode />
        <DetailRow
          label="Total cobrado:"
          value={`S/ ${calculateTotalPrice(selectedService, serviceDetails).toFixed(2)}`}
          isAmount
        />
      </div>
    </div>
  )
}

/**
 * Fila de detalle individual
 */
const DetailRow = ({ label, value, isCode, isAmount }) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 font-roboto">{label}</span>
      <span
        className={`font-medium font-${isCode || isAmount ? 'exo' : 'roboto'} ${
          isAmount ? 'font-bold text-lg' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * Botones de acción
 */
const ActionButtons = ({ onRequestNew, onBack }) => {
  return (
    <div className="space-y-3">
      <button
        onClick={onRequestNew}
        className="w-full max-w-md mx-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-roboto font-semibold"
      >
        Solicitar Otro Servicio
      </button>

      <button
        onClick={onBack}
        className="w-full max-w-md mx-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-roboto"
      >
        Volver al Inicio
      </button>
    </div>
  )
}

/**
 * Promoción de planes familiares
 */
const PlanPromotion = () => {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
      <p className="text-sm text-blue-800 font-roboto">
        <i className="fas fa-lightbulb mr-2"></i>
        ¿Sabías que con un plan familiar puedes ahorrar hasta un 60% en servicios médicos?
        <a
          href="#"
          className="block mt-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver planes disponibles →
        </a>
      </p>
    </div>
  )
}

export default ConfirmationScreen
