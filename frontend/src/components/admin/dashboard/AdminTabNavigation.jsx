import React from 'react'

/**
 * Componente de navegación por tabs para el dashboard de administrador
 * Renderiza la lista de tabs disponibles y maneja la selección
 */
const AdminTabNavigation = ({ tabs, activeTab, onTabChange }) => {
  // Mapeo de iconos usando clases de FontAwesome para evitar problemas
  const iconMap = {
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
    bell: 'fas fa-bell'
  }
  
  const getIconClass = (iconName) => {
    return iconMap[iconName] || 'fas fa-file'
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <i className={`${getIconClass(tab.icon)} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminTabNavigation
