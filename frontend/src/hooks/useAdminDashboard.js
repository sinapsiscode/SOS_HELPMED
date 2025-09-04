import { useState, useEffect } from 'react'
import useAppStore from '../stores/useAppStore'

/**
 * Hook para manejar el estado principal del dashboard de administrador
 * Maneja la navegación entre tabs y el estado general de la vista
 */
export const useAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { currentUser: user } = useAppStore()

  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Panel General',
      icon: 'dashboard'
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'users'
    },
    {
      id: 'requests',
      label: 'Solicitudes Contacto',
      icon: 'phone'
    },
    {
      id: 'contracts',
      label: 'Contratos Corporativos',
      icon: 'building-office'
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'chart-bar'
    },
    {
      id: 'surveys',
      label: 'Encuestas',
      icon: 'clipboard-check'
    },
    {
      id: 'units',
      label: 'Unidades',
      icon: 'truck'
    },
    {
      id: 'plans',
      label: 'Planes',
      icon: 'clipboard-list'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'bell'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: 'cog'
    }
  ]

  return {
    activeTab,
    setActiveTab: handleTabChange,
    tabs,
    user
  }
}
