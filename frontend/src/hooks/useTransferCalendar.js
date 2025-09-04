import { useState, useCallback, useMemo } from 'react'

/**
 * Hook especializado para gestión de calendario de traslados
 *  Cumple reglas de tamaño: <100 líneas
 *  Responsabilidad única: Calendar logic and time slots
 *  Funciones puras para generación de fechas y horarios
 */
const useTransferCalendar = (transfers = []) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  /**
   * Generar slots de tiempo disponibles para una fecha
   */
  const generateTimeSlots = useCallback((date) => {
    const slots = []
    const startHour = 6 // 6 AM
    const endHour = 20 // 8 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const minute of [0, 30]) {
        if (hour === endHour && minute > 0) break

        const timeSlot = new Date(date)
        timeSlot.setHours(hour, minute, 0, 0)

        // No permitir horarios en el pasado
        if (timeSlot > new Date()) {
          // Verificar si ya hay un traslado programado en ese horario
          const isOccupied = transfers.some((transfer) => {
            const transferDate = new Date(transfer.scheduledDate)
            return transferDate.getTime() === timeSlot.getTime()
          })

          slots.push({
            time: timeSlot,
            timeString: timeSlot.toLocaleTimeString('es-CL', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            available: !isOccupied
          })
        }
      }
    }

    return slots
  }, [transfers])

  /**
   * Obtener slots de tiempo disponibles para la fecha seleccionada
   */
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    return generateTimeSlots(selectedDate)
  }, [selectedDate, generateTimeSlots])

  /**
   * Generar datos del calendario para el mes actual
   */
  const calendarData = useMemo(() => {
    const today = new Date()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Empezar el domingo anterior

    const days = []
    const currentDate = new Date(startDate)

    // Generar 42 días (6 semanas)
    for (let i = 0; i < 42; i++) {
      const day = new Date(currentDate)
      const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
      const isToday = day.toDateString() === today.toDateString()
      const isPast = day < today.setHours(0, 0, 0, 0)
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()

      // Contar traslados programados en este día
      const transfersOnDay = transfers.filter((transfer) => {
        const transferDate = new Date(transfer.scheduledDate)
        return transferDate.toDateString() === day.toDateString()
      }).length

      days.push({
        date: new Date(day),
        day: day.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        isSelected,
        transfersCount: transfersOnDay,
        dateString: day.toDateString()
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }, [currentMonth, selectedDate, transfers])

  /**
   * Seleccionar una fecha del calendario
   */
  const selectDate = useCallback((date) => {
    setSelectedDate(date)
  }, [])

  /**
   * Navegar al mes anterior
   */
  const previousMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }, [currentMonth])

  /**
   * Navegar al mes siguiente
   */
  const nextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }, [currentMonth])

  return {
    // Estados
    selectedDate,
    currentMonth,
    availableTimeSlots,
    calendarData,
    
    // Acciones
    selectDate,
    previousMonth,
    nextMonth,
    
    // Utilidades
    generateTimeSlots
  }
}

export default useTransferCalendar