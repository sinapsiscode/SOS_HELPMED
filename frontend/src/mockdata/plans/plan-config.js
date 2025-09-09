// Configuración de todos los planes disponibles en el sistema

export const PLAN_TYPES = {
  FAMILIAR: 'FAMILIAR',
  CORPORATIVO: 'CORPORATIVO',
  EXTERNO: 'EXTERNO'
}

export const FAMILIAR_SUBTYPES = {
  HELP: 'HELP',
  BASICO: 'BASICO',
  VIP: 'VIP',
  DORADO: 'DORADO'
}

export const EXTERNO_SUBTYPES = {
  CASO_1: 'CASO_1', // Sin límites, facturación directa
  CASO_2: 'CASO_2' // Con límites individuales y generales
}

export const SERVICE_TYPES = {
  EMERGENCIA: 'EMERGENCIA',
  URGENCIA: 'URGENCIA',
  MEDICO_DOMICILIO: 'MEDICO_DOMICILIO',
  TRASLADO_PROGRAMADO: 'TRASLADO_PROGRAMADO',
  ZONA_PROTEGIDA: 'ZONA_PROTEGIDA',
  ORIENTACION_TELEFONICA: 'ORIENTACION_TELEFONICA',
  EXAMENES_LABORATORIO: 'EXAMENES_LABORATORIO'
}

export const PLAN_CONFIGURATIONS = {
  FAMILIAR: {
    HELP: {
      name: 'Plan Help',
      description: 'Plan con límite de servicios de emergencia, urgencia o médico a domicilio',
      variants: [
        { services: 8, name: 'Help 8' },
        { services: 12, name: 'Help 12' },
        { services: 16, name: 'Help 16' }
      ],
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'FLEXIBLE', // Se cuenta del límite total
        [SERVICE_TYPES.URGENCIA]: 'FLEXIBLE', // Se cuenta del límite total
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 'FLEXIBLE', // Se cuenta del límite total
        [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO'
      },
      benefits: {
        emergencias_ilimitadas: {
          active: false,
          title: 'Emergencias Ilimitadas',
          description: 'Atención de emergencias médicas sin límite de servicios',
          icon: 'fas fa-ambulance'
        },
        orientacion_telefonica: {
          active: true,
          title: 'Orientación Médica Telefónica',
          description: 'Consultas telefónicas 24/7 con profesionales médicos',
          icon: 'fas fa-phone-alt'
        },
        zona_protegida: {
          active: false,
          title: 'Zona Protegida',
          description: 'Emergencia/urgencia médica para terceros en tu dirección registrada',
          icon: 'fas fa-shield-alt'
        },
        seguro_accidentes: {
          active: false,
          title: 'Seguro contra Accidentes',
          description: 'Cobertura contra accidentes personales 24/7',
          icon: 'fas fa-shield-alt',
          details: {
            provider: 'Chubb',
            maxAge: 79,
            coverage: ['Accidentes personales 24/7'],
            validity: '24/7 - 365 días'
          }
        },
        examenes_laboratorio: {
          active: false,
          title: 'Exámenes de Laboratorio',
          description: 'Análisis clínicos básicos incluidos en el plan',
          icon: 'fas fa-flask'
        }
      },
      color: 'blue'
    },
    BASICO: {
      name: 'Plan Básico',
      description: 'Plan con servicios específicos por tipo',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO',
        [SERVICE_TYPES.URGENCIA]: 3,
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 4,
        [SERVICE_TYPES.TRASLADO_PROGRAMADO]: 1,
        [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO'
      },
      benefits: {
        emergencias_ilimitadas: {
          active: true,
          title: 'Emergencias Ilimitadas',
          description: 'Atención de emergencias médicas sin límite de servicios',
          icon: 'fas fa-ambulance'
        },
        orientacion_telefonica: {
          active: true,
          title: 'Orientación Médica Telefónica',
          description: 'Consultas telefónicas 24/7 con profesionales médicos',
          icon: 'fas fa-phone-alt'
        },
        zona_protegida: {
          active: false,
          title: 'Zona Protegida',
          description: 'Emergencia/urgencia médica para terceros en tu dirección registrada',
          icon: 'fas fa-shield-alt'
        },
        seguro_accidentes: {
          active: false,
          title: 'Seguro contra Accidentes',
          description: 'Cobertura contra accidentes personales 24/7',
          icon: 'fas fa-shield-alt',
          details: {
            provider: 'Chubb',
            maxAge: 79,
            coverage: ['Accidentes personales 24/7'],
            validity: '24/7 - 365 días'
          }
        },
        examenes_laboratorio: {
          active: false,
          title: 'Exámenes de Laboratorio',
          description: 'Análisis clínicos básicos incluidos en el plan',
          icon: 'fas fa-flask'
        }
      },
      color: 'green'
    },
    VIP: {
      name: 'Plan VIP',
      description: 'Plan con servicios ampliados y beneficios adicionales',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO',
        [SERVICE_TYPES.URGENCIA]: 6,
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 6,
        [SERVICE_TYPES.TRASLADO_PROGRAMADO]: 1,
        [SERVICE_TYPES.ZONA_PROTEGIDA]: 1,
        [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO'
      },
      benefits: {
        emergencias_ilimitadas: {
          active: true,
          title: 'Emergencias Ilimitadas',
          description: 'Atención de emergencias médicas sin límite de servicios',
          icon: 'fas fa-ambulance'
        },
        orientacion_telefonica: {
          active: true,
          title: 'Orientación Médica Telefónica',
          description: 'Consultas telefónicas 24/7 con profesionales médicos',
          icon: 'fas fa-phone-alt'
        },
        zona_protegida: {
          active: true,
          title: 'Zona Protegida',
          description: 'Emergencia/urgencia médica para terceros en tu dirección registrada',
          icon: 'fas fa-shield-alt'
        },
        seguro_accidentes: {
          active: true,
          title: 'Seguro contra Accidentes',
          description: 'Cobertura contra accidentes personales 24/7',
          icon: 'fas fa-shield-alt',
          details: {
            provider: 'Chubb',
            maxAge: 79,
            coverage: ['Accidentes personales 24/7'],
            validity: '24/7 - 365 días'
          }
        },
        examenes_laboratorio: {
          active: false,
          title: 'Exámenes de Laboratorio',
          description: 'Análisis clínicos básicos incluidos en el plan',
          icon: 'fas fa-flask'
        }
      },
      color: 'purple'
    },
    DORADO: {
      name: 'Plan Dorado',
      description: 'Plan premium con todos los beneficios incluidos',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO',
        [SERVICE_TYPES.URGENCIA]: 10,
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 10,
        [SERVICE_TYPES.TRASLADO_PROGRAMADO]: 1,
        [SERVICE_TYPES.ZONA_PROTEGIDA]: 2,
        [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO',
        [SERVICE_TYPES.EXAMENES_LABORATORIO]: 'ILIMITADO'
      },
      benefits: {
        emergencias_ilimitadas: {
          active: true,
          title: 'Emergencias Ilimitadas',
          description: 'Atención de emergencias médicas sin límite de servicios',
          icon: 'fas fa-ambulance'
        },
        orientacion_telefonica: {
          active: true,
          title: 'Orientación Médica Telefónica',
          description: 'Consultas telefónicas 24/7 con profesionales médicos',
          icon: 'fas fa-phone-alt'
        },
        zona_protegida: {
          active: true,
          title: 'Zona Protegida',
          description: 'Emergencia/urgencia médica para terceros en tu dirección registrada',
          icon: 'fas fa-shield-alt'
        },
        seguro_accidentes: {
          active: true,
          title: 'Seguro contra Accidentes',
          description: 'Cobertura contra accidentes personales 24/7',
          icon: 'fas fa-shield-alt',
          details: {
            provider: 'Chubb',
            maxAge: 79,
            coverage: ['Accidentes personales 24/7'],
            validity: '24/7 - 365 días'
          }
        },
        examenes_laboratorio: {
          active: true,
          title: 'Exámenes de Laboratorio',
          description: 'Análisis clínicos básicos incluidos en el plan',
          icon: 'fas fa-flask',
          details: {
            tests: ['Examen de orina', 'Examen de heces', 'Hemograma completo'],
            network: 'Disponible en laboratorios de la red Help MED'
          }
        }
      },
      color: 'yellow'
    }
  },
  CORPORATIVO: {
    AREA_PROTEGIDA: {
      name: 'Área Protegida',
      description: 'Convenio corporativo para atención de emergencias',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'VARIABLE' // Depende del contrato
      },
      benefits: {
        solo_emergencias: true,
        multiple_users: true,
        corporate_billing: true
      },
      color: 'red'
    }
  },
  EXTERNO: {
    CASO_1: {
      name: 'Afiliados Externos - Caso 1',
      description: 'Sin límite de servicios, facturación directa al cliente',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO',
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 'ILIMITADO'
      },
      benefits: {
        facturacion_directa: true,
        sin_limites: true
      },
      color: 'indigo'
    },
    CASO_2: {
      name: 'Afiliados Externos - Caso 2',
      description: 'Límite de 3 servicios por afiliado, 430 servicios generales',
      limits: {
        [SERVICE_TYPES.EMERGENCIA]: 3, // Por afiliado
        [SERVICE_TYPES.MEDICO_DOMICILIO]: 3, // Por afiliado
        general_limit: 430 // Límite general de la empresa
      },
      benefits: {
        limite_individual: true,
        limite_general: true,
        pago_adicional: true,
        aprox_clients: 500
      },
      color: 'teal'
    }
  }
}

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  FAMILIAR: 'FAMILIAR',
  CORPORATIVO: 'CORPORATIVO',
  EXTERNO: 'EXTERNO'
}

// Precios de servicios adicionales (mockdata)
export const ADDITIONAL_PRICES = {
  [SERVICE_TYPES.URGENCIA]: 365,
  [SERVICE_TYPES.MEDICO_DOMICILIO]: 410,
  [SERVICE_TYPES.TRASLADO_PROGRAMADO]: 515,
  [SERVICE_TYPES.ZONA_PROTEGIDA]: 645
}

// Helper functions
export const getPlanConfig = (planType, subType) => {
  return PLAN_CONFIGURATIONS[planType]?.[subType] || null
}

export const isServiceUnlimited = (planType, subType, serviceType) => {
  const config = getPlanConfig(planType, subType)
  return config?.limits[serviceType] === 'ILIMITADO'
}

export const getServiceLimit = (planType, subType, serviceType) => {
  const config = getPlanConfig(planType, subType)
  return config?.limits[serviceType] || 0
}
