import { useState, useMemo, useCallback } from 'react'

/**
 * Hook para gestión de solicitudes de contacto
 */
const useContactRequests = () => {
  // Estado de solicitudes
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+51 999 888 777',
      subject: 'Información sobre planes corporativos',
      message: 'Necesito información sobre los planes corporativos para mi empresa de 50 empleados.',
      status: 'pending',
      priority: 'high',
      date: new Date('2024-01-20T10:30:00'),
      type: 'corporate'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+51 987 654 321',
      subject: 'Consulta sobre cobertura',
      message: 'Quisiera saber si tienen cobertura en la zona de Arequipa.',
      status: 'pending',
      priority: 'medium',
      date: new Date('2024-01-20T09:15:00'),
      type: 'coverage'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      phone: '+51 912 345 678',
      subject: 'Problema con el servicio',
      message: 'Tuve un problema con la ambulancia que llegó tarde a mi emergencia.',
      status: 'in_progress',
      priority: 'urgent',
      date: new Date('2024-01-19T14:20:00'),
      type: 'complaint'
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+51 923 456 789',
      subject: 'Renovación de plan',
      message: 'Mi plan vence pronto y quisiera información sobre la renovación.',
      status: 'resolved',
      priority: 'low',
      date: new Date('2024-01-19T11:00:00'),
      type: 'renewal'
    },
    {
      id: 5,
      name: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@email.com',
      phone: '+51 934 567 890',
      subject: 'Solicitud de afiliación',
      message: 'Quiero afiliar a mi familia completa al plan premium.',
      status: 'pending',
      priority: 'high',
      date: new Date('2024-01-20T08:45:00'),
      type: 'subscription'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Filtrar solicitudes
  const filteredRequests = useMemo(() => {
    let filtered = [...requests]

    // Filtro por estado
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.status === filter)
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term) ||
        r.message.toLowerCase().includes(term)
      )
    }

    // Ordenar por prioridad y fecha
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (b.status === 'pending' && a.status !== 'pending') return 1
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return b.date - a.date
    })

    return filtered
  }, [requests, filter, searchTerm])

  // Estadísticas
  const stats = useMemo(() => {
    const total = requests.length
    const pending = requests.filter(r => r.status === 'pending').length
    const inProgress = requests.filter(r => r.status === 'in_progress').length
    const resolved = requests.filter(r => r.status === 'resolved').length
    const urgent = requests.filter(r => r.priority === 'urgent' && r.status !== 'resolved').length

    return { total, pending, inProgress, resolved, urgent }
  }, [requests])

  // Handlers
  const handleStatusChange = useCallback((requestId, newStatus) => {
    setRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
    )
  }, [])

  const handlePriorityChange = useCallback((requestId, newPriority) => {
    setRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, priority: newPriority } : r)
    )
  }, [])

  const handleAssignRequest = useCallback((requestId, assignee) => {
    setRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, assignee, status: 'in_progress' } : r)
    )
  }, [])

  const handleAddNote = useCallback((requestId, note) => {
    setRequests(prev => 
      prev.map(r => {
        if (r.id === requestId) {
          const notes = r.notes || []
          return { 
            ...r, 
            notes: [...notes, { text: note, date: new Date(), author: 'Admin' }]
          }
        }
        return r
      })
    )
  }, [])

  const handleDeleteRequest = useCallback((requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId))
  }, [])

  // Utilidades
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'corporate': return 'fas fa-building'
      case 'coverage': return 'fas fa-map-marker-alt'
      case 'complaint': return 'fas fa-exclamation-triangle'
      case 'renewal': return 'fas fa-sync'
      case 'subscription': return 'fas fa-user-plus'
      default: return 'fas fa-envelope'
    }
  }

  return {
    requests: filteredRequests,
    stats,
    filter,
    searchTerm,
    selectedRequest,
    setFilter,
    setSearchTerm,
    setSelectedRequest,
    handleStatusChange,
    handlePriorityChange,
    handleAssignRequest,
    handleAddNote,
    handleDeleteRequest,
    getStatusColor,
    getPriorityColor,
    getTypeIcon
  }
}

export default useContactRequests