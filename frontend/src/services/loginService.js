/**
 * Servicio especializado para manejo de login
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicio especializado con responsabilidad única
 * ✅ Regla #2: Lógica de negocio separada de componentes
 * ✅ Regla #6: Manejo centralizado de credenciales y errores
 *
 * Responsabilidades:
 * - Gestión de credenciales de acceso rápido
 * - Validación de tipos de usuario
 * - Manejo de errores de login
 * - Configuración de usuarios demo
 */
class LoginService {
  constructor() {
    // Credenciales que existen en db.json y mockdata
    this.quickLoginCredentials = {
      admin: {
        username: 'admin',
        password: 'admin123'
      },
      ambulance: {
        username: 'conductor',
        password: 'conductor123'
      },
      familiar: {
        username: 'familiar',
        password: 'familiar123'
      },
      // Planes familiares
      help_user: {
        username: 'help_user',
        password: 'help123'
      },
      basico_user: {
        username: 'basico_user',
        password: 'basico123'
      },
      vip_user: {
        username: 'vip_user',
        password: 'vip123'
      },
      dorado_user: {
        username: 'dorado_user',
        password: 'dorado123'
      },
      // Corporativos
      empresa_abc: {
        username: 'empresa_abc',
        password: 'corp123'
      },
      empresa_xyz: {
        username: 'empresa_xyz',
        password: 'corp456'
      },
      hotel_plaza: {
        username: 'hotel_plaza',
        password: 'hotel789'
      },
      // Externos
      externo1: {
        username: 'externo1',
        password: 'ext123'
      },
      externo1_b: {
        username: 'externo1_b',
        password: 'ext124'
      },
      externo2: {
        username: 'externo2',
        password: 'ext456'
      },
      externo2_b: {
        username: 'externo2_b',
        password: 'ext457'
      },
      externo2_c: {
        username: 'externo2_c',
        password: 'ext458'
      },
      // Administradores externos
      bcr_admin: {
        username: 'bcr_admin',
        password: 'bcr123'
      },
      coopeservidores_admin: {
        username: 'coopeservidores_admin',
        password: 'coope123'
      }
    }

    // Configuración de categorías de usuario que existen en db.json y mockdata
    this.userCategories = {
      admin: {
        name: 'ADMINISTRADOR',
        color: 'red',
        users: ['admin']
      },
      ambulancia: {
        name: 'AMBULANCIAS',
        color: 'orange',
        users: ['ambulance']
      },
      familiar: {
        name: 'PLANES FAMILIARES',
        color: 'green',
        users: ['familiar', 'help_user', 'basico_user', 'vip_user', 'dorado_user']
      },
      corporativo: {
        name: 'CORPORATIVO',
        color: 'purple',
        users: ['empresa_abc', 'empresa_xyz', 'hotel_plaza']
      },
      externo: {
        name: 'EXTERNOS',
        color: 'indigo',
        users: ['externo1', 'externo1_b', 'externo2', 'externo2_b', 'externo2_c']
      },
      externo_admin: {
        name: 'ADMIN EXTERNOS',
        color: 'teal',
        users: ['bcr_admin', 'coopeservidores_admin']
      }
    }

    // Información detallada solo de usuarios que existen
    this.userDetails = {
      admin: { displayName: 'Administrador', description: 'admin / admin123' },
      ambulance: { displayName: 'Conductor', description: 'conductor / conductor123' },
      familiar: { displayName: 'Familiar', description: 'familiar / familiar123' },
      // Planes familiares
      help_user: { displayName: 'Plan Help', description: 'help_user / help123' },
      basico_user: { displayName: 'Plan Básico', description: 'basico_user / basico123' },
      vip_user: { displayName: 'Plan VIP', description: 'vip_user / vip123' },
      dorado_user: { displayName: 'Plan Dorado', description: 'dorado_user / dorado123' },
      // Corporativos
      empresa_abc: { displayName: 'Empresa ABC', description: 'empresa_abc / corp123' },
      empresa_xyz: { displayName: 'Centro Médico XYZ', description: 'empresa_xyz / corp456' },
      hotel_plaza: { displayName: 'Hotel Plaza', description: 'hotel_plaza / hotel789' },
      // Externos
      externo1: { displayName: 'Externo Caso 1A', description: 'externo1 / ext123' },
      externo1_b: { displayName: 'Externo Caso 1B', description: 'externo1_b / ext124' },
      externo2: { displayName: 'Externo Caso 2A', description: 'externo2 / ext456' },
      externo2_b: { displayName: 'Externo Caso 2B', description: 'externo2_b / ext457' },
      externo2_c: { displayName: 'Externo Caso 2C', description: 'externo2_c / ext458' },
      // Administradores externos
      bcr_admin: { displayName: 'Admin BCR', description: 'bcr_admin / bcr123' },
      coopeservidores_admin: { displayName: 'Admin Coopeservidores', description: 'coopeservidores_admin / coope123' }
    }
  }

  /**
   * Obtiene las credenciales para login rápido
   */
  getQuickLoginCredentials(type) {
    const credentials = this.quickLoginCredentials[type]

    if (!credentials) {
      // Fallback al admin si el tipo no existe
      return this.quickLoginCredentials.admin
    }

    return credentials
  }

  /**
   * Obtiene información de una categoría de usuario
   */
  getUserCategory(categoryKey) {
    return this.userCategories[categoryKey]
  }

  /**
   * Obtiene todas las categorías de usuario
   */
  getAllUserCategories() {
    return this.userCategories
  }

  /**
   * Obtiene detalles de un usuario específico
   */
  getUserDetails(userType) {
    return (
      this.userDetails[userType] || {
        displayName: userType,
        description: `${userType} / ***`
      }
    )
  }

  /**
   * Obtiene usuarios por categoría
   */
  getUsersByCategory(categoryKey) {
    const category = this.userCategories[categoryKey]
    if (!category) return []

    return category.users.map((userType) => ({
      type: userType,
      ...this.getUserDetails(userType),
      credentials: this.getQuickLoginCredentials(userType)
    }))
  }

  /**
   * Valida si un tipo de usuario existe
   */
  isValidUserType(type) {
    return type in this.quickLoginCredentials
  }

  /**
   * Obtiene el color asociado a un tipo de usuario
   */
  getUserColor(userType) {
    // Buscar en qué categoría está el usuario
    for (const [categoryKey, category] of Object.entries(this.userCategories)) {
      if (category.users.includes(userType)) {
        return category.color
      }
    }
    return 'gray' // Color por defecto
  }

  /**
   * Muestra error de login estándar
   */
  showLoginError(errorMessage) {
    alert('Error de login: ' + errorMessage)
  }

  /**
   * Muestra error de login rápido
   */
  showQuickLoginError(errorMessage) {
    alert('Error en acceso rápido: ' + errorMessage)
  }

  /**
   * Valida credenciales básicas
   */
  validateCredentials(username, password) {
    if (!username || !username.trim()) {
      return {
        isValid: false,
        error: 'El nombre de usuario es requerido'
      }
    }

    if (!password || !password.trim()) {
      return {
        isValid: false,
        error: 'La contraseña es requerida'
      }
    }

    if (username.length < 3) {
      return {
        isValid: false,
        error: 'El nombre de usuario debe tener al menos 3 caracteres'
      }
    }

    if (password.length < 6) {
      return {
        isValid: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      }
    }

    return { isValid: true }
  }

  /**
   * Genera estadísticas de usuarios demo
   */
  getDemoStats() {
    const totalUsers = Object.keys(this.quickLoginCredentials).length
    const categories = Object.keys(this.userCategories).length

    return {
      totalUsers,
      categories,
      usersByCategory: Object.entries(this.userCategories).reduce((acc, [key, category]) => {
        acc[key] = category.users.length
        return acc
      }, {})
    }
  }
}

// Exportar instancia singleton
export const loginService = new LoginService()
