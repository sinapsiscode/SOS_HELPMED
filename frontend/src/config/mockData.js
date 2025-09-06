// Datos mock para desarrollo - Serán reemplazados por API real
export const MOCK_DATA = {
  // Usuarios por defecto
  defaultUsers: {
    admin: {
      name: 'Admin',
      email: 'admin@helpmed.com',
      role: 'admin'
    },
    ambulance: {
      name: 'Carlos Mendoza',
      email: 'conductor@helpmed.com',
      role: 'ambulance',
      ambulance_unit: 'AMB-001'
    },
    familiar: {
      name: 'María García',
      email: 'familiar@helpmed.com',
      role: 'familiar'
    }
  },
  
  // Datos de emergencia de ejemplo
  emergencyExample: {
    code: 'EMG-3796',
    distance: '2.5 km',
    eta: '8 min',
    patient: {
      name: 'Juan Pérez Simulado',
      age: '45 años',
      phone: '+51 999888777'
    },
    symptoms: 'Dolor torácico intenso, dificultad respiratoria (SIMULACIÓN)',
    location: {
      address: 'Av. Simulación 123, Lima',
      coordinates: [-12.046374, -77.042793]
    },
    service: 'medical',
    priority: 'high',
    status: 'pending'
  },
  
  // Lista de ambulancias
  ambulances: [
    {
      id: 'AMB-001',
      driver: 'Carlos Mendoza',
      status: 'available',
      location: { lat: -12.046374, lng: -77.042793 },
      type: 'basic'
    },
    {
      id: 'AMB-002', 
      driver: 'Pedro Rodriguez',
      status: 'busy',
      location: { lat: -12.056374, lng: -77.052793 },
      type: 'advanced'
    },
    {
      id: 'AMB-003',
      driver: 'Ana López',
      status: 'available',
      location: { lat: -12.036374, lng: -77.032793 },
      type: 'basic'
    }
  ],
  
  // Planes y servicios
  plans: [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 29.90,
      currency: 'S/',
      features: [
        'Atención médica básica',
        '2 servicios al mes',
        'Cobertura en Lima'
      ]
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 59.90,
      currency: 'S/',
      features: [
        'Atención médica completa',
        'Servicios ilimitados',
        'Cobertura nacional',
        'Asistencia mecánica'
      ]
    },
    {
      id: 'corporate',
      name: 'Plan Corporativo',
      price: 'Personalizado',
      currency: '',
      features: [
        'Planes personalizados',
        'Gestión de flotas',
        'Reportes detallados',
        'Soporte 24/7'
      ]
    }
  ],
  
  // Estadísticas del dashboard
  dashboardStats: {
    totalEmergencies: 156,
    activeEmergencies: 3,
    availableAmbulances: 8,
    totalAmbulances: 12,
    monthlyRevenue: 45230,
    totalUsers: 1234,
    averageResponseTime: '8.5 min',
    satisfactionRate: 94.5
  },
  
  // Contactos de emergencia
  emergencyContacts: [
    { type: 'police', number: '105', name: 'Policía Nacional' },
    { type: 'fire', number: '116', name: 'Bomberos' },
    { type: 'medical', number: '106', name: 'SAMU' }
  ],
  
  // Afiliados
  affiliates: [
    {
      id: 1,
      name: 'María García López',
      dni: '45678912',
      phone: '+51 987654321',
      relationship: 'conyuge',
      birthDate: '1985-03-15',
      status: 'active',
      addedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      name: 'Carlos García Pérez',
      dni: '78945612',
      phone: '+51 912345678',
      relationship: 'hijo',
      birthDate: '2010-07-22',
      status: 'active',
      addedAt: '2024-01-10T10:30:00Z'
    },
    {
      id: 3,
      name: 'Ana García Pérez',
      dni: '32165498',
      phone: null,
      relationship: 'hijo',
      birthDate: '2012-11-08',
      status: 'inactive',
      addedAt: '2024-01-10T11:00:00Z'
    }
  ],
  
  // Distritos de Lima
  districts: [
    'Miraflores',
    'San Isidro',
    'Barranco',
    'Surco',
    'La Molina',
    'San Borja',
    'Jesús María',
    'Lince',
    'Magdalena',
    'Pueblo Libre',
    'San Miguel',
    'Cercado de Lima'
  ],
  
  // Tipos de documento
  documentTypes: [
    { value: 'dni', label: 'DNI' },
    { value: 'ce', label: 'Carnet de Extranjería' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'ruc', label: 'RUC' }
  ],
  
  // Estados de servicio
  serviceStatus: [
    { value: 'active', label: 'Activo', color: 'green' },
    { value: 'inactive', label: 'Inactivo', color: 'gray' },
    { value: 'suspended', label: 'Suspendido', color: 'orange' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' }
  ]
}