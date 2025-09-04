import React, { useState, useRef, useEffect } from 'react'

/**
 * Encabezado del dashboard corporativo - Con logo Help MED
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario corporativo
 * @param {Function} props.onLogout - Función para cerrar sesión
 * @returns {JSX.Element} Encabezado corporativo
 */
const CorporateHeader = ({ user, onLogout }) => {
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
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Sección Izquierda */}
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
            <div className="hidden md:flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-700">Plan Activo</span>
            </div>

            {/* Información del usuario */}
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {user.profile?.name || user.company?.name}
              </p>
              <p className="text-xs text-gray-600 truncate max-w-[150px]">
                {user.profile?.position || 'Administrador Corporativo'}
              </p>
            </div>

            {/* Avatar con dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
                title="Perfil de usuario"
              >
                <span className="text-white font-bold text-base">
                  {(user.profile?.name || user.company?.name)?.charAt(0) || 'A'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.profile?.name || user.company?.name}</p>
                    <p className="text-xs text-gray-500">{user.profile?.position || 'Administrador Corporativo'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        onLogout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-3 text-red-400"></i>
                      Cerrar Sesión
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

export default CorporateHeader
