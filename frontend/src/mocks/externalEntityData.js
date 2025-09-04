/**
 * Datos mock para gestión de entidades externas
 * REGLA #11: Separación de mock data para desarrollo
 *
 * Entidades externas incluyen bancos, aseguradoras y empresas
 * que pueden tener afiliados en el sistema HelpMED
 */

export const MOCK_EXTERNAL_ENTITIES = [
  {
    id: 'ent_bcr',
    name: 'Banco Central de Reserva',
    code: 'BCR',
    type: 'banco',
    description: 'Banco Central de Reserva del Perú',
    activeUsers: 45,
    maxUsers: 100,
    admin: {
      username: 'bcr_admin',
      name: 'Admin BCR',
      email: 'admin@bcr.gob.pe',
      phone: '01-613-2000'
    },
    contactName: 'María González',
    contactEmail: 'contacto@bcr.gob.pe',
    contactPhone: '01-613-2001',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: 'ent_rimac',
    name: 'Rimac Seguros',
    code: 'RIMAC',
    type: 'aseguradora',
    description: 'Compañía de seguros',
    activeUsers: 23,
    maxUsers: 50,
    admin: {
      username: 'rimac_admin',
      name: 'Admin Rimac',
      email: 'admin@rimac.com.pe',
      phone: '01-411-1111'
    },
    contactName: 'Carlos Mendoza',
    contactEmail: 'contacto@rimac.com.pe',
    contactPhone: '01-411-1100',
    active: true,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-18T16:45:00Z'
  },
  {
    id: 'ent_bcp',
    name: 'Banco de Crédito del Perú',
    code: 'BCP',
    type: 'banco',
    description: 'Banco comercial',
    activeUsers: 67,
    maxUsers: 150,
    admin: null,
    contactName: 'Ana Torres',
    contactEmail: 'contacto@viabcp.com',
    contactPhone: '01-311-9898',
    active: false,
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-03-15T13:20:00Z'
  },
  {
    id: 'ent_interbank',
    name: 'Interbank',
    code: 'IBK',
    type: 'banco',
    description: 'Banco comercial peruano',
    activeUsers: 89,
    maxUsers: 200,
    admin: {
      username: 'interbank_admin',
      name: 'Admin Interbank',
      email: 'admin@interbank.pe',
      phone: '01-311-9000'
    },
    contactName: 'Luis Vargas',
    contactEmail: 'contacto@interbank.pe',
    contactPhone: '01-311-9001',
    active: true,
    createdAt: '2024-02-05T08:00:00Z',
    updatedAt: '2024-03-22T10:15:00Z'
  },
  {
    id: 'ent_pacifico',
    name: 'Pacífico Seguros',
    code: 'PACIFICO',
    type: 'aseguradora',
    description: 'Compañía de seguros del Grupo Romero',
    activeUsers: 34,
    maxUsers: 80,
    admin: null,
    contactName: 'Rosa Jiménez',
    contactEmail: 'contacto@pacifico.com.pe',
    contactPhone: '01-513-5000',
    active: true,
    createdAt: '2024-02-28T14:20:00Z',
    updatedAt: '2024-03-25T09:30:00Z'
  },
  {
    id: 'ent_backus',
    name: 'Unión de Cervecerías Backus',
    code: 'BACKUS',
    type: 'empresa',
    description: 'Empresa cervecera peruana',
    activeUsers: 156,
    maxUsers: 300,
    admin: {
      username: 'backus_admin',
      name: 'Admin Backus',
      email: 'admin@backus.pe',
      phone: '01-311-3000'
    },
    contactName: 'Pedro Ramírez',
    contactEmail: 'rrhh@backus.pe',
    contactPhone: '01-311-3001',
    active: true,
    createdAt: '2024-01-10T12:45:00Z',
    updatedAt: '2024-03-19T11:00:00Z'
  }
]

/**
 * Tipos de entidades disponibles
 */
export const ENTITY_TYPES = [
  { value: 'empresa', label: 'Empresa', icon: 'fas fa-building', color: 'purple' },
  { value: 'banco', label: 'Banco', icon: 'fas fa-university', color: 'blue' },
  { value: 'aseguradora', label: 'Aseguradora', icon: 'fas fa-shield-alt', color: 'green' },
  { value: 'otro', label: 'Otro', icon: 'fas fa-handshake', color: 'gray' }
]

/**
 * Estados de formulario inicial
 */
export const INITIAL_ENTITY_FORM = {
  name: '',
  code: '',
  type: 'empresa',
  description: '',
  maxUsers: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  active: true
}

export const INITIAL_ADMIN_FORM = {
  username: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  entityId: ''
}
