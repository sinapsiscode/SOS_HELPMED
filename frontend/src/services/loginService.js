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
    // Credenciales de acceso rápido para demo
    this.quickLoginCredentials = {
      admin: {
        username: 'admin',
        password: 'admin123'
      },
      help: {
        username: 'help_user',
        password: 'help123'
      },
      basico: {
        username: 'basico_user',
        password: 'basico123'
      },
      vip: {
        username: 'vip_user',
        password: 'vip123'
      },
      dorado: {
        username: 'dorado_user',
        password: 'dorado123'
      },
      corporativo: {
        username: 'empresa_abc',
        password: 'corp123'
      },
      externo1: {
        username: 'externo1',
        password: 'ext123'
      },
      externo2: {
        username: 'externo2',
        password: 'ext456'
      },
      ambulancia1: {
        username: 'ambulancia1',
        password: 'amb123'
      },
      ambulancia2: {
        username: 'ambulancia2',
        password: 'amb123'
      },
      bcr_admin: {
        username: 'bcr_admin',
        password: 'bcr123'
      }
    }

    // Configuración de categorías de usuario
    this.userCategories = {
      admin: {
        name: 'ADMINISTRADOR',
        color: 'red',
        users: ['admin']
      },
      familiar: {
        name: 'PLANES FAMILIARES',
        color: 'green',
        users: ['help', 'basico', 'vip', 'dorado']
      },
      corporativo: {
        name: 'CORPORATIVO',
        color: 'purple',
        users: ['corporativo']
      },
      ambulancia: {
        name: 'AMBULANCIAS',
        color: 'orange',
        users: ['ambulancia1', 'ambulancia2']
      },
      externo: {
        name: 'AFILIADOS EXTERNOS',
        color: 'teal',
        users: ['externo1', 'externo2']
      },
      external_admin: {
        name: 'ADMINISTRADOR EXTERNO',
        color: 'emerald',
        users: ['bcr_admin']
      }
    }

    // Información detallada de usuarios
    this.userDetails = {
      admin: { displayName: 'Administrador', description: 'admin / admin123' },
      help: { displayName: 'Help', description: 'help_user / help123' },
      basico: { displayName: 'Básico', description: 'basico_user / basico123' },
      vip: { displayName: 'VIP', description: 'vip_user / vip123' },
      dorado: { displayName: 'Dorado', description: 'dorado_user / dorado123' },
      corporativo: { displayName: 'Corporativo', description: 'empresa_abc / corp123' },
      ambulancia1: { displayName: 'Ambulancia 1', description: 'ambulancia1 / amb123' },
      ambulancia2: { displayName: 'Ambulancia 2', description: 'ambulancia2 / amb123' },
      externo1: { displayName: 'Caso 1', description: 'externo1 / ext123' },
      bcr_admin: { displayName: 'BCR Admin', description: 'bcr_admin / bcr123' }
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
