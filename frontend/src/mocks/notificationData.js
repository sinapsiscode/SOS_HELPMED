/**
 * Datos mock para sistema de notificaciones y alertas
 * REGLA #11: Separación de mock data para desarrollo
 *
 * Sistema de alertas automáticas para emergencias, servicios y contratos
 */

/**
 * Configuración inicial del sistema de notificaciones
 */
export const INITIAL_NOTIFICATION_CONFIG = {
  // Comportamiento de popups
  autoShowEmergencies: true,
  emergencyPopupDuration: 10, // segundos
  sosNeverAutoClose: true,
  playSound: true,

  // Tipos de alertas activas
  enableEmergencyAlerts: true,
  enableServiceAlerts: true,
  enableContractAlerts: true,
  enableAmbulanceAlerts: true,

  // Modo de notificación
  notificationMode: 'normal' // 'quiet' | 'normal' | 'detailed'
}

/**
 * Estados iniciales de silenciado de alertas
 */
export const INITIAL_MUTED_ALERTS = {
  emergencies: false,
  lowServices: false,
  noAmbulances: false,
  contractExpiration: false
}

/**
 * Tipos de alertas con configuración visual
 */
export const ALERT_TYPES = {
  CRITICAL: {
    value: 'critical',
    borderClass: 'border-red-300 bg-red-50',
    iconColor: 'text-red-600',
    priority: 1
  },
  WARNING: {
    value: 'warning',
    borderClass: 'border-orange-300 bg-orange-50',
    iconColor: 'text-orange-600',
    priority: 2
  },
  INFO: {
    value: 'info',
    borderClass: 'border-blue-300 bg-blue-50',
    iconColor: 'text-blue-600',
    priority: 3
  },
  SUCCESS: {
    value: 'success',
    borderClass: 'border-green-300 bg-green-50',
    iconColor: 'text-green-600',
    priority: 4
  }
}

/**
 * Modos de notificación disponibles
 */
export const NOTIFICATION_MODES = [
  {
    value: 'quiet',
    title: 'Silencioso',
    description: 'Solo alertas críticas y emergencias',
    color: 'bg-gray-100 text-gray-700'
  },
  {
    value: 'normal',
    title: 'Normal',
    description: 'Todas las alertas importantes',
    color: 'bg-green-100 text-green-700'
  },
  {
    value: 'detailed',
    title: 'Detallado',
    description: 'Información completa con coordenadas y detalles adicionales',
    color: 'bg-blue-100 text-blue-700'
  }
]

/**
 * Configuración de silenciado rápido de alertas
 */
export const MUTE_BUTTONS = [
  {
    id: 'emergencies',
    label: 'Emergencias',
    labelShort: 'Emerg.',
    icon: 'fas fa-bell-slash',
    colors: {
      active: 'bg-red-100 text-red-700 hover:bg-red-200',
      muted: 'bg-gray-200 text-gray-500 line-through'
    }
  },
  {
    id: 'lowServices',
    label: 'Servicios Bajos',
    labelShort: 'Servic.',
    icon: 'fas fa-bell-slash',
    colors: {
      active: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      muted: 'bg-gray-200 text-gray-500 line-through'
    }
  },
  {
    id: 'noAmbulances',
    label: 'Sin Ambulancias',
    labelShort: 'Ambul.',
    icon: 'fas fa-bell-slash',
    colors: {
      active: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      muted: 'bg-gray-200 text-gray-500 line-through'
    }
  },
  {
    id: 'contractExpiration',
    label: 'Contratos',
    labelShort: 'Contr.',
    icon: 'fas fa-bell-slash',
    colors: {
      active: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      muted: 'bg-gray-200 text-gray-500 line-through'
    }
  }
]

/**
 * Configuración de tipos de alertas para el panel
 */
export const ALERT_SETTINGS = [
  {
    key: 'enableEmergencyAlerts',
    label: 'Emergencias',
    description: 'Alertas por emergencias sin atender'
  },
  {
    key: 'enableServiceAlerts',
    label: 'Servicios Bajos',
    description: 'Usuarios con pocos servicios restantes'
  },
  {
    key: 'enableContractAlerts',
    label: 'Contratos por Vencer',
    description: 'Contratos corporativos próximos a vencer'
  },
  {
    key: 'enableAmbulanceAlerts',
    label: 'Sin Ambulancias',
    description: 'Cuando no hay ambulancias disponibles'
  }
]

/**
 * Configuración de sonidos para diferentes tipos de emergencia
 */
export const SOUND_CONFIG = {
  SOS: {
    frequency: 800,
    type: 'sine',
    duration: 0.5,
    gain: 0.3
  },
  NORMAL: {
    frequency: 600,
    type: 'sine',
    duration: 0.5,
    gain: 0.3
  }
}

/**
 * Tabs del sistema de notificaciones
 */
export const NOTIFICATION_TABS = [
  {
    id: 'alerts',
    label: 'Alertas Activas',
    labelShort: 'Alertas',
    icon: 'fas fa-bell'
  },
  {
    id: 'config',
    label: 'Configuración',
    labelShort: 'Config',
    icon: 'fas fa-cog'
  }
]

/**
 * Validaciones para la configuración
 */
export const CONFIG_VALIDATION = {
  emergencyPopupDuration: {
    min: 5,
    max: 60,
    default: 10
  }
}
