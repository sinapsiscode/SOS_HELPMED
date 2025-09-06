import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.assignmentControls.comments.title}
 * ${LABELS.admin.map.assignmentControls.comments.approach}
 *
 * @param {Object} selectedEmergency - Emergencia seleccionada
 * @param {Object} selectedUnit - Unidad seleccionada
 * @param {boolean} loading - Estado de carga
 * @param {Function} handleAssignUnit - Función para asignar unidad
 * @param {Function} clearSelections - Función para limpiar selecciones
 */
const AssignmentControls = ({
  selectedEmergency,
  selectedUnit,
  loading,
  handleAssignUnit,
  clearSelections
}) => {
  const labels = LABELS.admin.map.assignmentControls

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof handleAssignUnit !== 'function') {
    console.error(labels.errors.handleAssignUnitRequired)
    return null
  }

  if (typeof clearSelections !== 'function') {
    console.error(labels.errors.clearSelectionsRequired)
    return null
  }

  if (!selectedEmergency && !selectedUnit) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-medium p-4 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {selectedEmergency && selectedUnit ? (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h4 className="font-exo font-semibold text-gray-800">{labels.readyToAssign.title}</h4>
                <p className="text-sm text-gray-600">
                  <strong>{labels.readyToAssign.emergency}</strong> {selectedEmergency.affiliateInfo?.name} •
                  <strong>{labels.readyToAssign.unit}</strong> {selectedUnit.ambulance?.unit_id}
                </p>
              </div>
              <button
                onClick={() => handleAssignUnit(selectedEmergency, selectedUnit)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-exo font-medium transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-check"></i>
                <span>{labels.button.assign}</span>
              </button>
            </div>
          ) : selectedEmergency ? (
            <div>
              <h4 className="font-exo font-semibold text-gray-800">{labels.emergencySelected.title}</h4>
              <p className="text-sm text-gray-600">
                {selectedEmergency.affiliateInfo?.name} - {selectedEmergency.description}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {labels.emergencySelected.instruction}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="font-exo font-semibold text-gray-800">{labels.unitSelected.title}</h4>
              <p className="text-sm text-gray-600">
                {selectedUnit.ambulance?.unit_id} - {selectedUnit.profile?.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">{labels.unitSelected.instruction}</p>
            </div>
          )}
        </div>
        <button onClick={clearSelections} className="text-gray-400 hover:text-gray-600 ml-4">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default AssignmentControls
