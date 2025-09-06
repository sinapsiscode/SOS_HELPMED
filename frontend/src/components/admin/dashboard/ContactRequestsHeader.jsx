import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Header del componente de Solicitudes de Contacto
 * Incluye título, descripción y filtros
 * Extraído del ContactRequestsTab monolítico
 */
const ContactRequestsHeader = ({ filter, serviceFilter, onFilterChange, onServiceFilterChange }) => {
  const labels = LABELS.admin.dashboard.contactRequestsHeader
  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{labels.title}</h2>
          <p className="text-sm sm:text-base text-gray-600">
            {labels.subtitle}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.filters.urgency.label}:</label>
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">{labels.filters.urgency.options.all}</option>
              <option value="crítica">{labels.filters.urgency.options.critical}</option>
              <option value="alta">{labels.filters.urgency.options.high}</option>
              <option value="media">{labels.filters.urgency.options.medium}</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.filters.service.label}:</label>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">{labels.filters.service.options.all}</option>
              <option value={labels.filters.service.values.emergency}>{labels.filters.service.options.emergency}</option>
              <option value={labels.filters.service.values.urgency}>{labels.filters.service.options.urgency}</option>
              <option value={labels.filters.service.values.homeDoctor}>{labels.filters.service.options.homeDoctor}</option>
              <option value={labels.filters.service.values.programmedTransfer}>{labels.filters.service.options.programmedTransfer}</option>
              <option value={labels.filters.service.values.protectedZone}>{labels.filters.service.options.protectedZone}</option>
              <option value={labels.filters.service.values.labExams}>{labels.filters.service.options.labExams}</option>
              <option value={labels.filters.service.values.phoneOrientation}>{labels.filters.service.options.phoneOrientation}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactRequestsHeader