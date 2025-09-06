import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.mapLegend.comments.title}
 * ${LABELS.admin.map.mapLegend.comments.approach}
 */
const MapLegend = () => {
  const labels = LABELS.admin.map.mapLegend

  return (
    <div className="bg-white rounded-lg shadow-medium p-4">
      <h3 className="font-exo font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-map-marker-alt mr-2"></i>
        {labels.title}
      </h3>

      <div className="space-y-3">
        <div>
          <h4 className="font-exo font-medium text-gray-700 mb-2">{labels.sections.emergencies.title}</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.emergencies.priorities.high}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.emergencies.priorities.medium}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user-md text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.emergencies.priorities.low}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-exo font-medium text-gray-700 mb-2">{labels.sections.units.title}</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.units.status.available}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.units.status.onWay}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">{labels.sections.units.status.onSite}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapLegend
