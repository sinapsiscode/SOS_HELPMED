// Configuración de API y endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
// MOCK_API_URL is deprecated - not used anymore

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },

  // Users
  users: {
    list: '/users',
    get: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    profile: '/users/profile'
  },

  // Emergencies
  emergencies: {
    list: '/emergencies',
    get: (id) => `/emergencies/${id}`,
    create: '/emergencies',
    update: (id) => `/emergencies/${id}`,
    assign: (id) => `/emergencies/${id}/assign`,
    complete: (id) => `/emergencies/${id}/complete`,
    cancel: (id) => `/emergencies/${id}/cancel`,
    track: (id) => `/emergencies/${id}/track`
  },

  // Ambulances
  ambulances: {
    list: '/ambulances',
    get: (id) => `/ambulances/${id}`,
    create: '/ambulances',
    update: (id) => `/ambulances/${id}`,
    updateStatus: (id) => `/ambulances/${id}/status`,
    updateLocation: (id) => `/ambulances/${id}/location`,
    available: '/ambulances/available'
  },

  // Affiliates
  affiliates: {
    list: '/affiliates',
    get: (id) => `/affiliates/${id}`,
    create: '/affiliates',
    update: (id) => `/affiliates/${id}`,
    delete: (id) => `/affiliates/${id}`,
    activate: (id) => `/affiliates/${id}/activate`,
    suspend: (id) => `/affiliates/${id}/suspend`
  },

  // Contracts
  contracts: {
    list: '/contracts',
    get: (id) => `/contracts/${id}`,
    create: '/contracts',
    update: (id) => `/contracts/${id}`,
    cancel: (id) => `/contracts/${id}/cancel`,
    renew: (id) => `/contracts/${id}/renew`
  },

  // Reports
  reports: {
    dashboard: '/reports/dashboard',
    emergencies: '/reports/emergencies',
    financial: '/reports/financial',
    performance: '/reports/performance',
    export: '/reports/export'
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    preferences: '/notifications/preferences'
  },
  // Settings
  settings: {
    general: '/settings/general',
    update: '/settings/update',
    backup: '/settings/backup',
    restore: '/settings/restore'
  }
}

// URLs externas
export const EXTERNAL_URLS = {
  googleMaps: 'https://maps.google.com',
  waze: 'https://waze.com',
  whatsapp: 'https://wa.me',
  support: 'https://helpmed.com/support',
  documentation: 'https://docs.helpmed.com'
}

// Configuración de WebSocket
export const WEBSOCKET_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:4001',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10
}
