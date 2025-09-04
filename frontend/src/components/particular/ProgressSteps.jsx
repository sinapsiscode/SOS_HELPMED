import React from 'react'

/**
 * Indicador de pasos del flujo particular
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.currentStep - Paso actual del flujo
 * @returns {JSX.Element} Indicador de progreso
 */
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 'service', label: 'Servicio', number: 1 },
    { id: 'payment', label: 'Pago', number: 2 },
    { id: 'confirmation', label: 'Confirmación', icon: 'fas fa-check' }
  ]

  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepIndicator
              step={step}
              isActive={currentStep === step.id}
              isCompleted={getStepIndex(currentStep) > index}
            />

            {/* Separador entre pasos */}
            {index < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-300"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/**
 * Indicador individual de paso
 */
const StepIndicator = ({ step, isActive, isCompleted }) => {
  const getStepColor = () => {
    if (step.id === 'confirmation' && (isActive || isCompleted)) {
      return 'text-green-600'
    }
    if (isActive || isCompleted) {
      return 'text-red-600'
    }
    return 'text-gray-400'
  }

  const getCircleClasses = () => {
    const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center border-2'

    if (step.id === 'confirmation' && (isActive || isCompleted)) {
      return `${baseClasses} border-green-600 bg-green-600 text-white`
    }

    if (isActive || isCompleted) {
      return `${baseClasses} border-red-600 bg-red-600 text-white`
    }

    return `${baseClasses} border-gray-300`
  }

  return (
    <div className={`flex items-center ${getStepColor()}`}>
      <div className={getCircleClasses()}>
        {step.icon ? <i className={`${step.icon} text-sm`}></i> : step.number}
      </div>
      <span className="ml-2 text-sm font-medium">{step.label}</span>
    </div>
  )
}

/**
 * Obtiene el índice numérico del paso actual
 */
const getStepIndex = (currentStep) => {
  const stepIndexes = {
    service: 0,
    payment: 1,
    confirmation: 2
  }
  return stepIndexes[currentStep] || 0
}

export default ProgressSteps
