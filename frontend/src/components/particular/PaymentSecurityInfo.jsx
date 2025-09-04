import React from 'react'

/**
 * Información de seguridad del pago
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.acceptedCards - Tarjetas aceptadas
 * @returns {JSX.Element} Información de seguridad y tarjetas aceptadas
 */
const PaymentSecurityInfo = ({ acceptedCards }) => {
  return (
    <div className="space-y-4">
      {/* Información de seguridad */}
      <SecurityBadge />

      {/* Tarjetas aceptadas */}
      <AcceptedCards acceptedCards={acceptedCards} />
    </div>
  )
}

/**
 * Badge de seguridad
 */
const SecurityBadge = () => {
  return (
    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex-shrink-0">
        <i className="fas fa-shield-alt text-green-600 text-xl"></i>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-green-800 font-exo">Pago 100% Seguro</h4>
          <div className="flex items-center space-x-1">
            <i className="fas fa-lock text-green-600 text-sm"></i>
            <span className="text-xs text-green-700 font-roboto">SSL 256-bit</span>
          </div>
        </div>
        <p className="text-sm text-green-700 mb-2 font-roboto">
          Tu información está protegida con encriptación de grado bancario
        </p>

        {/* Características de seguridad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <SecurityFeature icon="fas fa-certificate" text="Certificado PCI-DSS" />
          <SecurityFeature icon="fas fa-eye-slash" text="Datos no almacenados" />
          <SecurityFeature icon="fas fa-user-shield" text="Protección antifraude" />
          <SecurityFeature icon="fas fa-clock" text="Monitoreo 24/7" />
        </div>
      </div>
    </div>
  )
}

/**
 * Característica de seguridad individual
 */
const SecurityFeature = ({ icon, text }) => {
  return (
    <div className="flex items-center space-x-2">
      <i className={`${icon} text-green-600 text-xs`}></i>
      <span className="text-xs text-green-700 font-roboto">{text}</span>
    </div>
  )
}

/**
 * Tarjetas aceptadas
 */
const AcceptedCards = ({ acceptedCards }) => {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-3 font-roboto">Métodos de pago aceptados</p>
      <div className="flex items-center justify-center space-x-4">
        {acceptedCards.map((card) => (
          <CardIcon key={card.type} card={card} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 font-roboto">
        Procesado por sistemas bancarios certificados
      </p>
    </div>
  )
}

/**
 * Icono de tarjeta individual
 */
const CardIcon = ({ card }) => {
  return (
    <div
      className="flex flex-col items-center space-y-1 opacity-70 hover:opacity-100 transition-opacity"
      title={card.name}
    >
      <i
        className={`${card.icon} text-2xl text-gray-600 hover:text-gray-800 transition-colors`}
      ></i>
    </div>
  )
}

export default PaymentSecurityInfo
