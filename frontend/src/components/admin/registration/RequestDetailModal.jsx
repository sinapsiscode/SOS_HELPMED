import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.registration.requestDetailModal.comments.title}
 * ${LABELS.admin.registration.requestDetailModal.comments.rules.rule3}
 * ${LABELS.admin.registration.requestDetailModal.comments.rules.rule2}
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
  const labels = LABELS.admin.registration.requestDetailModal

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
            {labels.title.replace('{name}', `${request.name} ${request.lastName}`)}
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
                {labels.sections.personalData}
              </h4>
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>{labels.fields.fullName}</strong> {request.name} {request.lastName}
                </p>
                <p>
                  <strong>{labels.fields.dni}</strong> {request.dni}
                </p>
                <p>
                  <strong>{labels.fields.birthDate}</strong> {request.birthDate}
                </p>
                <p>
                  <strong>{labels.fields.email}</strong> {request.email}
                </p>
                <p>
                  <strong>{labels.fields.phone}</strong> {request.phone}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">{labels.sections.location}</h4>
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>{labels.fields.address}</strong> {request.address}
                </p>
                <p>
                  <strong>{labels.fields.district}</strong> {request.district}
                </p>
                <p>
                  <strong>{labels.fields.city}</strong> {request.city}
                </p>
                <p>
                  <strong>{labels.fields.coordinates}</strong> {request.latitude || 'N/A'},{' '}
                  {request.longitude || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Información del plan */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              {labels.sections.selectedPlan}
            </h4>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>{labels.fields.planType}</strong>{' '}
                  {getPlanTypeName(request.planType, request.planSubtype)}
                </p>
                <p>
                  <strong>{labels.fields.category}</strong> {request.planType}
                </p>
                <p>
                  <strong>{labels.fields.subtype}</strong> {request.planSubtype}
                </p>
                {request.monthlyPayment && (
                  <p>
                    <strong>{labels.fields.monthlyPayment}</strong> S/ {request.monthlyPayment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contacto de emergencia */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              {labels.sections.emergencyContact}
            </h4>
            <div className="text-sm font-roboto space-y-2">
              <p>
                <strong>{labels.fields.name}</strong> {request.emergencyContactName}
              </p>
              <p>
                <strong>{labels.fields.relation}</strong> {request.emergencyContactRelation}
              </p>
              <p>
                <strong>{labels.fields.phone}</strong> {request.emergencyContactPhone}
              </p>
            </div>
          </div>

          {/* Condiciones médicas (si existen) */}
          {request.medicalConditions && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
                {labels.sections.medicalConditions}
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
                {labels.sections.additionalComments}
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
                {labels.sections.rejectionReason}
              </h4>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-roboto text-red-700">{request.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Información de tracking */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-800 border-b pb-2">
              {labels.sections.trackingInfo}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>{labels.fields.requestId}</strong> {request.id}
                </p>
                <p>
                  <strong>{labels.fields.requestDate}</strong>{' '}
                  {new Date(request.requestDate).toLocaleString('es-CL')}
                </p>
                <p>
                  <strong>{labels.fields.currentStatus}</strong>
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
                      ? labels.status.pending
                      : request.status === 'approved'
                        ? labels.status.approved
                        : labels.status.rejected}
                  </span>
                </p>
              </div>
              <div className="text-sm font-roboto space-y-2">
                {request.processedAt && (
                  <p>
                    <strong>{labels.fields.processedAt}</strong>{' '}
                    {new Date(request.processedAt).toLocaleString('es-CL')}
                  </p>
                )}
                {request.userId && (
                  <p>
                    <strong>{labels.fields.userId}</strong> {request.userId}
                  </p>
                )}
                {request.processedBy && (
                  <p>
                    <strong>{labels.fields.processedBy}</strong> {request.processedBy}
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
              {labels.buttons.close}
            </button>

            {/* Botones para solicitudes pendientes */}
            {request.status === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  <i className="fas fa-check mr-2"></i>
                  {labels.buttons.approveRequest}
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  <i className="fas fa-times mr-2"></i>
                  {labels.buttons.rejectRequest}
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
                {labels.buttons.activateServices}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailModal
