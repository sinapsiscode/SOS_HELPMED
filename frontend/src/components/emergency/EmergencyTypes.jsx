import React from 'react'

/**
 * Tipos de servicios de emergencia
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onEmergencyRequest - Función para solicitar emergencia
 * @returns {JSX.Element} Tipos de emergencia
 */
const EmergencyTypes = ({ onEmergencyRequest }) => {
  const emergencyTypes = [
    {
      id: 'medical',
      title: 'Emergencia Médica',
      description: 'Situaciones críticas que requieren atención inmediata',
      icon: 'fas fa-ambulance',
      gradient: 'from-red-500 to-red-600',
      iconBg: 'bg-white bg-opacity-20'
    },
    {
      id: 'consultation',
      title: 'Consulta Médica',
      description: 'Atención médica programada y evaluaciones',
      icon: 'fas fa-stethoscope',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-white bg-opacity-20'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 font-exo">Tipos de Servicio</h2>

      <div className="space-y-4">
        {emergencyTypes.map((type) => (
          <EmergencyTypeCard key={type.id} type={type} onRequest={onEmergencyRequest} />
        ))}
      </div>
    </div>
  )
}

/**
 * Tarjeta de tipo de emergencia individual
 */
const EmergencyTypeCard = ({ type, onRequest }) => {
  return (
    <button
      onClick={() => onRequest(type.id)}
      className={`w-full p-6 bg-gradient-to-r ${type.gradient} text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 ${type.iconBg} rounded-full flex items-center justify-center`}>
          <i className={`${type.icon} text-2xl`}></i>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold mb-1 font-exo">{type.title}</h3>
          <p className={`${type.id === 'medical' ? 'text-red-100' : 'text-blue-100'} font-roboto`}>
            {type.description}
          </p>
        </div>
        <i className="fas fa-chevron-right text-xl"></i>
      </div>
    </button>
  )
}

export default EmergencyTypes
