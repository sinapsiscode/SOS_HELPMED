import React, { useState, useRef, useEffect } from 'react'
import useAppStore from '../stores/useAppStore'

const Header = () => {
  const { currentUser, logout, notifications } = useAppStore()
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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/public/Logo-Helpmed-negativo.png" 
              alt="Help MED Logo" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1 text-right">
              <h2 className="font-exo font-semibold text-gray-800 text-sm sm:text-base truncate">
                {currentUser?.name}
              </h2>
              <p className="text-xs sm:text-sm font-roboto text-gray-600 truncate">
                {currentUser?.membership}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-helpmed-blue transition-colors">
              <i className="fas fa-bell text-lg sm:text-xl"></i>
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  <span className="text-xs">{notifications.length}</span>
                </div>
              )}
            </button>

            {/* Avatar with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative flex-shrink-0 cursor-pointer"
                title="Perfil de usuario"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-helpmed-blue to-primary-blue rounded-full flex items-center justify-center hover:ring-2 hover:ring-helpmed-blue hover:ring-opacity-50 transition-all">
                  <span className="text-white font-exo font-bold text-base sm:text-lg">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">{currentUser?.membership}</p>
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

export default Header
