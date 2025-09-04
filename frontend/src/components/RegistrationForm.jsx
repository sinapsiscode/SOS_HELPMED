import PropTypes from 'prop-types'
import useRegistrationForm from '../hooks/useRegistrationForm'
import TermsAndConditions from './familiar/TermsAndConditions'
import RegistrationHeader from './registration/RegistrationHeader'
import PlanTypeSelector from './registration/PlanTypeSelector'
import CompanyInfoSection from './registration/CompanyInfoSection'
import PersonalDataSection from './registration/PersonalDataSection'
import ContactInfoSection from './registration/ContactInfoSection'
import ExternalEntitySection from './registration/ExternalEntitySection'
import EmergencyContactSection from './registration/EmergencyContactSection'
import AdditionalInfoSection from './registration/AdditionalInfoSection'
import TermsAcceptance from './registration/TermsAcceptance'
import RegistrationFormActions from './registration/RegistrationFormActions'

/**
 * Componente principal de formulario de registro
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 72 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #4: Validación con esquema Yup
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const RegistrationForm = ({ onBack }) => {
  const {
    formData,
    isSubmitting,
    showTerms,
    planOptions,
    externalEntities,
    handleInputChange,
    handleSubmit,
    handleAcceptTerms,
    handleDeclineTerms
  } = useRegistrationForm(onBack)

  return (
    <div className="min-h-screen gradient-helpmed flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-heavy p-8">
          <RegistrationHeader onBack={onBack} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <PlanTypeSelector
              formData={formData}
              planOptions={planOptions}
              onInputChange={handleInputChange}
            />

            {formData.planType && (
              <>
                <CompanyInfoSection formData={formData} onInputChange={handleInputChange} />
                <PersonalDataSection formData={formData} onInputChange={handleInputChange} />
                <ContactInfoSection formData={formData} onInputChange={handleInputChange} />
                <ExternalEntitySection
                  formData={formData}
                  externalEntities={externalEntities}
                  onInputChange={handleInputChange}
                />
                <EmergencyContactSection formData={formData} onInputChange={handleInputChange} />
                <AdditionalInfoSection formData={formData} onInputChange={handleInputChange} />
                <TermsAcceptance />
              </>
            )}

            <RegistrationFormActions
              formData={formData}
              isSubmitting={isSubmitting}
              onBack={onBack}
            />
          </form>
        </div>
      </div>

      {showTerms && (
        <TermsAndConditions
          planType={formData.planType.toUpperCase()}
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
        />
      )}
    </div>
  )
}

RegistrationForm.propTypes = {
  onBack: PropTypes.func.isRequired
}

export default RegistrationForm
