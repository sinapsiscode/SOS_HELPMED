import React from 'react'

/**
 * Modal para mostrar el detalle completo de una solicitud de registro
 * Siguiendo Regla #3: Componente enfocado y modular
 * Siguiendo Regla #2: Solo presentación, lógica delegada a props
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.request - Datos completos de la solicitud
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onApprove - Función para aprobar solicitud
 * @param {Function} props.onReject - Función para rechazar solicitud
 * @param {Function} props.onActivateServices - Función para activar servicios
 * @param {Function} props.getPlanTypeName - Función para formatear nombre del plan
 * @returns {JSX.Element} Modal de detalle de solicitud
 */
const RequestDetailModal = ({
  request,
  onClose,
  onApprove,
  onReject,
  onActivateServices,
  getPlanTypeName
}) => {
  // Funciones simples de manejo (lógica trivial permitida - Regla #2)
  const handleApprove = () => {
    onApprove(request.id)
    onClose()
  }

  const handleReject = () => {
    onReject(request.id)
    onClose()
  }

  const handleActivateServices = () => {
    onActivateServices(request.userId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-exo font-bold text-gray-800">
            Detalle de Solicitud - {request.name} {request.lastName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Información personal y de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Datos personales */}
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
                Datos Personales
              </h4>
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>Nombre completo:</strong> {request.name} {request.lastName}
                </p>
                <p>
                  <strong>DNI:</strong> {request.dni}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong> {request.birthDate}
                </p>
                <p>
                  <strong>Email:</strong> {request.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {request.phone}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">Ubicación</h4>
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>Dirección:</strong> {request.address}
                </p>
                <p>
                  <strong>Distrito:</strong> {request.district}
                </p>
                <p>
                  <strong>Ciudad:</strong> {request.city}
                </p>
                <p>
                  <strong>Coordenadas:</strong> {request.latitude || 'N/A'},{' '}
                  {request.longitude || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Información del plan */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              Plan Seleccionado
            </h4>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>Tipo de plan:</strong>{' '}
                  {getPlanTypeName(request.planType, request.planSubtype)}
                </p>
                <p>
                  <strong>Categoría:</strong> {request.planType}
                </p>
                <p>
                  <strong>Subtipo:</strong> {request.planSubtype}
                </p>
                {request.monthlyPayment && (
                  <p>
                    <strong>Pago mensual:</strong> S/ {request.monthlyPayment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contacto de emergencia */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              Contacto de Emergencia
            </h4>
            <div className="text-sm font-roboto space-y-2">
              <p>
                <strong>Nombre:</strong> {request.emergencyContactName}
              </p>
              <p>
                <strong>Relación:</strong> {request.emergencyContactRelation}
              </p>
              <p>
                <strong>Teléfono:</strong> {request.emergencyContactPhone}
              </p>
            </div>
          </div>

          {/* Condiciones médicas (si existen) */}
          {request.medicalConditions && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
                Condiciones Médicas
              </h4>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-roboto text-gray-700">{request.medicalConditions}</p>
              </div>
            </div>
          )}

          {/* Comentarios (si existen) */}
          {request.comments && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
                Comentarios Adicionales
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-roboto text-gray-700">{request.comments}</p>
              </div>
            </div>
          )}

          {/* Motivo del rechazo (si está rechazada) */}
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-red-800 border-b border-red-200 pb-2">
                Motivo del Rechazo
              </h4>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-roboto text-red-700">{request.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Información de tracking */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              Información de Seguimiento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>ID de solicitud:</strong> {request.id}
                </p>
                <p>
                  <strong>Fecha de solicitud:</strong>{' '}
                  {new Date(request.requestDate).toLocaleString('es-CL')}
                </p>
                <p>
                  <strong>Estado actual:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status === 'pending'
                      ? 'PENDIENTE'
                      : request.status === 'approved'
                        ? 'APROBADA'
                        : 'RECHAZADA'}
                  </span>
                </p>
              </div>
              <div className="text-sm font-roboto space-y-2">
                {request.processedAt && (
                  <p>
                    <strong>Procesada el:</strong>{' '}
                    {new Date(request.processedAt).toLocaleString('es-CL')}
                  </p>
                )}
                {request.userId && (
                  <p>
                    <strong>ID de usuario:</strong> {request.userId}
                  </p>
                )}
                {request.processedBy && (
                  <p>
                    <strong>Procesada por:</strong> {request.processedBy}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción en footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-exo font-medium hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>

            {/* Botones para solicitudes pendientes */}
            {request.status === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  <i className="fas fa-check mr-2"></i>
                  Aprobar Solicitud
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>
                  Rechazar Solicitud
                </button>
              </>
            )}

            {/* Botón para activar servicios (solicitudes aprobadas) */}
            {request.status === 'approved' && request.userId && (
              <button
                onClick={handleActivateServices}
                className="flex-1 px-4 py-2 bg-helpmed-blue hover:bg-primary-blue text-white rounded-lg font-exo font-medium transition-colors"
              >
                <i className="fas fa-star mr-2"></i>
                Activar Servicios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailModal
