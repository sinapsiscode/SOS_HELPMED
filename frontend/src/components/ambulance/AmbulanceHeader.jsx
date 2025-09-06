import React, { useState, useRef, useEffect } from 'react'
import useAppStore from '../../stores/useAppStore'
import { APP_CONFIG } from '../../config/constants'
import { LABELS } from '../../config/labels'
import { MOCK_DATA } from '../../config/mockData'

/**
 * Header específico para el dashboard de ambulancia
 * Diseño basado en la imagen proporcionada con Panel Ambulancia
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario conductor
 * @returns {JSX.Element} Header de ambulancia
 */
const AmbulanceHeader = ({ user }) => {
  const { logout } = useAppStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Sección Izquierda - Logo y Título */}
          <div className="flex items-center space-x-4">
            {/* Logo HelpMED */}
            <img 
              src={APP_CONFIG.logo} 
              alt={`${APP_CONFIG.name} Logo`} 
              className="h-10 w-auto object-contain"
            />
            
            {/* Información del panel */}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{LABELS.ambulance.title}</h1>
              <p className="text-sm text-gray-600">
                {LABELS.ambulance.header.driver}: {user?.profile?.name || user?.name || MOCK_DATA.defaultUsers.ambulance.name}
              </p>
            </div>
          </div>

          {/* Sección Derecha - Info del usuario y dropdown */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.profile?.name || user?.name || MOCK_DATA.defaultUsers.ambulance.name}
              </p>
              <p className="text-xs text-gray-600">
                {LABELS.ambulance.header.unit}: {user?.ambulance_unit || MOCK_DATA.defaultUsers.ambulance.ambulance_unit}
              </p>
            </div>

            {/* Avatar con dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                title="Perfil de usuario"
              >
                <span className="text-white font-bold text-base">
                  {(user?.profile?.name || user?.name || MOCK_DATA.defaultUsers.ambulance.name)?.charAt(0) || 'C'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile?.name || user?.name || MOCK_DATA.defaultUsers.ambulance.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {LABELS.ambulance.header.unit}: {user?.ambulance_unit || MOCK_DATA.defaultUsers.ambulance.ambulance_unit}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-3 text-red-400"></i>
                      {LABELS.buttons.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AmbulanceHeader