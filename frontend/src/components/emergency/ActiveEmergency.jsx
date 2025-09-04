import React from 'react'
import useAppStore from '../../stores/useAppStore'
import ProgressStep from './ProgressStep'

/**
 * Vista de emergencia activa
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Emergencia activa
 */
const ActiveEmergency = () => {
  const { currentEmergency, emergencyStatus, assignedUnit } = useAppStore()

  return (
    <div className="space-y-6">
      {/* Cabecera de emergencia activa */}
      <EmergencyHeader emergencyStatus={emergencyStatus} currentEmergency={currentEmergency} />

      {/* Unidad asignada */}
      {assignedUnit && <AssignedUnit assignedUnit={assignedUnit} />}

      {/* Pasos del progreso */}
      <EmergencyProgress emergencyStatus={emergencyStatus} />
    </div>
  )
}

/**
 * Cabecera de la emergencia activa
 */
const EmergencyHeader = ({ emergencyStatus, currentEmergency }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <i className="fas fa-exclamation text-white text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-800 font-exo">Emergencia Activa</h2>
          <p className="text-red-600 font-roboto">Estado: {emergencyStatus}</p>
        </div>
      </div>

      <EmergencyDetails currentEmergency={currentEmergency} />
    </div>
  )
}

/**
 * Detalles de la emergencia
 */
const EmergencyDetails = ({ currentEmergency }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="font-semibold text-gray-600 font-roboto">Tipo:</span>
          <p className="text-gray-800 font-roboto">{currentEmergency.type}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-600 font-roboto">Hora:</span>
          <p className="text-gray-800 font-roboto">
            {currentEmergency.timestamp?.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Contactos extra */}
      {currentEmergency.extraContacts && currentEmergency.extraContacts.length > 0 && (
        <ExtraContacts contacts={currentEmergency.extraContacts} />
      )}
    </div>
  )
}

/**
 * Contactos extra de emergencia
 */
const ExtraContacts = ({ contacts }) => {
  return (
    <div className="border-t border-gray-200 pt-3">
      <span className="font-semibold text-gray-600 block mb-2 font-roboto">
        📞 Contactos de Emergencia Notificados:
      </span>
      <div className="space-y-1">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm bg-blue-50 rounded px-2 py-1"
          >
            <span className="text-blue-800 font-medium font-roboto">{contact.name}</span>
            <span className="text-blue-600 font-roboto">{contact.phone}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Unidad asignada
 */
const AssignedUnit = ({ assignedUnit }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 font-exo">Unidad Asignada</h3>

      <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <i className="fas fa-ambulance text-white"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-green-800 font-exo">{assignedUnit.id}</h4>
          <p className="text-green-600 text-sm font-roboto">{assignedUnit.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-600 font-roboto">Tripulación: {assignedUnit.crew}</p>
          <p className="text-sm text-green-600 font-roboto">Equipo: {assignedUnit.equipment}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Progreso de la emergencia
 */
const EmergencyProgress = ({ emergencyStatus }) => {
  const steps = [
    {
      icon: 'fas fa-phone',
      title: 'Solicitud Recibida',
      completed: true,
      time: '14:30'
    },
    {
      icon: 'fas fa-search',
      title: 'Unidad Asignada',
      completed: emergencyStatus !== 'requested',
      time: emergencyStatus !== 'requested' ? '14:32' : null
    },
    {
      icon: 'fas fa-route',
      title: 'En Camino',
      completed: false,
      time: null
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Llegada al Lugar',
      completed: false,
      time: null
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6 font-exo">Progreso de la Emergencia</h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <ProgressStep
            key={index}
            icon={step.icon}
            title={step.title}
            completed={step.completed}
            time={step.time}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveEmergency
