import React from 'react'

/**
 * Header del componente de Solicitudes de Contacto
 * Incluye título, descripción y filtros
 * Extraído del ContactRequestsTab monolítico
 */
const ContactRequestsHeader = ({ filter, serviceFilter, onFilterChange, onServiceFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Solicitudes de Contacto</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Clientes que requieren ampliación de servicios
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgencia:</label>
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todas</option>
              <option value="crítica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Servicio:</label>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos</option>
              <option value="EMERGENCIA">Emergencias</option>
              <option value="URGENCIA">Urgencias</option>
              <option value="MEDICO_DOMICILIO">Médico a Domicilio</option>
              <option value="TRASLADO_PROGRAMADO">Traslados</option>
              <option value="ZONA_PROTEGIDA">Zona Protegida</option>
              <option value="EXAMENES_LABORATORIO">Exámenes Lab.</option>
              <option value="ORIENTACION_TELEFONICA">Orientación Tel.</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactRequestsHeader