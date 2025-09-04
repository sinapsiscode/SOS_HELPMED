import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import useAppStore from '../../stores/useAppStore'

const EmergencyAlert = ({ emergency, onNavigate, onClose }) => {
  const [showMedicalHistory, setShowMedicalHistory] = useState(false)
  const { getMedicalHistory } = useAppStore()

  const handleBackdropClick = (e) => {
    // Cerrar modal si se hace clic en el fondo (backdrop)
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICA':
        return 'red'
      case 'ALTA':
        return 'orange'
      case 'MEDIA':
        return 'yellow'
      default:
        return 'blue'
    }
  }

  const formatAddress = (address) => {
    if (!address) return 'Dirección no especificada'
    if (address.length > 50) {
      return address.substring(0, 50) + '...'
    }
    return address
  }

  const urgencyColor = getUrgencyColor(emergency.urgency)

  const handleViewMedicalHistory = async () => {
    try {
      // Obtener el historial médico del paciente
      const medicalHistory = getMedicalHistory
        ? getMedicalHistory(emergency.user_id, emergency.affiliateInfo?.id || emergency.patient?.id)
        : []

      if (!medicalHistory || medicalHistory.length === 0) {
        Swal.fire({
          title: 'Sin Historial Médico',
          html: `
            <div class="text-center">
              <i class="fas fa-file-medical text-5xl text-gray-400 mb-3"></i>
              <p class="text-gray-600">Este paciente no tiene historial médico previo</p>
              <p class="text-sm text-gray-500 mt-2">Es la primera vez que recibe atención</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3B82F6'
        })
        return
      }

      // Formatear el historial para mostrarlo
      const historyHtml = medicalHistory
        .map(
          (record, index) => `
        <div class="mb-4 p-3 border border-gray-200 rounded-lg ${index === 0 ? 'bg-blue-50' : 'bg-gray-50'}">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-semibold text-gray-800">
              ${
                record.actualServiceType === 'EMERGENCIA'
                  ? '🚨'
                  : record.actualServiceType === 'URGENCIA'
                    ? '⚡'
                    : record.actualServiceType === 'MEDICO_DOMICILIO'
                      ? '👨‍⚕️'
                      : record.actualServiceType === 'TRASLADO'
                        ? '🚑'
                        : '🏥'
              } 
              ${record.actualServiceType || record.serviceType || 'Servicio Médico'}
            </h4>
            <span class="text-xs text-gray-500">
              ${new Date(record.completedDate || record.serviceDate).toLocaleDateString('es-PE')}
            </span>
          </div>
          
          <div class="space-y-1 text-sm">
            ${
              record.diagnosis
                ? `
              <div>
                <span class="font-medium text-gray-700">Diagnóstico:</span>
                <p class="text-gray-600">${record.diagnosis}</p>
              </div>
            `
                : ''
            }
            
            ${
              record.treatment
                ? `
              <div>
                <span class="font-medium text-gray-700">Tratamiento:</span>
                <p class="text-gray-600">${record.treatment}</p>
              </div>
            `
                : ''
            }
            
            ${
              record.observations
                ? `
              <div>
                <span class="font-medium text-gray-700">Observaciones:</span>
                <p class="text-gray-600">${record.observations}</p>
              </div>
            `
                : ''
            }
            
            ${
              record.completedBy
                ? `
              <div class="mt-2 pt-2 border-t border-gray-200">
                <span class="text-xs text-gray-500">
                  Atendido por: ${record.completedBy} 
                  ${record.ambulanceUnit ? `(${record.ambulanceUnit})` : ''}
                </span>
              </div>
            `
                : ''
            }
          </div>
        </div>
      `
        )
        .join('')

      Swal.fire({
        title: `📋 Historial Médico - ${emergency.patient?.name || emergency.affiliateInfo?.name}`,
        html: `
          <div class="text-left max-h-96 overflow-y-auto">
            <div class="mb-3 p-2 bg-blue-100 border border-blue-300 rounded-lg">
              <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-1"></i>
                Historial de ${medicalHistory.length} atención(es) previas
              </p>
            </div>
            ${historyHtml}
          </div>
        `,
        width: 600,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3B82F6',
        showCloseButton: true
      })
    } catch (error) {
      console.error('Error al obtener historial médico:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el historial médico',
        icon: 'error'
      })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header con animación de urgencia */}
          <div className={`bg-${urgencyColor}-600 p-4 text-white relative overflow-hidden`}>
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-white opacity-20"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold flex items-center">
                  <motion.i
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="fas fa-exclamation-triangle mr-3"
                  />
                  EMERGENCIA ASIGNADA
                </h2>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">OBLIGATORIA</div>
                  <div className="text-xs">Asignación automática</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {emergency.code}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {emergency.distance} - {emergency.eta}
                </span>
              </div>
            </div>
          </div>

          {/* Información del paciente */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-user-injured mr-2 text-red-600"></i>
                  Información del Paciente
                </h3>
                <button
                  onClick={handleViewMedicalHistory}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <i className="fas fa-file-medical mr-1"></i>
                  Ver Historial
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="font-medium">{emergency.patient.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Edad:</span>
                  <p className="font-medium">{emergency.patient.age} años</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Teléfono:</span>
                  <p className="font-medium">{emergency.patient.phone}</p>
                </div>
              </div>
            </div>

            {/* Síntomas */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <i className="fas fa-notes-medical mr-2"></i>
                Síntomas Reportados
              </h3>
              <p className="text-sm text-gray-700">{emergency.symptoms}</p>
              {emergency.vitalSigns && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {emergency.vitalSigns.map((sign, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ubicación */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Ubicación
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                {formatAddress(emergency.location?.address || emergency.address)}
              </p>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600">
                  <i className="fas fa-route mr-1"></i>
                  {emergency.distance || 'Calculando...'}
                </span>
                <span className="text-gray-600">
                  <i className="fas fa-clock mr-1"></i>
                  ETA: {emergency.eta || 'Calculando...'}
                </span>
              </div>
            </div>

            {/* Información adicional */}
            {emergency.additionalInfo && (
              <div className="text-sm text-gray-600 italic">
                <i className="fas fa-info-circle mr-1"></i>
                {emergency.additionalInfo}
              </div>
            )}
          </div>

          {/* Botones de navegación */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('google')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <i className="fab fa-google mr-2"></i>
                Google Maps
              </button>

              <button
                onClick={() => onNavigate('waze')}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                <i className="fas fa-route mr-2"></i>
                Waze
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EmergencyAlert
