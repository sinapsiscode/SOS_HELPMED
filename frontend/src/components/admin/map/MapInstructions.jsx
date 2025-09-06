import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.mapInstructions.comments.title}
 * ${LABELS.admin.map.mapInstructions.comments.approach}
 */
const MapInstructions = () => {
  const labels = LABELS.admin.map.mapInstructions

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 className="font-exo font-semibold text-blue-800 mb-2">
        <i className="fas fa-info-circle mr-2"></i>
        {labels.title}
      </h4>
      <div className="text-sm text-blue-700 space-y-1">
        <p>{labels.steps.step1}</p>
        <p>{labels.steps.step2}</p>
        <p>{labels.steps.step3}</p>
        <p>{labels.steps.step4}</p>
      </div>
    </div>
  )
}

export default MapInstructions
