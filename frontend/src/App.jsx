import { useEffect, Suspense } from 'react'
import useAppStore from './stores/useAppStore'
import SplashScreen from './components/SplashScreen'
import LoginScreen from './components/LoginScreen'
import OfflineManager from './components/shared/OfflineManager'
import ErrorBoundary from './components/shared/ErrorBoundary'
import {
  LazyAdminDashboard,
  LazyFamiliarDashboard,
  LazyCorporateDashboard,
  LazyExternalDashboard,
  LazyExternalAdminDashboard,
  LazyAmbulanceDashboard,
  registerServiceWorker,
  PerformanceMonitor
} from './utils/performance'

function App() {
  const { currentScreen, isLoading } = useAppStore()

  useEffect(() => {
    // Performance monitoring
    PerformanceMonitor.start('app-initialization')

    // Register service worker for offline functionality
    registerServiceWorker()

    // Show splash screen on app start
    setTimeout(() => {
      useAppStore.setState({ currentScreen: 'login' })
      PerformanceMonitor.end('app-initialization')
    }, 2000)
  }, [])

  const renderScreen = () => {
    console.log('Rendering screen:', currentScreen)
    
    const LoadingSpinner = () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />
      case 'login':
        return <LoginScreen />
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyFamiliarDashboard />
          </Suspense>
        )
      case 'admin':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyAdminDashboard />
            </Suspense>
          </ErrorBoundary>
        )
      case 'corporate':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyCorporateDashboard />
          </Suspense>
        )
      case 'external':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyExternalDashboard />
          </Suspense>
        )
      case 'external-admin':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyExternalAdminDashboard />
          </Suspense>
        )
      case 'ambulance':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyAmbulanceDashboard />
          </Suspense>
        )
      default:
        return <LoginScreen />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {renderScreen()}
        {currentScreen !== 'splash' && currentScreen !== 'login' && <OfflineManager />}
      </div>
    </ErrorBoundary>
  )
}

export default App
