import React from 'react'

/**
 * Paso del progreso de emergencia
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.icon - Icono del paso
 * @param {string} props.title - Título del paso
 * @param {boolean} props.completed - Si el paso está completado
 * @param {string} props.time - Tiempo del paso
 * @returns {JSX.Element} Paso de progreso
 */
const ProgressStep = ({ icon, title, completed, time }) => {
  return (
    <div
      className={`flex items-center space-x-4 p-3 rounded-lg ${
        completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <StepIcon icon={icon} completed={completed} />
      <StepContent title={title} time={time} completed={completed} />
      {completed && <CompletedIndicator />}
    </div>
  )
}

/**
 * Icono del paso
 */
const StepIcon = ({ icon, completed }) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
      }`}
    >
      <i className={completed ? 'fas fa-check' : icon}></i>
    </div>
  )
}

/**
 * Contenido del paso
 */
const StepContent = ({ title, time, completed }) => {
  return (
    <div className="flex-1">
      <h4 className={`font-semibold font-exo ${completed ? 'text-green-800' : 'text-gray-600'}`}>
        {title}
      </h4>
      {time && (
        <p className={`text-sm font-roboto ${completed ? 'text-green-600' : 'text-gray-500'}`}>
          {time}
        </p>
      )}
    </div>
  )
}

/**
 * Indicador de completado
 */
const CompletedIndicator = () => {
  return <i className="fas fa-check-circle text-green-500 text-xl"></i>
}

export default ProgressStep
