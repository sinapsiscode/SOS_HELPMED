import { useMemo } from 'react'
import { useAdminDashboard } from './useAdminDashboard'

/**
 * Hook que maneja TODA la lógica del AdminDashboard
 * El componente NO tomará ninguna decisión, solo mostrará lo que este hook provee
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @returns {Object} Todo lo necesario para el componente UI
 */
export const useAdminDashboardUI = () => {
  // ============================================
  // HOOK BASE - Datos del dashboard
  // ============================================
  const { activeTab, setActiveTab, tabs, user } = useAdminDashboard()

  // ============================================
  // VALIDACIÓN DE ACCESO
  // ============================================

  /**
   * Determina si el usuario tiene acceso
   * Toda la lógica de decisión está aquí
   */
  const accessControl = useMemo(() => {
    const hasUser = Boolean(user)
    const isAdmin = user?.role === 'ADMIN'
    const hasAccess = hasUser && isAdmin

    return {
      hasAccess,
      hasUser,
      isAdmin,
      showAccessDenied: !hasAccess
    }
  }, [user])

  /**
   * Configuración para la pantalla de acceso denegado
   */
  const accessDeniedScreen = useMemo(
    () => ({
      visible: accessControl.showAccessDenied,
      container: 'min-h-screen bg-gray-50 flex items-center justify-center',
      content: {
        wrapper: 'text-center',
        title: {
          text: 'Acceso Denegado',
          className: 'text-xl font-semibold text-red-600'
        },
        message: {
          text: 'No tienes permisos de administrador',
          className: 'text-gray-600'
        }
      }
    }),
    [accessControl.showAccessDenied]
  )

  // ============================================
  // CONFIGURACIÓN DE TABS
  // ============================================

  /**
   * Mapeo de tabs a componentes
   * El componente no necesita lógica switch
   */
  const tabComponents = useMemo(
    () => ({
      overview: {
        id: 'overview',
        component: 'OverviewTab',
        visible: true
      },
      users: {
        id: 'users',
        component: 'UsersTab',
        visible: true
      },
      requests: {
        id: 'requests',
        component: 'ContactRequestsTab',
        visible: true
      },
      contracts: {
        id: 'contracts',
        component: 'CorporateContractManagement',
        visible: true
      },
      units: {
        id: 'units',
        component: 'AmbulanceManagement',
        visible: true
      },
      emergencies: {
        id: 'emergencies',
        component: 'ReportsAnalytics',
        visible: true
      },
      plans: {
        id: 'plans',
        component: 'PlanConfiguration',
        visible: true
      },
      settings: {
        id: 'settings',
        component: 'SettingsTab',
        visible: true
      }
    }),
    []
  )

  /**
   * Determina qué componente mostrar
   * Toda la lógica está aquí, no en el componente
   */
  const activeTabComponent = useMemo(() => {
    const component = tabComponents[activeTab] || tabComponents.overview
    return {
      name: component.component,
      id: component.id,
      key: `tab-${component.id}`
    }
  }, [activeTab, tabComponents])

  // ============================================
  // CONFIGURACIÓN DE LAYOUT
  // ============================================

  /**
   * Clases CSS organizadas por sección
   */
  const layoutClasses = useMemo(
    () => ({
      mainContainer: 'min-h-screen bg-gray-50',
      contentWrapper: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
    }),
    []
  )

  // ============================================
  // CONFIGURACIÓN DEL HEADER
  // ============================================

  /**
   * Props para el AdminHeader
   */
  const headerProps = useMemo(
    () => ({
      user: user || { name: '', email: '' },
      visible: accessControl.hasAccess
    }),
    [user, accessControl.hasAccess]
  )

  // ============================================
  // CONFIGURACIÓN DE NAVEGACIÓN
  // ============================================

  /**
   * Props para el AdminTabNavigation
   */
  const navigationProps = useMemo(
    () => ({
      tabs: tabs || [],
      activeTab: activeTab || 'overview',
      onTabChange: setActiveTab,
      visible: accessControl.hasAccess
    }),
    [tabs, activeTab, setActiveTab, accessControl.hasAccess]
  )

  // ============================================
  // ESTADO DEL DASHBOARD
  // ============================================

  /**
   * Estado completo del dashboard
   */
  const dashboardState = useMemo(
    () => ({
      isReady: true,
      hasAccess: accessControl.hasAccess,
      currentTab: activeTab,
      totalTabs: tabs?.length || 0
    }),
    [accessControl.hasAccess, activeTab, tabs]
  )

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Estado de acceso
    access: {
      control: accessControl,
      deniedScreen: accessDeniedScreen
    },

    // Configuración del dashboard
    dashboard: {
      state: dashboardState,
      layout: layoutClasses,
      activeComponent: activeTabComponent
    },

    // Props para subcomponentes
    header: headerProps,
    navigation: navigationProps,

    // Helpers
    shouldRenderDashboard: accessControl.hasAccess
  }
}
