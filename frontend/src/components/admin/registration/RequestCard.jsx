import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.registration.requestCard.comments.title}
 * ${LABELS.admin.registration.requestCard.comments.rules.rule3}
 * ${LABELS.admin.registration.requestCard.comments.rules.rule2}
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.request - Datos de la solicitud de registro
 * @param {Function} props.onApprove - Función para aprobar solicitud
 * @param {Function} props.onReject - Función para rechazar solicitud
 * @param {Function} props.onActivateServices - Función para activar servicios
 * @param {Function} props.onViewDetail - Función para ver detalle
 * @param {Function} props.getStatusColor - Función para obtener color del estado
 * @param {Function} props.getStatusIcon - Función para obtener icono del estado
 * @param {Function} props.getPlanTypeName - Función para formatear nombre del plan
 * @returns {JSX.Element} Tarjeta de solicitud
 */
const RequestCard = ({
  request,
  onApprove,
  onReject,
  onActivateServices,
  onViewDetail,
  getStatusColor,
  getStatusIcon,
  getPlanTypeName
}) => {
  const labels = LABELS.admin.registration.requestCard
  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header con nombre y estado */}
          <div className="flex items-center space-x-3 mb-3">
            <i className={getStatusIcon(request.status)}></i>
            <h4 className="text-lg font-exo font-semibold text-gray-800">
              {request.name} {request.lastName}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
            >
              {request.status === 'pending'
                ? labels.status.pending
                : request.status === 'approved'
                  ? labels.status.approved
                  : labels.status.rejected}
            </span>
          </div>

          {/* Información principal en grid responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {/* Datos personales */}
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.email}</strong> {request.email}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.phone}</strong> {request.phone}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.dni}</strong> {request.dni}
              </p>
            </div>

            {/* Información del plan y ubicación */}
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.plan}</strong> {getPlanTypeName(request.planType, request.planSubtype)}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.city}</strong> {request.city}, {request.district}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.date}</strong> {new Date(request.requestDate).toLocaleDateString('es-CL')}
              </p>
            </div>

            {/* Contacto de emergencia */}
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.emergencyContact}</strong> {request.emergencyContactName}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.relation}</strong> {request.emergencyContactRelation}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>{labels.fields.emergencyPhone}</strong> {request.emergencyContactPhone}
              </p>
            </div>
          </div>

          {/* Condiciones médicas (si existen) */}
          {request.medicalConditions && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-exo font-semibold text-blue-800 mb-1">
                {labels.sections.medicalConditions}
              </p>
              <p className="text-sm text-blue-700 font-roboto">{request.medicalConditions}</p>
            </div>
          )}

          {/* Comentarios (si existen) */}
          {request.comments && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-exo font-semibold text-gray-800 mb-1">{labels.sections.comments}</p>
              <p className="text-sm text-gray-700 font-roboto">{request.comments}</p>
            </div>
          )}

          {/* Motivo del rechazo (si está rechazada) */}
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-exo font-semibold text-red-800 mb-1">
                {labels.sections.rejectionReason}
              </p>
              <p className="text-sm text-red-700 font-roboto">{request.rejectionReason}</p>
            </div>
          )}

          {/* Footer con ID y botones de acción */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 font-roboto">
              {labels.footer.id} {request.id.slice(-8)} • {labels.footer.request}{' '}
              {new Date(request.requestDate).toLocaleString('es-CL')}
            </div>

            {/* Botones de acción responsive */}
            <div className="flex space-x-2">
              {/* Botones para solicitudes pendientes */}
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                  >
                    <i className="fas fa-check"></i>
                    <span className="hidden sm:inline">{labels.buttons.approve.full}</span>
                    <span className="sm:hidden">{labels.buttons.approve.short}</span>
                  </button>
                  <button
                    onClick={() => onReject(request.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                  >
                    <i className="fas fa-times"></i>
                    <span className="hidden sm:inline">{labels.buttons.reject.full}</span>
                    <span className="sm:hidden">{labels.buttons.reject.short}</span>
                  </button>
                </>
              )}

              {/* Botón para activar servicios (solicitudes aprobadas) */}
              {request.status === 'approved' && request.userId && (
                <button
                  onClick={() => onActivateServices(request.userId)}
                  className="bg-helpmed-blue hover:bg-primary-blue text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                >
                  <i className="fas fa-star"></i>
                  <span className="hidden sm:inline">{labels.buttons.activateServices.full}</span>
                  <span className="sm:hidden">{labels.buttons.activateServices.short}</span>
                </button>
              )}

              {/* Botón para ver detalle (siempre disponible) */}
              <button
                onClick={() => onViewDetail(request)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
              >
                <i className="fas fa-eye"></i>
                <span className="hidden sm:inline">{labels.buttons.viewDetail.full}</span>
                <span className="sm:hidden">{labels.buttons.viewDetail.short}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestCard
