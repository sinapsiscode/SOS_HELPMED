import React from 'react'

/**
 * Modal para mostrar historial de paciente
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Estado del modal
 * @param {Object} props.patient - Datos del paciente
 * @param {Function} props.onClose - Función para cerrar modal
 * @returns {JSX.Element} Modal de historial de paciente
 */
const PatientHistoryModal = ({ isOpen, patient, onClose }) => {
  if (!isOpen || !patient) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEmergencyTypeIcon = (type) => {
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
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Pendiente
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            Desconocido
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <i className={`${getEmergencyTypeIcon(patient.emergencyType)} text-2xl`}></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 font-exo">Historial de Paciente</h2>
                <p className="text-gray-600 font-roboto">{patient.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información básica del paciente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 font-exo mb-3">
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Nombre:</strong> {patient.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Edad:</strong> {patient.age} años
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Género:</strong> {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Fecha de Atención:</strong> {formatDate(patient.date)}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <strong>Estado:</strong>
                  <span className="ml-2">{getStatusBadge(patient.status)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Detalles de la emergencia */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 font-exo mb-3 flex items-center">
              <i className={`${getEmergencyTypeIcon(patient.emergencyType)} mr-2`}></i>
              {getEmergencyTypeLabel(patient.emergencyType)}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Descripción:</strong>
              </p>
              <p className="text-sm text-gray-600 bg-white rounded p-3">{patient.notes}</p>
            </div>
          </div>

          {/* Hospital de destino */}
          {patient.hospital && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 font-exo mb-3">
                <i className="fas fa-hospital text-green-600 mr-2"></i>
                Hospital de Destino
              </h3>
              <p className="text-sm text-gray-700">
                <strong>{patient.hospital}</strong>
              </p>
            </div>
          )}

          {/* Seguimiento médico */}
          {patient.followUp && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 font-exo mb-3">
                <i className="fas fa-calendar-check text-yellow-600 mr-2"></i>
                Seguimiento Requerido
              </h3>
              <p className="text-sm text-gray-600 bg-white rounded p-3">{patient.followUp}</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <strong>ID del Paciente:</strong> {patient.id}
                </p>
                <p>
                  <strong>Tipo de Emergencia:</strong>{' '}
                  {getEmergencyTypeLabel(patient.emergencyType)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Fecha de Registro:</strong> {formatDate(patient.date)}
                </p>
                <p>
                  <strong>Estado Final:</strong>{' '}
                  {patient.status === 'completed' ? 'Completado' : 'Transferido'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-info-circle mr-2"></i>
              <span>Historial completo del paciente</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-helpmed-blue hover:bg-blue-700 text-white rounded-lg transition-colors font-roboto"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientHistoryModal
