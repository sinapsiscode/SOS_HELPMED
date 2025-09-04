import React from 'react'

/**
 * Componente de calendario para selección de fechas de traslado
 *  Separado del componente principal
 *  Props claramente definidos
 *  Responsabilidad única: Calendar UI
 */
const TransferCalendar = ({
  calendarData,
  currentMonth,
  selectedDate,
  availableTimeSlots,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
  onTimeSlotSelect
}) => {
  const dayLabels = [
    { full: 'Domingo', short: 'Dom', mobile: 'D' },
    { full: 'Lunes', short: 'Lun', mobile: 'L' },
    { full: 'Martes', short: 'Mar', mobile: 'M' },
    { full: 'Miércoles', short: 'Mié', mobile: 'X' },
    { full: 'Jueves', short: 'Jue', mobile: 'J' },
    { full: 'Viernes', short: 'Vie', mobile: 'V' },
    { full: 'Sábado', short: 'Sáb', mobile: 'S' }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Programar Traslado</h3>
          <div className="flex items-center justify-between sm:justify-center space-x-2 sm:space-x-4">
            <button
              onClick={onPreviousMonth}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 min-w-0 text-center flex-1 sm:min-w-[200px] sm:flex-none">
              {currentMonth.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
            </h4>
            <button
              onClick={onNextMonth}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Días de la semana - Responsive */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((day) => (
            <div
              key={day.short}
              className="h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600"
            >
              <span className="hidden sm:inline">{day.short}</span>
              <span className="sm:hidden">{day.mobile}</span>
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((dayData) => (
            <button
              key={dayData.dateString}
              onClick={() => !dayData.isPast && onSelectDate(dayData.date)}
              disabled={dayData.isPast}
              className={`
                h-10 sm:h-12 w-full text-xs sm:text-sm border border-gray-100 transition-all duration-200
                ${dayData.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${dayData.isToday ? 'bg-blue-100 border-blue-300 font-bold' : ''}
                ${dayData.isSelected ? 'bg-red-500 text-white border-red-500' : ''}
                ${dayData.isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}
                ${!dayData.isPast && !dayData.isSelected ? 'hover:border-red-300 hover:text-red-600' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <span>{dayData.day}</span>
                {dayData.transfersCount > 0 && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      dayData.isSelected ? 'bg-white' : 'bg-red-500'
                    }`}
                  ></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Leyenda - Responsive */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Hoy</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="hidden sm:inline">Tiene traslados</span>
            <span className="sm:hidden">Con traslados</span>
          </div>
        </div>
      </div>

      {/* Horarios disponibles */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
          <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-4">
            Horarios Disponibles
            <div className="text-sm sm:text-base font-normal text-gray-600 mt-1">
              {selectedDate.toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </h3>

          {availableTimeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {availableTimeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (slot.available) {
                      onTimeSlotSelect(slot)
                    }
                  }}
                  disabled={!slot.available}
                  className={`
                    p-2 sm:p-3 text-xs sm:text-sm rounded-lg border transition-colors
                    ${
                      slot.available
                        ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {slot.timeString}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-calendar-times text-3xl text-gray-400 mb-3"></i>
              <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransferCalendar