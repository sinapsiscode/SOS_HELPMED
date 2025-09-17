import React from 'react'
import { useEmergencyAssignment } from '../../../hooks/useEmergencyAssignment'
import { LABELS } from '../../../config/labels'

/**
 * Tab de asignaciones de emergencias
 * ENFOQUE BALANCEADO: Estructura en componente, lógica compleja en hook
 *
 * @param {Array} pendingEmergencies - Emergencias pendientes de asignación
 * @param {Array} availableUnits - Unidades disponibles para asignar
 */
const AssignmentsTab = ({ pendingEmergencies, availableUnits }) => {
  const {
    loading,
    error,
    handleAssignUnit,
    handleSetArrivalTime,
    processAvailableUnits,
    getPriorityColor,
    getServiceTypeIcon,
    clearError
  } = useEmergencyAssignment()

  const labels = LABELS.admin.affiliateManagement.assignments
  
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(pendingEmergencies)) {
    console.error('AssignmentsTab: pendingEmergencies debe ser un array')
    return null
  }

  if (!Array.isArray(availableUnits)) {
    console.error('AssignmentsTab: availableUnits debe ser un array')
    return null
  }

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">{labels.error.title}</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {labels.error.button}
          </button>
        </div>
      </div>
    )
  }

  // ============================================
  // ESTADÍSTICAS LOCALES SIMPLES
  // ============================================
  const highPriorityCount = pendingEmergencies.filter((e) => e.priority === 'alta').length
  const mediumPriorityCount = pendingEmergencies.filter((e) => e.priority === 'media').length
  const totalPending = pendingEmergencies.length

  return (
    <>
      {/* Estadísticas de Asignaciones */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 font-exo">{highPriorityCount}</div>
            <div className="text-sm text-red-700 font-roboto">{labels.stats.highPriority}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 font-exo">{mediumPriorityCount}</div>
            <div className="text-sm text-yellow-700 font-roboto">{labels.stats.mediumPriority}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 font-exo">
              {availableUnits.length}
            </div>
            <div className="text-sm text-green-700 font-roboto">{labels.stats.availableUnits}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 font-exo">{totalPending}</div>
            <div className="text-sm text-blue-700 font-roboto">{labels.stats.pending}</div>
          </div>
        </div>
      </div>

      {/* Lista de Servicios Pendientes */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">
            {labels.list.titleWithCount.replace('{count}', totalPending)}
          </h3>
        </div>

        {totalPending === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">{labels.list.empty.icon}</h3>
            <p className="text-gray-600 font-roboto">{labels.list.empty.description}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingEmergencies.map((emergency) => {
              const processedUnits = processAvailableUnits(availableUnits, emergency)

              return (
                <div key={emergency.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:space-x-3 mb-3">
                        <i className={getServiceTypeIcon(emergency.type)}></i>
                        <h4 className="text-lg font-exo font-semibold text-gray-800">
                          {emergency.userName}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(emergency.priority)}`}
                        >
                          {emergency.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                          {emergency.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 font-roboto mb-1">
                            <strong>{labels.list.fields.patient}:</strong> {emergency.affiliateInfo.name} (
                            {emergency.affiliateInfo.relation})
                          </p>
                          <p className="text-sm text-gray-600 font-roboto mb-1">
                            <strong>{labels.list.fields.plan}:</strong> {emergency.planName}
                          </p>
                          <p className="text-sm text-gray-600 font-roboto">
                            <strong>{labels.list.fields.description}:</strong> {emergency.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-roboto mb-1">
                            <strong>{labels.list.fields.location}:</strong> {emergency.location.address}
                          </p>
                          <p className="text-sm text-gray-600 font-roboto mb-1">
                            <strong>{labels.list.fields.estimatedTime}:</strong> {emergency.estimatedResponseTime}
                          </p>
                          <p className="text-sm text-gray-600 font-roboto">
                            <strong>{labels.list.fields.requestedTime}:</strong>{' '}
                            {Math.floor((Date.now() - emergency.timestamp) / (1000 * 60))} {labels.list.fields.minutes}
                          </p>
                        </div>
                      </div>

                      {/* Selector de Unidad y Tiempo de Llegada */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        {/* Tiempo Estimado de Llegada */}
                        <div>
                          <h5 className="font-exo font-semibold text-gray-800 mb-3">
                            {labels.list.arrival.title}
                          </h5>
                          <button
                            onClick={() => handleSetArrivalTime(emergency.id)}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-exo font-medium transition-colors flex items-center space-x-2"
                          >
                            <i className="fas fa-clock"></i>
                            <span>
                              {loading ? labels.list.arrival.processing : labels.list.arrival.button}
                            </span>
                          </button>
                          {emergency.estimatedArrivalTime && (
                            <p className="text-sm text-green-600 font-roboto mt-2">
                              <i className="fas fa-check-circle mr-1"></i>
                              {labels.list.arrival.established}: {emergency.estimatedArrivalTime} {labels.list.arrival.minutes}
                            </p>
                          )}
                        </div>

                        {/* Asignar Unidad */}
                        <div>
                          <h5 className="font-exo font-semibold text-gray-800 mb-3">
                            {labels.list.assignment.title}
                            <span className="text-sm text-gray-600 font-normal ml-2">
                              {labels.list.assignment.subtitle}
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {processedUnits.length === 0 ? (
                              <div className="col-span-3 text-center text-gray-500 font-roboto">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                {labels.list.assignment.noUnits}
                              </div>
                            ) : (
                              processedUnits.map((unit, index) => (
                                <button
                                  key={unit.id}
                                  onClick={() =>
                                    handleAssignUnit(emergency, unit.ambulance.unit_id)
                                  }
                                  disabled={loading}
                                  className={`relative flex items-center space-x-3 p-3 border rounded-lg transition-colors text-left disabled:opacity-50 ${
                                    index === 0
                                      ? 'border-green-400 bg-green-50 hover:bg-green-100'
                                      : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                  }`}
                                >
                                  {index === 0 && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      {labels.list.assignment.closest}
                                    </div>
                                  )}
                                  <i
                                    className={`fas fa-ambulance ${index === 0 ? 'text-green-600' : 'text-blue-600'}`}
                                  ></i>
                                  <div className="flex-1">
                                    <div className="font-exo font-semibold text-gray-800">
                                      {unit.ambulance.unit_id}
                                    </div>
                                    <div className="text-xs text-gray-600 font-roboto">
                                      {unit.profile.name}
                                    </div>
                                    <div className="text-xs text-green-600 font-roboto">
                                      <i className="fas fa-circle mr-1"></i>{labels.list.assignment.available}
                                    </div>
                                    <div className="text-xs font-roboto mt-1">
                                      <span
                                        className={`${index === 0 ? 'text-green-700 font-semibold' : 'text-gray-700'}`}
                                      >
                                        <i className="fas fa-route mr-1"></i>
                                        {unit.distance.toFixed(1)} {labels.list.assignment.distance.km} {labels.list.assignment.distance.separator} {unit.estimatedTime} {labels.list.fields.minutes}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default AssignmentsTab
