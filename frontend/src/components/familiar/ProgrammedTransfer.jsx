// Componente de traslados programados
// ✅ REFACTORIZADO: Extraída lógica a hooks especializados y componentes separados
// ✅ Reducido de 1255 líneas a menos de 200 líneas
// ✅ Separación clara de responsabilidades

import React, { useState, useEffect } from 'react'
import useAppStore from '../../stores/useAppStore'
import useTransferCalendar from '../../hooks/useTransferCalendar'
import useTransferOperations from '../../hooks/useTransferOperations'
import TransferCalendar from './programmed-transfer/TransferCalendar'
import TransferModal from './programmed-transfer/TransferModal'
import TransfersList from './programmed-transfer/TransfersList'
import Swal from 'sweetalert2'

/**
 * Componente principal para gestión de traslados programados
 * ✅ Cumple reglas de refactorización:
 * - Regla #2: Lógica compleja extraída a hooks especializados
 * - Regla #3: Componentes separados en archivos individuales
 * - Regla #5: Estados distribuidos y especializados
 * - Regla #13: Optimización con hooks composables
 */
const ProgrammedTransfer = ({ onServiceCompleted }) => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const { currentUser, requestTransfer, getAllTransfers } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [showModal, setShowModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const transferOps = useTransferOperations(getAllTransfers, requestTransfer, currentUser)
  const calendar = useTransferCalendar(transferOps.transfers)

  // ============================================
  // EFECTOS
  // ============================================
  useEffect(() => {
    transferOps.loadTransfers()
  }, [transferOps.loadTransfers])

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
    setShowModal(true)
  }

  const handleNewTransfer = () => {
    if (!calendar.selectedDate) {
      Swal.fire({
        title: 'Selecciona una fecha',
        text: 'Por favor, selecciona una fecha en el calendario antes de continuar',
        icon: 'warning',
        confirmButtonColor: '#EF4444'
      })
      return
    }
    setShowModal(true)
  }

  const handleSubmitTransfer = async (transferData) => {
    const success = await transferOps.createTransfer(transferData)
    if (success && onServiceCompleted) {
      onServiceCompleted('TRASLADO_PROGRAMADO', 'Traslado programado exitosamente')
    }
    return success
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedTimeSlot(null)
  }

  // ============================================
  // ESTADÍSTICAS DE TRASLADOS
  // ============================================
  const stats = transferOps.getTransferStats()

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Traslados Programados</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Programa tus traslados médicos con anticipación
          </p>
        </div>

        {/* Estadísticas rápidas - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-xs sm:text-sm text-blue-700">Programados</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs sm:text-sm text-green-700">Completados</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-xs sm:text-sm text-orange-700">En Progreso</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">{stats.thisWeek}</div>
            <div className="text-xs sm:text-sm text-purple-700">Esta Semana</div>
          </div>
        </div>

        {/* Botón para nuevo traslado */}
        <div className="mt-6 text-center">
          <button
            onClick={handleNewTransfer}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <i className="fas fa-plus mr-2"></i>
            Nuevo Traslado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Calendario */}
        <TransferCalendar
          calendarData={calendar.calendarData}
          currentMonth={calendar.currentMonth}
          selectedDate={calendar.selectedDate}
          availableTimeSlots={calendar.availableTimeSlots}
          onSelectDate={calendar.selectDate}
          onPreviousMonth={calendar.previousMonth}
          onNextMonth={calendar.nextMonth}
          onTimeSlotSelect={handleTimeSlotSelect}
        />

        {/* Lista de traslados */}
        <div className="space-y-4 sm:space-y-6">
          <TransfersList
            transfers={transferOps.transfers}
            onCancelTransfer={transferOps.cancelTransfer}
          />
        </div>
      </div>

      {/* Modal de formulario */}
      <TransferModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedDate={calendar.selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        currentUser={currentUser}
        onSubmit={handleSubmitTransfer}
      />

      {/* Loading state */}
      {transferOps.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-gray-700">Procesando...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgrammedTransfer
