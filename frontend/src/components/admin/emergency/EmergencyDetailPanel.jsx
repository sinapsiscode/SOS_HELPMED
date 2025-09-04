import React from 'react'
import { useEmergencyTracking } from '../../../hooks/useEmergencyTracking'

/**
 * Panel de detalles completos de emergencia
 * ENFOQUE BALANCEADO: Solo presentación con funciones del hook
 */
const EmergencyDetailPanel = ({ emergency, onClose, onAssignUnit, onUpdateStatus, onAddNote }) => {
  const { getPriorityColor, getElapsedTimeFormatted } = useEmergencyTracking()

  if (!emergency) return null

  return (
    <div className="bg-white rounded-xl shadow-medium">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Detalles de Emergencia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Información Básica */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Información General</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">{emergency.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{emergency.type?.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prioridad:</span>
              <span className={`font-medium ${getPriorityColor(emergency.priority)}`}>
                {emergency.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium">{emergency.status?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo transcurrido:</span>
              <span className="font-medium">{getElapsedTimeFormatted(emergency.startTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Severidad:</span>
              <span className="font-medium">{emergency.severity_score}/10</span>
            </div>
          </div>
        </div>

        {/* Paciente */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Información del Paciente</h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div>
              <strong>Nombre:</strong> {emergency.patient?.name}
            </div>
            <div>
              <strong>Edad:</strong> {emergency.patient?.age} años
            </div>
            <div>
              <strong>Género:</strong>{' '}
              {emergency.patient?.gender === 'M' ? 'Masculino' : 'Femenino'}
            </div>
            <div>
              <strong>Teléfono:</strong> {emergency.patient?.phone}
            </div>
            {emergency.patient?.medicalHistory?.length > 0 && (
              <div>
                <strong>Historial médico:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {emergency.patient.medicalHistory.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Ubicación</h3>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-start space-x-2">
              <i className="fas fa-map-marker-alt text-red-600 mt-1"></i>
              <div>
                <div className="font-medium">{emergency.location?.address}</div>
                <div className="text-gray-600">{emergency.location?.landmark}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        {emergency.vital_signs && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Signos Vitales</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-600 mb-2">
                Última medición: {new Date(emergency.vital_signs.timestamp).toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>FC:</strong> {emergency.vital_signs.heartRate} bpm
                </div>
                <div>
                  <strong>PA:</strong> {emergency.vital_signs.bloodPressure} mmHg
                </div>
                <div>
                  <strong>SatO2:</strong> {emergency.vital_signs.oxygenSaturation}%
                </div>
                <div>
                  <strong>Temp:</strong> {emergency.vital_signs.temperature}°C
                </div>
              </div>
              <div className="mt-2 text-sm">
                <strong>Consciencia:</strong> {emergency.vital_signs.consciousness}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Cronología</h3>
          <div className="space-y-3">
            {emergency.timeline?.map((event, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{event.event}</div>
                      <div className="text-sm text-gray-600">{event.details}</div>
                      <div className="text-xs text-gray-500">por {event.operator}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            )) || <p className="text-gray-500 text-sm">Sin eventos registrados</p>}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-2">
            {!emergency.assignedUnit && emergency.status === 'PENDIENTE' && onAssignUnit && (
              <button
                onClick={() => onAssignUnit(emergency)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                <i className="fas fa-ambulance mr-2"></i>Asignar Unidad
              </button>
            )}
            {emergency.status !== 'COMPLETADA' && onUpdateStatus && (
              <button
                onClick={() => onUpdateStatus(emergency, 'COMPLETADA')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                <i className="fas fa-check mr-2"></i>Marcar como Completada
              </button>
            )}
            {onAddNote && (
              <button
                onClick={() => onAddNote(emergency)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                <i className="fas fa-note-sticky mr-2"></i>Agregar Nota
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyDetailPanel
