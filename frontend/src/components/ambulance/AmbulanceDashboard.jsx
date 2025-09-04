import React, { useState } from 'react'
import useAmbulanceDashboard from '../../hooks/useAmbulanceDashboard'
import AmbulanceHeader from './AmbulanceHeader'
import AmbulanceStatusCard from './AmbulanceStatusCard'
import GPSLocationCard from './GPSLocationCard'
import EmergencyTrackingSection from './EmergencyTrackingSection'
import EmergencyAssignedModal from './EmergencyAssignedModal'
import MoveAmbulanceModal from './MoveAmbulanceModal'
import AddEmergencyNoteModal from './AddEmergencyNoteModal'
import ServiceCompletionModal from './ServiceCompletionModal'
import ActiveEmergencyCard from './ActiveEmergencyCard'
import useAppStore from '../../stores/useAppStore'

/**
 * Dashboard completo de ambulancia
 * Replica exactamente el diseño mostrado en la imagen
 * Ahora modularizado con componentes reutilizables
 */
const AmbulanceDashboard = () => {
  const { currentUser } = useAppStore()
  const [showEmergencyModal, setShowEmergencyModal] = useState(false) // Modal oculto por defecto
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('DISPONIBLE')
  const [activeEmergency, setActiveEmergency] = useState(null) // Datos de emergencia activa
  
  // Hook que maneja toda la lógica compleja
  const {
    ambulanceLocation,
    isLocationTracking,
    ambulanceStatus,
    gpsActive,
    ambulanceId,
    simulateEmergency,
    getCurrentLocation,
    addEmergencyNote,
    showCompletionModal,
    completionModalData,
    closeCompletionModal,
    processServiceCompletion,
    completeEmergency
  } = useAmbulanceDashboard()

  const handleSimulateAlert = () => {
    setShowEmergencyModal(true)
    simulateEmergency()
  }

  const handleNavigationStart = (emergencyData) => {
    // Se activa cuando el usuario pulsa Google Maps o Waze en el modal
    setActiveEmergency(emergencyData)
    setCurrentStatus('EN CAMINO')
    setShowEmergencyModal(false)
  }

  const handleConfirmArrival = (emergencyData) => {
    // Solo actualizar el estado, el modal maneja la confirmación visual
    setCurrentStatus('EN SERVICIO')
    console.log('Llegada confirmada para emergencia:', emergencyData.code)
  }

  const handleCloseEmergency = () => {
    setCurrentStatus('DISPONIBLE')
    setShowEmergencyModal(false)
  }

  const handleOpenNoteModal = () => {
    setShowNoteModal(true)
  }

  const handleAddNote = (noteData) => {
    console.log('Nota agregada:', noteData)
    alert(`Nota agregada: ${noteData.noteType} - ${noteData.description}`)
    addEmergencyNote(noteData)
  }

  const handleUpdatePosition = () => {
    setShowMoveModal(true)
  }

  const handleMoveAmbulance = (moveData) => {
    console.log('Moviendo ambulancia:', moveData)
    // Aquí puedes llamar al hook o servicio para actualizar la posición
    alert(`Ambulancia movida: ${moveData.movementType} hacia ${moveData.destination}`)
    getCurrentLocation()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header modularizado */}
      <AmbulanceHeader user={currentUser} />

      {/* Contenido Principal */}
      <div className="p-6 space-y-6">
        {/* Primera fila - Estado Actual y Ubicación GPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmbulanceStatusCard
            status={currentStatus}
            gpsActive={gpsActive !== false}
            ambulanceId={ambulanceId || 'AMB-001'}
            onSimulateAlert={handleSimulateAlert}
          />
          
          <GPSLocationCard
            location={ambulanceLocation || { lat: -12.089900, lng: -77.046900 }}
            precision={6762}
            lastUpdate="11:09:44 p. m."
          />
        </div>

        {/* Segunda fila - Emergencia Activa (si existe) */}
        {activeEmergency && (
          <ActiveEmergencyCard
            emergencyData={activeEmergency}
            onConfirmArrival={handleConfirmArrival}
            isVisible={true}
          />
        )}

        {/* Tercera fila - Seguimiento de Emergencias (siempre visible) */}
        <EmergencyTrackingSection
          onOpenNoteModal={handleOpenNoteModal}
          onUpdateLocation={handleUpdatePosition}
        />
      </div>

      {/* Modal de Emergencia Asignada */}
      <EmergencyAssignedModal
        isOpen={showEmergencyModal}
        onClose={handleCloseEmergency}
        onNavigationStart={handleNavigationStart}
      />

      {/* Modal de Mover Ambulancia */}
      <MoveAmbulanceModal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onUpdatePosition={handleMoveAmbulance}
        currentLocation={ambulanceLocation}
      />

      {/* Modal de Agregar Nota */}
      <AddEmergencyNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onAddNote={handleAddNote}
        emergencyCode="EMG-175696195833"
      />

      {/* Modal de Completar y Clasificar Servicio */}
      <ServiceCompletionModal
        isOpen={showCompletionModal}
        onClose={closeCompletionModal}
        onComplete={processServiceCompletion}
        patientInfo={completionModalData?.patientInfo}
        emergencyCode={completionModalData?.emergencyCode}
      />
    </div>
  )
}

export default AmbulanceDashboard