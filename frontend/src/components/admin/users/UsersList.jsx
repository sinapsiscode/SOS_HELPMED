import React from 'react'
import { useUsersList } from '../../../hooks/useUsersList'

/**
 * Lista de usuarios para administración
 * ENFOQUE BALANCEADO: Clases estáticas en componente, lógica compleja en hook
 * React.memo solo si se detectan problemas de performance
 *
 * @param {Array} users - Lista de usuarios
 * @param {Function} onUpdate - Callback para actualizar usuario
 * @param {Function} onDelete - Callback para eliminar usuario
 */
const UsersList = React.memo(({ users, onUpdate, onDelete }) => {
  // Validación de props (Regla #4)
  if (!Array.isArray(users)) {
    console.error('UsersList: users debe ser un array')
    return null
  }
  if (typeof onUpdate !== 'function') {
    console.error('UsersList: onUpdate debe ser una función')
    return null
  }
  if (typeof onDelete !== 'function') {
    console.error('UsersList: onDelete debe ser una función')
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
        <p className="text-red-600">Error al cargar usuarios: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
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
        <p className="text-gray-500">No se encontraron usuarios</p>
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
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
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
                        alert(`Error: ${result.error}`)
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
                        alert(`Error: ${result.error}`)
                      }
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Eliminar
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
