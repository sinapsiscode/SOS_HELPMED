import React, { useState, useMemo } from 'react'
import useAppStore from '../../../stores/useAppStore'
import ContactRequestsHeader from './ContactRequestsHeader'
import ContactRequestsStats from './ContactRequestsStats'
import ContactRequestItem from './ContactRequestItem'
import ContactModal from './ContactModal'
import ContractDetailsModal from './ContractDetailsModal'
import { LABELS } from '../../../config/labels'

/**
 * Tab de solicitudes de contacto refactorizado
 * Usa componentes modulares para mantener la arquitectura limpia
 * Restaurado con el diseño original de la imagen
 */
const ContactRequestsTab = () => {
  const labels = LABELS.admin.dashboard.contactRequestsTab
  const headerLabels = LABELS.admin.dashboard.contactRequestsHeader
  
  const { allUsers, contactRequests } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contactModalRequest, setContactModalRequest] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [detailsModalRequest, setDetailsModalRequest] = useState(null)

  // Función para obtener nombre legible del tipo de servicio
  const getServiceTypeName = (serviceType) => {
    const serviceNames = {
      [headerLabels.filters.service.values.emergency]: headerLabels.filters.service.options.emergency,
      [headerLabels.filters.service.values.urgency]: headerLabels.filters.service.options.urgency,
      [headerLabels.filters.service.values.homeDoctor]: headerLabels.filters.service.options.homeDoctor,
      [headerLabels.filters.service.values.programmedTransfer]: headerLabels.filters.service.options.programmedTransfer,
      [headerLabels.filters.service.values.protectedZone]: headerLabels.filters.service.options.protectedZone,
      [headerLabels.filters.service.values.labExams]: headerLabels.filters.service.options.labExams,
      [headerLabels.filters.service.values.phoneOrientation]: headerLabels.filters.service.options.phoneOrientation
    }
    return serviceNames[serviceType] || serviceType
  }

  // Generar datos de solicitudes de contacto basados en usuarios y sus límites
  const generateContactRequests = useMemo(() => {
    const requests = []
    
    // Revisar usuarios familiares
    allUsers?.familiar?.forEach(user => {
      const serviceUsage = user.service_usage?.current_period
      
      if (user.plan?.subtype === 'HELP') {
        // Plan Help - verificar servicios restantes
        const remainingServices = serviceUsage?.remaining_services || 0
        if (remainingServices <= 2) {
          requests.push({
            id: `req_${user.id}_help`,
            userId: user.id,
            userName: user.profile?.name,
            userType: labels.userTypes.familiar,
            planName: user.plan?.name,
            planType: user.plan?.subtype,
            urgency: remainingServices === 0 ? labels.urgencyValues.critical : labels.urgencyValues.high,
            reason: remainingServices === 0 
              ? labels.reasons.servicesExhausted
              : labels.reasons.onlyXServicesRemaining.replace('{count}', remainingServices),
            contactPhone: user.profile?.phone ||'+51 9 7777 8888',
            contactEmail: user.profile?.email || labels.demo.emails[1],
            requestDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            status: labels.status.pending,
            servicesUsed: (user.plan?.total_services || 10) - remainingServices,
            servicesTotal: user.plan?.total_services || 10,
            lastServiceDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
          })
        }
      } else {
        // Otros planes - verificar servicios específicos
        const breakdown = serviceUsage?.breakdown || {}
        Object.entries(breakdown).forEach(([serviceType, serviceData]) => {
          if (typeof serviceData === 'object' && serviceData.limit) {
            const remaining = serviceData.limit - serviceData.used
            if (remaining <= 1) {
              requests.push({
                id: `req_${user.id}_${serviceType}`,
                userId: user.id,
                userName: user.profile?.name,
                userType: labels.userTypes.familiar,
                planName: user.plan?.name,
                planType: user.plan?.subtype,
                urgency: remaining === 0 ? labels.urgencyValues.critical : labels.urgencyValues.high,
                reason: remaining === 0 
                  ? labels.reasons.serviceExhausted.replace('{service}', getServiceTypeName(serviceType))
                  : labels.reasons.onlyXRemaining.replace('{service}', getServiceTypeName(serviceType)).replace('{count}', remaining).replace('{plural}', remaining > 1 ? 's' : ''),
                contactPhone: user.profile?.phone ||'+51 9 7777 8888',
                contactEmail: user.profile?.email || labels.demo.emails[1],
                requestDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
                status: labels.status.pending,
                serviceType,
                servicesUsed: serviceData.used,
                servicesTotal: serviceData.limit,
                lastServiceDate: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000)
              })
            }
          }
        })
      }
    })

    // Revisar usuarios corporativos
    allUsers?.corporativo?.forEach(user => {
      const remainingServices = user.service_usage?.current_period?.remaining_services || 0
      if (remainingServices <= 5) {
        requests.push({
          id: `req_${user.id}_corp`,
          userId: user.id,
          userName: user.profile?.name,
          userType: labels.userTypes.corporate,
          planName: labels.planNames.protectedArea,
          companyName: user.company?.name,
          urgency: remainingServices === 0 ? labels.urgencyValues.critical : remainingServices <= 2 ? labels.urgencyValues.high : labels.urgencyValues.medium,
          reason: remainingServices === 0 
            ? labels.reasons.corporateServicesExhausted
            : labels.reasons.onlyXCorporateRemaining.replace('{count}', remainingServices),
          contactPhone: user.profile?.phone || '+51 2 2555 1000',
          contactEmail: user.profile?.email || labels.demo.emails[2],
          requestDate: new Date(Date.now() - Math.random() * 4 * 24 * 60 * 60 * 1000),
          status: 'pendiente',
          servicesUsed: (user.company?.contracted_services || 50) - remainingServices,
          servicesTotal: user.company?.contracted_services || 50,
          lastServiceDate: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000)
        })
      }
    })

    // Agregar algunas solicitudes de ejemplo para demostración
    if (requests.length === 0) {
      // Datos de ejemplo para mostrar la funcionalidad
      requests.push(
        {
          id: 'demo_1',
          userId: 'demo_1',
          userName: labels.demo.names[0],
          userType: 'Familiar',
          planName: labels.demo.plans[0],
          urgency: labels.urgencyValues.critical,
          reason: 'Traslados - Servicio agotado',
          contactPhone: labels.demo.phones[0],
          contactEmail: labels.demo.emails[0],
          requestDate: new Date('2025-08-31'),
          status: 'pendiente',
          serviceType: 'TRASLADO_PROGRAMADO',
          servicesUsed: 1,
          servicesTotal: 1,
          lastServiceDate: new Date('2025-08-30')
        },
        {
          id: 'demo_2',
          userId: 'demo_2',
          userName: labels.demo.names[1],
          userType: labels.userTypes.corporate,
          planName: labels.planNames.protectedArea,
          companyName: labels.demo.names[2],
          urgency: labels.urgencyValues.critical,
          reason: 'Servicios corporativos agotados',
          contactPhone: labels.demo.phones[1],
          contactEmail: labels.demo.emails[3],
          requestDate: new Date('2025-08-30'),
          status: 'pendiente',
          servicesUsed: 50,
          servicesTotal: 50,
          lastServiceDate: new Date('2025-08-29')
        }
      )
    }

    // Combinar con las solicitudes reales del store si existen
    const realRequests = contactRequests
      ?.filter(req => req.userType !== 'Externo')
      ?.map(req => ({
        id: req.id,
        userId: req.userId,
        userName: req.userName,
        userType: req.userType,
        planName: req.planName,
        companyName: req.companyName,
        urgency: req.urgency || 'media',
        reason: req.reason,
        contactPhone: req.contactPhone,
        contactEmail: req.contactEmail,
        requestDate: new Date(req.requestDate),
        status: req.status,
        servicesUsed: req.currentUsage?.used || 0,
        servicesTotal: req.currentUsage?.total || 0,
        lastServiceDate: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000),
        isRealRequest: true
      })) || []

    // Combinar y ordenar por urgencia y fecha
    const allRequests = [...requests, ...realRequests]
    return allRequests.sort((a, b) => {
      const urgencyOrder = { [labels.urgencyValues.critical]: 3, [labels.urgencyValues.high]: 2, [labels.urgencyValues.medium]: 1 }
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      }
      return new Date(b.requestDate) - new Date(a.requestDate)
    })
  }, [allUsers, contactRequests])

  // Filtrar solicitudes según los filtros seleccionados
  const filteredRequests = useMemo(() => {
    return generateContactRequests.filter(request => {
      // Filtro por urgencia
      let urgencyMatch = true
      if (filter !== 'all') {
        urgencyMatch = request.urgency === filter
      }
      
      // Filtro por tipo de servicio
      let serviceMatch = true
      if (serviceFilter !== 'all') {
        serviceMatch = request.serviceType === serviceFilter
      }
      
      return urgencyMatch && serviceMatch
    })
  }, [generateContactRequests, filter, serviceFilter])

  const handleContactClient = (request) => {
    setContactModalRequest(request)
    setIsModalOpen(true)
  }

  const handleMarkAsContacted = (request) => {
    console.log(labels.logs.markingAsContacted, request)
    // TODO: Implementar actualización del estado en el store
    // Aquí podrías actualizar el estado de la solicitud en el store
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setContactModalRequest(null)
  }

  const handleViewDetail = (request) => {
    setDetailsModalRequest(request)
    setIsDetailsModalOpen(true)
  }

  const handleEditContract = (request) => {
    console.log(labels.logs.editingContract, request)
    // TODO: Implementar funcionalidad de edición de contrato
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setDetailsModalRequest(null)
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <ContactRequestsHeader
        filter={filter}
        serviceFilter={serviceFilter}
        onFilterChange={setFilter}
        onServiceFilterChange={setServiceFilter}
      />

      {/* Estadísticas */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <ContactRequestsStats requests={generateContactRequests} />
      </div>

      {/* Lista de Solicitudes */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {labels.titleWithCount.replace('{count}', filteredRequests.length)}
          </h3>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <ContactRequestItem
                key={request.id}
                request={request}
                onContactClient={handleContactClient}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">{labels.empty}</p>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={contactModalRequest}
        onMarkAsContacted={handleMarkAsContacted}
      />

      {/* Contract Details Modal */}
      <ContractDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        request={detailsModalRequest}
        onEditContract={handleEditContract}
      />
    </div>
  )
}

export default ContactRequestsTab