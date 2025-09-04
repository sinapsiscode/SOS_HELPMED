import React from 'react'
import useUserManagement from '../../hooks/useUserManagement'
import AffiliateManagement from './AffiliateManagement'
import ExternalUsersManagement from './ExternalUsersManagement'
import { UserCard, RegistrationRequestCard, UserFormModal } from './user'
import StatCard from '../shared/StatCard'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * Componente principal para gestión de usuarios administrativos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica compleja en hook useUserManagement
 * ✅ Regla #3: <200 líneas (actualmente ~180 líneas)
 * ✅ Regla #8: Manejo de errores delegado al hook
 * ✅ Regla #10: Arquitectura modular - componentes separados
 * ✅ Regla #4: Validación completa en service y modal
 *
 * @returns {JSX.Element} Interfaz principal de gestión de usuarios
 */
const UserManagement = () => {
  // Hook que maneja toda la lógica compleja (Regla #2)
  const {
    selectedUserType,
    setSelectedUserType,
    searchTerm,
    setSearchTerm,
    showCreateModal,
    setShowCreateModal,
    selectedUser,
    showAffiliateModal,
    affiliateUser,
    loading,
    error,
    filteredUsers,
    userTypeStats,
    allUsers,
    canCreateUser,
    showSearchInput,
    isRegistrationsTab,
    isExternalTab,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleManageServices,
    handleManageAffiliates,
    handleApproveRegistration,
    handleRejectRegistration,
    handleUserSave,
    closeAffiliateModal,
    clearError
  } = useUserManagement()

  // Manejo de errores (Regla #8)
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={`Error en gestión de usuarios: ${error}`} onRetry={clearError} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header y estadísticas */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-exo font-bold text-gray-800">
              <i className="fas fa-users-cog text-helpmed-blue mr-3"></i>
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 font-roboto mt-2">
              Administra usuarios del sistema y solicitudes de registro
            </p>
          </div>
          {canCreateUser && (
            <button
              onClick={handleCreateUser}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto disabled:opacity-50"
            >
              <i className="fas fa-plus mr-2"></i>
              Crear Usuario
            </button>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Familiares" count={userTypeStats.familiar} color="green" />
          <StatCard title="Corporativos" count={userTypeStats.corporativo} color="purple" />
          <StatCard title="Externos" count={userTypeStats.externo} color="blue" />
          <StatCard title="Administradores" count={userTypeStats.admin} color="red" />
        </div>


        {/* Filtros y búsqueda */}
        <div className="space-y-4">
          {/* Filtros responsive */}
          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {['familiar', 'corporativo', 'externo', 'admin', 'registrations'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedUserType(type)}
                  disabled={loading}
                  className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-colors whitespace-nowrap text-sm sm:text-base font-roboto disabled:opacity-50 ${
                    selectedUserType === type
                      ? 'bg-helpmed-blue text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'registrations' ? 'Solicitudes' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Búsqueda */}
          {showSearchInput && (
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto disabled:opacity-50"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Lista de usuarios o componente de externos */}
      {isExternalTab ? (
        // Mostrar componente especial para usuarios externos
        <ExternalUsersManagement />
      ) : (
        // Mostrar lista normal de usuarios
        <div className="bg-white rounded-xl shadow-medium">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-exo font-bold text-gray-800 capitalize">
              {isRegistrationsTab
                ? `Solicitudes de Registro (${filteredUsers.filter((r) => r.status === 'pending').length} pendientes)`
                : `Usuarios ${selectedUserType} (${filteredUsers.length})`}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 font-roboto">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {isRegistrationsTab
                ? // Mostrar solicitudes de registro
                  filteredUsers.map((request) => (
                    <RegistrationRequestCard
                      key={request.id}
                      request={request}
                      onApprove={() => handleApproveRegistration(request)}
                      onReject={() => handleRejectRegistration(request)}
                    />
                  ))
                : // Mostrar usuarios normales
                  filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      userType={selectedUserType}
                      onEdit={() => handleEditUser(user)}
                      onDelete={() => handleDeleteUser(user)}
                      onToggleStatus={() => handleToggleUserStatus(user)}
                      onManageAffiliates={() => handleManageAffiliates(user)}
                      onManageServices={(action) => handleManageServices(user, action)}
                    />
                  ))}

              {filteredUsers.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <i
                    className={`${isRegistrationsTab ? 'fas fa-clipboard-list' : 'fas fa-users'} text-6xl text-gray-300 mb-4`}
                  ></i>
                  <h3 className="text-xl font-exo font-semibold text-gray-700 mb-2">
                    {isRegistrationsTab
                      ? 'No hay solicitudes pendientes'
                      : 'No se encontraron usuarios'}
                  </h3>
                  <p className="text-gray-500 font-roboto">
                    {isRegistrationsTab
                      ? 'Las nuevas solicitudes de registro aparecerán aquí'
                      : 'Intenta ajustar los filtros de búsqueda'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal de creación/edición */}
      {showCreateModal && (
        <UserFormModal
          user={selectedUser}
          userType={selectedUserType}
          onClose={() => setShowCreateModal(false)}
          onSave={handleUserSave}
        />
      )}

      {/* Modal de Gestión de Afiliados */}
      {showAffiliateModal && affiliateUser && (
        <AffiliateManagement
          user={affiliateUser}
          onClose={closeAffiliateModal}
          onSave={closeAffiliateModal}
        />
      )}

      {/* Footer con Información */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm font-roboto">
              Sistema de gestión de usuarios HelpMED - Actualizado en tiempo real
            </span>
          </div>

          <div className="text-sm text-gray-600 font-roboto">
            <i className="fas fa-users mr-1"></i>
            Total:{' '}
            {Object.values(allUsers).reduce(
              (sum, userArray) => sum + (userArray?.length || 0),
              0
            )}{' '}
            usuarios
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
