// Usuarios administradores del sistema

export const ADMIN_USERS = [
  {
    id: 'admin_001',
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
    profile: {
      name: 'Carlos Mendoza',
      email: 'admin@helpmed.com',
      phone: '+51 9 8765 4321',
      position: 'Administrador General',
      avatar: null,
      permissions: [
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
        'plans.manage',
        'services.manage',
        'billing.manage',
        'reports.view',
        'system.configure'
      ],
      last_login: '2024-12-20T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z'
    },
    preferences: {
      dashboard_layout: 'full',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      theme: 'light',
      language: 'es'
    }
  },
  {
    id: 'admin_002',
    username: 'supervisor',
    password: 'super123',
    role: 'ADMIN',
    profile: {
      name: 'María González',
      email: 'supervisor@helpmed.com',
      phone: '+51 9 1234 5678',
      position: 'Supervisor de Operaciones',
      avatar: null,
      permissions: ['users.read', 'users.update', 'services.manage', 'reports.view'],
      last_login: '2024-12-19T15:45:00Z',
      created_at: '2024-02-15T00:00:00Z'
    },
    preferences: {
      dashboard_layout: 'compact',
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      theme: 'light',
      language: 'es'
    }
  }
]

// Configuración de permisos del sistema
export const ADMIN_PERMISSIONS = {
  'users.create': 'Crear usuarios',
  'users.read': 'Ver usuarios',
  'users.update': 'Editar usuarios',
  'users.delete': 'Eliminar usuarios',
  'plans.manage': 'Gestionar planes',
  'services.manage': 'Gestionar servicios',
  'billing.manage': 'Gestionar facturación',
  'reports.view': 'Ver reportes',
  'system.configure': 'Configurar sistema'
}

// Métricas del sistema para el dashboard admin
export const SYSTEM_METRICS = {
  total_users: 1250,
  active_emergencies: 8,
  monthly_services: 456,
  revenue_month: 537500, // En soles peruanos
  user_distribution: {
    familiar: 850,
    corporativo: 25,
    externo: 375
  },
  plan_distribution: {
    help: 320,
    basico: 280,
    vip: 180,
    dorado: 70,
    area_protegida: 25,
    externo_caso1: 200,
    externo_caso2: 175
  },
  service_usage: {
    emergencias: 145,
    urgencias: 89,
    medico_domicilio: 156,
    traslados: 34,
    zona_protegida: 12,
    orientacion: 234,
    laboratorio: 45
  },
  monthly_trends: [
    { month: 'Jul', services: 398 },
    { month: 'Ago', services: 432 },
    { month: 'Sep', services: 389 },
    { month: 'Oct', services: 445 },
    { month: 'Nov', services: 423 },
    { month: 'Dic', services: 456 }
  ]
}

// Alertas del sistema
export const SYSTEM_ALERTS = [
  {
    id: 'alert_001',
    type: 'warning',
    title: 'Empresa ABC cerca del límite',
    message: 'La empresa ABC ha usado 425 de sus 430 servicios contratados',
    timestamp: '2024-12-20T09:15:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 'alert_002',
    type: 'info',
    title: 'Nuevo usuario VIP registrado',
    message: 'Se registró un nuevo usuario en el Plan VIP - Juan Pérez',
    timestamp: '2024-12-20T08:30:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: 'alert_003',
    type: 'success',
    title: 'Facturación mensual completada',
    message: 'Se completó la facturación de diciembre para todos los clientes',
    timestamp: '2024-12-19T23:59:00Z',
    read: true,
    priority: 'low'
  }
]
