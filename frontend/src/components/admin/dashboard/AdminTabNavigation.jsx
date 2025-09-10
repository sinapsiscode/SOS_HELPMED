import React, { useState, useRef, useEffect } from 'react'
import { ICON_MAPPINGS } from '../../../config/constants'

/**
 * Componente de navegación por tabs para el dashboard de administrador
 * Renderiza la lista de tabs disponibles y maneja la selección
 * Responsive: Menú hamburguesa en móvil, tabs horizontales en desktop
 */
const AdminTabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Cerrar menú al cambiar de tab
  const handleTabChange = (tabId) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  const getIconClass = (iconName) => {
    return ICON_MAPPINGS[iconName] || ICON_MAPPINGS.default
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <>
      {/* Navegación Móvil - Menú Hamburguesa */}
      <div className="md:hidden bg-white shadow-sm border-b sticky top-0 z-40" ref={menuRef}>
        <div className="px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between text-left"
            aria-label="Abrir menú de navegación"
          >
            <div className="flex items-center space-x-3">
              {/* Icono hamburguesa */}
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <span className={`block h-0.5 w-6 bg-gray-600 transform transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'my-1'
                }`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transform transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
              
              {/* Tab activo */}
              <div className="flex items-center">
                <i className={`${getIconClass(activeTabData?.icon)} text-blue-600 mr-2`}></i>
                <span className="font-medium text-gray-900">{activeTabData?.label}</span>
              </div>
            </div>

            {/* Indicador de expansión */}
            <i className={`fas fa-chevron-${isMobileMenuOpen ? 'up' : 'down'} text-gray-400`}></i>
          </button>
        </div>

        {/* Menú desplegable móvil */}
        <div className={`
          absolute w-full bg-white shadow-lg border-t border-gray-100
          transition-all duration-300 ease-in-out origin-top
          ${isMobileMenuOpen 
            ? 'opacity-100 scale-y-100 visible' 
            : 'opacity-0 scale-y-0 invisible h-0'
          }
        `}>
          <div className="max-h-[70vh] overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-left
                  transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }
                `}
              >
                <i className={`${getIconClass(tab.icon)} mr-3 w-5 text-center`}></i>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <i className="fas fa-check ml-auto text-blue-600"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación Desktop - Tabs Horizontales */}
      <div className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {/* Tabs con scroll horizontal mejorado */}
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center px-4 py-4 text-sm font-medium 
                    border-b-2 whitespace-nowrap transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
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
      </div>

      {/* Overlay para cerrar menú en móvil */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default AdminTabNavigation