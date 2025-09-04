// Archivo principal de mockdata para facilitar importaciones

// Configuración de planes
export * from './plans/plan-config.js'

// Usuarios por tipo
export { ADMIN_USERS, SYSTEM_METRICS, SYSTEM_ALERTS } from './users/admin-users.js'
export { FAMILIAR_USERS } from './users/familiar-users.js'
export { CORPORATE_USERS } from './users/corporate-users.js'
export { EXTERNAL_USERS } from './users/external-users.js'
export { EXTERNAL_ADMIN_USERS } from './users/external-admin-users.js'
export { AMBULANCE_USERS } from './users/ambulance-users.js'

// Servicios
export * from './services/emergency-services.js'

// Importar todos los usuarios para la función de autenticación
import { ADMIN_USERS } from './users/admin-users.js'
import { FAMILIAR_USERS } from './users/familiar-users.js'
import { CORPORATE_USERS } from './users/corporate-users.js'
import { EXTERNAL_USERS } from './users/external-users.js'
import { EXTERNAL_ADMIN_USERS } from './users/external-admin-users.js'
import { AMBULANCE_USERS } from './users/ambulance-users.js'

// Función principal para obtener usuario por credenciales
export const authenticateUser = (username, password) => {
  // Buscar en todos los tipos de usuarios incluyendo ambulancias
  const allUsers = [
    ...ADMIN_USERS,
    ...FAMILIAR_USERS,
    ...CORPORATE_USERS,
    ...EXTERNAL_USERS,
    ...EXTERNAL_ADMIN_USERS,
    ...AMBULANCE_USERS
  ]

  const user = allUsers.find((u) => u.username === username && u.password === password)

  if (user) {
    // No devolver la contraseña por seguridad
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}

// Función para obtener todos los usuarios (para admin)
export const getAllUsers = () => {
  return {
    admin: ADMIN_USERS.map((u) => ({ ...u, password: undefined })),
    familiar: FAMILIAR_USERS.map((u) => ({ ...u, password: undefined })),
    corporativo: CORPORATE_USERS.map((u) => ({ ...u, password: undefined })),
    externo: EXTERNAL_USERS.map((u) => ({ ...u, password: undefined })),
    externo_admin: EXTERNAL_ADMIN_USERS.map((u) => ({ ...u, password: undefined })),
    ambulancia: AMBULANCE_USERS.map((u) => ({ ...u, password: undefined }))
  }
}

// Función para obtener estadísticas generales del sistema
export const getSystemStats = () => {
  const totalUsers = FAMILIAR_USERS.length + CORPORATE_USERS.length + EXTERNAL_USERS.length
  const activeEmergencies = 8 // Simulado

  return {
    totalUsers,
    activeEmergencies,
    userDistribution: {
      familiar: FAMILIAR_USERS.length,
      corporativo: CORPORATE_USERS.length,
      externo: EXTERNAL_USERS.length
    }
  }
}

// Funciones de validación para límites de servicios
export const validateServiceLimits = (userId, serviceType) => {
  // Esta función será implementada según el tipo de usuario
  // Por ahora retorna true para permitir servicios
  return true
}

// Función para simular uso de servicio
export const useService = (userId, serviceType, description, location) => {
  const timestamp = new Date().toISOString()

  const newService = {
    id: `serv_${Date.now()}`,
    user_id: userId,
    service_type: serviceType,
    date: timestamp.split('T')[0],
    time: timestamp.split('T')[1].split('.')[0],
    status: 'in_progress',
    description,
    location,
    unit_assigned: null, // Se asignará automáticamente
    response_time: null,
    duration: null,
    cost: 0,
    rating: null,
    notes: null
  }

  return newService
}

// Función helper para obtener usuario por ID
export const getUserById = (userId) => {
  const allUsers = [
    ...ADMIN_USERS,
    ...FAMILIAR_USERS,
    ...CORPORATE_USERS,
    ...EXTERNAL_USERS,
    ...EXTERNAL_ADMIN_USERS
  ]

  return allUsers.find((u) => u.id === userId)
}

// Función helper para obtener usuarios por tipo
export const getUsersByType = (userType) => {
  switch (userType) {
    case 'ADMIN':
      return ADMIN_USERS
    case 'FAMILIAR':
      return FAMILIAR_USERS
    case 'CORPORATIVO':
      return CORPORATE_USERS
    case 'EXTERNO':
      return EXTERNAL_USERS
    case 'EXTERNO_ADMIN':
      return EXTERNAL_ADMIN_USERS
    default:
      return []
  }
}
