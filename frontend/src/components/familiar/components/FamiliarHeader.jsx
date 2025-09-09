import React, { useState, useRef, useEffect } from 'react'
import useAppStore from '../../../stores/useAppStore'

/**
 * Componente Header específico para familiares
 * ✅ Separado del componente principal
 * ✅ Props claramente definidos
 * ✅ Responsabilidad única: Header display and logout
 */
const FamiliarHeader = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { logout } = useAppStore()

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Alineado con posición de "Resumen" */}
          <div className="flex items-center pl-6 sm:pl-10 md:pl-20">
            <img 
              src="/public/Logo-Helpmed-negativo.png" 
              alt="Help MED Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Sección Derecha */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Estado del plan - visible en desktop */}
            <div className="hidden md:flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Plan Activo</span>
            </div>

            {/* Notificaciones */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
              <i className="fas fa-bell text-lg sm:text-xl"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                <span className="text-xs">3</span>
              </div>
            </button>

            {/* Información del usuario */}
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {user.profile.name}
              </p>
              <p className="text-xs text-gray-600 truncate max-w-[150px]">
                {user.profile.email}
              </p>
            </div>

            {/* Avatar con dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-green-400 transition-all"
                aria-label="Menu de usuario"
                aria-expanded={isDropdownOpen}
              >
                <span className="text-white font-bold text-base">
                  {user.profile.name.charAt(0)}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-fade-in">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.profile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {user.profile.email}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      {user.plan.name}
                    </span>
                  </div>
                  
                  {/* Menu Options */}
                  <div className="py-1">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <i className="fas fa-user-circle text-gray-400"></i>
                      Mi Perfil
                    </button>
                    
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <i className="fas fa-bell text-gray-400"></i>
                      Notificaciones
                    </button>

                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <i className="fas fa-question-circle text-gray-400"></i>
                      Ayuda
                    </button>
                  </div>
                  
                  {/* Logout Section */}
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estado del plan - visible en mobile */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Plan Activo</span>
            </div>
            <div className="text-xs text-gray-500">
              Renueva: {user?.plan?.renewal_date ? new Date(user.plan.renewal_date).toLocaleDateString('es-CL') : 'No disponible'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default FamiliarHeader