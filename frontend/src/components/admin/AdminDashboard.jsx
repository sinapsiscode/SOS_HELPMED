import React, { lazy, Suspense } from 'react'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { AdminTabNavigation } from './dashboard'
import { AdminHeader } from './shared'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import ErrorBoundary from '../shared/ErrorBoundary'
import { LABELS } from '../../config/labels'

// Lazy loading de TODOS los componentes
const OverviewTab = lazy(() => import('./dashboard/OverviewTab'))
const UsersTab = lazy(() => import('./dashboard/UsersTab'))
const ContactRequestsTab = lazy(() => import('./dashboard/ContactRequestsTab'))
const CorporateContractManagement = lazy(() => import('./CorporateContractManagement'))
const ReportsAnalytics = lazy(() => import('./reports')) // Modularizado en carpeta reports/
const SurveyManagement = lazy(() => import('./SurveyManagement'))
const AmbulanceManagement = lazy(() => import('./AmbulanceManagement'))
const PlanConfiguration = lazy(() => import('./PlanConfiguration'))
const NotificationSystem = lazy(() => import('./NotificationSystem'))
const SystemConfiguration = lazy(() => import('./SystemConfiguration'))
const EmergencyTracking = lazy(() => import('./EmergencyTracking'))
const RevenueManagement = lazy(() => import('./RevenueManagement'))
const RegistrationManagement = lazy(() => import('./RegistrationManagement'))
const ExternalEntityManagement = lazy(() => import('./ExternalEntityManagement'))
const AffiliateManagement = lazy(() => import('./AffiliateManagement'))
const ExternalUsersManagement = lazy(() => import('./ExternalUsersManagement'))
const AssignmentMap = lazy(() => import('./AssignmentMap'))

/**
 * ${LABELS.admin.adminDashboard.comments.title}
 */
const AdminDashboard = () => {
  const labels = LABELS.admin.adminDashboard
  const { activeTab, setActiveTab, tabs, user, loading, error } = useAdminDashboard()

  // Validación de props y datos
  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage
          message={labels.errors.loadingError.replace('{error}', error)}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{labels.errors.authenticationError}</h2>
          <p className="text-gray-600">{labels.errors.userNotFound}</p>
        </div>
      </div>
    )
  }

  if (!Array.isArray(tabs) || tabs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{labels.errors.configurationError}</h2>
          <p className="text-gray-600">{labels.errors.tabsLoadError}</p>
        </div>
      </div>
    )
  }

  // Validación de acceso
  const hasAccess = user?.role === 'ADMIN'

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{labels.errors.accessDenied}</h2>
          <p className="text-gray-600">{labels.errors.noAdminPermissions}</p>
        </div>
      </div>
    )
  }

  // Mapeo de componentes con TODOS los módulos disponibles
  const renderActiveTab = () => {
    const TabComponent = (() => {
      switch (activeTab) {
        case 'overview':
          return OverviewTab
        case 'users':
          return UsersTab
        case 'requests':
          return ContactRequestsTab
        case 'contracts':
          return CorporateContractManagement
        case 'reports':
          return ReportsAnalytics
        case 'surveys':
          return SurveyManagement
        case 'units':
          return AmbulanceManagement
        case 'plans':
          return PlanConfiguration
        case 'notifications':
          return NotificationSystem
        case 'settings':
          return SystemConfiguration
        case 'emergencies':
          return EmergencyTracking
        case 'revenue':
          return RevenueManagement
        case 'registrations':
          return RegistrationManagement
        case 'external':
          return ExternalEntityManagement
        case 'affiliates':
          return AffiliateManagement
        case 'external-users':
          return ExternalUsersManagement
        case 'map':
          return AssignmentMap
        default:
          return OverviewTab
      }
    })()

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton />}>
          <TabComponent onTabChange={setActiveTab} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <AdminTabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </div>
    </div>
  )
}

export default AdminDashboard