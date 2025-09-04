// Usuarios administradores externos (ej: BCR para ver métricas de sus empleados)

import { PLAN_TYPES } from '../plans/plan-config.js'

export const EXTERNAL_ADMIN_USERS = [
  {
    id: 'ext_admin_001',
    username: 'bcr_admin',
    password: 'bcr123',
    role: 'EXTERNO_ADMIN',
    organization: {
      id: 'org_bcr_001',
      name: 'Banco Central de Reserva del Perú - Fondo de Empleados',
      short_name: 'BCR',
      type: 'FONDO_EMPLEADOS',
      rut: '20100047218',
      address: 'Jr. Miroquesada 441, Lima, Perú',
      contact: {
        name: 'María Fernández',
        position: 'Gerente de Bienestar',
        email: 'mfernandez@bcrp.gob.pe',
        phone: '+51 1 613-2000'
      },
      contract_start: '2024-01-01T00:00:00Z',
      referral_code: 'BCR_FONDO_EMPLEADOS'
    },
    profile: {
      name: 'Administrador BCR',
      email: 'admin.fondoempleados@bancobcr.com',
      phone: '+506 2287-9100',
      position: 'Administrador de Beneficios'
    },
    permissions: [
      'view_employee_metrics',
      'export_reports',
      'view_service_history',
      'view_consolidated_billing'
    ],
    metrics_access: {
      can_view_patient_names: true,
      can_view_service_details: true,
      can_export_data: true,
      data_retention_days: 365
    }
  },
  {
    id: 'ext_admin_002',
    username: 'coopeservidores_admin',
    password: 'coope123',
    role: 'EXTERNO_ADMIN',
    organization: {
      id: 'org_coope_001',
      name: 'Coopeservidores - Programa de Salud',
      short_name: 'COOPESERVIDORES',
      type: 'COOPERATIVA',
      rut: '20136424867',
      address: 'Av. Javier Prado Este 2875, San Borja, Lima',
      contact: {
        name: 'Carlos Rodríguez',
        position: 'Coordinador de Beneficios',
        email: 'crodriguez@coopeservidores.com.pe',
        phone: '+51 1 225-1200'
      },
      contract_start: '2024-03-01T00:00:00Z',
      referral_code: 'COOPESERVIDORES_SALUD'
    },
    profile: {
      name: 'Administrador Coopeservidores',
      email: 'beneficios@coopeservidores.fi.cr',
      phone: '+506 2243-9501',
      position: 'Administrador de Programa de Salud'
    },
    permissions: [
      'view_employee_metrics',
      'export_reports',
      'view_service_history',
      'view_consolidated_billing'
    ],
    metrics_access: {
      can_view_patient_names: true,
      can_view_service_details: true,
      can_export_data: true,
      data_retention_days: 365
    }
  }
]

// Función helper para obtener admin por username
export const getExternalAdminUser = (username) => {
  return EXTERNAL_ADMIN_USERS.find((user) => user.username === username)
}

// Función helper para obtener admin por código de referencia
export const getAdminByReferralCode = (referralCode) => {
  return EXTERNAL_ADMIN_USERS.find((user) => user.organization.referral_code === referralCode)
}

// Función para validar si un código de referencia es válido
export const isValidReferralCode = (code) => {
  return EXTERNAL_ADMIN_USERS.some((user) => user.organization.referral_code === code)
}
