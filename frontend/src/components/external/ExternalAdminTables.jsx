import React from 'react'

/**
 * Componentes de tablas para administradores externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 * Siguiendo Regla #10: Componentes modulares especializados
 */

/**
 * Lista de servicios recientes
 * @param {Object} props - Props del componente
 * @param {Array} props.services - Lista de servicios
 * @returns {JSX.Element} Lista de servicios recientes
 */
export const RecentServicesList = ({ services }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 font-exo">
          Servicios Recientes
        </h3>
      </div>

      <div className="max-h-80 sm:max-h-96 overflow-y-auto">
        {services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <i className="fas fa-clipboard-list text-3xl mb-4 opacity-50"></i>
            <p className="font-roboto">No hay servicios registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base text-gray-900 truncate font-exo">
                      {service.patientName}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-roboto">
                      <span className="hidden sm:inline">
                        {service.type === 'EMERGENCIA' ? 'Emergencia Médica' : 'Médico a Domicilio'}
                      </span>
                      <span className="sm:hidden">
                        {service.type === 'EMERGENCIA' ? 'Emergencia' : 'Domicilio'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-roboto">
                      {new Date(service.date).toLocaleString('es-CL')}
                    </div>
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                      service.type === 'EMERGENCIA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {service.type === 'EMERGENCIA' ? 'Emergencia' : 'Domicilio'}
                    </span>
                    <span className="sm:hidden">{service.type === 'EMERGENCIA' ? 'E' : 'D'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Tabla de empleados
 * @param {Object} props - Props del componente
 * @param {Array} props.employees - Lista de empleados
 * @param {Object} props.organization - Información de la organización
 * @returns {JSX.Element} Tabla de empleados
 */
export const EmployeesTable = ({ employees, organization }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate font-exo">
          <span className="hidden sm:inline">Empleados Afiliados - {organization.short_name}</span>
          <span className="sm:hidden">Empleados - {organization.short_name}</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-roboto">
                Empleado
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell font-roboto">
                DNI
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-roboto">
                <span className="hidden sm:inline">Servicios Usados</span>
                <span className="sm:hidden">Total</span>
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell font-roboto">
                Emergencias
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell font-roboto">
                Médico Domicilio
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell font-roboto">
                Último Servicio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate font-exo">
                    {employee.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate sm:block hidden font-roboto">
                    {employee.email}
                  </div>
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden sm:table-cell font-roboto">
                  {employee.dni}
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-900 font-exo">
                    {employee.totalServices}
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm text-gray-600 hidden md:table-cell font-roboto">
                  {employee.emergencies}
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm text-gray-600 hidden md:table-cell font-roboto">
                  {employee.homeDoctors}
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden lg:table-cell font-roboto">
                  {employee.lastService
                    ? new Date(employee.lastService).toLocaleDateString('es-CL')
                    : 'Sin servicios'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Tabla detallada de servicios
 * @param {Object} props - Props del componente
 * @param {Array} props.services - Lista de servicios
 * @returns {JSX.Element} Tabla detallada de servicios
 */
export const ServiceDetailsTable = ({ services }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase font-roboto">
                Fecha
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase font-roboto">
                Paciente
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell font-roboto">
                Tipo
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell font-roboto">
                Descripción
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell font-roboto">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-roboto">
                  <div className="hidden sm:block">
                    {new Date(service.date).toLocaleString('es-CL')}
                  </div>
                  <div className="sm:hidden">
                    {new Date(service.date).toLocaleDateString('es-CL')}
                  </div>
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate font-exo">
                    {service.patientName}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block font-roboto">
                    DNI: {service.patientDni}
                  </div>
                  <div className="sm:hidden">
                    <span
                      className={`px-1 py-0.5 rounded text-xs font-medium ${
                        service.type === 'EMERGENCIA'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {service.type === 'EMERGENCIA' ? 'E' : 'D'}
                    </span>
                  </div>
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.type === 'EMERGENCIA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {service.type === 'EMERGENCIA' ? 'Emergencia' : 'Médico Domicilio'}
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell font-roboto">
                  {service.description}
                </td>
                <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completado
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Tarjetas de reportes
 * @param {Object} props - Props del componente
 * @param {Function} props.onExport - Función para exportar
 * @returns {JSX.Element} Tarjetas de reportes
 */
export const ReportCards = ({ onExport }) => {
  const reportOptions = [
    {
      title: 'Reporte de Servicios',
      description: 'Detalle completo de todos los servicios utilizados',
      icon: 'fas fa-ambulance',
      format: 'csv',
      color: 'blue'
    },
    {
      title: 'Reporte de Empleados',
      description: 'Listado de empleados y su uso de servicios',
      icon: 'fas fa-users',
      format: 'csv',
      color: 'green'
    },
    {
      title: 'Reporte Mensual',
      description: 'Resumen mensual de actividad',
      icon: 'fas fa-calendar',
      format: 'pdf',
      color: 'purple'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {reportOptions.map((option) => (
        <div
          key={option.title}
          className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-green-300 transition-colors"
        >
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div
              className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                option.color === 'blue'
                  ? 'bg-blue-100'
                  : option.color === 'green'
                    ? 'bg-green-100'
                    : 'bg-purple-100'
              }`}
            >
              <i
                className={`${option.icon} ${
                  option.color === 'blue'
                    ? 'text-blue-600'
                    : option.color === 'green'
                      ? 'text-green-600'
                      : 'text-purple-600'
                } text-lg sm:text-xl`}
              ></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base text-gray-900 font-exo">
                {option.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-roboto">
                {option.description}
              </p>
              <button
                onClick={() => onExport(option.format)}
                className="mt-2 sm:mt-3 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors"
              >
                <span className="hidden sm:inline">Generar Reporte</span>
                <span className="sm:hidden">Generar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
