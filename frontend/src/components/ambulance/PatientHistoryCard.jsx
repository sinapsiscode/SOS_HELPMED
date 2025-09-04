import React from 'react'

/**
 * Componente para mostrar tarjetas de historial de pacientes
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.patient - Datos del paciente
 * @param {Function} props.onViewHistory - Función para ver historial completo
 * @param {Function} props.onAddNotes - Función para agregar notas
 * @returns {JSX.Element} Tarjeta de historial de paciente
 */
const PatientHistoryCard = ({ patient, onViewHistory, onAddNotes }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'cardiac':
        return 'fas fa-heartbeat text-red-500'
      case 'accident':
        return 'fas fa-car-crash text-orange-500'
      case 'respiratory':
        return 'fas fa-lungs text-blue-500'
      case 'medical':
        return 'fas fa-stethoscope text-green-500'
      default:
        return 'fas fa-notes-medical text-gray-500'
    }
  }

  const getEmergencyTypeLabel = (type) => {
    const labels = {
      cardiac: 'Emergencia Cardiaca',
      accident: 'Accidente',
      respiratory: 'Problema Respiratorio',
      medical: 'Emergencia Médica',
      trauma: 'Trauma',
      overdose: 'Sobredosis'
    }
    return labels[type] || 'Emergencia General'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Completado
          </span>
        )
      case 'transferred':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Transferido
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>
        )
    }
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header del paciente */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <i className={getEmergencyIcon(patient.emergencyType)}></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 font-exo">{patient.name}</h3>
              <p className="text-sm text-gray-600 font-roboto">
                {patient.age} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
              </p>
            </div>
            {getStatusBadge(patient.status)}
          </div>

          {/* Información del paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
                <strong>Fecha:</strong> {formatDate(patient.date)}
              </p>
              <p className="text-sm text-gray-600">
                <i className="fas fa-hospital text-green-500 mr-2"></i>
                <strong>Hospital:</strong> {patient.hospital}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <i className="fas fa-stethoscope text-purple-500 mr-2"></i>
                <strong>Tipo:</strong> {getEmergencyTypeLabel(patient.emergencyType)}
              </p>
              {patient.followUp && (
                <p className="text-sm text-gray-600">
                  <i className="fas fa-calendar-check text-orange-500 mr-2"></i>
                  <strong>Seguimiento:</strong> Requerido
                </p>
              )}
            </div>
          </div>

          {/* Notas del paciente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-notes-medical text-gray-600 mr-2"></i>
              <p className="text-sm font-medium text-gray-700">Notas Médicas</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{patient.notes}</p>
          </div>

          {/* Información de seguimiento si existe */}
          {patient.followUp && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-yellow-600 mr-2 mt-0.5"></i>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Seguimiento Requerido</p>
                  <p className="text-sm text-yellow-700 mt-1">{patient.followUp}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onViewHistory(patient)}
            className="px-4 py-2 bg-helpmed-blue hover:bg-blue-700 text-white rounded-lg transition-colors font-roboto text-sm"
            title="Ver historial completo del paciente"
          >
            <i className="fas fa-eye mr-2"></i>
            Ver Detalles
          </button>
          <button
            onClick={() => onAddNotes(patient)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-roboto text-sm"
            title="Agregar nuevas notas médicas"
          >
            <i className="fas fa-notes-medical mr-2"></i>
            Agregar Notas
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientHistoryCard
