import React, { useState } from 'react'

const ServiceExpansionModal = ({ isOpen, onClose, user }) => {
  const [selectedService, setSelectedService] = useState('')
  const [urgencyLevel, setUrgencyLevel] = useState('Media - En las próximas semanas')
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  const serviceOptions = [
    {
      id: 'urgencia',
      name: 'Urgencia Médica',
      description: 'Atención médica prioritaria'
    },
    {
      id: 'medico_domicilio',
      name: 'Médico a Domicilio',
      description: 'Consultas en tu hogar'
    },
    {
      id: 'traslado_programado',
      name: 'Traslado Programado',
      description: 'Traslados médicos planificados'
    },
    {
      id: 'zona_protegida',
      name: 'Zona Protegida',
      description: 'Cobertura en área específica'
    }
  ]

  const handleSubmit = () => {
    console.log('Solicitud de ampliación:', {
      service: selectedService,
      urgency: urgencyLevel,
      reason: reason,
      user: user?.profile?.name
    })
    // Aquí se enviaría la solicitud
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Solicitar Ampliación de Servicios
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Envía tu solicitud al equipo comercial
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tu situación actual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-center text-sm font-medium text-gray-700 mb-4">
              Tu situación actual:
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const breakdown = user?.service_usage?.current_period?.breakdown || {}
                    return Object.values(breakdown).reduce((acc, data) => {
                      if (typeof data === 'object' && data.used !== undefined) {
                        return acc + data.used
                      }
                      return acc
                    }, 0) || (user?.service_usage?.current_period?.used_services || 2)
                  })()}
                </div>
                <div className="text-xs text-blue-700 font-medium">Servicios Usados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {(() => {
                    const totalServices = user?.plan?.total_services || 10
                    const usedServices = user?.service_usage?.current_period?.used_services || 2
                    return Math.max(0, totalServices - usedServices)
                  })()}
                </div>
                <div className="text-xs text-red-700 font-medium">Restantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user?.plan?.total_services || 10}
                </div>
                <div className="text-xs text-gray-700 font-medium">Total Contratado</div>
              </div>
            </div>
          </div>
          {/* Tipo de Servicio */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Tipo de Servicio a Ampliar
            </h3>
            <div className="space-y-2">
              {serviceOptions.map((service) => (
                <label
                  key={service.id}
                  className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={selectedService === service.id}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Nivel de Urgencia */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Nivel de Urgencia
            </h3>
            <select
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Media - En las próximas semanas">Media - En las próximas semanas</option>
              <option value="Alta - En los próximos días">Alta - En los próximos días</option>
              <option value="Urgente - Lo antes posible">Urgente - Lo antes posible</option>
            </select>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <i className="fas fa-clock text-blue-500"></i>
              <span className="text-blue-600">Respuesta en 48 horas</span>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Motivo de la Solicitud
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica brevemente por qué necesitas ampliar tus servicios. Ej. Mayor demanda de servicios médicos, crecimiento del equipo, necesidades especiales, etc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-2">
              Entre más detalles proporciones, mejor podremos ayudarte
            </p>
          </div>

          {/* Información de Contacto */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              Información de Contacto
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <strong className="text-blue-800">Teléfono:</strong>
                <span className="text-blue-700">+51 9 9999 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-blue-800">Email:</strong>
                <span className="text-blue-700">{user?.profile?.email}</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Te contactaremos usando esta información
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedService || !reason.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-paper-plane"></i>
            Enviar Solicitud
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceExpansionModal