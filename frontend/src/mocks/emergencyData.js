/**
 * Mock data para emergencias pendientes
 * SOLO DESARROLLO - No usar en producción (Regla #1)
 */
export const MOCK_PENDING_EMERGENCIES = [
  {
    id: 'emg_001',
    user_id: 'fam_dor_001',
    userName: 'Alejandra Vega',
    userType: 'Familiar',
    planName: 'Plan Dorado',
    type: 'EMERGENCIA',
    description: 'Dolor de pecho intenso, dificultad para respirar',
    location: {
      address: 'Av. El Bosque 500, San Isidro',
      coordinates: {
        latitude: -12.083,
        longitude: -77.0362
      }
    },
    affiliateInfo: {
      id: 'titular',
      name: 'Alejandra Vega',
      relation: 'Titular'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'pending',
    priority: 'alta',
    estimatedResponseTime: '8-12 min'
  },
  {
    id: 'emg_002',
    user_id: 'fam_help_001',
    userName: 'Ana Rodríguez',
    userType: 'Familiar',
    planName: 'Plan Help 12',
    type: 'URGENCIA',
    description: 'Caída, posible fractura en brazo izquierdo',
    location: {
      address: 'Av. Javier Prado 1234, San Isidro',
      coordinates: {
        latitude: -12.0764,
        longitude: -77.0279
      }
    },
    affiliateInfo: {
      id: 'aff_001_002',
      name: 'Sofía Rodríguez',
      relation: 'Hija'
    },
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    status: 'pending',
    priority: 'media',
    estimatedResponseTime: '15-20 min'
  },
  {
    id: 'emg_003',
    user_id: 'fam_vip_001',
    userName: 'Eduardo Silva',
    userType: 'Familiar',
    planName: 'Plan VIP',
    type: 'MEDICO_DOMICILIO',
    description: 'Control de diabetes, valores alterados de glucemia',
    location: {
      address: 'Av. Salaverry 3000, Jesús María',
      coordinates: {
        latitude: -12.0642,
        longitude: -77.0547
      }
    },
    affiliateInfo: {
      id: 'titular',
      name: 'Eduardo Silva',
      relation: 'Titular'
    },
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    status: 'pending',
    priority: 'baja',
    estimatedResponseTime: '30-45 min'
  }
]
