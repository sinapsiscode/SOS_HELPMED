import React from 'react'

/**
 * Botón para acceder al servicio particular sin suscripción
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onGoToParticular - Función para ir al servicio particular
 * @returns {JSX.Element} Botón de servicio particular
 */
const ParticularServiceButton = ({ onGoToParticular }) => {
  return (
    <div className="mt-2 text-center">
      <SectionDivider />
      <ServiceButton onGoToParticular={onGoToParticular} />
      <ServiceDescription />
    </div>
  )
}

/**
 * Divisor de sección
 */
const SectionDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2 bg-white text-gray-500 font-roboto">O</span>
      </div>
    </div>
  )
}

/**
 * Botón principal del servicio
 */
const ServiceButton = ({ onGoToParticular }) => {
  return (
    <button
      onClick={onGoToParticular}
      className="mt-2 w-full px-4 py-3 border-2 border-red-500 text-red-600 rounded-lg font-exo font-semibold hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-2"
    >
      <ServiceIcon />
      <ServiceLabel />
      <PaymentBadge />
    </button>
  )
}

/**
 * Icono del servicio
 */
const ServiceIcon = () => {
  return <i className="fas fa-credit-card"></i>
}

/**
 * Etiqueta del servicio
 */
const ServiceLabel = () => {
  return <span>Servicio sin suscripción</span>
}

/**
 * Badge de pago inmediato
 */
const PaymentBadge = () => {
  return (
    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-roboto">
      Pago inmediato
    </span>
  )
}

/**
 * Descripción del servicio
 */
const ServiceDescription = () => {
  return (
    <p className="text-xs text-gray-500 mt-2 font-roboto">
      Para ex-clientes o servicios esporádicos
    </p>
  )
}

export default ParticularServiceButton
