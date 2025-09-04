// Usuarios de ambulancia con credenciales de acceso

export const AMBULANCE_USERS = [
  {
    id: 'amb_001',
    username: 'ambulancia1',
    password: 'amb123',
    role: 'AMBULANCE',
    profile: {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@helpmed.pe',
      phone: '+51 987 654 321',
      license: 'A1-123456789',
      memberSince: '2024-01-15T00:00:00.000Z'
    },
    ambulance: {
      unit_id: 'AMB-001',
      type: 'Ambulancia',
      plate: 'HM-001',
      equipment: 'Completo',
      capacity: 2
    },
    status: 'active',
    currentStatus: 'available', // available, en_route, on_scene, off_duty
    currentLocation: null,
    locationHistory: [],
    stats: {
      completedServices: 45,
      totalDistance: 1250.5,
      averageResponseTime: 8.2
    },
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'amb_002',
    username: 'ambulancia2',
    password: 'amb123',
    role: 'AMBULANCE',
    profile: {
      name: 'María González',
      email: 'maria.gonzalez@helpmed.pe',
      phone: '+51 987 654 322',
      license: 'A1-987654321',
      memberSince: '2024-02-01T00:00:00.000Z'
    },
    ambulance: {
      unit_id: 'AMB-002',
      type: 'Unidad Médica',
      plate: 'HM-002',
      equipment: 'Avanzado',
      capacity: 4
    },
    status: 'active',
    currentStatus: 'en_route',
    currentLocation: {
      latitude: -12.043,
      longitude: -77.0282,
      timestamp: new Date().toISOString(),
      accuracy: 5
    },
    locationHistory: [],
    stats: {
      completedServices: 32,
      totalDistance: 890.3,
      averageResponseTime: 7.8
    },
    createdAt: '2024-02-01T00:00:00.000Z'
  },
  {
    id: 'amb_003',
    username: 'ambulancia3',
    password: 'amb123',
    role: 'AMBULANCE',
    profile: {
      name: 'Roberto Silva',
      email: 'roberto.silva@helpmed.pe',
      phone: '+51 987 654 323',
      license: 'A1-456789123',
      memberSince: '2024-03-01T00:00:00.000Z'
    },
    ambulance: {
      unit_id: 'AMB-003',
      type: 'Ambulancia',
      plate: 'HM-003',
      equipment: 'Completo',
      capacity: 2
    },
    status: 'active',
    currentStatus: 'available',
    currentLocation: null,
    locationHistory: [],
    stats: {
      completedServices: 28,
      totalDistance: 720.8,
      averageResponseTime: 9.1
    },
    createdAt: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 'amb_004',
    username: 'ambulancia4',
    password: 'amb123',
    role: 'AMBULANCE',
    profile: {
      name: 'Ana Morales',
      email: 'ana.morales@helpmed.pe',
      phone: '+51 987 654 324',
      license: 'A1-789123456',
      memberSince: '2024-03-15T00:00:00.000Z'
    },
    ambulance: {
      unit_id: 'AMB-004',
      type: 'Unidad Médica',
      plate: 'HM-004',
      equipment: 'Avanzado',
      capacity: 4
    },
    status: 'active',
    currentStatus: 'on_scene',
    currentLocation: {
      latitude: -12.0564,
      longitude: -77.0425,
      timestamp: new Date().toISOString(),
      accuracy: 8
    },
    locationHistory: [],
    stats: {
      completedServices: 19,
      totalDistance: 456.2,
      averageResponseTime: 8.7
    },
    createdAt: '2024-03-15T00:00:00.000Z'
  },
  {
    id: 'amb_005',
    username: 'ambulancia5',
    password: 'amb123',
    role: 'AMBULANCE',
    profile: {
      name: 'Fernando López',
      email: 'fernando.lopez@helpmed.pe',
      phone: '+51 987 654 325',
      license: 'A1-321654987',
      memberSince: '2024-04-01T00:00:00.000Z'
    },
    ambulance: {
      unit_id: 'AMB-005',
      type: 'Ambulancia',
      plate: 'HM-005',
      equipment: 'Básico',
      capacity: 2
    },
    status: 'maintenance',
    currentStatus: 'off_duty',
    currentLocation: null,
    locationHistory: [],
    stats: {
      completedServices: 15,
      totalDistance: 298.5,
      averageResponseTime: 10.2
    },
    createdAt: '2024-04-01T00:00:00.000Z'
  }
]

// Función helper para obtener usuario ambulancia por username
export const getAmbulanceUser = (username) => {
  return AMBULANCE_USERS.find((user) => user.username === username)
}

// Función helper para obtener usuarios por estado
export const getAmbulanceUsersByStatus = (status) => {
  return AMBULANCE_USERS.filter((user) => user.currentStatus === status)
}
