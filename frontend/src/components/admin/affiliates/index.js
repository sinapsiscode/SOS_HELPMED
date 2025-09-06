/**
 * Barrel exports for affiliate components
 * Centralizes all affiliate-related component exports
 */

// Modal components
export { default as AddAffiliateModal } from './AddAffiliateModal'
export { default as EditAffiliateModal } from './EditAffiliateModal'

// Display components
export { default as AffiliateCard } from './AffiliateCard'
export { default as AffiliatesList } from './AffiliatesList'

// Form components
export { default as FormComponents } from './FormComponents'

// Re-export individual form components for convenience
export {
  FormField,
  SelectField,
  ErrorAlert,
  LoadingSpinner,
  ModalHeader,
  FormButtons
} from './FormComponents'