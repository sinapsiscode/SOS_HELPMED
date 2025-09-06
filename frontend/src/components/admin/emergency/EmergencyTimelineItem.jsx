import React from 'react'
import { useEmergencyTracking } from '../../../hooks/useEmergencyTracking'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.emergency.emergencyTimelineItem.comments.title}
 * ${LABELS.admin.emergency.emergencyTimelineItem.comments.approach}
 */
const EmergencyTimelineItem = ({
  emergency,
  onSelect,
  onAssignUnit,
  onUpdateStatus,
  onAddNote,
  isSelected
}) => {
  const { getPriorityColor, getStatusColor, getElapsedTime } = useEmergencyTracking()
  const labels = LABELS.admin.emergency.emergencyTimelineItem

  if (!emergency) return null

  return (
    <div
      className={`p-4 cursor-pointer transition-colors border-l-4 ${
        isSelected ? 'bg-blue-50 border-l-blue-500' : 'hover:bg-gray-50 border-l-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <i
              className={`fas fa-exclamation-triangle text-xl ${getPriorityColor(emergency.priority)}`}
            ></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-800">{emergency.id}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}
              >
                {emergency.status.replace('_', ' ')}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(emergency.priority)}`}>
                {emergency.priority}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>
                <i className="fas fa-user mr-1"></i>
                {emergency.patient?.name}
              </span>
              <span>
                <i className="fas fa-map-marker-alt mr-1"></i>
                {emergency.location?.landmark}
              </span>
              <span>
                <i className="fas fa-clock mr-1"></i>{labels.time.elapsed.replace('{time}', getElapsedTime(emergency.startTime))}
              </span>
              {emergency.assignedUnit && (
                <span className="text-blue-600">
                  <i className="fas fa-ambulance mr-1"></i>
                  {emergency.assignedUnit.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {!emergency.assignedUnit && emergency.status === labels.status.pending && onAssignUnit && (
            <button
              onClick={() => onAssignUnit(emergency)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
            >
              {labels.buttons.assignUnit}
            </button>
          )}
          {emergency.status !== labels.status.completed && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(emergency, labels.status.completed)}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
            >
              {labels.buttons.complete}
            </button>
          )}
          {onAddNote && (
            <button
              onClick={() => onAddNote(emergency)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
            >
              {labels.buttons.addNote}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmergencyTimelineItem
