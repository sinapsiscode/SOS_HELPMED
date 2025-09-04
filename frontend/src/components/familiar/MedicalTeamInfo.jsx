import React from 'react'

/**
 * Información del equipo médico
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.medicalTeam - Información del equipo médico
 * @returns {JSX.Element} Información del equipo médico
 */
const MedicalTeamInfo = ({ medicalTeam }) => {
  if (!medicalTeam || medicalTeam.length === 0) {
    return (
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center font-exo">
          <i className="fas fa-user-md mr-2 text-red-600"></i>
          Equipo Médico
        </h3>
        <div className="text-center py-4">
          <i className="fas fa-users text-gray-300 text-2xl mb-2"></i>
          <p className="text-gray-500 text-sm font-roboto">Información no disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center font-exo">
        <i className="fas fa-user-md mr-2 text-red-600"></i>
        Equipo Médico
      </h3>
      <div className="space-y-3">
        {medicalTeam.map((member, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className={`${member.icon || 'fas fa-user'} text-gray-600`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate font-exo">{member.name}</p>
              <p className="text-sm text-gray-600 font-roboto">{member.role}</p>
            </div>
            {/* Indicador de especialización */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.role === 'Médico'
                  ? 'bg-red-100 text-red-800'
                  : member.role === 'Paramédico'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {member.role === 'Médico' ? 'MD' : member.role === 'Paramédico' ? 'PM' : 'CD'}
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional del equipo */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <i className="fas fa-info-circle text-blue-600 mt-0.5 flex-shrink-0"></i>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1 font-exo">Equipo especializado disponible</p>
            <ul className="text-xs space-y-1 font-roboto">
              <li>• Equipo de reanimación cardiopulmonar</li>
              <li>• Medicamentos de emergencia</li>
              <li>• Monitor de signos vitales</li>
              <li>• Equipo de trauma básico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalTeamInfo
