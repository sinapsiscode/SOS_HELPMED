/**
 * Datos de configuración de planes y precios para desarrollo
 * ENFOQUE BALANCEADO: Mock data separado para cumplir reglas de refactorización
 *
 * Planes disponibles:
 * - Familiar: HELP, BASICO, VIP, DORADO
 * - Corporativo: EMPRESARIAL_BASICO, EMPRESARIAL_PREMIUM, EMPRESARIAL_ENTERPRISE
 * - Externo: PUBLICO_BASICO, PUBLICO_PREMIUM
 *
 * Estructura de datos:
 * - pricing: Precios por modalidad de pago
 * - limits: Límites de servicios por plan
 * - benefits: Beneficios incluidos
 * - features: Características técnicas
 * - target_market: Mercado objetivo
 *
 * @see {@link ADDITIONAL_PRICING} Configuración adicional de precios
 * @see {@link VALID_SERVICE_TYPES} Tipos de servicios válidos
 */

// ============================================
// CONFIGURACIÓN PRINCIPAL DE PLANES
// ============================================
export const INITIAL_PLANS_CONFIG = {
  familiar: {
    HELP: {
      id: 'FAM_HELP',
      name: 'Plan Help',
      description: 'Plan básico de emergencias médicas',
      active: true,
      pricing: {
        monthly: 65,
        quarterly: 170,
        annually: 650,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        URGENCIA: 'ILIMITADO',
        MEDICO_DOMICILIO: 0,
        TRASLADO_PROGRAMADO: 0,
        ZONA_PROTEGIDA: 0,
        ORIENTACION_TELEFONICA: 'ILIMITADO',
        EXAMENES_LABORATORIO: 0
      },
      benefits: {
        emergencias_ilimitadas: true,
        orientacion_telefonica: true,
        zona_protegida: false,
        seguro_accidentes: false,
        examenes_laboratorio: false
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 10,
        red_hospitales: 'básica',
        app_movil: true,
        seguimiento_gps: false
      },
      target_market: 'Familias con presupuesto limitado',
      created_at: '2024-01-01',
      updated_at: '2024-01-15'
    },
    BASICO: {
      id: 'FAM_BASICO',
      name: 'Plan Básico',
      description: 'Plan familiar con servicios esenciales',
      active: true,
      pricing: {
        monthly: 150,
        quarterly: 410,
        annually: 1500,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        URGENCIA: 3,
        MEDICO_DOMICILIO: 2,
        TRASLADO_PROGRAMADO: 1,
        ZONA_PROTEGIDA: 0,
        ORIENTACION_TELEFONICA: 'ILIMITADO',
        EXAMENES_LABORATORIO: 0
      },
      benefits: {
        emergencias_ilimitadas: true,
        orientacion_telefonica: true,
        zona_protegida: false,
        seguro_accidentes: false,
        examenes_laboratorio: false
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 8,
        red_hospitales: 'estándar',
        app_movil: true,
        seguimiento_gps: true
      },
      target_market: 'Familias clase media',
      created_at: '2024-01-01',
      updated_at: '2024-01-10'
    },
    VIP: {
      id: 'FAM_VIP',
      name: 'Plan VIP',
      description: 'Plan premium con beneficios adicionales',
      active: true,
      pricing: {
        monthly: 280,
        quarterly: 775,
        annually: 2800,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        URGENCIA: 6,
        MEDICO_DOMICILIO: 4,
        TRASLADO_PROGRAMADO: 3,
        ZONA_PROTEGIDA: 1,
        ORIENTACION_TELEFONICA: 'ILIMITADO',
        EXAMENES_LABORATORIO: 0
      },
      benefits: {
        emergencias_ilimitadas: true,
        orientacion_telefonica: true,
        zona_protegida: true,
        seguro_accidentes: true,
        examenes_laboratorio: false
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 6,
        red_hospitales: 'premium',
        app_movil: true,
        seguimiento_gps: true
      },
      target_market: 'Familias de ingresos altos',
      created_at: '2024-01-01',
      updated_at: '2024-01-12'
    },
    DORADO: {
      id: 'FAM_DORADO',
      name: 'Plan Dorado',
      description: 'Plan de lujo con todos los beneficios',
      active: true,
      pricing: {
        monthly: 410,
        quarterly: 1160,
        annually: 4100,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        URGENCIA: 10,
        MEDICO_DOMICILIO: 8,
        TRASLADO_PROGRAMADO: 6,
        ZONA_PROTEGIDA: 2,
        ORIENTACION_TELEFONICA: 'ILIMITADO',
        EXAMENES_LABORATORIO: 4
      },
      benefits: {
        emergencias_ilimitadas: true,
        orientacion_telefonica: true,
        zona_protegida: true,
        seguro_accidentes: true,
        examenes_laboratorio: true
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 5,
        red_hospitales: 'premium_plus',
        app_movil: true,
        seguimiento_gps: true
      },
      target_market: 'Familias premium',
      created_at: '2024-01-01',
      updated_at: '2024-01-08'
    }
  },
  corporativo: {
    EMPRESARIAL_BASICO: {
      id: 'CORP_BASIC',
      name: 'Plan Empresarial Básico',
      description: 'Plan corporativo para pequeñas empresas',
      active: true,
      pricing: {
        per_employee: 108,
        minimum_employees: 10,
        setup_fee: 645,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        services_per_employee: 12
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 8,
        dashboard_corporativo: true,
        reportes_mensual: true,
        soporte_dedicado: false
      },
      target_market: 'Empresas 10-50 empleados',
      created_at: '2024-01-01',
      updated_at: '2024-01-14'
    },
    EMPRESARIAL_PREMIUM: {
      id: 'CORP_PREMIUM',
      name: 'Plan Empresarial Premium',
      description: 'Plan corporativo para medianas empresas',
      active: true,
      pricing: {
        per_employee: 165,
        minimum_employees: 25,
        setup_fee: 1290,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        services_per_employee: 18
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 6,
        dashboard_corporativo: true,
        reportes_mensual: true,
        reportes_tiempo_real: true,
        soporte_dedicado: true
      },
      target_market: 'Empresas 25-100 empleados',
      created_at: '2024-01-01',
      updated_at: '2024-01-11'
    },
    EMPRESARIAL_ENTERPRISE: {
      id: 'CORP_ENTERPRISE',
      name: 'Plan Enterprise',
      description: 'Plan corporativo para grandes empresas',
      active: true,
      pricing: {
        per_employee: 232,
        minimum_employees: 100,
        setup_fee: 3225,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        services_per_employee: 24
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 4,
        dashboard_corporativo: true,
        reportes_mensual: true,
        reportes_tiempo_real: true,
        soporte_dedicado: true,
        integracion_api: true,
        account_manager: true
      },
      target_market: 'Empresas +100 empleados',
      created_at: '2024-01-01',
      updated_at: '2024-01-09'
    }
  },
  externo: {
    PUBLICO_BASICO: {
      id: 'EXT_PUBLIC_BASIC',
      name: 'Plan Público Básico',
      description: 'Servicios básicos para entidades públicas',
      active: true,
      pricing: {
        monthly: 8600,
        setup_fee: 5160,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        monthly_services: 150
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 12,
        reportes_gubernamental: true,
        dashboard_publico: true
      },
      target_market: 'Municipalidades menores',
      created_at: '2024-01-01',
      updated_at: '2024-01-13'
    },
    PUBLICO_PREMIUM: {
      id: 'EXT_PUBLIC_PREMIUM',
      name: 'Plan Público Premium',
      description: 'Servicios completos para grandes entidades públicas',
      active: true,
      pricing: {
        monthly: 17200,
        setup_fee: 10320,
        currency: 'PEN'
      },
      limits: {
        EMERGENCIA: 'ILIMITADO',
        monthly_services: 400
      },
      features: {
        cobertura_24_7: true,
        tiempo_respuesta_max: 8,
        reportes_gubernamental: true,
        dashboard_publico: true,
        integracion_sistemas: true,
        soporte_especializado: true
      },
      target_market: 'Gobiernos regionales y provinciales',
      created_at: '2024-01-01',
      updated_at: '2024-01-07'
    }
  }
}

// ============================================
// CONFIGURACIÓN DE PRECIOS ADICIONALES
// ============================================
export const INITIAL_ADDITIONAL_PRICING = {
  service_fees: {
    URGENCIA_ADICIONAL: {
      name: 'Urgencia Adicional',
      description: 'Costo por urgencia que excede el límite del plan',
      pricing: {
        familiar: { amount: 180, currency: 'PEN' },
        corporativo: { amount: 215, currency: 'PEN' },
        externo: { amount: 295, currency: 'PEN' }
      }
    },
    MEDICO_DOMICILIO_ADICIONAL: {
      name: 'Médico a Domicilio Adicional',
      description: 'Costo por consulta médica domiciliaria adicional',
      pricing: {
        familiar: { amount: 320, currency: 'PEN' },
        corporativo: { amount: 385, currency: 'PEN' },
        externo: { amount: 450, currency: 'PEN' }
      }
    },
    TRASLADO_PROGRAMADO_ADICIONAL: {
      name: 'Traslado Programado Adicional',
      description: 'Costo por traslado programado que excede límite',
      pricing: {
        familiar: { amount: 215, currency: 'PEN' },
        corporativo: { amount: 260, currency: 'PEN' },
        externo: { amount: 315, currency: 'PEN' }
      }
    },
    ZONA_PROTEGIDA_ADICIONAL: {
      name: 'Cobertura Zona Protegida Adicional',
      description: 'Extensión mensual de cobertura en zona protegida',
      pricing: {
        familiar: { amount: 545, currency: 'PEN' },
        corporativo: { amount: 650, currency: 'PEN' },
        externo: { amount: 775, currency: 'PEN' }
      }
    }
  },
  upgrade_fees: {
    PLAN_UPGRADE: {
      name: 'Actualización de Plan',
      description: 'Costo por cambio a plan superior',
      pricing: {
        familiar: { amount: 125, currency: 'PEN' },
        corporativo: { amount: 215, currency: 'PEN' },
        externo: { amount: 430, currency: 'PEN' }
      }
    }
  },
  setup_fees: {
    ACTIVACION_INMEDIATA: {
      name: 'Activación Inmediata',
      description: 'Activación del servicio en menos de 24 horas',
      pricing: {
        familiar: { amount: 85, currency: 'PEN' },
        corporativo: { amount: 215, currency: 'PEN' },
        externo: { amount: 430, currency: 'PEN' }
      }
    }
  }
}

// ============================================
// TIPOS DE SERVICIOS VÁLIDOS
// ============================================
export const VALID_SERVICE_TYPES = [
  'EMERGENCIA',
  'URGENCIA',
  'MEDICO_DOMICILIO',
  'TRASLADO_PROGRAMADO',
  'ZONA_PROTEGIDA',
  'ORIENTACION_TELEFONICA',
  'EXAMENES_LABORATORIO'
]

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================
export const PLAN_VALIDATION = {
  name: {
    minLength: 3,
    maxLength: 50,
    required: true
  },
  description: {
    minLength: 10,
    maxLength: 200,
    required: true
  },
  pricing: {
    monthly: { min: 50, max: 10000 },
    quarterly: { min: 150, max: 30000 },
    annually: { min: 500, max: 100000 },
    per_employee: { min: 50, max: 500 },
    setup_fee: { min: 100, max: 10000 }
  }
}

// ============================================
// ESTADÍSTICAS SIMULADAS DEL SISTEMA
// ============================================
export const MOCK_PLAN_STATS = {
  total_plans: 9,
  active_plans: 9,
  inactive_plans: 0,
  total_subscribers: {
    familiar: 1250,
    corporativo: 85,
    externo: 12
  },
  revenue_monthly: {
    familiar: 287500,
    corporativo: 156800,
    externo: 307200,
    total: 751500
  },
  most_popular: {
    familiar: 'BASICO',
    corporativo: 'EMPRESARIAL_PREMIUM',
    externo: 'PUBLICO_BASICO'
  }
}
