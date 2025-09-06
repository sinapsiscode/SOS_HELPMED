/**
 * Constantes para la gestión de afiliados
 * Importa valores desde la configuración centralizada
 */

import { RELATIONSHIP_TYPES, AFFILIATE_STATUS, AFFILIATE_LIMITS } from '../config/constants'
import { LABELS } from '../config/labels'

// Re-exportar desde configuración centralizada
export { RELATIONSHIP_TYPES, AFFILIATE_STATUS, AFFILIATE_LIMITS }

// Estados de afiliados (alias para compatibilidad)
export const AFFILIATE_STATUSES = AFFILIATE_STATUS

// Labels para estados de afiliados
export const AFFILIATE_STATUS_LABELS = {
  [AFFILIATE_STATUS.ACTIVE]: LABELS.admin.affiliates.status.active,
  [AFFILIATE_STATUS.INACTIVE]: LABELS.admin.affiliates.status.inactive
}

// Clases CSS para badges de estado de afiliados
export const AFFILIATE_STATUS_CLASSES = {
  [AFFILIATE_STATUS.ACTIVE]: 'bg-green-100 text-green-800 border-green-200',
  [AFFILIATE_STATUS.INACTIVE]: 'bg-red-100 text-red-800 border-red-200'
}

// Labels para tipos de relación
export const RELATIONSHIP_LABELS = {
  [RELATIONSHIP_TYPES.SPOUSE]: LABELS.admin.affiliates.relationships.spouse,
  [RELATIONSHIP_TYPES.CHILD]: LABELS.admin.affiliates.relationships.child,
  [RELATIONSHIP_TYPES.FATHER]: LABELS.admin.affiliates.relationships.father,
  [RELATIONSHIP_TYPES.MOTHER]: LABELS.admin.affiliates.relationships.mother,
  [RELATIONSHIP_TYPES.SIBLING]: LABELS.admin.affiliates.relationships.sibling,
  [RELATIONSHIP_TYPES.OTHER]: LABELS.admin.affiliates.relationships.other
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

// Mensajes de error específicos para afiliados
export const ERROR_MESSAGES = {
  GENERIC: LABELS.messages.error,
  AFFILIATE_NOT_FOUND: LABELS.admin.affiliates.messages.notFound,
  DUPLICATE_DNI: LABELS.admin.affiliates.messages.duplicateDni,
  LIMIT_REACHED: LABELS.admin.affiliates.messages.limitReached,
  INVALID_DATA: LABELS.forms.validation.required,
  REQUIRED_FIELDS: LABELS.messages.requiredFields
}

// Mensajes de éxito para afiliados
export const SUCCESS_MESSAGES = {
  AFFILIATE_ADDED: LABELS.admin.affiliates.messages.addSuccess,
  AFFILIATE_UPDATED: LABELS.admin.affiliates.messages.updateSuccess,
  AFFILIATE_DELETED: LABELS.admin.affiliates.messages.deleteSuccess,
  STATUS_CHANGED: LABELS.admin.affiliates.messages.statusChanged,
  CHANGES_SAVED: LABELS.messages.success
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