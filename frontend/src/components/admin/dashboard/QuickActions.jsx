import React from 'react'
import Swal from 'sweetalert2'
import { LABELS } from '../../../config/labels'

/**
 * Componente de Acciones Rápidas
 * Proporciona acceso rápido a las funciones más utilizadas del dashboard
 * Extraído del AdminDashboard monolítico durante refactorización
 * 
 * @param {Function} onTabChange - Función para cambiar de tab en el dashboard
 */
const QuickActions = ({ onTabChange }) => {
  const labels = LABELS.admin.dashboard.quickActions
  
  const handleAction = (action, tabId) => {
    if (tabId && onTabChange) {
      // Si hay un tabId y función de cambio, navegar a ese tab
      onTabChange(tabId)
    } else {
      // Fallback: mostrar mensaje si no hay navegación disponible
      Swal.fire({
        title: labels.alert.title,
        text: labels.alert.text.replace('{action}', action),
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const actions = labels.actions

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        {labels.title}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action.name, action.tab)}
            className={`p-3 sm:p-4 border border-${action.color}-200 rounded-lg hover:bg-${action.color}-50 transition-all duration-200 text-center flex flex-col items-center justify-center group hover:shadow-lg`}
            title={action.description}
          >
            <i className={`${action.icon} text-${action.color}-600 text-lg sm:text-xl md:text-2xl mb-2 group-hover:scale-110 transition-transform`}></i>
            <div className="text-xs sm:text-sm font-medium text-gray-800 leading-tight break-words">
              {action.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions