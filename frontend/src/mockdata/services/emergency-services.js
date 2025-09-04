// Datos de servicios de emergencia y historial

export const EMERGENCY_HISTORY = [
  // Servicios de usuarios familiares
  {
    id: 'serv_001',
    user_id: 'fam_help_001',
    user_type: 'FAMILIAR',
    service_type: 'EMERGENCIA',
    date: '2024-12-15',
    time: '14:30',
    status: 'completed',
    description: 'Dolor de pecho intenso',
    location: 'Av. San Isidro 1234, San Isidro',
    unit_assigned: 'AMB-001',
    response_time: '4 min',
    duration: '45 min',
    cost: 0, // Incluido en plan
    rating: 5,
    notes: 'Atención excelente, personal muy profesional'
  },
  {
    id: 'serv_002',
    user_id: 'fam_help_001',
    user_type: 'FAMILIAR',
    service_type: 'URGENCIA',
    date: '2024-11-28',
    time: '09:15',
    status: 'completed',
    description: 'Fiebre alta en menor',
    location: 'Av. San Isidro 1234, San Isidro',
    unit_assigned: 'MED-003',
    response_time: '12 min',
    duration: '30 min',
    cost: 0,
    rating: 4,
    notes: 'Atención rápida y efectiva'
  },
  {
    id: 'serv_003',
    user_id: 'fam_vip_001',
    user_type: 'FAMILIAR',
    service_type: 'MEDICO_DOMICILIO',
    date: '2024-12-10',
    time: '16:45',
    status: 'completed',
    description: 'Control médico rutinario',
    location: 'Av. Vitacura 3000, Vitacura',
    unit_assigned: 'MED-005',
    response_time: '25 min',
    duration: '60 min',
    cost: 0,
    rating: 5,
    notes: 'Dr. muy profesional, excelente atención'
  },
  {
    id: 'serv_004',
    user_id: 'fam_dor_001',
    user_type: 'FAMILIAR',
    service_type: 'ZONA_PROTEGIDA',
    date: '2024-11-22',
    time: '11:20',
    status: 'completed',
    description: 'Atención en centro comercial',
    location: 'Mall Plaza Norte, Huechuraba',
    unit_assigned: 'MED-002',
    response_time: '8 min',
    duration: '35 min',
    cost: 0,
    rating: 5,
    notes: 'Servicio de zona protegida funcionó perfectamente'
  },

  // Servicios corporativos
  {
    id: 'serv_005',
    user_id: 'corp_001',
    user_type: 'CORPORATIVO',
    service_type: 'EMERGENCIA',
    date: '2024-12-18',
    time: '10:45',
    status: 'completed',
    description: 'Accidente laboral - corte en mano',
    location: 'Av. Industrial 1500, Callao',
    unit_assigned: 'AMB-002',
    response_time: '6 min',
    duration: '50 min',
    cost: 0,
    employee_name: 'Juan Pérez',
    employee_id: 'emp_001',
    rating: 5,
    notes: 'Atención inmediata, trabajador estabilizado y trasladado'
  },
  {
    id: 'serv_006',
    user_id: 'corp_001',
    user_type: 'CORPORATIVO',
    service_type: 'EMERGENCIA',
    date: '2024-12-10',
    time: '14:20',
    status: 'completed',
    description: 'Mareos y desmayo',
    location: 'Camino a Colina Km 15',
    unit_assigned: 'AMB-001',
    response_time: '15 min',
    duration: '40 min',
    cost: 0,
    employee_name: 'María González',
    employee_id: 'emp_002',
    rating: 4,
    notes: 'Trabajadora atendida y dada de alta en el lugar'
  },
  {
    id: 'serv_007',
    user_id: 'corp_002',
    user_type: 'CORPORATIVO',
    service_type: 'EMERGENCIA',
    date: '2024-12-05',
    time: '08:30',
    status: 'completed',
    description: 'Dolor torácico',
    location: 'Av. Miraflores 1800, Miraflores',
    unit_assigned: 'AMB-003',
    response_time: '3 min',
    duration: '55 min',
    cost: 0,
    employee_name: 'Dr. Eduardo Vargas',
    employee_id: 'emp_004',
    rating: 5,
    notes: 'Médico del centro atendido por precaución'
  },

  // Servicios externos
  {
    id: 'serv_008',
    user_id: 'ext_caso1_001',
    user_type: 'EXTERNO',
    service_type: 'EMERGENCIA',
    date: '2024-12-18',
    time: '14:30',
    status: 'completed',
    description: 'Crisis hipertensiva',
    location: 'Los Aromos 789, San Martín de Porres',
    unit_assigned: 'AMB-004',
    response_time: '18 min',
    duration: '65 min',
    cost: 120000,
    billing_to: 'Seguros del Pacífico',
    rating: 4,
    notes: 'Paciente estabilizado y trasladado a clínica'
  },
  {
    id: 'serv_009',
    user_id: 'ext_caso1_001',
    user_type: 'EXTERNO',
    service_type: 'MEDICO_DOMICILIO',
    date: '2024-12-12',
    time: '19:45',
    status: 'completed',
    description: 'Control post operatorio',
    location: 'Los Aromos 789, San Martín de Porres',
    unit_assigned: 'MED-006',
    response_time: '35 min',
    duration: '45 min',
    cost: 95000,
    billing_to: 'Seguros del Pacífico',
    rating: 5,
    notes: 'Control realizado sin complicaciones'
  },
  {
    id: 'serv_010',
    user_id: 'ext_caso2_001',
    user_type: 'EXTERNO',
    service_type: 'EMERGENCIA',
    date: '2024-11-28',
    time: '16:20',
    status: 'completed',
    description: 'Lesión en trabajo',
    location: 'Pasaje Los Copihues 456, Arequipa',
    unit_assigned: 'AMB-ANT-01',
    response_time: '22 min',
    duration: '40 min',
    cost: 0, // Dentro del límite individual
    rating: 4,
    notes: 'Último servicio dentro del límite individual del afiliado'
  }
]

// Unidades médicas disponibles
export const MEDICAL_UNITS = [
  {
    id: 'AMB-001',
    type: 'Ambulancia',
    status: 'available',
    location: 'Base Central - Miraflores',
    equipment: 'Completo',
    crew: 2,
    last_service: '2024-12-19T16:30:00Z',
    coverage_area: ['Miraflores', 'San Isidro', 'Vitacura'],
    coordinates: { lat: -12.0284, lng: -77.05965 }
  },
  {
    id: 'AMB-002',
    type: 'Ambulancia',
    status: 'in_service',
    location: 'En servicio - San Martín de Porres',
    equipment: 'Completo',
    crew: 2,
    current_service: 'serv_011',
    eta_available: '2024-12-20T11:45:00Z',
    coverage_area: ['San Martín de Porres', 'Callao', 'Cerrillos'],
    coordinates: { lat: -33.5067, lng: -77.07581 }
  },
  {
    id: 'AMB-003',
    type: 'Ambulancia',
    status: 'available',
    location: 'Base Norte - Huechuraba',
    equipment: 'Completo',
    crew: 2,
    last_service: '2024-12-19T14:20:00Z',
    coverage_area: ['Huechuraba', 'Quilicura', 'Colina'],
    coordinates: { lat: -33.3784, lng: -77.06342 }
  },
  {
    id: 'AMB-004',
    type: 'Ambulancia',
    status: 'maintenance',
    location: 'Taller de mantención',
    equipment: 'En revisión',
    crew: 0,
    eta_available: '2024-12-21T08:00:00Z',
    coverage_area: ['Ñuñoa', 'La Reina', 'Peñalolén'],
    coordinates: null
  },
  {
    id: 'MED-002',
    type: 'Unidad Médica',
    status: 'available',
    location: 'Base Sur - San Miguel',
    equipment: 'Básico',
    crew: 1,
    last_service: '2024-12-19T12:15:00Z',
    coverage_area: ['San Miguel', 'La Cisterna', 'El Bosque'],
    coordinates: { lat: -12.0962, lng: -77.06435 }
  },
  {
    id: 'MED-003',
    type: 'Unidad Médica',
    status: 'available',
    location: 'Base Central - Miraflores',
    equipment: 'Básico',
    crew: 1,
    last_service: '2024-12-19T09:30:00Z',
    coverage_area: ['Miraflores', 'Lima', 'Ñuñoa'],
    coordinates: { lat: -12.0284, lng: -77.05965 }
  },
  {
    id: 'MED-005',
    type: 'Unidad Médica VIP',
    status: 'available',
    location: 'Base Premium - San Isidro',
    equipment: 'Premium',
    crew: 1,
    specialties: ['Cardiología', 'Medicina Interna'],
    last_service: '2024-12-18T18:45:00Z',
    coverage_area: ['San Isidro', 'Vitacura', 'Lo Barnechea'],
    coordinates: { lat: -12.0172, lng: -77.05476 }
  },
  {
    id: 'MED-006',
    type: 'Unidad Médica',
    status: 'available',
    location: 'Base Oeste - Callao',
    equipment: 'Básico',
    crew: 1,
    last_service: '2024-12-19T15:20:00Z',
    coverage_area: ['Callao', 'San Martín de Porres', 'Cerro Navia'],
    coordinates: { lat: -12.0401, lng: -77.07394 }
  },
  {
    id: 'AMB-ANT-01',
    type: 'Ambulancia Regional',
    status: 'available',
    location: 'Base Arequipa',
    equipment: 'Completo',
    crew: 2,
    last_service: '2024-12-18T20:10:00Z',
    coverage_area: ['Arequipa', 'Calama', 'Tocopilla'],
    coordinates: { lat: -16.409, lng: -71.5375 }
  }
]

// Estadísticas de servicios
export const SERVICE_STATISTICS = {
  monthly_totals: {
    december: {
      emergencias: 156,
      urgencias: 89,
      medico_domicilio: 167,
      traslados: 34,
      zona_protegida: 12,
      orientacion: 234,
      laboratorio: 45
    },
    november: {
      emergencias: 142,
      urgencias: 95,
      medico_domicilio: 145,
      traslados: 28,
      zona_protegida: 8,
      orientacion: 198,
      laboratorio: 38
    }
  },
  response_times: {
    average_emergency: '7.5 min',
    average_urgency: '15.2 min',
    average_home_visit: '28.4 min',
    best_time: '2 min',
    worst_time: '45 min'
  },
  satisfaction: {
    overall: 4.6,
    emergency: 4.8,
    urgency: 4.5,
    home_visit: 4.7,
    total_reviews: 1247
  },
  user_type_breakdown: {
    familiar: {
      services: 412,
      percentage: 58
    },
    corporativo: {
      services: 156,
      percentage: 22
    },
    externo: {
      services: 142,
      percentage: 20
    }
  }
}

// Función helper para obtener historial por usuario
export const getServiceHistory = (userId) => {
  return EMERGENCY_HISTORY.filter((service) => service.user_id === userId)
}

// Función helper para obtener unidades disponibles
export const getAvailableUnits = () => {
  return MEDICAL_UNITS.filter((unit) => unit.status === 'available')
}

// Función helper para obtener estadísticas por tipo de usuario
export const getStatsByUserType = (userType) => {
  return EMERGENCY_HISTORY.filter((service) => service.user_type === userType)
}
