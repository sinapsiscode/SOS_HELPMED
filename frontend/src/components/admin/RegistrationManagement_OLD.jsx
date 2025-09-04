import { useState } from 'react'
import useAppStore from '../../stores/useAppStore'
import Swal from 'sweetalert2'

const RegistrationManagement = () => {
  const {
    registrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    activateUserServices
  } = useAppStore()

  const [filter, setFilter] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const filteredRequests = registrationRequests.filter((request) => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const handleApprove = async (requestId) => {
    const result = await Swal.fire({
      title: '¿Aprobar Solicitud?',
      text: 'Se creará una cuenta para este cliente y se activarán sus servicios',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280'
    })

    if (result.isConfirmed) {
      try {
        await approveRegistrationRequest(requestId)
        Swal.fire({
          title: '¡Solicitud Aprobada!',
          text: 'El cliente ha sido registrado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al aprobar la solicitud',
          icon: 'error'
        })
      }
    }
  }

  const handleReject = async (requestId) => {
    const { value: reason } = await Swal.fire({
      title: 'Rechazar Solicitud',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Explica brevemente por qué se rechaza esta solicitud...',
      inputAttributes: {
        'aria-label': 'Motivo del rechazo'
      },
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes proporcionar un motivo para el rechazo'
        }
      }
    })

    if (reason) {
      try {
        await rejectRegistrationRequest(requestId, reason)
        Swal.fire({
          title: 'Solicitud Rechazada',
          text: 'Se ha notificado al cliente sobre el rechazo',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al rechazar la solicitud',
          icon: 'error'
        })
      }
    }
  }

  const handleActivateServices = async (userId) => {
    const result = await Swal.fire({
      title: 'Activar Servicios',
      text: '¿Deseas activar todos los beneficios del plan para este cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1D44D1'
    })

    if (result.isConfirmed) {
      try {
        await activateUserServices(userId)
        Swal.fire({
          title: '¡Servicios Activados!',
          text: 'Todos los beneficios del plan han sido activados',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al activar los servicios',
          icon: 'error'
        })
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock text-yellow-600'
      case 'approved':
        return 'fas fa-check-circle text-green-600'
      case 'rejected':
        return 'fas fa-times-circle text-red-600'
      default:
        return 'fas fa-question-circle text-gray-600'
    }
  }

  const getPlanTypeName = (planType, planSubtype) => {
    const planNames = {
      familiar: {
        help: 'Plan Help',
        basico: 'Plan Básico',
        vip: 'Plan VIP',
        dorado: 'Plan Dorado'
      },
      corporativo: {
        area_protegida: 'Área Protegida'
      }
    }
    return planNames[planType]?.[planSubtype] || 'Plan No Especificado'
  }

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-exo font-bold text-gray-800">
              Gestión de Solicitudes de Registro
            </h2>
            <p className="text-gray-600 font-roboto">
              Administra las solicitudes de nuevos clientes
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm font-exo font-medium text-gray-700">Filtrar por estado:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600 font-exo">
              {registrationRequests.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-xs sm:text-sm text-yellow-700 font-roboto">Pendientes</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600 font-exo">
              {registrationRequests.filter((r) => r.status === 'approved').length}
            </div>
            <div className="text-xs sm:text-sm text-green-700 font-roboto">Aprobadas</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600 font-exo">
              {registrationRequests.filter((r) => r.status === 'rejected').length}
            </div>
            <div className="text-xs sm:text-sm text-red-700 font-roboto">Rechazadas</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 font-exo">
              {registrationRequests.length}
            </div>
            <div className="text-xs sm:text-sm text-blue-700 font-roboto">Total</div>
          </div>
        </div>
      </div>

      {/* Lista de Solicitudes */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">
            Solicitudes ({filteredRequests.length})
          </h3>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">
              No hay solicitudes
            </h3>
            <p className="text-gray-600 font-roboto">
              No se encontraron solicitudes con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <i className={getStatusIcon(request.status)}></i>
                      <h4 className="text-lg font-exo font-semibold text-gray-800">
                        {request.name} {request.lastName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
                      >
                        {request.status === 'pending'
                          ? 'PENDIENTE'
                          : request.status === 'approved'
                            ? 'APROBADA'
                            : 'RECHAZADA'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Email:</strong> {request.email}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Teléfono:</strong> {request.phone}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>DNI:</strong> {request.dni}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Plan:</strong>{' '}
                          {getPlanTypeName(request.planType, request.planSubtype)}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Ciudad:</strong> {request.city}, {request.district}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Fecha:</strong>{' '}
                          {new Date(request.requestDate).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Contacto Emergencia:</strong> {request.emergencyContactName}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Relación:</strong> {request.emergencyContactRelation}
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          <strong>Tel. Emergencia:</strong> {request.emergencyContactPhone}
                        </p>
                      </div>
                    </div>

                    {request.medicalConditions && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-exo font-semibold text-blue-800 mb-1">
                          Condiciones Médicas:
                        </p>
                        <p className="text-sm text-blue-700 font-roboto">
                          {request.medicalConditions}
                        </p>
                      </div>
                    )}

                    {request.comments && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-exo font-semibold text-gray-800 mb-1">
                          Comentarios:
                        </p>
                        <p className="text-sm text-gray-700 font-roboto">{request.comments}</p>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-exo font-semibold text-red-800 mb-1">
                          Motivo del Rechazo:
                        </p>
                        <p className="text-sm text-red-700 font-roboto">
                          {request.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-roboto">
                        ID: {request.id.slice(-8)} • Solicitud:{' '}
                        {new Date(request.requestDate).toLocaleString('es-CL')}
                      </div>

                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                            >
                              <i className="fas fa-check"></i>
                              <span className="hidden sm:inline">Aprobar</span>
                              <span className="sm:hidden">OK</span>
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                            >
                              <i className="fas fa-times"></i>
                              <span className="hidden sm:inline">Rechazar</span>
                              <span className="sm:hidden">NO</span>
                            </button>
                          </>
                        )}

                        {request.status === 'approved' && request.userId && (
                          <button
                            onClick={() => handleActivateServices(request.userId)}
                            className="bg-helpmed-blue hover:bg-primary-blue text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                          >
                            <i className="fas fa-star"></i>
                            <span className="hidden sm:inline">Activar Servicios</span>
                            <span className="sm:hidden">Activar</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
                        >
                          <i className="fas fa-eye"></i>
                          <span className="hidden sm:inline">Ver Detalle</span>
                          <span className="sm:hidden">Ver</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onActivateServices={handleActivateServices}
        />
      )}
    </div>
  )
}

const RequestDetailModal = ({ request, onClose, onApprove, onReject, onActivateServices }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-exo font-bold text-gray-800">
            Detalle de Solicitud - {request.name} {request.lastName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información completa aquí - similar al formato de la lista pero más detallado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800">Datos Personales</h4>
              <div className="text-sm font-roboto space-y-2">
                <p>
                  <strong>Nombre:</strong> {request.name} {request.lastName}
                </p>
                <p>
                  <strong>DNI:</strong> {request.dni}
                </p>
                <p>
                  <strong>Fecha de Nacimiento:</strong> {request.birthDate}
                </p>
                <p>
                  <strong>Email:</strong> {request.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {request.phone}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-800">Ubicación</h4>
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
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-exo font-medium hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>

            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onApprove(request.id)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    onReject(request.id)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-exo font-medium transition-colors"
                >
                  Rechazar
                </button>
              </>
            )}

            {request.status === 'approved' && request.userId && (
              <button
                onClick={() => {
                  onActivateServices(request.userId)
                  onClose()
                }}
                className="flex-1 px-4 py-2 bg-helpmed-blue hover:bg-primary-blue text-white rounded-lg font-exo font-medium transition-colors"
              >
                Activar Servicios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationManagement
