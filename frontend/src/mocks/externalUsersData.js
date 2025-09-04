/**
 * Datos mock para gestión de usuarios de entidades externas
 * REGLA #11: Separación de mock data para desarrollo
 *
 * Estructura jerárquica: Entidades -> Administradores -> Usuarios
 * Los usuarios externos se registran desde el aplicativo móvil
 */

export const MOCK_EXTERNAL_STRUCTURE = [
  {
    entity: 'Banco Central de Reserva',
    entityCode: 'BCR',
    type: 'banco',
    admin: {
      id: 'ext_admin_bcr',
      username: 'bcr_admin',
      name: 'Carlos Mendoza',
      email: 'admin@bcr.gob.pe',
      phone: '999-888-777',
      status: 'active',
      createdAt: '2024-01-15'
    },
    users: [
      {
        id: 'ext_user_bcr_1',
        username: 'bcr_001',
        name: 'Ana García',
        email: 'agarcia@bcr.gob.pe',
        employeeCode: 'BCR-2024-001',
        status: 'active',
        lastAccess: '2024-12-10',
        servicesUsed: 12
      },
      {
        id: 'ext_user_bcr_2',
        username: 'bcr_002',
        name: 'Luis Pérez',
        email: 'lperez@bcr.gob.pe',
        employeeCode: 'BCR-2024-002',
        status: 'active',
        lastAccess: '2024-12-09',
        servicesUsed: 8
      },
      {
        id: 'ext_user_bcr_3',
        username: 'bcr_003',
        name: 'María Torres',
        email: 'mtorres@bcr.gob.pe',
        employeeCode: 'BCR-2024-003',
        status: 'inactive',
        lastAccess: '2024-11-20',
        servicesUsed: 5
      }
    ],
    stats: {
      totalUsers: 45,
      activeUsers: 42,
      monthlyServices: 156,
      totalServices: 1234
    }
  },
  {
    entity: 'Rimac Seguros',
    entityCode: 'RIMAC',
    type: 'aseguradora',
    admin: {
      id: 'ext_admin_rimac',
      username: 'rimac_admin',
      name: 'Patricia Vega',
      email: 'pvega@rimac.com.pe',
      phone: '999-777-666',
      status: 'active',
      createdAt: '2024-02-20'
    },
    users: [
      {
        id: 'ext_user_rimac_1',
        username: 'rimac_001',
        name: 'Roberto Silva',
        email: 'rsilva@rimac.com.pe',
        employeeCode: 'RIM-2024-001',
        status: 'active',
        lastAccess: '2024-12-10',
        servicesUsed: 15
      },
      {
        id: 'ext_user_rimac_2',
        username: 'rimac_002',
        name: 'Carmen López',
        email: 'clopez@rimac.com.pe',
        employeeCode: 'RIM-2024-002',
        status: 'active',
        lastAccess: '2024-12-08',
        servicesUsed: 10
      }
    ],
    stats: {
      totalUsers: 23,
      activeUsers: 20,
      monthlyServices: 89,
      totalServices: 567
    }
  },
  {
    entity: 'Banco de Crédito del Perú',
    entityCode: 'BCP',
    type: 'banco',
    admin: {
      id: 'ext_admin_bcp',
      username: 'bcp_admin',
      name: 'Jorge Ramírez',
      email: 'admin@viabcp.com',
      phone: '999-666-555',
      status: 'active',
      createdAt: '2024-03-10'
    },
    users: [
      {
        id: 'ext_user_bcp_1',
        username: 'bcp_001',
        name: 'Sandra Morales',
        email: 'smorales@viabcp.com',
        employeeCode: 'BCP-2024-001',
        status: 'active',
        lastAccess: '2024-12-09',
        servicesUsed: 20
      },
      {
        id: 'ext_user_bcp_2',
        username: 'bcp_002',
        name: 'Miguel Castillo',
        email: 'mcastillo@viabcp.com',
        employeeCode: 'BCP-2024-002',
        status: 'active',
        lastAccess: '2024-12-08',
        servicesUsed: 18
      },
      {
        id: 'ext_user_bcp_3',
        username: 'bcp_003',
        name: 'Elena Vargas',
        email: 'evargas@viabcp.com',
        employeeCode: 'BCP-2024-003',
        status: 'inactive',
        lastAccess: '2024-11-15',
        servicesUsed: 3
      }
    ],
    stats: {
      totalUsers: 67,
      activeUsers: 61,
      monthlyServices: 234,
      totalServices: 1876
    }
  },
  {
    entity: 'Pacífico Seguros',
    entityCode: 'PACIFICO',
    type: 'aseguradora',
    admin: {
      id: 'ext_admin_pacifico',
      username: 'pacifico_admin',
      name: 'Rosa Jiménez',
      email: 'admin@pacifico.com.pe',
      phone: '999-555-444',
      status: 'active',
      createdAt: '2024-02-28'
    },
    users: [
      {
        id: 'ext_user_pacifico_1',
        username: 'pacifico_001',
        name: 'Carlos Mendez',
        email: 'cmendez@pacifico.com.pe',
        employeeCode: 'PAC-2024-001',
        status: 'active',
        lastAccess: '2024-12-10',
        servicesUsed: 7
      }
    ],
    stats: {
      totalUsers: 34,
      activeUsers: 31,
      monthlyServices: 98,
      totalServices: 456
    }
  }
]

/**
 * Tipos de entidades con configuración de estilo
 */
export const ENTITY_TYPES = [
  { value: 'empresa', label: 'Empresa', icon: 'fas fa-building', color: 'purple' },
  { value: 'banco', label: 'Banco', icon: 'fas fa-university', color: 'blue' },
  { value: 'aseguradora', label: 'Aseguradora', icon: 'fas fa-shield-alt', color: 'green' },
  { value: 'gobierno', label: 'Entidad Gubernamental', icon: 'fas fa-landmark', color: 'red' },
  {
    value: 'educacion',
    label: 'Institución Educativa',
    icon: 'fas fa-graduation-cap',
    color: 'indigo'
  },
  { value: 'otro', label: 'Otro', icon: 'fas fa-handshake', color: 'gray' }
]

/**
 * Estados de formulario inicial para nueva entidad con administrador
 */
export const INITIAL_ENTITY_ADMIN_FORM = {
  // Datos de la entidad
  entityName: '',
  entityCode: '',
  entityType: 'empresa',
  // Datos del administrador
  adminUsername: '',
  adminPassword: '',
  adminName: '',
  adminEmail: '',
  adminPhone: ''
}

/**
 * Modos de vista disponibles
 */
export const VIEW_MODES = {
  HIERARCHICAL: 'hierarchical',
  LIST: 'list'
}
