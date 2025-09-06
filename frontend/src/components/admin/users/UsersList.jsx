import React from 'react'
import { useUsersList } from '../../../hooks/useUsersList'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.users.usersList.comments.title}
 * ${LABELS.admin.users.usersList.comments.approach}
 * ${LABELS.admin.users.usersList.comments.optimization}
 *
 * @param {Array} users - Lista de usuarios
 * @param {Function} onUpdate - Callback para actualizar usuario
 * @param {Function} onDelete - Callback para eliminar usuario
 */
const UsersList = React.memo(({ users, onUpdate, onDelete }) => {
  const labels = LABELS.admin.users.usersList
  
  // Validación de props (Regla #4)
  if (!Array.isArray(users)) {
    console.error(labels.errors.usersArray)
    return null
  }
  if (typeof onUpdate !== 'function') {
    console.error(labels.errors.onUpdateFunction)
    return null
  }
  if (typeof onDelete !== 'function') {
    console.error(labels.errors.onDeleteFunction)
    return null
  }
  // ============================================
  // HOOK - Solo lógica de negocio compleja
  // ============================================
  const { processedUsers, isEmpty, handleStatusToggle, handleDelete, error } = useUsersList(
    users,
    onUpdate,
    onDelete
  )


  // Manejo de errores consistente (Regla #8)
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-600">{labels.errors.loadingError.replace('{error}', error)}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {labels.buttons.retry}
        </button>
      </div>
    )
  }

  // ============================================
  // RENDER CONDICIONAL - Estado vacío
  // ============================================
  if (isEmpty) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">{labels.emptyState.message}</p>
      </div>
    )
  }

  // ============================================
  // RENDER - Template con clases estáticas
  // ============================================
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.user}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.role}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.plan}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.status}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.registrationDate}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.headers.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* Columna Usuario */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{user.initial}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Columna Rol */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>

                {/* Columna Plan */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.plan}</td>

                {/* Columna Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={user.statusClasses}>{user.statusLabel}</span>
                </td>

                {/* Columna Fecha */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.formattedDate}
                </td>

                {/* Columna Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={async () => {
                      const result = await handleStatusToggle(user.id, user.newStatus)
                      if (!result.success) {
                        alert(labels.errors.errorPrefix.replace('{error}', result.error))
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    {user.toggleButtonText}
                  </button>
                  <button
                    onClick={async () => {
                      const result = await handleDelete(user)
                      if (!result.success) {
                        alert(labels.errors.errorPrefix.replace('{error}', result.error))
                      }
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    {labels.buttons.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

UsersList.displayName = 'UsersList'

export default UsersList
