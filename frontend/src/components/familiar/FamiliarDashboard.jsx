// Dashboard principal para usuarios familiares (todos los sub-planes)
// ✅ REFACTORIZADO: Extraída lógica a hooks especializados y componentes separados
// ✅ Reducido de 1684 líneas a menos de 200 líneas
// ✅ Separación clara de responsabilidades

import { useState, useRef, useEffect } from 'react'
import useAppStore from '../../stores/useAppStore'
import useSurveyManagement from '../../hooks/useSurveyManagement'
import useEmergencyRequests from '../../hooks/useEmergencyRequests'
import useHighPrecisionLocation from '../../hooks/useHighPrecisionLocation'
import useSOSEmergency from '../../hooks/useSOSEmergency'
import FamiliarHeader from './components/FamiliarHeader'
import ActiveEmergencyBanner from './components/ActiveEmergencyBanner'
import OverviewTab from './tabs/OverviewTab'
import LimitsTab from './tabs/LimitsTab'
import BenefitsTab from './tabs/BenefitsTab'
import AffiliatesTab from './tabs/AffiliatesTab'
import MedicalHistoryTab from './tabs/MedicalHistoryTab'
import ProgrammedTransfer from './ProgrammedTransfer'
import SatisfactionSurvey from '../shared/SatisfactionSurvey'

/**
 * Dashboard refactorizado para usuarios familiares
 * ✅ Cumple reglas de refactorización:
 * - Regla #2: Lógica compleja extraída a hooks
 * - Regla #3: Componentes separados en archivos individuales
 * - Regla #5: Estados distribuidos y especializados
 * - Regla #13: Optimización con hooks composables
 */
const FamiliarDashboard = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const {
    currentUser,
    currentEmergency,
    emergencyStatus,
    requestEmergency,
    pendingSurveys,
    submitSurvey
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [activeTab, setActiveTab] = useState('overview')
  const [showSurvey, setShowSurvey] = useState(false)
  const [currentSurveyData, setCurrentSurveyData] = useState(null)
  const watchIdRef = useRef(null)

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const { showServiceQualitySurvey } = useSurveyManagement(currentUser)
  const { isGettingLocation, getHighPrecisionLocation } = useHighPrecisionLocation()
  const emergencyHook = useEmergencyRequests(requestEmergency, showServiceQualitySurvey)
  const sosHook = useSOSEmergency(getHighPrecisionLocation, emergencyHook.handleEmergencyRequest)

  // ============================================
  // EFECTOS
  // ============================================
  useEffect(() => {
    const currentWatchId = watchIdRef.current
    return () => {
      if (currentWatchId) {
        navigator.geolocation.clearWatch(currentWatchId)
      }
    }
  }, [])

  // Verificar si hay encuestas pendientes
  useEffect(() => {
    if (pendingSurveys && pendingSurveys.length > 0 && !showSurvey && !currentSurveyData) {
      setTimeout(() => {
        const nextSurvey = pendingSurveys[0]
        setCurrentSurveyData(nextSurvey)
        setShowSurvey(true)
      }, 30000)
    }
  }, [pendingSurveys, showSurvey, currentSurveyData])

  // ============================================
  // VALIDACIÓN DE USUARIO
  // ============================================
  if (!currentUser || currentUser.role !== 'FAMILIAR') {
    return <div>Error: Usuario no válido</div>
  }

  // ============================================
  // FUNCIONES DE TAB CONTENT
  // ============================================
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            user={currentUser}
            onEmergencyRequest={emergencyHook.handleEmergencyRequest}
            currentEmergency={currentEmergency}
          />
        )
      case 'programmed-transfer':
        return <ProgrammedTransfer user={currentUser} />
      case 'limits':
        try {
          return <LimitsTab user={currentUser} />
        } catch (error) {
          console.error('Error rendering LimitsTab:', error)
          return (
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Límites y Uso</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  Error al cargar la información de límites. Por favor, recarga la página.
                </p>
              </div>
            </div>
          )
        }
      case 'benefits':
        return <BenefitsTab user={currentUser} />
      case 'affiliates':
        return <AffiliatesTab user={currentUser} />
      case 'medical-history':
        return <MedicalHistoryTab user={currentUser} />
      default:
        return (
          <OverviewTab
            user={currentUser}
            onEmergencyRequest={emergencyHook.handleEmergencyRequest}
            currentEmergency={currentEmergency}
          />
        )
    }
  }

  // ============================================
  // FUNCIONES DE ENCUESTA
  // ============================================
  const handleSurveySubmit = async (surveyData) => {
    try {
      await submitSurvey(surveyData)
      setShowSurvey(false)
      setCurrentSurveyData(null)
    } catch (error) {
      console.error('Error submitting survey:', error)
    }
  }

  // ============================================
  // TABS CONFIGURATION
  // ============================================
  const tabs = [
    { id: 'overview', label: 'Resumen', shortLabel: 'Inicio', icon: 'fas fa-home' },
    {
      id: 'programmed-transfer',
      label: 'Traslado Programado',
      shortLabel: 'Traslados',
      icon: 'fas fa-calendar-alt'
    },
    {
      id: 'limits',
      label: 'Límites y Uso',
      shortLabel: 'Límites',
      icon: 'fas fa-chart-pie'
    },
    {
      id: 'benefits',
      label: 'Beneficios',
      shortLabel: 'Beneficios',
      icon: 'fas fa-star'
    },
    {
      id: 'affiliates',
      label: 'Datos de Afiliados',
      shortLabel: 'Afiliados',
      icon: 'fas fa-users'
    },
    {
      id: 'medical-history',
      label: 'Historial Médico',
      shortLabel: 'Historial',
      icon: 'fas fa-file-medical'
    }
  ]

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para familiares */}
      <FamiliarHeader user={currentUser} />

      {/* Emergency Active Banner */}
      {currentEmergency && emergencyStatus !== 'idle' && (
        <ActiveEmergencyBanner emergency={currentEmergency} status={emergencyStatus} />
      )}

      {/* Survey Modal */}
      {showSurvey && currentSurveyData && (
        <SatisfactionSurvey
          serviceId={currentSurveyData.serviceId}
          serviceType={currentSurveyData.serviceType}
          requestDate={currentSurveyData.requestDate}
          onSubmit={handleSurveySubmit}
          onClose={() => {
            setShowSurvey(false)
            setCurrentSurveyData(null)
          }}
        />
      )}

      {/* Botón SOS Flotante */}
      <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-50">
        {/* Ondas de fondo permanentes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-400 opacity-15 animate-ripple"></div>
          <div className="absolute w-16 h-16 rounded-full bg-red-400 opacity-10 animate-ripple-delay-1"></div>
          <div className="absolute w-16 h-16 rounded-full bg-red-400 opacity-5 animate-ripple-delay-2"></div>
        </div>

        <button
          onClick={sosHook.handleSOSEmergency}
          disabled={isGettingLocation}
          className={`relative w-16 h-16 rounded-full transition-all duration-300 transform shadow-2xl ${
            isGettingLocation
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-95'
          }`}
          style={{
            animation: isGettingLocation ? 'pulse 1s infinite' : 'pulse-rings 3s infinite'
          }}
          title="Emergencia SOS - Presiona para activar protocolo de emergencia crítica"
        >
          {/* Brillo interno */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-400 to-transparent opacity-30"></div>

          {/* Contenido del botón */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
            {isGettingLocation ? (
              <i className="fas fa-satellite text-xl animate-pulse drop-shadow-lg"></i>
            ) : (
              <>
                <i className="fas fa-ambulance text-xl mb-0.5 drop-shadow-lg"></i>
                <span className="text-xs font-bold drop-shadow-md">SOS</span>
              </>
            )}
          </div>

          {/* Efecto de presión */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 active:opacity-20 transition-opacity duration-150"></div>
        </button>
      </div>

      {/* Navigation Tabs - Responsive */}
      <div className="px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 max-w-6xl mx-auto">
          <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 px-1 sm:px-2 md:px-4 overflow-x-auto scrollbar-hide md:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap min-w-0 flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <i className={`${tab.icon} text-sm sm:text-base`}></i>
                <span className="hidden sm:inline truncate">{tab.label}</span>
                <span className="sm:hidden text-xs mt-1 text-center leading-tight">
                  {tab.shortLabel}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8">{renderTabContent()}</div>
    </div>
  )
}

export default FamiliarDashboard
