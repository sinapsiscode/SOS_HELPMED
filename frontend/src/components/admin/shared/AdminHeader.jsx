import React, { useState, useRef, useEffect } from 'react'
import { useAdminHeader } from '../../../hooks/useAdminHeader'
import useAppStore from '../../../stores/useAppStore'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.shared.adminHeader.comments.title}
 * ${LABELS.admin.shared.adminHeader.comments.approach}
 * ${LABELS.admin.shared.adminHeader.comments.logic}
 * ${LABELS.admin.shared.adminHeader.comments.optimization}
 * ${LABELS.admin.shared.adminHeader.comments.size}
 *
 * @param {Object} user - Datos del usuario
 */
const AdminHeader = React.memo(({ user }) => {
  const labels = LABELS.admin.shared.adminHeader
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { logout } = useAppStore()
  
  // ============================================
  // HOOK - Toda la lógica está aquí
  // ============================================
  const { containerClass, innerContainerClass, mainWrapperClass, leftSection, rightSection } =
    useAdminHeader(user)
    
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

  // ============================================
  // RENDER - Solo template, sin lógica
  // ============================================
  return (
    <div className={containerClass}>
      <div className={innerContainerClass}>
        <div className={mainWrapperClass}>
          {/* Sección Izquierda */}
          <div className={leftSection.className}>
            <img 
              src="/public/Logo-Helpmed-negativo.png" 
              alt={labels.logo.alt} 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Sección Derecha */}
          <div className={rightSection.className}>
            <div className={rightSection.userInfo.className}>
              <p className={rightSection.userInfo.name.className}>
                {rightSection.userInfo.name.text}
              </p>
              <p className={rightSection.userInfo.email.className}>
                {rightSection.userInfo.email.text}
              </p>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`${rightSection.avatar.className} cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all`}
                aria-label={labels.userMenu.ariaLabel}
                aria-expanded={isDropdownOpen}
              >
                <span className={rightSection.avatar.initial.className}>
                  {rightSection.avatar.initial.text}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-fade-in">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {rightSection.userInfo.name.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {rightSection.userInfo.email.text}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      {labels.userMenu.role}
                    </span>
                  </div>
                  
                  {/* Logout Section */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      {labels.userMenu.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

AdminHeader.displayName = 'AdminHeader'

export default AdminHeader
