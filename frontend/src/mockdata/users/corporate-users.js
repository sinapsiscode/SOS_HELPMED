// Usuarios corporativos - Área Protegida

import { PLAN_TYPES } from '../plans/plan-config.js'

export const CORPORATE_USERS = [
  {
    id: 'corp_001',
    username: 'empresa_abc',
    password: 'corp123',
    role: 'CORPORATIVO',
    plan: {
      type: PLAN_TYPES.CORPORATIVO,
      subtype: 'AREA_PROTEGIDA',
      name: 'Área Protegida - Empresa ABC',
      billing_cycle: 'annual', // 'monthly' o 'annual'
      contract_services: 50, // 50 servicios anuales
      start_date: '2024-01-01T00:00:00Z',
      renewal_date: '2025-01-01T00:00:00Z',
      endDate: '2025-01-15T00:00:00Z', // Vence en pocos días para probar la alerta
      contract_id: 'CORP-ABC-2024-001',
      contract_pdf: '/documents/contracts/CORP-ABC-2024-001.pdf' // URL simulada del PDF
    },
    company: {
      id: 'comp_abc_001',
      name: 'Empresa ABC Ltda.',
      rut: '96.123.456-7',
      industry: 'Construcción',
      address: 'Av. Industrial 1500, Callao',
      contact_person: {
        name: 'Carlos Ramírez',
        position: 'Gerente de RRHH',
        email: 'carlos.ramirez@empresaabc.cl',
        phone: '+51 2 2555 1000'
      },
      employees_count: 150,
      locations: [
        {
          id: 'loc_001',
          name: 'Oficina Central',
          address: 'Av. Industrial 1500, Callao',
          phone: '+51 2 2555 1000',
          employees: 50
        },
        {
          id: 'loc_002',
          name: 'Obra Norte',
          address: 'Carretera Central Km 15, Lima',
          phone: '+51 9 8888 1000',
          employees: 100
        }
      ]
    },
    profile: {
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@empresaabc.cl',
      phone: '+51 2 2555 1000',
      position: 'Administrador Corporativo',
      permissions: ['view_employees', 'request_emergency', 'view_reports', 'manage_locations']
    },
    service_usage: {
      current_period: {
        used_services: 50,
        remaining_services: 0, // Cambiar a 0 para probar la compra de servicios adicionales
        total_limit: 50,
        usage_percentage: 100,
        breakdown_by_location: {
          loc_001: 12, // Oficina Central
          loc_002: 23 // Obra Norte
        },
        breakdown_by_month: {
          enero: 8,
          febrero: 6,
          marzo: 4,
          abril: 7,
          mayo: 3,
          junio: 2,
          julio: 5
        }
      },
      reset_date: '2025-01-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 1075,
      payment_method: 'invoice',
      billing_contact: {
        name: 'Ana Torres',
        email: 'facturacion@empresaabc.cl',
        phone: '+51 2 2555 1001'
      },
      auto_renewal: true,
      additional_service_rate: 65 // Costo por servicio adicional
    },
    employees: [
      {
        id: 'emp_001',
        name: 'Juan Pérez',
        dni: '12.345.678-9',
        position: 'Supervisor',
        location: 'loc_001',
        phone: '+51 9 1111 2222',
        active: true
      },
      {
        id: 'emp_002',
        name: 'María González',
        dni: '98.765.432-1',
        position: 'Operaria',
        location: 'loc_002',
        phone: '+51 9 3333 4444',
        active: true
      },
      {
        id: 'emp_003',
        name: 'Pedro Silva',
        dni: '11.222.333-4',
        position: 'Técnico',
        location: 'loc_002',
        phone: '+51 9 5555 6666',
        active: true
      }
    ]
  },
  {
    id: 'corp_002',
    username: 'empresa_xyz',
    password: 'corp456',
    role: 'CORPORATIVO',
    plan: {
      type: PLAN_TYPES.CORPORATIVO,
      subtype: 'AREA_PROTEGIDA',
      name: 'Área Protegida - Centro Médico XYZ',
      billing_cycle: 'monthly', // Plan mensual
      contract_services: 10, // 10 servicios por mes
      start_date: '2024-06-01T00:00:00Z',
      renewal_date: '2025-06-01T00:00:00Z',
      contract_id: 'CORP-XYZ-2024-002'
    },
    company: {
      id: 'comp_xyz_001',
      name: 'Centro Médico XYZ',
      rut: '76.987.654-3',
      industry: 'Salud',
      address: 'Av. Arequipa 1800, Lince',
      contact_person: {
        name: 'Dra. Patricia Morales',
        position: 'Directora Médica',
        email: 'patricia.morales@centromedico.cl',
        phone: '+51 2 2777 2000'
      },
      employees_count: 80,
      locations: [
        {
          id: 'loc_003',
          name: 'Centro Principal',
          address: 'Av. Arequipa 1800, Lince',
          phone: '+51 2 2777 2000',
          employees: 60
        },
        {
          id: 'loc_004',
          name: 'Sucursal Las Condes',
          address: 'Av. Javier Prado 8000, San Isidro',
          phone: '+51 2 2777 3000',
          employees: 20
        }
      ]
    },
    profile: {
      name: 'Dra. Patricia Morales',
      email: 'patricia.morales@centromedico.cl',
      phone: '+51 2 2777 2000',
      position: 'Administrador Corporativo',
      permissions: [
        'view_employees',
        'request_emergency',
        'view_reports',
        'manage_locations',
        'billing_access'
      ]
    },
    service_usage: {
      current_period: {
        used_services: 8,
        remaining_services: 2,
        total_limit: 10,
        usage_percentage: 80,
        breakdown_by_location: {
          loc_003: 18, // Centro Principal
          loc_004: 7 // Sucursal Las Condes
        },
        breakdown_by_month: {
          junio: 3,
          julio: 4,
          agosto: 5,
          septiembre: 3,
          octubre: 4,
          noviembre: 3,
          diciembre: 3
        }
      },
      reset_date: '2025-02-01T00:00:00Z' // Reset mensual (1ro de febrero)
    },
    billing: {
      monthly_cost: 645, // Costo mensual para plan mensual
      payment_method: 'credit_card',
      billing_contact: {
        name: 'Roberto Kim',
        email: 'administracion@centromedico.cl',
        phone: '+51 2 2777 2001'
      },
      auto_renewal: true,
      additional_service_rate: 52
    },
    employees: [
      {
        id: 'emp_004',
        name: 'Dr. Eduardo Vargas',
        dni: '15.555.777-8',
        position: 'Cardiólogo',
        location: 'loc_003',
        phone: '+51 9 7777 8888',
        active: true
      },
      {
        id: 'emp_005',
        name: 'Enfermera Rosa Díaz',
        dni: '13.444.666-7',
        position: 'Enfermera',
        location: 'loc_003',
        phone: '+51 9 6666 7777',
        active: true
      },
      {
        id: 'emp_006',
        name: 'Técnico Luis Reyes',
        dni: '14.333.555-6',
        position: 'Técnico Radiología',
        location: 'loc_004',
        phone: '+51 9 5555 6666',
        active: true
      }
    ]
  },
  {
    id: 'corp_003',
    username: 'hotel_plaza',
    password: 'hotel789',
    role: 'CORPORATIVO',
    plan: {
      type: PLAN_TYPES.CORPORATIVO,
      subtype: 'AREA_PROTEGIDA',
      name: 'Área Protegida - Hotel Plaza',
      billing_cycle: 'annual', // Plan anual
      contract_services: 30, // 30 servicios anuales
      start_date: '2024-09-01T00:00:00Z',
      renewal_date: '2025-09-01T00:00:00Z',
      contract_id: 'CORP-PLZ-2024-003'
    },
    company: {
      id: 'comp_plz_001',
      name: 'Hotel Plaza Santiago',
      rut: '85.222.111-9',
      industry: 'Hotelería',
      address: 'Plaza de Armas 100, Lima Centro',
      contact_person: {
        name: 'Fernando Castillo',
        position: 'Gerente General',
        email: 'fernando.castillo@hotelplaza.cl',
        phone: '+51 2 2666 5000'
      },
      employees_count: 120,
      locations: [
        {
          id: 'loc_005',
          name: 'Hotel Principal',
          address: 'Plaza de Armas 100, Lima Centro',
          phone: '+51 2 2666 5000',
          employees: 120
        }
      ]
    },
    profile: {
      name: 'Fernando Castillo',
      email: 'fernando.castillo@hotelplaza.cl',
      phone: '+51 2 2666 5000',
      position: 'Administrador Corporativo',
      permissions: ['view_employees', 'request_emergency', 'view_reports']
    },
    service_usage: {
      current_period: {
        used_services: 8,
        remaining_services: 22,
        total_limit: 30,
        usage_percentage: 27,
        breakdown_by_location: {
          loc_005: 8 // Hotel Principal
        },
        breakdown_by_month: {
          septiembre: 2,
          octubre: 3,
          noviembre: 1,
          diciembre: 2
        }
      },
      reset_date: '2025-09-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 775,
      payment_method: 'bank_transfer',
      billing_contact: {
        name: 'Carla Núñez',
        email: 'finanzas@hotelplaza.cl',
        phone: '+51 2 2666 5001'
      },
      auto_renewal: false,
      additional_service_rate: 77
    },
    employees: [
      {
        id: 'emp_007',
        name: 'Sandra Herrera',
        dni: '17.111.222-3',
        position: 'Recepcionista',
        location: 'loc_005',
        phone: '+51 9 9999 1111',
        active: true
      },
      {
        id: 'emp_008',
        name: 'Mario Soto',
        dni: '19.888.999-0',
        position: 'Conserje',
        location: 'loc_005',
        phone: '+51 9 8888 9999',
        active: true
      }
    ]
  }
]

// Función helper para obtener empresa por username
export const getCorporateUser = (username) => {
  return CORPORATE_USERS.find((user) => user.username === username)
}

// Función helper para obtener empleados de una empresa
export const getCompanyEmployees = (companyId) => {
  const company = CORPORATE_USERS.find((user) => user.company.id === companyId)
  return company?.employees || []
}

// Función para validar si una empresa puede usar más servicios
export const canUseMoreServices = (username) => {
  const user = getCorporateUser(username)
  if (!user) return false

  return user.service_usage.current_period.remaining_services > 0
}
