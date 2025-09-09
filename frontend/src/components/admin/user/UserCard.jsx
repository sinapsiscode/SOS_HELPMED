import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.user.userCard.comments.title}
 * ${LABELS.admin.user.userCard.comments.rule3}
 * ${LABELS.admin.user.userCard.comments.rule2}
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Datos del usuario
 * @param {string} props.userType - Tipo de usuario
 * @param {Function} props.onEdit - Función para editar usuario
 * @param {Function} props.onDelete - Función para eliminar usuario
 * @param {Function} props.onToggleStatus - Función para cambiar estado
 * @param {Function} props.onManageAffiliates - Función para gestionar afiliados
 * @param {Function} props.onManageServices - Función para gestionar servicios
 * @returns {JSX.Element} Tarjeta de usuario responsive
 */
const UserCard = ({
  user,
  userType,
  onEdit,
  onDelete,
  onToggleStatus,
  onManageAffiliates,
  onManageServices
}) => {
  const labels = LABELS.admin.user.userCard
  const getUserDisplayInfo = () => {
    switch (userType) {
      case 'familiar':
        const affiliatesCount = user.affiliatesCount || user.affiliates?.length || 0
        const affiliatesText = labels.userTypes.familiar.affiliatesFormat
          .replace('{count}', affiliatesCount)
          .replace('{plural}', affiliatesCount !== 1 ? 's' : '')
        return {
          name: user.profile?.name,
          subtitle: `${user.plan?.name} • ${affiliatesText}`,
          email: user.profile?.email,
          phone: user.profile?.phone,
          icon: labels.icons.familiar,
          color: 'green'
        }
      case 'corporativo':
        return {
          name: user.company?.name,
          subtitle: user.profile?.name + ' - ' + user.profile?.position,
          email: user.profile?.email,
          phone: user.profile?.phone,
          icon: labels.icons.corporativo,
          color: 'purple'
        }
      case 'externo':
        return {
          name: user.profile?.name,
          subtitle: user.client_company?.name + ' - ' + user.plan?.name,
          email: user.profile?.email,
          phone: user.profile?.phone,
          icon: labels.icons.externo,
          color: 'blue'
        }
      case 'admin':
        return {
          name: user.profile?.name,
          subtitle: user.profile?.position,
          email: user.profile?.email,
          phone: user.profile?.phone,
          icon: labels.icons.admin,
          color: 'red'
        }
      default:
        return {
          name: labels.userTypes.default.name,
          subtitle: labels.userTypes.default.subtitle,
          email: '',
          phone: '',
          icon: labels.icons.default,
          color: 'gray'
        }
    }
  }

  const displayInfo = getUserDisplayInfo()
  const isActive = user.active !== false

  return (
    <>
      {/* Vista Desktop */}
      <div className="hidden sm:block p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 bg-${displayInfo.color}-100 rounded-full flex items-center justify-center`}
            >
              <i className={`${displayInfo.icon} text-${displayInfo.color}-600`}></i>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-800">{displayInfo.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isActive ? labels.status.active : labels.status.inactive}
                </span>
              </div>
              <p className="text-sm text-gray-600">{displayInfo.subtitle}</p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <span>
                  <i className="fas fa-user mr-1"></i>
                  {user.username}
                </span>
                {displayInfo.email && (
                  <span>
                    <i className="fas fa-envelope mr-1"></i>
                    {displayInfo.email}
                  </span>
                )}
                {displayInfo.phone && (
                  <span>
                    <i className="fas fa-phone mr-1"></i>
                    {displayInfo.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Contador de servicios para corporativos */}
            {userType === 'corporativo' && (
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {labels.userTypes.corporativo.servicesFormat
                  .replace('{used}', user.service_usage?.current_period?.used_services || 0)
                  .replace('{total}', user.plan?.contract_services ||
                    (user.service_usage?.current_period?.used_services || 0) +
                      (user.service_usage?.current_period?.remaining_services || 20))}
              </span>
            )}

            {/* Botón para registrar servicios consumidos - Solo para corporativos */}
            {userType === 'corporativo' && (
              <button
                onClick={() => onManageServices('consume')}
                className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center justify-center"
                title={labels.buttons.registerUsage}
              >
                <i className="fas fa-plus text-sm"></i>
              </button>
            )}

            {/* Botón para gestionar servicios adicionales - Solo para corporativos */}
            {userType === 'corporativo' && (
              <button
                onClick={() => onManageServices('add')}
                className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center justify-center"
                title={labels.buttons.manageAdditional}
              >
                <i className="fas fa-plus text-sm"></i>
              </button>
            )}

            {/* Botón para gestionar servicios adicionales - Solo para familiares */}
            {userType === 'familiar' && (
              <button
                onClick={() => onManageServices('default')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title={labels.buttons.manageAdditional}
              >
                <i className="fas fa-plus"></i>
              </button>
            )}

            {/* Botón específico para gestión de afiliados en usuarios familiares */}
            {userType === 'familiar' && (
              <button
                onClick={onManageAffiliates}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title={labels.buttons.manageAffiliates}
              >
                <i className="fas fa-users"></i>
              </button>
            )}

            <button
              onClick={onToggleStatus}
              className={`p-2 rounded-lg transition-colors ${
                isActive ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
              }`}
              title={isActive ? labels.buttons.deactivateUser : labels.buttons.activateUser}
            >
              <i className={`fas fa-${isActive ? 'pause' : 'play'}`}></i>
            </button>

            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title={labels.buttons.editUser}
            >
              <i className="fas fa-edit"></i>
            </button>

            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={labels.buttons.deleteUser}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Vista Mobile - Mobile First Design */}
      <div className="block sm:hidden bg-white border border-gray-200 rounded-lg shadow-sm mb-3 w-full max-w-[calc(100vw-16px)] mx-2">
        <div className="p-3 w-full">
          {/* Header con badges en línea - NO superpuestos */}
          <div className="space-y-3">
            {/* Primera línea: Nombre + Badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 bg-${displayInfo.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <i className={`${displayInfo.icon} text-${displayInfo.color}-600 text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {displayInfo.name}
                  </h4>
                </div>
              </div>

              {/* Badges en línea horizontal */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Badge de estado de plan/contrato para corporativos */}
                {userType === 'corporativo' && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      Math.random() > 0.5
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {Math.random() > 0.5 ? labels.planStatus.expired : labels.planStatus.health}
                  </span>
                )}

                {/* Badge de días para familiares */}
                {userType === 'familiar' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {labels.userTypes.familiar.daysFormat.replace('{days}', Math.floor(Math.random() * 30) + 1)}
                  </span>
                )}
              </div>
            </div>

            {/* Segunda línea: Solo subtítulo */}
            <div>
              <p className="text-xs text-gray-600 truncate">{displayInfo.subtitle}</p>
            </div>
          </div>

          {/* Información básica compacta */}
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">{labels.fields.contact}</span>
                <p className="font-medium text-gray-900 truncate">{displayInfo.name}</p>
              </div>
              <div>
                <span className="text-gray-500">{labels.fields.ruc}</span>
                <p className="font-medium text-gray-900">
                  {user.profile?.dni || user.company?.rut || '12345678'}-
                  {Math.floor(Math.random() * 9) + 1}
                </p>
              </div>
            </div>
          </div>

          {/* Métricas compactas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">{labels.fields.employees}</span>
              <span className="font-semibold text-gray-900 ml-1">
                {userType === 'corporativo'
                  ? user.company?.employees || 50
                  : user.affiliatesCount || 4}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{labels.fields.services}</span>
              <span className="font-semibold text-gray-900 ml-1">
                {userType === 'corporativo'
                  ? Math.floor((user.company?.employees || 50) / 4)
                  : user.plan?.services || 10}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{labels.fields.usage}</span>
              <span className="font-semibold text-blue-600 ml-1">
                {userType === 'corporativo'
                  ? labels.userTypes.corporativo.servicesFormat
                      .replace('{used}', user.service_usage?.current_period?.used_services || 0)
                      .replace('{total}', user.plan?.contract_services || (user.service_usage?.current_period?.used_services || 0) + (user.service_usage?.current_period?.remaining_services || 20))
                  : labels.userTypes.corporativo.servicesFormat
                      .replace('{used}', user.service_usage?.current_period?.used_services || Math.floor(Math.random() * 10) + 1)
                      .replace('{total}', user.plan?.services || 10)}
                <span className="text-gray-600 ml-1">
                  {labels.userTypes.corporativo.percentageFormat.replace('{percentage}',
                    userType === 'corporativo'
                      ? Math.round(
                          ((user.service_usage?.current_period?.used_services || 0) /
                            (user.plan?.contract_services ||
                              (user.service_usage?.current_period?.used_services || 0) +
                                (user.service_usage?.current_period?.remaining_services || 20))) *
                            100
                        )
                      : Math.floor(Math.random() * 80) + 20
                  )}
                </span>
              </span>
            </div>
            <div>
              <span className="text-gray-500">{labels.fields.renewal}</span>
              <span className="font-semibold text-gray-900 ml-1">
                31-{String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2025
              </span>
            </div>
          </div>

          {/* Información financiera compacta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">{labels.fields.monthlyCost}</span>
              <p className="font-bold text-green-600">
                S/ {(Math.floor(Math.random() * 500) + 200).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">{labels.fields.id}</span>
              <p className="font-mono text-gray-700 text-xs">
                {userType.toUpperCase()}-{user.username?.toUpperCase() || 'USR'}-
                {String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}
              </p>
            </div>
          </div>

          {/* Contacto compacto */}
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-500">{labels.fields.phone}</span>
              <a
                href={`tel:${displayInfo.phone || `+51927772000`}`}
                className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
              >
                {displayInfo.phone || `+51 9 ${Math.floor(Math.random() * 90000000) + 10000000}`}
              </a>
            </div>
            <div>
              <span className="text-gray-500">{labels.fields.email}</span>
              <a
                href={`mailto:${displayInfo.email || `${user.username}@email.com`}`}
                className="text-blue-600 hover:text-blue-800 ml-1 font-medium break-all text-xs"
              >
                {displayInfo.email || `${user.username}@email.com`}
              </a>
            </div>
          </div>
        </div>

        {/* Acciones - Forzar que quepa en pantalla */}
        <div className="bg-gray-50 border-t border-gray-200 p-2 w-full overflow-hidden">
          <div className="w-full space-y-2">
            {/* Botón principal */}
            <button
              onClick={onEdit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
            >
              {labels.buttons.viewDetail}
            </button>

            {/* Botones pequeños en línea */}
            <div className="flex items-center justify-center space-x-1 w-full">
              {userType === 'corporativo' && (
                <>
                  <button
                    onClick={() => onManageServices('consume')}
                    className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center"
                    title={labels.buttons.registerUseShort}
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                  <button
                    onClick={() => onManageServices('add')}
                    className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center"
                    title={labels.buttons.addServicesShort}
                  >
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </>
              )}

              {userType === 'familiar' && (
                <button
                  onClick={() => onManageServices('default')}
                  className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center"
                  title={labels.buttons.addServicesMobile}
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              )}

              {userType === 'familiar' && (
                <button
                  onClick={onManageAffiliates}
                  className="w-8 h-8 bg-purple-500 text-white rounded flex items-center justify-center"
                  title={labels.buttons.manageAffiliatesMobile}
                >
                  <i className="fas fa-users text-xs"></i>
                </button>
              )}

              <button
                onClick={onToggleStatus}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  isActive ? 'bg-yellow-500' : 'bg-green-500'
                } text-white`}
                title={labels.buttons.toggleStatusMobile}
              >
                <i className={`fas fa-${isActive ? 'pause' : 'play'} text-xs`}></i>
              </button>

              <button
                onClick={onDelete}
                className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center"
                title={labels.buttons.deleteUserMobile}
              >
                <i className="fas fa-trash text-xs"></i>
              </button>

              {isActive && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs ml-2">
                  {labels.status.online}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserCard
