// Datos mock para desarrollo - Solo se usan con JSON Server
export const MOCK_DATA = {
  // Sin datos por defecto - todo vacío
  defaultUsers: {},
  
  // Sin datos de emergencia
  emergencyExample: null,
  
  // Lista vacía de ambulancias
  ambulances: [],
  
  // Planes vacíos
  plans: [],
  
  // Estadísticas en cero
  dashboardStats: {
    totalEmergencies: 0,
    activeEmergencies: 0,
    availableAmbulances: 0,
    totalAmbulances: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    averageResponseTime: '0 min',
    satisfactionRate: 0
  },
  
  // Contactos vacíos
  emergencyContacts: [],
  
  // Afiliados vacíos
  affiliates: [],
  
  // Distritos vacíos
  districts: [],
  
  // Tipos de documento vacíos
  documentTypes: [],
  
  // Estados de servicio vacíos
  serviceStatus: []
}