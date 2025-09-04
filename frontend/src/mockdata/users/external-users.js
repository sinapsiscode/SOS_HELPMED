// Usuarios afiliados externos

import { PLAN_TYPES, EXTERNO_SUBTYPES } from '../plans/plan-config.js'

export const EXTERNAL_USERS = [
  // CASO 1: Sin límites, facturación directa
  {
    id: 'ext_caso1_001',
    username: 'externo1',
    password: 'ext123',
    role: 'EXTERNO',
    plan: {
      type: PLAN_TYPES.EXTERNO,
      subtype: EXTERNO_SUBTYPES.CASO_1,
      name: 'Afiliados Externos - Caso 1',
      billing_type: 'direct',
      start_date: '2024-01-01T00:00:00Z',
      contract_id: 'EXT-C1-2024-001'
    },
    client_company: {
      id: 'client_001',
      name: 'Rimac Seguros',
      rut: '90.123.000-7',
      contact_person: {
        name: 'Valentina Torres',
        email: 'convenios@segurospacifico.cl',
        phone: '+51 2 2800 9000'
      },
      billing_address: 'Av. Javier Prado 3000, La Molina',
      contract_type: 'unlimited_services'
    },
    profile: {
      name: 'José Martínez',
      email: 'jose.martinez@email.com',
      phone: '+51 9 4444 5555',
      dni: '20.111.222-3',
      address: 'Los Aromos 789, San Martín de Porres',
      birth_date: '1982-08-14',
      affiliate_id: 'SP-001-20111222',
      referral_source: null, // Sin referencia, afiliado directo
      emergency_contacts: [
        {
          name: 'Elena Martínez',
          relationship: 'Esposa',
          phone: '+51 9 4444 6666'
        }
      ],
      medical_info: {
        blood_type: 'A-',
        allergies: [],
        conditions: [],
        medications: [],
        insurance: 'Rimac Seguros'
      }
    },
    service_usage: {
      current_period: {
        unlimited: true,
        services_used: 15,
        breakdown: {
          emergencias: 6,
          medico_domicilio: 9
        },
        last_service: '2024-12-18T14:30:00Z'
      },
      billing_info: {
        cost_per_emergency: 515,
        cost_per_home_visit: 410,
        monthly_total: 7555 // 15 servicios total
      }
    }
  },
  {
    id: 'ext_caso1_002',
    username: 'externo1_b',
    password: 'ext124',
    role: 'EXTERNO',
    plan: {
      type: PLAN_TYPES.EXTERNO,
      subtype: EXTERNO_SUBTYPES.CASO_1,
      name: 'Afiliados Externos - Caso 1',
      billing_type: 'direct',
      start_date: '2024-03-15T00:00:00Z',
      contract_id: 'EXT-C1-2024-002'
    },
    client_company: {
      id: 'client_002',
      name: 'Pacifico Seguros',
      rut: '91.456.789-1',
      contact_person: {
        name: 'Ricardo Sandoval',
        email: 'convenios@mutual.cl',
        phone: '+51 2 2900 8000'
      },
      billing_address: 'Av. Providencia 1500, Providencia',
      contract_type: 'unlimited_services'
    },
    profile: {
      name: 'Carolina Rojas',
      email: 'carolina.rojas@email.com',
      phone: '+51 9 6666 7777',
      dni: '22.333.444-5',
      address: 'Av. Grecia 1200, Ñuñoa',
      birth_date: '1988-12-05',
      affiliate_id: 'MS-002-22333444',
      referral_source: null, // Sin referencia, afiliado directo
      emergency_contacts: [
        {
          name: 'Miguel Rojas',
          relationship: 'Hermano',
          phone: '+51 9 6666 8888'
        }
      ],
      medical_info: {
        blood_type: 'O+',
        allergies: ['Aspirina'],
        conditions: ['Asma'],
        medications: ['Salbutamol'],
        insurance: 'Pacifico Seguros'
      }
    },
    service_usage: {
      current_period: {
        unlimited: true,
        services_used: 8,
        breakdown: {
          emergencias: 3,
          medico_domicilio: 5
        },
        last_service: '2024-12-15T09:45:00Z'
      },
      billing_info: {
        cost_per_emergency: 515,
        cost_per_home_visit: 410,
        monthly_total: 3590 // 8 servicios total
      }
    }
  },

  // CASO 2: Con límites (3 por afiliado, 430 general)
  {
    id: 'ext_caso2_001',
    username: 'externo2',
    password: 'ext456',
    role: 'EXTERNO',
    plan: {
      type: PLAN_TYPES.EXTERNO,
      subtype: EXTERNO_SUBTYPES.CASO_2,
      name: 'Afiliados Externos - Caso 2',
      billing_type: 'limited',
      individual_limit: 3,
      general_limit: 430,
      start_date: '2024-01-01T00:00:00Z',
      contract_id: 'EXT-C2-2024-001'
    },
    client_company: {
      id: 'client_003',
      name: 'Empresa Minera Norte',
      rut: '88.777.666-5',
      contact_person: {
        name: 'Andrea Salinas',
        email: 'bienestar@mineranorte.cl',
        phone: '+51 2 2700 6000'
      },
      billing_address: 'Av. Vitacura 2500, Vitacura',
      contract_type: 'limited_services',
      total_affiliates: 500,
      general_services_used: 425, // Cerca del límite de 430
      general_services_remaining: 5
    },
    profile: {
      name: 'Manuel Guerrero',
      email: 'manuel.guerrero@email.com',
      phone: '+51 9 8888 9999',
      dni: '24.555.666-7',
      address: 'Pasaje Los Copihues 456, Arequipa',
      birth_date: '1979-06-20',
      affiliate_id: 'EMN-001-24555666',
      employee_id: 'EMP-2024-1256',
      referral_source: 'BCR_FONDO_EMPLEADOS', // Empleado del BCR
      emergency_contacts: [
        {
          name: 'Rosa Guerrero',
          relationship: 'Esposa',
          phone: '+51 9 8888 0000'
        }
      ],
      medical_info: {
        blood_type: 'B+',
        allergies: [],
        conditions: [],
        medications: [],
        insurance: 'Empresa Minera Norte'
      }
    },
    service_usage: {
      current_period: {
        individual_limit: 3,
        individual_used: 3, // ¡Ya agotó su límite individual!
        individual_remaining: 0,
        services_breakdown: {
          emergencias: 1,
          medico_domicilio: 2
        },
        last_service: '2024-11-28T16:20:00Z',
        additional_services_needed: true
      },
      billing_info: {
        cost_per_additional_service: 195,
        services_pending_payment: 0
      }
    }
  },
  {
    id: 'ext_caso2_002',
    username: 'externo2_b',
    password: 'ext457',
    role: 'EXTERNO',
    plan: {
      type: PLAN_TYPES.EXTERNO,
      subtype: EXTERNO_SUBTYPES.CASO_2,
      name: 'Afiliados Externos - Caso 2',
      billing_type: 'limited',
      individual_limit: 3,
      general_limit: 430,
      start_date: '2024-01-01T00:00:00Z',
      contract_id: 'EXT-C2-2024-001'
    },
    client_company: {
      id: 'client_003', // Misma empresa que el anterior
      name: 'Empresa Minera Norte',
      rut: '88.777.666-5',
      contact_person: {
        name: 'Andrea Salinas',
        email: 'bienestar@mineranorte.cl',
        phone: '+51 2 2700 6000'
      },
      billing_address: 'Av. Vitacura 2500, Vitacura',
      contract_type: 'limited_services',
      total_affiliates: 500,
      general_services_used: 425,
      general_services_remaining: 5
    },
    profile: {
      name: 'Pamela Cortés',
      email: 'pamela.cortes@email.com',
      phone: '+51 9 7777 8888',
      dni: '25.444.555-6',
      address: 'Calle del Mineral 123, Arequipa',
      birth_date: '1985-09-12',
      affiliate_id: 'EMN-002-25444555',
      employee_id: 'EMP-2024-1789',
      referral_source: 'BCR_FONDO_EMPLEADOS', // Empleada del BCR
      emergency_contacts: [
        {
          name: 'Carlos Cortés',
          relationship: 'Hermano',
          phone: '+51 9 7777 9999'
        }
      ],
      medical_info: {
        blood_type: 'AB-',
        allergies: ['Penicilina'],
        conditions: [],
        medications: [],
        insurance: 'Empresa Minera Norte'
      }
    },
    service_usage: {
      current_period: {
        individual_limit: 3,
        individual_used: 1,
        individual_remaining: 2,
        services_breakdown: {
          emergencias: 0,
          medico_domicilio: 1
        },
        last_service: '2024-10-15T11:30:00Z',
        additional_services_needed: false
      },
      billing_info: {
        cost_per_additional_service: 195,
        services_pending_payment: 0
      }
    }
  },
  {
    id: 'ext_caso2_003',
    username: 'externo2_c',
    password: 'ext458',
    role: 'EXTERNO',
    plan: {
      type: PLAN_TYPES.EXTERNO,
      subtype: EXTERNO_SUBTYPES.CASO_2,
      name: 'Afiliados Externos - Caso 2',
      billing_type: 'limited',
      individual_limit: 3,
      general_limit: 430,
      start_date: '2024-01-01T00:00:00Z',
      contract_id: 'EXT-C2-2024-002'
    },
    client_company: {
      id: 'client_004',
      name: 'Universidad del Valle',
      rut: '71.222.333-4',
      contact_person: {
        name: 'Dr. Francisco López',
        email: 'bienestar@univalle.cl',
        phone: '+51 2 2600 4000'
      },
      billing_address: 'Av. Libertador 3000, Lima',
      contract_type: 'limited_services',
      total_affiliates: 450,
      general_services_used: 156, // Bien dentro del límite
      general_services_remaining: 274
    },
    profile: {
      name: 'Profesor Alberto Ruiz',
      email: 'alberto.ruiz@univalle.cl',
      phone: '+51 9 5555 4444',
      dni: '26.333.444-5',
      address: 'Av. Educación 890, Lima',
      birth_date: '1975-03-08',
      affiliate_id: 'UV-003-26333444',
      employee_id: 'PROF-2020-0567',
      referral_source: null, // Sin referencia, afiliado directo
      emergency_contacts: [
        {
          name: 'Dra. Carmen Ruiz',
          relationship: 'Esposa',
          phone: '+51 9 5555 3333'
        }
      ],
      medical_info: {
        blood_type: 'O+',
        allergies: [],
        conditions: ['Hipertensión'],
        medications: ['Enalapril 10mg'],
        insurance: 'Universidad del Valle'
      }
    },
    service_usage: {
      current_period: {
        individual_limit: 3,
        individual_used: 0,
        individual_remaining: 3,
        services_breakdown: {
          emergencias: 0,
          medico_domicilio: 0
        },
        last_service: null,
        additional_services_needed: false
      },
      billing_info: {
        cost_per_additional_service: 195,
        services_pending_payment: 0
      }
    }
  }
]

// Función helper para obtener usuario externo por username
export const getExternalUser = (username) => {
  return EXTERNAL_USERS.find((user) => user.username === username)
}

// Función helper para obtener usuarios por empresa cliente
export const getUsersByClientCompany = (clientId) => {
  return EXTERNAL_USERS.filter((user) => user.client_company.id === clientId)
}

// Función para validar si un usuario puede usar más servicios individuales
export const canUseIndividualService = (username) => {
  const user = getExternalUser(username)
  if (!user) return false

  if (user.plan.subtype === EXTERNO_SUBTYPES.CASO_1) return true // Sin límites

  return user.service_usage.current_period.individual_remaining > 0
}

// Función para validar si la empresa puede usar más servicios generales
export const canUseGeneralService = (username) => {
  const user = getExternalUser(username)
  if (!user) return false

  if (user.plan.subtype === EXTERNO_SUBTYPES.CASO_1) return true // Sin límites

  return user.client_company.general_services_remaining > 0
}

// Función para obtener usuarios por código de referencia (ej: BCR)
export const getUsersByReferralSource = (referralSource) => {
  return EXTERNAL_USERS.filter((user) => user.profile.referral_source === referralSource)
}
