import React from 'react'

const ContactModal = ({ isOpen, onClose, request, onMarkAsContacted }) => {
  if (!isOpen || !request) return null

  const handleMarkAsContacted = () => {
    onMarkAsContacted(request)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Contactar Cliente
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Cliente info */}
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Cliente:</span>
              <span className="ml-2 text-gray-600">{request.userName}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Teléfono:</span>
              <span className="ml-2 text-gray-600">{request.contactPhone}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-600">{request.contactEmail}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Motivo:</span>
              <span className="ml-2 text-gray-600">{request.reason}</span>
            </div>
          </div>

          {/* Acciones sugeridas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Acciones sugeridas:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Llamar al cliente para ofrecerle upgrade
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Enviar propuesta personalizada por email
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Programar reunión comercial
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3">
          <button
            onClick={handleMarkAsContacted}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Marcar como Contactado
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactModal