/**
 * Constantes para la gestión de afiliados
 * Centraliza valores hardcodeados y configuraciones
 */

// Estados de afiliados
export const AFFILIATE_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

// Labels para estados de afiliados
export const AFFILIATE_STATUS_LABELS = {
  [AFFILIATE_STATUSES.ACTIVE]: 'ACTIVO',
  [AFFILIATE_STATUSES.INACTIVE]: 'INACTIVO'
}

// Clases CSS para badges de estado de afiliados
export const AFFILIATE_STATUS_CLASSES = {
  [AFFILIATE_STATUSES.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [AFFILIATE_STATUSES.INACTIVE]: 'bg-red-100 text-red-800 border-red-200'
}

// Tipos de relación familiar
export const RELATIONSHIP_TYPES = {
  SPOUSE: 'conyuge',
  CHILD: 'hijo',
  FATHER: 'padre',
  MOTHER: 'madre',
  SIBLING: 'hermano',
  OTHER: 'otro'
}

// Labels para tipos de relación
export const RELATIONSHIP_LABELS = {
  [RELATIONSHIP_TYPES.SPOUSE]: 'Cónyuge',
  [RELATIONSHIP_TYPES.CHILD]: 'Hijo/a',
  [RELATIONSHIP_TYPES.FATHER]: 'Padre',
  [RELATIONSHIP_TYPES.MOTHER]: 'Madre',
  [RELATIONSHIP_TYPES.SIBLING]: 'Hermano/a',
  [RELATIONSHIP_TYPES.OTHER]: 'Otro'
}

// Opciones para selectores de relación
export const RELATIONSHIP_OPTIONS = [
  { value: RELATIONSHIP_TYPES.SPOUSE, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.SPOUSE] },
  { value: RELATIONSHIP_TYPES.CHILD, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.CHILD] },
  { value: RELATIONSHIP_TYPES.FATHER, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.FATHER] },
  { value: RELATIONSHIP_TYPES.MOTHER, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.MOTHER] },
  { value: RELATIONSHIP_TYPES.SIBLING, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.SIBLING] },
  { value: RELATIONSHIP_TYPES.OTHER, label: RELATIONSHIP_LABELS[RELATIONSHIP_TYPES.OTHER] }
]

// Límites de afiliados por plan
export const AFFILIATE_LIMITS = {
  BASIC: 3,
  PREMIUM: 8,
  CORPORATE: 50,
  UNLIMITED: -1 // Sin límite
}

// Mensajes de error específicos para afiliados
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error inesperado',
  AFFILIATE_NOT_FOUND: 'Afiliado no encontrado',
  DUPLICATE_DNI: 'Ya existe un afiliado con este DNI',
  LIMIT_REACHED: 'Se ha alcanzado el límite máximo de afiliados para este plan',
  INVALID_DATA: 'Los datos del afiliado son inválidos',
  REQUIRED_FIELDS: 'Nombre y DNI son campos obligatorios'
}

// Mensajes de éxito para afiliados
export const SUCCESS_MESSAGES = {
  AFFILIATE_ADDED: 'Afiliado agregado correctamente',
  AFFILIATE_UPDATED: 'Afiliado actualizado correctamente',
  AFFILIATE_DELETED: 'Afiliado eliminado correctamente',
  STATUS_CHANGED: 'Estado del afiliado cambiado correctamente',
  CHANGES_SAVED: 'Los cambios han sido guardados correctamente'
}

// Validaciones
export const VALIDATION_RULES = {
  DNI: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 12,
    PATTERN: /^[0-9]+$/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  PHONE: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    PATTERN: /^\+?[\d\s\-()]+$/
  },
  AGE: {
    MIN: 0,
    MAX: 120
  }
}

// Configuración de formularios
export const FORM_CONFIG = {
  DEFAULT_RELATIONSHIP: RELATIONSHIP_TYPES.CHILD,
  REQUIRED_FIELDS: ['name', 'dni'],
  OPTIONAL_FIELDS: ['phone', 'birthDate'],
  DATE_FORMAT: 'YYYY-MM-DD'
}

// Configuración de UI
export const UI_CONFIG = {
  MODAL_Z_INDEX: 60,
  CARD_HOVER_SHADOW: 'hover:shadow-medium',
  TRANSITION_DURATION: 'transition-all duration-200'
}
