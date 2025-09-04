/**
 * Constantes para el dashboard de administrador
 * Centraliza valores hardcodeados para facilitar mantenimiento
 */

// Estados de usuarios
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
}

// Labels para estados de usuario
export const USER_STATUS_LABELS = {
  [USER_STATUSES.ACTIVE]: 'Activo',
  [USER_STATUSES.INACTIVE]: 'Inactivo',
  [USER_STATUSES.SUSPENDED]: 'Suspendido'
}

// Clases CSS para badges de estado
export const USER_STATUS_CLASSES = {
  [USER_STATUSES.ACTIVE]: 'bg-green-100 text-green-800',
  [USER_STATUSES.INACTIVE]: 'bg-gray-100 text-gray-800',
  [USER_STATUSES.SUSPENDED]: 'bg-red-100 text-red-800'
}

// Configuración de stats cards
export const STATS_COLORS = {
  BLUE: 'blue',
  RED: 'red',
  GREEN: 'green',
  PURPLE: 'purple',
  YELLOW: 'yellow',
  GRAY: 'gray'
}

// Mapeo de colores a clases CSS
export const STATS_COLOR_CLASSES = {
  [STATS_COLORS.BLUE]: 'bg-blue-50 text-blue-700 border-blue-200',
  [STATS_COLORS.RED]: 'bg-red-50 text-red-700 border-red-200',
  [STATS_COLORS.GREEN]: 'bg-green-50 text-green-700 border-green-200',
  [STATS_COLORS.PURPLE]: 'bg-purple-50 text-purple-700 border-purple-200',
  [STATS_COLORS.YELLOW]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [STATS_COLORS.GRAY]: 'bg-gray-50 text-gray-700 border-gray-200'
}

// Iconos para tabs del dashboard
export const TAB_ICONS = {
  DASHBOARD: '📊',
  USERS: '👥',
  CLIPBOARD_LIST: '📋',
  BUILDING_OFFICE: '🏢',
  TRUCK: '🚛',
  EXCLAMATION_TRIANGLE: '⚠️',
  PHONE: '📞',
  COG: '⚙️',
  CHART_BAR: '📈',
  CLIPBOARD_CHECK: '✅',
  BELL: '🔔'
}

// Mapeo de nombres de iconos a emojis
export const ICON_MAP = {
  dashboard: TAB_ICONS.DASHBOARD,
  users: TAB_ICONS.USERS,
  'clipboard-list': TAB_ICONS.CLIPBOARD_LIST,
  'building-office': TAB_ICONS.BUILDING_OFFICE,
  truck: TAB_ICONS.TRUCK,
  'exclamation-triangle': TAB_ICONS.EXCLAMATION_TRIANGLE,
  phone: TAB_ICONS.PHONE,
  cog: TAB_ICONS.COG,
  'chart-bar': TAB_ICONS.CHART_BAR,
  'clipboard-check': TAB_ICONS.CLIPBOARD_CHECK,
  bell: TAB_ICONS.BELL
}

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

// Timeouts para operaciones
export const TIMEOUTS = {
  API_CALL: 5000,
  LOADING_MIN: 500,
  AUTO_REFRESH: 30000,
  DEBOUNCE_SEARCH: 300
}

// Mensajes de error estándar
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error inesperado',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'El recurso solicitado no fue encontrado',
  VALIDATION: 'Los datos ingresados no son válidos'
}

// Mensajes de éxito estándar
export const SUCCESS_MESSAGES = {
  USER_UPDATED: 'Usuario actualizado correctamente',
  USER_DELETED: 'Usuario eliminado correctamente',
  SETTINGS_SAVED: 'Configuración guardada correctamente',
  DATA_REFRESHED: 'Datos actualizados correctamente'
}

// Límites de validación
export const VALIDATION_LIMITS = {
  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_LENGTH: 50,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255
}
