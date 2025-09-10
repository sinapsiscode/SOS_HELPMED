// Configuración centralizada de constantes
export const APP_CONFIG = {
  name: 'HelpMED',
  logo: '/Logo-Helpmed-negativo.png',
  version: '1.0.0'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  AMBULANCE: 'ambulance',
  FAMILIAR: 'familiar',
  CORPORATE: 'corporate'
}

export const SERVICE_TYPES = {
  MEDICAL: 'medical',
  MECHANICAL: 'mechanical',
  FIRE: 'fire',
  POLICE: 'police'
}

export const EMERGENCY_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const AMBULANCE_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance'
}

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
}

export const CONTACT_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

export const MAP_CONFIG = {
  defaultCenter: [-12.046374, -77.042793], // Lima, Perú
  defaultZoom: 12,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
}

export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  datetime: 'DD/MM/YYYY HH:mm',
  api: 'YYYY-MM-DD',
  time: 'HH:mm',
  locale: 'es-CL'
}

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100]
}

export const VALIDATION = {
  phoneRegex: /^\+?[0-9]{9,15}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  dniRegex: /^[0-9]{8}$/,
  rucRegex: /^[0-9]{11}$/,
  nameRegex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
}

export const RELATIONSHIP_TYPES = {
  SPOUSE: 'conyuge',
  CHILD: 'hijo',
  FATHER: 'padre',
  MOTHER: 'madre',
  SIBLING: 'hermano',
  OTHER: 'otro'
}

export const AFFILIATE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

export const AFFILIATE_LIMITS = {
  BASIC: 3,
  PREMIUM: 8,
  CORPORATE: 50,
  UNLIMITED: -1
}

export const AMBULANCE_TYPES = {
  AMBULANCE: 'Ambulancia',
  MOTORIZED_DOCTOR: 'Médico motorizado',
  CAR_DOCTOR: 'Médico en auto'
}

export const MEDICAL_TEAM_TYPES = {
  NURSING_TECH: 'tecnico_enfermeria',
  NURSING_LICENSE: 'licenciado_enfermeria',
  BOTH: 'ambos'
}

export const AMBULANCE_DEFAULTS = {
  PASSWORD: 'temp123',
  CAPACITY: 2,
  TYPE: 'Ambulancia',
  MEDICAL_TEAM: 'tecnico_enfermeria',
  STATUS: 'active'
}

export const FILE_LIMITS = {
  CONTRACT_PDF: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf']
  }
}

export const ICON_MAPPINGS = {
  dashboard: 'fas fa-tachometer-alt',
  users: 'fas fa-users',
  'clipboard-list': 'fas fa-clipboard-list',
  'building-office': 'fas fa-building',
  truck: 'fas fa-truck',
  'exclamation-triangle': 'fas fa-exclamation-triangle',
  phone: 'fas fa-phone',
  cog: 'fas fa-cog',
  'chart-bar': 'fas fa-chart-bar',
  'clipboard-check': 'fas fa-clipboard-check',
  bell: 'fas fa-bell',
  default: 'fas fa-file'
}