// Textos y etiquetas centralizados
export const LABELS = {
  // Generales
  app: {
    name: 'HelpMED',
    tagline: 'Tu salud en buenas manos',
    copyright: '© 2024 HelpMED. Todos los derechos reservados.'
  },
  
  // Botones comunes
  buttons: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    reject: 'Rechazar',
    accept: 'Aceptar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    download: 'Descargar',
    upload: 'Subir',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse'
  },
  
  // Mensajes comunes
  messages: {
    loading: 'Cargando...',
    saving: 'Guardando...',
    deleting: 'Eliminando...',
    success: 'Operación exitosa',
    error: 'Ha ocurrido un error',
    noData: 'No hay datos disponibles',
    confirmDelete: '¿Está seguro de eliminar este registro?',
    requiredFields: 'Por favor complete todos los campos requeridos',
    invalidEmail: 'Email inválido',
    invalidPhone: 'Teléfono inválido',
    sessionExpired: 'Su sesión ha expirado'
  },
  
  // Panel Ambulancia
  ambulance: {
    title: 'Panel Ambulancia',
    header: {
      driver: 'Conductor',
      unit: 'Unidad',
      status: 'Estado'
    },
    emergency: {
      title: 'EMERGENCIA ASIGNADA',
      obligatory: 'OBLIGATORIA',
      automatic: 'Asignación automática',
      patient: 'Información del Paciente',
      symptoms: 'Síntomas Reportados',
      location: 'Ubicación',
      eta: 'ETA',
      distance: 'Distancia',
      viewHistory: 'Ver Historial',
      noHistory: 'No hay registros previos disponibles'
    },
    status: {
      available: 'Disponible',
      busy: 'Ocupado',
      offline: 'Fuera de línea',
      maintenance: 'En mantenimiento'
    },
    actions: {
      startRoute: 'Iniciar Ruta',
      arrived: 'He Llegado',
      complete: 'Completar',
      cancel: 'Cancelar'
    }
  },
  
  // Panel Admin
  admin: {
    title: 'Panel de Administración',
    adminDashboard: {
      comments: {
        title: 'Dashboard principal de administrador con TODOS los módulos'
      },
      errors: {
        loadingError: 'Error al cargar dashboard: {error}',
        authenticationError: 'Error de Autenticación',
        userNotFound: 'Usuario no encontrado',
        configurationError: 'Error de Configuración',
        tabsLoadError: 'No se pudieron cargar los tabs',
        accessDenied: 'Acceso Denegado',
        noAdminPermissions: 'No tienes permisos de administrador'
      }
    },
    affiliateManagement: {
      comments: {
        title: 'Componente principal para gestión de afiliados',
        refactored: 'REFACTORIZADO siguiendo TODAS las reglas:',
        rules: {
          rule1: '✅ Regla #1: <200 líneas',
          rule3: '✅ Regla #3: Props con PropTypes',
          rule5: '✅ Regla #5: Usa logger en lugar de console.log',
          rule8: '✅ Regla #8: Manejo robusto de errores',
          rule12: '✅ Regla #12: Hooks llamados correctamente (no condicionalmente)'
        },
        errorModalTitle: 'Componente de modal de error reutilizable',
        errorModalRule: '✅ Regla #1: Componente pequeño'
      },
      errors: {
        userRequired: 'AffiliateManagement: user es requerido y debe ser un objeto',
        profileNameRequired: 'AffiliateManagement: user.profile.name es requerido',
        planNameRequired: 'AffiliateManagement: user.plan.name es requerido',
        onSaveFunction: 'AffiliateManagement: onSave debe ser una función',
        onCloseFunction: 'AffiliateManagement: onClose debe ser una función',
        incompleteUserInfo: 'Información de usuario incompleta',
        userPlanNotFound: 'Plan de usuario no encontrado',
        incorrectConfig: 'Configuración incorrecta',
        addError: 'Error al agregar afiliado',
        editError: 'Error al editar afiliado',
        unexpectedAddError: 'Error inesperado al agregar afiliado',
        unexpectedEditError: 'Error inesperado al editar afiliado'
      },
      header: {
        title: 'Gestión de Afiliados - {name}',
        subtitle: 'Plan: {plan} • Afiliados: {count}',
        closeAriaLabel: 'Cerrar'
      },
      planInfo: {
        title: 'Información del Plan Familiar',
        owner: 'Titular:',
        plan: 'Plan:'
      },
      buttons: {
        addAffiliate: 'Agregar Afiliado',
        cancel: 'Cancelar',
        saveChanges: 'Guardar Cambios',
        saving: 'Guardando...',
        close: 'Cerrar'
      },
      errorModal: {
        title: 'Error de Datos'
      }
    },
    ambulanceManagement: {
      comments: {
        title: 'Componente principal de gestión de ambulancias',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        rule3: 'Componente <200 líneas siguiendo Regla #3',
        lazyLoading: 'Lazy loading de modal (Regla #5)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)',
        businessLogic: 'HOOK - Toda la lógica de negocio compleja',
        tabRendering: 'FUNCIONES DE RENDERIZADO DE TABS'
      },
      errors: {
        managementError: 'Error en gestión de ambulancias: {error}'
      },
      header: {
        title: 'Gestión de Unidades Médicas',
        subtitle: 'Administra unidades y asigna servicios manualmente'
      },
      filters: {
        all: 'Todas',
        active: 'Activas',
        inactive: 'Inactivas',
        onDuty: 'En Servicio'
      },
      buttons: {
        newUnit: 'Nueva Unidad',
        newUnitShort: 'Nueva'
      },
      tabs: {
        units: 'Unidades ({count})',
        assignments: 'Asignaciones ({count})',
        map: 'Mapa de Asignaciones'
      }
    },
    assignmentMap: {
      comments: {
        title: 'Componente principal del mapa de asignaciones de emergencias médicas',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          visualization: '- Visualización de emergencias pendientes en mapa interactivo',
          management: '- Gestión de unidades médicas disponibles y ocupadas',
          assignment: '- Asignación de unidades a emergencias mediante interfaz visual',
          eta: '- Establecimiento de tiempos estimados de llegada',
          stats: '- Estadísticas en tiempo real y controles de selección'
        },
        architecture: {
          title: 'Arquitectura modular:',
          controls: '- AssignmentControls: Panel de control de asignaciones',
          emergencyMarkers: '- EmergencyMarkers: Marcadores de emergencias en el mapa',
          unitMarkers: '- UnitMarkers: Marcadores de unidades médicas',
          sidebar: '- MapLegend/Stats/Instructions: Componentes informativos del sidebar'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<AssignmentMap />'
        },
        see: {
          hook: '@see {@link useAssignmentMap} Hook que maneja toda la lógica de negocio',
          mockData: '@see {@link MOCK_PENDING_EMERGENCIES} Datos mock de emergencias'
        },
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (146 líneas)',
          rule4: '- Regla #4: Validación de props y datos',
          rule5: '- Regla #5: Lógica compleja en hook personalizado',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        validation: 'VALIDACIÓN INICIAL (Regla #4)',
        businessLogic: 'HOOK - Toda la lógica compleja',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)'
      },
      errors: {
        dataRequired: 'AssignmentMap: MOCK_PENDING_EMERGENCIES requerido',
        dataNotAvailable: 'Error: Datos de emergencias no disponibles',
        mapError: 'Error en mapa de asignaciones: {error}'
      },
      map: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    corporateContractManagement: {
      comments: {
        title: 'Componente principal de gestión de contratos corporativos',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          visualization: '- Visualización y filtrado de contratos corporativos',
          renewal: '- Renovación automática de contratos',
          services: '- Gestión de servicios adicionales y consumidos',
          upload: '- Subida de contratos PDF',
          stats: '- Estadísticas en tiempo real'
        },
        architecture: {
          title: 'Arquitectura modular:',
          header: '- CorporateHeader: Header con filtros y estadísticas',
          list: '- ContractsList: Lista de contratos con vista responsive',
          modal: '- AddContractModal: Modal para subir contratos PDF (lazy loaded)'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<CorporateContractManagement />'
        },
        see: '@see {@link useCorporateContractManagement} Hook que maneja toda la lógica de negocio',
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (150 líneas aprox)',
          rule4: '- Regla #4: Validación de datos y props',
          rule5: '- Regla #5: Lógica compleja en hook personalizado',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        lazyLoading: 'Lazy loading del modal pesado (Regla #5)',
        businessLogic: 'HOOK - Toda la lógica compleja (Regla #2)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)',
        localHandlers: 'HANDLERS LOCALES SIMPLES (Regla #2)',
        viewContract: 'Maneja la visualización detallada de un contrato',
        saveContract: 'Maneja el guardado de contratos PDF'
      },
      errors: {
        managementError: 'Error en gestión de contratos: {error}'
      },
      logs: {
        contractUploaded: 'Contrato subido: {data}'
      },
      alerts: {
        title: '¡Contrato Subido!',
        message: 'El contrato PDF ha sido subido exitosamente'
      }
    },
    emergencyTracking: {
      comments: {
        title: 'Sistema de seguimiento de emergencias activas en tiempo real',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          monitoring: '- Monitoreo en tiempo real de emergencias activas',
          filtering: '- Filtrado por prioridad, estado y rango temporal',
          views: '- Vista timeline, grid y mapa intercambiables',
          assignment: '- Asignación de unidades médicas',
          eta: '- Establecimiento de tiempos de llegada',
          details: '- Panel de detalles con información completa',
          notes: '- Gestión de notas y actualizaciones de estado'
        },
        architecture: {
          title: 'Arquitectura modular:',
          header: '- EmergencyHeader: Header con filtros y estadísticas',
          card: '- EmergencyCard: Tarjetas individuales de emergencias',
          timeline: '- EmergencyTimelineItem: Items de vista timeline (lazy)',
          detailPanel: '- EmergencyDetailPanel: Panel de detalles (lazy)',
          mapView: '- EmergencyMapView: Vista de mapa (lazy)'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<EmergencyTracking />'
        },
        see: {
          hook: '@see {@link useEmergencyTracking} Hook que maneja toda la lógica de negocio',
          mockData: '@see {@link MOCK_EMERGENCY_DATA} Datos mock de emergencias'
        },
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (180 líneas aprox)',
          rule4: '- Regla #4: Validación de datos y props',
          rule5: '- Regla #5: Lógica compleja en hook personalizado + lazy loading',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        lazyLoading: 'Lazy loading de componentes pesados (Regla #5)',
        businessLogic: 'HOOK - Toda la lógica compleja (Regla #2)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)'
      },
      errors: {
        trackingError: 'Error en seguimiento de emergencias: {error}'
      },
      header: {
        emergenciesCount: 'Emergencias ({count})'
      }
    },
    externalEntityManagement: {
      comments: {
        title: 'Sistema de gestión de entidades externas',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          crud: '- Gestión CRUD de entidades externas (bancos, aseguradoras, empresas)',
          adminCreation: '- Creación de administradores externos con credenciales',
          responsive: '- Vista responsive con estadísticas en tiempo real',
          confirmations: '- Modales de confirmación para todas las operaciones',
          validation: '- Validación de formularios y manejo de errores'
        },
        architecture: {
          title: 'Arquitectura modular:',
          header: '- EntityHeader: Header con estadísticas y botones de acción',
          list: '- EntityList: Lista de entidades con vistas desktop y móvil',
          addEntityModal: '- AddEntityModal: Modal para crear nuevas entidades (lazy)',
          addAdminModal: '- AddAdminModal: Modal para crear administradores (lazy)'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<ExternalEntityManagement />'
        },
        see: {
          hook: '@see {@link useExternalEntityManagement} Hook que maneja toda la lógica de negocio',
          mockData: '@see {@link MOCK_EXTERNAL_ENTITIES} Datos mock de entidades'
        },
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (176 líneas aprox)',
          rule4: '- Regla #4: Validación de datos y props',
          rule5: '- Regla #5: Lógica compleja en hook personalizado + lazy loading',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        lazyLoading: 'Lazy loading de modales pesados (Regla #5)',
        businessLogic: 'HOOK - Toda la lógica compleja (Regla #5)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)'
      },
      errors: {
        managementError: 'Error en gestión de entidades: {error}'
      },
      header: {
        emergenciesCount: 'Emergencias activas ({count})'
      },
      logs: {
        contractUploaded: 'Contrato cargado: {data}'
      },
      alerts: {
        title: 'Éxito',
        message: 'Contrato agregado correctamente'
      }
    },
    externalUsersManagement: {
      comments: {
        title: 'Sistema de gestión de usuarios de entidades externas',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          hierarchy: '- Gestión jerárquica: Entidades -> Administradores -> Usuarios',
          entityCreation: '- Creación de entidades con administrador obligatorio',
          expandableView: '- Vista expandible/colapsable de entidades',
          filtering: '- Filtrado y búsqueda avanzada de usuarios',
          activation: '- Activación/desactivación de usuarios externos',
          stats: '- Estadísticas globales del sistema'
        },
        architecture: {
          title: 'Arquitectura modular:',
          header: '- UsersHeader: Header con estadísticas, búsqueda y controles',
          hierarchicalView: '- HierarchicalView: Vista jerárquica expandible de entidades',
          addEntityAdminModal: '- AddEntityAdminModal: Modal para crear entidad con admin (lazy)'
        },
        notes: {
          title: 'Notas importantes:',
          registration: '- Los usuarios externos se registran desde el aplicativo móvil',
          adminRequired: '- Cada entidad debe tener un administrador obligatorio',
          viewOnly: '- Solo se permite vista jerárquica para mejor comprensión'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<ExternalUsersManagement />'
        },
        see: {
          hook: '@see {@link useExternalUsersManagement} Hook que maneja toda la lógica de negocio',
          mockData: '@see {@link MOCK_EXTERNAL_STRUCTURE} Datos mock de estructura jerárquica'
        },
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (145 líneas aprox)',
          rule4: '- Regla #4: Validación de datos y props',
          rule5: '- Regla #5: Lógica compleja en hook personalizado + lazy loading',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        lazyLoading: 'Lazy loading de modal pesado (Regla #5)',
        businessLogic: 'HOOK - Toda la lógica compleja (Regla #5)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)'
      },
      errors: {
        managementError: 'Error en gestión de usuarios externos: {error}'
      },
      search: {
        noResults: 'No se encontraron resultados',
        noMatchesFor: 'No hay entidades, administradores o usuarios que coincidan con "{searchTerm}"',
        clearSearch: 'Limpiar búsqueda'
      }
    },
    notificationSystem: {
      comments: {
        title: 'Sistema de notificaciones y alertas automáticas',
        approach: 'ENFOQUE BALANCEADO: Estructura en componente, lógica en hook',
        features: {
          title: 'Funcionalidades:',
          autoAlerts: '- Alertas automáticas de emergencias con popups y sonidos',
          silenceSystem: '- Sistema de silenciado temporal de alertas por tipo',
          configBehavior: '- Configuración de comportamiento de notificaciones',
          alertsView: '- Vista de alertas activas y historial de notificaciones',
          statsPanel: '- Panel de estadísticas resumidas del sistema',
          autoSounds: '- Reproducción automática de sonidos según tipo de emergencia'
        },
        architecture: {
          title: 'Arquitectura modular:',
          header: '- NotificationsHeader: Header con tabs y contador de alertas',
          alertsView: '- AlertsView: Vista de alertas con controles de silencio',
          configView: '- ConfigView: Formulario de configuración de notificaciones',
          summaryStats: '- SummaryStats: Panel de estadísticas resumidas'
        },
        specialFeatures: {
          title: 'Características especiales:',
          autoPopups: '- Popups automáticos para emergencias SOS (nunca se cierran solos)',
          soundSystem: '- Sistema de sonidos diferenciados por tipo de emergencia',
          notificationModes: '- Modos de notificación: silencioso, normal, detallado',
          globalSync: '- Sincronización con configuración global del sistema'
        },
        example: {
          title: '@example',
          usage: '// Uso básico en dashboard administrativo',
          component: '<NotificationSystem />'
        },
        see: {
          hook: '@see {@link useNotificationSystem} Hook que maneja toda la lógica de negocio',
          config: '@see {@link INITIAL_NOTIFICATION_CONFIG} Configuración inicial'
        },
        rules: {
          title: 'Cumple reglas de refactorización:',
          rule3: '- Regla #3: <200 líneas (142 líneas aprox)',
          rule4: '- Regla #4: Validación de datos y props',
          rule5: '- Regla #5: Lógica compleja en hook personalizado',
          rule6: '- Regla #6: Componentes modulares y reutilizables',
          rule8: '- Regla #8: Manejo consistente de errores',
          rule12: '- Regla #12: Documentación JSDoc completa'
        },
        businessLogic: 'HOOK - Toda la lógica compleja (Regla #5)',
        errorHandling: 'MANEJO DE ERRORES (Regla #8)'
      },
      errors: {
        systemError: 'Error en sistema de notificaciones: {error}'
      }
    },
    /**
     * Panel de configuración de métodos de pago para administrador
     * @description Permite editar toda la información de los métodos de pago alternativos
     */
    paymentMethodsConfig: {
      title: 'Configuración de Métodos de Pago',
      subtitle: 'Configure los métodos de pago disponibles para servicios particulares',
      sections: {
        enabledMethods: 'Métodos Habilitados',
        yapeConfig: 'Configuración de Yape',
        plinConfig: 'Configuración de Plin',
        bankTransferConfig: 'Configuración de Transferencia Bancaria',
        generalConfig: 'Configuración General'
      },
      methods: {
        yape: 'Yape',
        plin: 'Plin',
        transfer: 'Transferencia'
      },
      fields: {
        yapeNumber: 'Número de Yape',
        plinNumber: 'Número de Plin',
        ownerName: 'Nombre del Titular',
        accountHolder: 'Titular de la Cuenta',
        additionalInstructions: 'Instrucciones adicionales',
        bankName: 'Banco',
        accountNumber: 'Número de Cuenta',
        cciCode: 'CCI (Código Interbancario)',
        accountType: 'Tipo de Cuenta',
        maxFileSize: 'Tamaño máximo de archivo (MB)',
        allowedFormats: 'Formatos permitidos',
        confirmationMessage: 'Mensaje de confirmación'
      },
      options: {
        banks: {
          bcp: 'Banco de Crédito del Perú (BCP)',
          bbva: 'BBVA Continental',
          interbank: 'Interbank',
          scotiabank: 'Scotiabank',
          nacion: 'Banco de la Nación',
          pichincha: 'Banco Pichincha'
        },
        accountTypes: {
          ahorros: 'Cuenta de Ahorros',
          corriente: 'Cuenta Corriente'
        }
      },
      placeholders: {
        yapeNumber: '999888777',
        plinNumber: '998877666',
        accountNumber: '123-456789-0-12',
        cciCode: '00212300456789012',
        ownerName: 'Nombre o razón social',
        additionalInstructions: 'Instrucciones para el usuario...',
        confirmationMessage: 'Mensaje que verá el usuario después de enviar el pago...'
      },
      defaultValues: {
        yapeInstructions: 'Enviar captura del voucher después de realizar el pago',
        plinInstructions: 'Usar el código QR o número para realizar el pago',
        transferInstructions: 'Enviar voucher a administracion@helpmed.com después de la transferencia',
        confirmationMessage: 'Su pago ha sido registrado y será verificado en las próximas 2 horas',
        ownerName: 'HELPMED S.A.C.',
        bankName: 'Banco de Crédito del Perú',
        accountType: 'corriente',
        formats: ['jpg', 'jpeg', 'png', 'pdf']
      },
      buttons: {
        cancel: 'Cancelar',
        save: 'Guardar Cambios',
        saving: 'Guardando...'
      },
      messages: {
        saveSuccess: 'Configuración guardada exitosamente',
        saveError: 'Error al guardar la configuración'
      }
    },
    /**
     * Panel de configuración de planes para administrador
     * @description Permite editar y gestionar todos los planes disponibles
     */
    planConfiguration: {
      title: 'Configuración de Planes',
      subtitle: 'Planes Familiares (4)',
      counters: {
        totalPlans: 'Total Planes',
        familiar: 'Familiares',
        corporate: 'Corporativos',
        external: 'Externos'
      },
      buttons: {
        additionalPrices: 'Precios Adicionales',
        export: 'Exportar',
        newPlan: 'Nuevo Plan',
        edit: 'Editar',
        pause: 'Pausar',
        delete: 'Eliminar',
        saveChanges: 'Guardar Cambios',
        cancel: 'Cancelar',
        yesPause: 'Sí, pausar',
        yesDelete: 'Sí, eliminar',
        createPlan: 'Crear Plan'
      },
      plans: {
        help: {
          name: 'Plan Help',
          description: 'Plan básico de emergencias médicas'
        },
        basic: {
          name: 'Plan Básico',
          description: 'Plan familiar con servicios esenciales'
        },
        vip: {
          name: 'Plan VIP',
          description: 'Plan premium con beneficios adicionales'
        },
        gold: {
          name: 'Plan Dorado',
          description: 'Plan de lujo con todos los beneficios'
        }
      },
      status: {
        active: 'Activo'
      },
      fields: {
        price: 'Precio:',
        characteristics: 'Características:',
        updated: 'Actualizado:',
        mainLimits: 'Límites Principales:',
        emergencies: 'Emergencias:',
        urgencies: 'Urgencias:',
        medicalDom: 'Médico Dom:',
        transfers: 'Traslados:',
        planName: 'Nombre del Plan',
        annualPrice: 'Precio Anual',
        homeDoctorShort: 'Médico Dom.',
        planType: 'Tipo de Plan',
        description: 'Descripción',
        annualPriceFull: 'Precio Anual (S/)'
      },
      values: {
        unlimited: 'ILIMITADO'
      },
      formats: {
        year: '/año',
        month: '/mes',
        currency: 'S/'
      },
      modals: {
        editPlan: {
          title: 'Editar {planName}',
          fields: {
            planName: 'Nombre del Plan',
            annualPrice: 'Precio Anual',
            monthlyPrice: 'Precio Mensual (S/)',
            planLimits: 'Límites del Plan',
            emergencies: 'Emergencias',
            medicalDom: 'Médico Dom.',
            urgencies: 'Urgencias',
            transfers: 'Traslados'
          },
          buttons: {
            save: 'Guardar Cambios',
            cancel: 'Cancelar'
          }
        },
        pausePlan: {
          title: '¿Pausar plan?',
          message: '¿Deseas pausar el {planName}? Los usuarios no podrán suscribirse mientras esté pausado.',
          buttons: {
            confirm: 'Sí, pausar',
            cancel: 'Cancelar'
          }
        },
        deletePlan: {
          title: '¿Eliminar plan?',
          message: '¿Estás seguro de eliminar el {planName}? Esta acción no se puede deshacer.',
          buttons: {
            confirm: 'Sí, eliminar',
            cancel: 'Cancelar'
          }
        },
        addPlan: {
          title: 'Agregar Nuevo Plan',
          fields: {
            planName: 'Nombre del Plan',
            description: 'Descripción',
            monthlyPrice: 'Precio Mensual (S/)',
            annualPrice: 'Precio Anual (S/)',
            planType: 'Tipo de Plan'
          },
          placeholders: {
            planName: 'Ej: Plan Premium',
            description: 'Descripción del plan',
            price: '0.00'
          },
          options: {
            familiar: 'Familiar',
            corporate: 'Corporativo',
            external: 'Externo'
          },
          buttons: {
            create: 'Crear Plan',
            cancel: 'Cancelar'
          }
        },
        export: {
          title: 'Exportando',
          message: 'Los planes se están exportando a Excel...'
        },
        saved: {
          title: 'Configuración guardada',
          message: 'Los precios adicionales han sido actualizados correctamente'
        }
      },
      options: {
        planTypes: {
          familiar: 'Familiar',
          corporate: 'Corporativo',
          external: 'Externo'
        }
      },
      placeholders: {
        planName: 'Ej: Plan Premium',
        description: 'Descripción del plan',
        price: '0.00'
      },
      console: {
        pricesSaved: 'Datos de precios guardados:'
      }
    },
    ambulance: {
      stats: {
        active: 'Activas',
        available: 'Disponibles',
        inService: 'En Servicio',
        maintenance: 'Mantenimiento',
        total: 'Total Unidades'
      },
      errors: {
        ambulancesRequired: 'UnitsTab: ambulances es requerido',
        filteredRequired: 'UnitsTab: filteredAmbulances es requerido',
        onEditRequired: 'UnitsTab: onEdit debe ser una función',
        onDeleteRequired: 'UnitsTab: onDelete debe ser una función'
      },
      titleWithCount: 'Lista de Unidades ({count})',
      empty: {
        title: 'No hay unidades registradas',
        description: 'Agrega nuevas unidades de ambulancia para comenzar'
      },
      form: {
        title: {
          new: 'Nueva Unidad',
          edit: 'Editar Unidad'
        },
        sections: {
          credentials: 'Credenciales de Acceso',
          ambulanceData: 'Datos de la Ambulancia'
        },
        fields: {
          username: 'Usuario',
          password: 'Contraseña',
          passwordOptional: 'Nueva Contraseña (opcional)',
          unitId: 'ID de Unidad',
          plate: 'Placa',
          type: 'Tipo',
          capacity: 'Capacidad (personas)',
          medicalTeam: 'Equipo Médico',
          status: 'Estado'
        },
        placeholders: {
          unitId: 'AMB-001',
          plate: 'ABC-123'
        },
        options: {
          type: {
            ambulance: 'Ambulancia',
            motorizedDoctor: 'Médico motorizado',
            carDoctor: 'Médico en auto'
          },
          medicalTeam: {
            nursingTech: 'Técnico en Enfermería',
            nursingLicense: 'Licenciado en Enfermería',
            both: 'Técnico y Licenciado'
          },
          status: {
            active: 'Activa',
            inactive: 'Inactiva',
            maintenance: 'Mantenimiento'
          }
        },
        validation: {
          userRequired: 'El usuario es requerido',
          unitIdRequired: 'El ID de unidad es requerido',
          plateRequired: 'La placa es requerida',
          passwordRequired: 'La contraseña es requerida para nuevas unidades'
        },
        buttons: {
          create: 'Crear',
          update: 'Actualizar',
          unit: 'Unidad'
        },
        errors: {
          unexpectedError: 'Error inesperado'
        }
      },
      row: {
        defaultUnit: 'Unidad Sin ID',
        driver: 'Conductor',
        notAssigned: 'Sin asignar',
        notSpecified: 'No especificado',
        notSpecifiedFemale: 'No especificada',
        never: 'Nunca',
        people: 'personas',
        fields: {
          email: 'Email',
          phone: 'Teléfono',
          license: 'Licencia',
          type: 'Tipo',
          plate: 'Placa',
          capacity: 'Capacidad',
          medicalTeam: 'Equipo Médico',
          gpsLocation: 'Ubicación GPS',
          lastUpdate: 'Última actualización',
          completedServices: 'Servicios completados',
          id: 'ID',
          created: 'Creado'
        },
        actions: {
          edit: 'Editar',
          delete: 'Eliminar',
          markAvailable: 'Marcar como Disponible',
          markOffDuty: 'Marcar fuera de Servicio'
        },
        errors: {
          rowError: 'Error en fila de ambulancia',
          ambulanceRequired: 'ambulance es requerido y debe ser un objeto',
          onEditRequired: 'onEdit debe ser una función',
          onDeleteRequired: 'onDelete debe ser una función'
        }
      }
    },
    dashboard: {
      overview: 'Resumen',
      users: 'Usuarios',
      ambulances: 'Ambulancias',
      emergencies: 'Emergencias',
      affiliates: 'Afiliados',
      contracts: 'Contratos',
      reports: 'Reportes',
      settings: 'Configuración'
    },
    stats: {
      totalUsers: 'Total Usuarios',
      activeEmergencies: 'Emergencias Activas',
      availableAmbulances: 'Ambulancias Disponibles',
      monthlyRevenue: 'Ingresos Mensuales'
    },
    affiliates: {
      add: {
        title: 'Agregar Afiliado',
        submitButton: 'Agregar',
        submittingButton: 'Agregando...',
        fields: {
          name: {
            label: 'Nombre Completo',
            placeholder: 'Ingresa el nombre completo'
          },
          dni: {
            label: 'DNI',
            placeholder: 'Ingresa el DNI'
          },
          phone: {
            label: 'Teléfono',
            placeholder: 'Ingresa el número de teléfono'
          },
          relationship: {
            label: 'Relación Familiar'
          },
          birthDate: {
            label: 'Fecha de Nacimiento'
          }
        }
      },
      edit: {
        title: 'Editar Afiliado',
        submitButton: 'Guardar Cambios',
        submittingButton: 'Guardando...',
        editingLabel: 'Editando',
        noChanges: 'No se han realizado cambios',
        processingRequest: 'Ya se está procesando una solicitud',
        correctErrors: 'Por favor corrige los errores del formulario'
      },
      status: {
        active: 'ACTIVO',
        inactive: 'INACTIVO'
      },
      relationships: {
        spouse: 'Cónyuge',
        child: 'Hijo/a',
        father: 'Padre',
        mother: 'Madre',
        sibling: 'Hermano/a',
        other: 'Otro'
      },
      messages: {
        addSuccess: 'Afiliado agregado correctamente',
        updateSuccess: 'Afiliado actualizado correctamente',
        deleteSuccess: 'Afiliado eliminado correctamente',
        statusChanged: 'Estado del afiliado cambiado correctamente',
        duplicateDni: 'Ya existe un afiliado con este DNI',
        limitReached: 'Se ha alcanzado el límite máximo de afiliados para este plan',
        notFound: 'Afiliado no encontrado',
        alreadyActive: 'El afiliado ya está activo',
        incompleteData: 'El afiliado debe tener datos completos (nombre y DNI)'
      },
      card: {
        noName: 'Sin nombre',
        notSpecified: 'No especificado',
        notSpecifiedFemale: 'No especificada',
        invalidDate: 'Fecha inválida',
        years: 'años',
        labels: {
          dni: 'DNI',
          phone: 'Teléfono',
          age: 'Edad',
          added: 'Agregado'
        },
        actions: {
          activate: 'Activar',
          deactivate: 'Desactivar',
          edit: 'Editar',
          delete: 'Eliminar',
          activateTitle: 'Activar afiliado',
          deactivateTitle: 'Desactivar afiliado',
          editTitle: 'Editar información del afiliado',
          deleteTitle: 'Eliminar afiliado'
        }
      },
      list: {
        title: 'Afiliados',
        titleWithCount: 'Afiliados ({count})',
        subtitle: 'Administra los afiliados del plan familiar',
        empty: {
          icon: '👥',
          title: 'No hay afiliados registrados',
          description: 'Comienza agregando afiliados al plan familiar',
          addButton: 'Agregar Primer Afiliado'
        },
        stats: {
          title: 'Estadísticas Rápidas',
          total: 'Total',
          active: 'Activos',
          inactive: 'Inactivos'
        }
      },
      assignments: {
        title: 'Asignaciones de Emergencias',
        error: {
          title: 'Error en Asignaciones',
          button: 'Reintentar'
        },
        stats: {
          highPriority: 'Alta Prioridad',
          mediumPriority: 'Media Prioridad',
          availableUnits: 'Unidades Disponibles',
          pending: 'Pendientes'
        },
        list: {
          title: 'Servicios Pendientes de Asignación',
          titleWithCount: 'Servicios Pendientes de Asignación ({count})',
          empty: {
            icon: '¡Excelente!',
            description: 'No hay servicios pendientes de asignación.'
          },
          fields: {
            patient: 'Paciente',
            plan: 'Plan',
            description: 'Descripción',
            location: 'Ubicación',
            estimatedTime: 'Tiempo estimado',
            requestedTime: 'Solicitado hace',
            minutes: 'min'
          },
          arrival: {
            title: 'Tiempo Estimado de Llegada',
            button: 'Establecer Tiempo de Llegada',
            processing: 'Procesando...',
            established: 'Tiempo establecido',
            minutes: 'minutos'
          },
          assignment: {
            title: 'Asignar Unidad Médica',
            subtitle: '(Ordenadas por cercanía)',
            noUnits: 'No hay unidades disponibles',
            closest: 'MÁS CERCANA',
            available: 'Disponible',
            distance: {
              km: 'km',
              separator: '•'
            }
          }
        }
      },
      units: {
        title: 'Unidades',
        titleWithCount: 'Unidades ({count})',
        stats: {
          active: 'Activas',
          available: 'Disponibles',
          inService: 'En Servicio',
          total: 'Total'
        },
        empty: {
          title: 'No hay unidades',
          description: 'No se encontraron unidades con los filtros seleccionados.'
        },
        errors: {
          ambulancesRequired: 'UnitsTab: ambulances debe ser un array',
          filteredRequired: 'UnitsTab: filteredAmbulances debe ser un array',
          onEditRequired: 'UnitsTab: onEdit debe ser una función',
          onDeleteRequired: 'UnitsTab: onDelete debe ser una función'
        }
      }
    },
    corporate: {
      contracts: {
        add: {
          title: 'Subir Contrato PDF',
          sections: {
            client: 'Seleccionar Cliente',
            validity: 'Vigencia del Contrato',
            document: 'Documento del Contrato',
            selectedClient: 'Cliente Seleccionado',
            validationErrors: 'Errores de Validación'
          },
          fields: {
            client: 'Cliente Corporativo',
            startDate: 'Fecha de Inicio',
            endDate: 'Fecha de Fin',
            contractPdf: 'Contrato PDF',
            company: 'Empresa',
            ruc: 'RUC',
            contact: 'Contacto',
            email: 'Email'
          },
          placeholders: {
            selectClient: 'Seleccionar cliente...'
          },
          upload: {
            changeFile: 'Cambiar archivo',
            dragAndDrop: 'Arrastra y suelta tu archivo PDF aquí',
            orClick: 'o haz clic para seleccionar',
            fileLimit: 'Solo archivos PDF, máximo {size}MB'
          },
          buttons: {
            cancel: 'Cancelar',
            submit: 'Subir Contrato',
            submitting: 'Subiendo Contrato...'
          },
          validation: {
            clientRequired: 'Debe seleccionar un cliente corporativo',
            fileRequired: 'Debe subir un archivo PDF del contrato',
            onlyPdf: 'Solo se permiten archivos PDF',
            fileTooLarge: 'El archivo no puede exceder {size}MB',
            startDateRequired: 'Debe seleccionar una fecha de inicio',
            endDateRequired: 'Debe seleccionar una fecha de fin',
            endDateInvalid: 'La fecha de fin debe ser posterior a la fecha de inicio'
          },
          alerts: {
            error: {
              title: 'Error',
              text: 'Ocurrió un error al subir el contrato. Por favor, inténtelo nuevamente.'
            }
          },
          errors: {
            onCloseRequired: 'AddContractModal: onClose debe ser una función',
            onSaveRequired: 'AddContractModal: onSave debe ser una función',
            corporateUsersRequired: 'AddContractModal: corporateUsers debe ser un array',
            uploadError: 'Error al subir contrato:'
          }
        },
        detail: {
          title: 'Contrato',
          sections: {
            contractInfo: 'Información del Contrato',
            companyInfo: 'Información de la Empresa',
            expiringWarning: '⚠️ Contrato por Vencer'
          },
          fields: {
            contractId: 'ID Contrato',
            plan: 'Plan',
            services: 'Servicios',
            startDate: 'Inicio',
            renewalDate: 'Renovación',
            monthlyCost: 'Costo Mensual',
            company: 'Empresa',
            ruc: 'RUC',
            industry: 'Industria',
            contact: 'Contacto'
          },
          messages: {
            contractExpiring: 'Este contrato vence el {date}. Contacte al cliente para renovación.'
          },
          buttons: {
            edit: 'Editar Contrato',
            close: 'Cerrar'
          },
          defaults: {
            notAvailable: 'N/A',
            currencySymbol: 'S/'
          }
        },
        list: {
          title: 'Contratos Corporativos',
          titleWithCount: 'Contratos Corporativos ({count})',
          empty: {
            title: 'No hay contratos',
            description: 'No se encontraron contratos con los filtros aplicados.'
          },
          fields: {
            contact: 'Contacto',
            ruc: 'RUC',
            usage: 'Uso',
            renewal: 'Renovación',
            monthlyCost: 'Costo Mensual',
            cost: 'Costo',
            id: 'ID',
            phone: 'Teléfono',
            email: 'Email'
          },
          buttons: {
            viewDetail: 'Ver Detalle',
            renew: 'Renovar',
            renewContract: 'Renovar Contrato'
          },
          errors: {
            contractsRequired: 'ContractsList: contracts debe ser un array',
            getContractStatusRequired: 'ContractsList: getContractStatus debe ser una función',
            getUsageColorRequired: 'ContractsList: getUsageColor debe ser una función',
            getContractStatusClassRequired: 'ContractsList: getContractStatusClass debe ser una función',
            onViewContractRequired: 'ContractsList: onViewContract debe ser una función',
            onRenewContractRequired: 'ContractsList: onRenewContract debe ser una función'
          }
        },
        header: {
          title: 'Gestión de Contratos Corporativos',
          subtitle: 'Administra contratos de área protegida para empresas',
          buttons: {
            uploadContract: 'Subir Contrato PDF'
          },
          search: {
            placeholder: 'Buscar por empresa, contacto o RUC...'
          },
          filters: {
            all: 'Todos los Contratos',
            active: 'Contratos Activos',
            expiring: 'Por Vencer (30 días)'
          },
          stats: {
            total: 'Total Contratos',
            active: 'Contratos Activos',
            expiring: 'Por Vencer',
            monthlyRevenue: 'Ingresos Mensuales'
          },
          errors: {
            contractStatsRequired: 'CorporateHeader: contractStats es requerido',
            setSearchTermRequired: 'CorporateHeader: setSearchTerm debe ser una función',
            setFilterRequired: 'CorporateHeader: setFilter debe ser una función',
            onShowAddFormRequired: 'CorporateHeader: onShowAddForm debe ser una función'
          }
        }
      }
    },
    dashboard: {
      contactModal: {
        title: 'Contactar Cliente',
        fields: {
          client: 'Cliente',
          phone: 'Teléfono',
          email: 'Email',
          reason: 'Motivo'
        },
        suggestedActions: {
          title: 'Acciones sugeridas',
          items: [
            'Llamar al cliente para ofrecerle upgrade',
            'Enviar propuesta personalizada por email',
            'Programar reunión comercial'
          ]
        },
        buttons: {
          markAsContacted: 'Marcar como Contactado',
          close: 'Cerrar'
        }
      },
      contactRequestItem: {
        priority: 'ALTA',
        userType: 'Familiar',
        serviceTypes: {
          programmedTransfer: 'TRASLADO_PROGRAMADO'
        },
        badges: {
          protectedZone: 'Zona Protegida'
        },
        fields: {
          reason: 'Motivo',
          protectedZoneMessage: 'Zona Protegida - Solo 1 restante',
          plan: 'Plan'
        },
        cards: {
          serviceUsage: {
            title: 'Uso de Servicios',
            content: '0/1 (Zona Protegida)'
          },
          contact: {
            title: 'Contacto'
          }
        },
        dates: {
          request: 'Solicitud',
          lastService: 'Último servicio'
        },
        buttons: {
          contact: 'Contactar',
          viewDetail: 'Ver Detalle'
        }
      },
      contactRequestsHeader: {
        title: 'Solicitudes de Contacto',
        subtitle: 'Clientes que requieren ampliación de servicios',
        filters: {
          urgency: {
            label: 'Urgencia',
            options: {
              all: 'Todas',
              critical: 'Crítica',
              high: 'Alta',
              medium: 'Media'
            }
          },
          service: {
            label: 'Servicio',
            options: {
              all: 'Todos',
              emergency: 'Emergencias',
              urgency: 'Urgencias',
              homeDoctor: 'Médico a Domicilio',
              programmedTransfer: 'Traslados',
              protectedZone: 'Zona Protegida',
              labExams: 'Exámenes Lab.',
              phoneOrientation: 'Orientación Tel.'
            },
            values: {
              emergency: 'EMERGENCIA',
              urgency: 'URGENCIA',
              homeDoctor: 'MEDICO_DOMICILIO',
              programmedTransfer: 'TRASLADO_PROGRAMADO',
              protectedZone: 'ZONA_PROTEGIDA',
              labExams: 'EXAMENES_LABORATORIO',
              phoneOrientation: 'ORIENTACION_TELEFONICA'
            }
          }
        }
      },
      contactRequestsStats: {
        urgencyValues: {
          critical: 'crítica',
          high: 'alta',
          medium: 'media'
        },
        cards: {
          critical: 'Críticas',
          highPriority: 'Alta Prioridad',
          mediumPriority: 'Media Prioridad',
          total: 'Total',
          requests: 'Solicitudes'
        }
      },
      contactRequestsTab: {
        title: 'Solicitudes Pendientes',
        titleWithCount: 'Solicitudes Pendientes ({count})',
        empty: 'No hay solicitudes que coincidan con los filtros seleccionados',
        userTypes: {
          familiar: 'Familiar',
          corporate: 'Corporativo'
        },
        urgencyValues: {
          critical: 'crítica',
          high: 'alta',
          medium: 'media'
        },
        planNames: {
          protectedArea: 'Área Protegida'
        },
        status: {
          pending: 'pendiente'
        },
        reasons: {
          servicesExhausted: 'Servicios agotados - Plan Help',
          onlyXServicesRemaining: 'Solo {count} servicios restantes - Plan Help',
          serviceExhausted: '{service} - Servicio agotado',
          onlyXRemaining: '{service} - Solo {count} restante{plural}',
          corporateServicesExhausted: 'Servicios corporativos agotados',
          onlyXCorporateRemaining: 'Solo {count} servicios restantes'
        },
        demo: {
          names: ['Eduardo Silva', 'Empresa ABC Ltda.', 'Carlos Ramírez'],
          plans: ['Plan VIP'],
          phones: ['+51 9 7777 8888', '+51 2 2555 1000'],
          emails: ['eduardo.silva@gmail.com', 'cliente@email.com', 'corporativo@empresa.com', 'carlos.ramirez@empresaabc.cl']
        },
        logs: {
          markingAsContacted: 'Marcando como contactado:',
          editingContract: 'Editando contrato:'
        }
      },
      contractDetailsModal: {
        title: 'Contrato',
        sections: {
          contractInfo: 'Información del Contrato',
          companyInfo: 'Información de la Empresa',
          serviceUsage: 'Uso de Servicios',
          expiringWarning: 'Contrato por Vencer'
        },
        fields: {
          contractId: 'ID Contrato',
          plan: 'Plan',
          services: 'Servicios',
          startDate: 'Inicio',
          renewalDate: 'Renovación',
          monthlyCost: 'Costo Mensual',
          company: 'Empresa',
          ruc: 'RUC',
          industry: 'Industria',
          contact: 'Contacto',
          servicesUsed: 'Servicios Usados',
          servicesRemaining: 'Servicios Restantes',
          usagePercentage: 'Porcentaje de Uso'
        },
        demo: {
          contractId: 'CORP-ABC-2024-001',
          planName: 'Área Protegida - Empresa ABC',
          defaultServices: '50',
          startDate: '31-12-2023',
          renewalDate: '31-12-2024',
          monthlyCost: 'S/ 1075',
          companyName: 'Empresa ABC Ltda.',
          rucNumber: '96.123.456-7',
          industry: 'Construcción',
          contactPerson: 'Carlos Ramírez (Gerente de RRHH)',
          usagePercentage: '100%'
        },
        messages: {
          expiringMessage: 'Este contrato vence el {date}. Contacte al cliente para renovación.'
        },
        buttons: {
          editContract: 'Editar Contrato',
          close: 'Cerrar'
        }
      },
      overviewTab: {
        title: 'Vista General',
        buttons: {
          refresh: 'Actualizar'
        },
        stats: {
          totalUsers: {
            title: 'Usuarios Totales',
            subtitle: '{count} activos',
            icon: '👥'
          },
          emergencies: {
            title: 'Emergencias',
            subtitle: '{count} pendientes',
            icon: '⚠️'
          },
          contracts: {
            title: 'Contratos',
            subtitle: '{count} activos',
            icon: '🏢'
          },
          units: {
            title: 'Unidades',
            subtitle: '{count} disponibles',
            icon: '🚛'
          }
        },
        recentActivity: {
          title: 'Actividad Reciente',
          items: [
            {
              icon: '🚨',
              title: 'Nueva emergencia registrada',
              time: 'Hace 5 minutos'
            },
            {
              icon: '👤',
              title: 'Usuario registrado',
              time: 'Hace 12 minutos'
            },
            {
              icon: '📝',
              title: 'Contrato actualizado',
              time: 'Hace 1 hora'
            }
          ]
        }
      },
      quickActions: {
        title: 'Acciones Rápidas',
        alert: {
          title: 'Acción Rápida',
          text: 'Ejecutando: {action}'
        },
        actions: [
          {
            name: 'Gestionar Usuarios',
            icon: 'fas fa-user-plus',
            color: 'blue',
            tab: 'users',
            description: 'Administrar usuarios del sistema'
          },
          {
            name: 'Contratos Corporativos',
            icon: 'fas fa-file-contract',
            color: 'red',
            tab: 'contracts',
            description: 'Gestionar contratos empresariales'
          },
          {
            name: 'Ver Reportes',
            icon: 'fas fa-chart-bar',
            color: 'green',
            tab: 'reports',
            description: 'Visualizar reportes y estadísticas'
          },
          {
            name: 'Configurar Planes',
            icon: 'fas fa-cog',
            color: 'purple',
            tab: 'plans',
            description: 'Configurar planes y servicios'
          }
        ]
      },
      quickMetrics: {
        title: 'Métricas Clave',
        metrics: [
          {
            label: 'Tiempo respuesta promedio',
            value: '8.3 min',
            color: 'green'
          },
          {
            label: 'Satisfacción del cliente',
            value: '94%',
            color: 'blue'
          },
          {
            label: 'Utilización de unidades',
            value: '78%',
            color: 'purple'
          },
          {
            label: 'Servicios completados hoy',
            value: '127',
            color: 'orange'
          }
        ]
      },
      settingsTab: {
        title: 'Configuración del Sistema',
        placeholder: {
          icon: '⚙️',
          title: 'Configuración',
          description: 'Componente en desarrollo para configuraciones avanzadas del sistema'
        }
      },
      systemAlerts: {
        title: 'Alertas del Sistema',
        mockAlerts: [
          {
            id: 1,
            type: 'warning',
            title: 'Mantenimiento programado',
            message: 'Mantenimiento del sistema programado para mañana a las 02:00',
            time: '1 hour ago'
          },
          {
            id: 2,
            type: 'info',
            title: 'Actualización disponible',
            message: 'Nueva versión del sistema disponible para instalación',
            time: '3 hours ago'
          }
        ],
        alertTypes: {
          warning: 'warning',
          info: 'info'
        },
        colors: {
          warning: {
            border: 'border-yellow-500',
            background: 'bg-yellow-50'
          },
          info: {
            border: 'border-blue-500',
            background: 'bg-blue-50'
          }
        }
      }
    },
    userManagement: {
      title: 'Gestión de Usuarios',
      subtitle: 'Administra usuarios del sistema y solicitudes de registro',
      buttons: {
        createUser: 'Crear Usuario'
      },
      stats: {
        familiares: 'Familiares',
        corporativos: 'Corporativos',
        externos: 'Externos',
        administradores: 'Administradores'
      },
      filters: {
        familiar: 'familiar',
        corporativo: 'corporativo',
        externo: 'externo',
        admin: 'admin',
        registrations: 'Solicitudes'
      },
      search: {
        placeholder: 'Buscar usuarios...'
      },
      loading: {
        message: 'Cargando usuarios...'
      },
      headers: {
        registrationsPending: 'Solicitudes de Registro ({count} pendientes)',
        usersList: 'Usuarios {type} ({count})'
      },
      empty: {
        registrations: {
          icon: 'fas fa-clipboard-list',
          title: 'No hay solicitudes pendientes',
          description: 'Las nuevas solicitudes de registro aparecerán aquí'
        },
        users: {
          icon: 'fas fa-users',
          title: 'No se encontraron usuarios',
          description: 'Intenta ajustar los filtros de búsqueda'
        }
      },
      footer: {
        info: 'Sistema de gestión de usuarios HelpMED - Actualizado en tiempo real',
        total: 'Total: {count} usuarios'
      },
      error: {
        prefix: 'Error en gestión de usuarios: {error}'
      }
    },
    usersTab: {
      comments: {
        description: 'Tab de gestión de usuarios',
        usage: 'Ahora usa el componente UserManagement completo con todas las funciones'
      }
    },
    emergency: {
      emergencyCard: {
        comments: {
          title: 'Tarjeta de emergencia individual para vista grid',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          emergencyRequired: 'EmergencyCard: emergency es requerido',
          onSelectRequired: 'EmergencyCard: onSelect debe ser una función',
          getPriorityRequired: 'EmergencyCard: getPriorityCardColor debe ser una función',
          getStatusRequired: 'EmergencyCard: getStatusColor debe ser una función',
          getElapsedRequired: 'EmergencyCard: getElapsedTime debe ser una función'
        },
        patient: {
          years: ' años'
        },
        time: {
          elapsed: 'Hace {time} min',
          arrival: 'Llegada: {time} min',
          waiting: 'Esperando {time} min'
        },
        buttons: {
          assign: 'Asignar',
          arrivalTime: 'Tiempo Llegada',
          complete: 'Completar',
          note: 'Nota'
        },
        status: {
          pending: 'PENDIENTE',
          completed: 'COMPLETADA'
        }
      },
      emergencyDetailPanel: {
        comments: {
          title: 'Panel de detalles completos de emergencia',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con funciones del hook'
        },
        title: 'Detalles de Emergencia',
        sections: {
          general: {
            title: 'Información General',
            fields: {
              id: 'ID:',
              type: 'Tipo:',
              priority: 'Prioridad:',
              status: 'Estado:',
              elapsedTime: 'Tiempo transcurrido:',
              severity: 'Severidad:'
            }
          },
          patient: {
            title: 'Información del Paciente',
            fields: {
              name: 'Nombre:',
              age: 'Edad:',
              ageUnit: ' años',
              gender: 'Género:',
              genderMale: 'Masculino',
              genderFemale: 'Femenino',
              phone: 'Teléfono:',
              medicalHistory: 'Historial médico:'
            }
          },
          location: {
            title: 'Ubicación'
          },
          vitalSigns: {
            title: 'Signos Vitales',
            lastMeasurement: 'Última medición: {timestamp}',
            fields: {
              heartRate: 'FC:',
              heartRateUnit: ' bpm',
              bloodPressure: 'PA:',
              bloodPressureUnit: ' mmHg',
              oxygenSaturation: 'SatO2:',
              oxygenUnit: '%',
              temperature: 'Temp:',
              temperatureUnit: '°C',
              consciousness: 'Consciencia:'
            }
          },
          timeline: {
            title: 'Cronología',
            by: 'por {operator}',
            noEvents: 'Sin eventos registrados'
          }
        },
        buttons: {
          assignUnit: 'Asignar Unidad',
          markCompleted: 'Marcar como Completada',
          addNote: 'Agregar Nota'
        },
        severityFormat: '{score}/10'
      },
      emergencyHeader: {
        comments: {
          title: 'Header del seguimiento de emergencias con filtros y estadísticas',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Seguimiento de Emergencias',
        realTimeMonitoring: 'Monitoreo en tiempo real',
        errors: {
          statsRequired: 'EmergencyHeader: stats es requerido',
          setFilterPriorityRequired: 'EmergencyHeader: setFilterPriority debe ser una función',
          setFilterStatusRequired: 'EmergencyHeader: setFilterStatus debe ser una función',
          setFilterTimeRangeRequired: 'EmergencyHeader: setFilterTimeRange debe ser una función',
          setViewModeRequired: 'EmergencyHeader: setViewMode debe ser una función'
        },
        filters: {
          priority: {
            all: 'Todas las prioridades',
            critical: 'Crítica',
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
          },
          status: {
            all: 'Todos los estados',
            pending: 'Pendientes',
            inProgress: 'En Progreso',
            onRoute: 'En Ruta',
            completed: 'Completadas'
          },
          timeRange: {
            today: 'Hoy',
            last24h: 'Últimas 24h',
            last7days: 'Últimos 7 días',
            all: 'Todas'
          }
        },
        viewModes: {
          timeline: 'timeline',
          grid: 'grid',
          map: 'map'
        },
        priorityValues: {
          critical: 'CRITICA',
          high: 'ALTA',
          medium: 'MEDIA',
          low: 'BAJA'
        },
        statusValues: {
          pending: 'PENDIENTE',
          inProgress: 'EN_PROGRESO',
          onRoute: 'EN_RUTA',
          completed: 'COMPLETADA'
        }
      },
      emergencyMapView: {
        comments: {
          title: 'Vista de mapa para emergencias',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Mapa de Emergencias',
        placeholder: {
          title: 'Mapa interactivo de emergencias activas',
          description: 'Mostraría la ubicación en tiempo real de todas las emergencias'
        },
        errors: {
          emergenciesRequired: 'EmergencyMapView: emergencies debe ser un array',
          onSelectRequired: 'EmergencyMapView: onSelectEmergency debe ser una función'
        },
        priorityValue: {
          critical: 'CRITICA'
        }
      },
      emergencyStats: {
        comments: {
          title: 'Componente de estadísticas de emergencias',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props',
          cardTitle: 'Tarjeta individual de estadística'
        },
        errors: {
          statsRequired: 'EmergencyStats: stats es requerido',
          cardFieldsRequired: 'EmergencyStatCard: title y count son requeridos'
        },
        cards: {
          total: {
            title: 'Total',
            icon: 'fas fa-list',
            color: 'blue'
          },
          active: {
            title: 'Activas',
            icon: 'fas fa-exclamation-triangle',
            color: 'yellow'
          },
          pending: {
            title: 'Pendientes',
            icon: 'fas fa-clock',
            color: 'orange'
          },
          completed: {
            title: 'Completadas',
            icon: 'fas fa-check-circle',
            color: 'green'
          },
          critical: {
            title: 'Críticas',
            icon: 'fas fa-heartbeat',
            color: 'red'
          },
          avgTime: {
            title: 'Tiempo Prom.',
            icon: 'fas fa-stopwatch',
            color: 'purple',
            format: '{time}min'
          }
        },
        colorClasses: {
          blue: 'bg-blue-50 border-blue-200 text-blue-600',
          yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
          orange: 'bg-orange-50 border-orange-200 text-orange-600',
          green: 'bg-green-50 border-green-200 text-green-600',
          red: 'bg-red-50 border-red-200 text-red-600',
          purple: 'bg-purple-50 border-purple-200 text-purple-600'
        }
      },
      emergencyTimelineItem: {
        comments: {
          title: 'Item de emergencia para vista timeline',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con funciones del hook'
        },
        time: {
          elapsed: 'Hace {time} min'
        },
        buttons: {
          assignUnit: 'Asignar Unidad',
          complete: 'Completar',
          addNote: '+ Nota'
        },
        status: {
          pending: 'PENDIENTE',
          completed: 'COMPLETADA'
        }
      }
    },
    external: {
      addAdminModal: {
        comments: {
          title: 'Modal para crear administrador externo',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Crear Administrador Externo',
        errors: {
          isOpenRequired: 'AddAdminModal: isOpen debe ser boolean',
          adminFormRequired: 'AddAdminModal: adminForm es requerido y debe ser un objeto',
          entitiesRequired: 'AddAdminModal: entitiesWithoutAdmin debe ser un array',
          onCloseRequired: 'AddAdminModal: onClose debe ser una función',
          onSubmitRequired: 'AddAdminModal: onSubmit debe ser una función',
          updateFormRequired: 'AddAdminModal: updateAdminForm debe ser una función',
          isLoadingRequired: 'AddAdminModal: isLoading debe ser boolean',
          isFormValidRequired: 'AddAdminModal: isFormValid debe ser una función'
        },
        fields: {
          entity: {
            label: 'Entidad *',
            placeholder: 'Selecciona una entidad',
            format: '{name} ({code})'
          },
          username: {
            label: 'Usuario *',
            placeholder: 'usuario_admin'
          },
          password: {
            label: 'Contraseña *',
            placeholder: 'Contraseña segura',
            hint: 'La contraseña se mostrará al crear el administrador'
          },
          name: {
            label: 'Nombre Completo *',
            placeholder: 'Nombre del administrador'
          },
          email: {
            label: 'Email *',
            placeholder: 'admin@entidad.com'
          },
          phone: {
            label: 'Teléfono',
            placeholder: '999-999-999'
          }
        },
        privileges: {
          title: 'Privilegios del administrador externo:',
          items: [
            'Gestionar usuarios de su entidad',
            'Ver reportes de su organización',
            'Configurar límites y restricciones',
            'No puede modificar configuración del sistema'
          ]
        },
        buttons: {
          cancel: 'Cancelar',
          submit: 'Crear Administrador',
          submitting: 'Creando...'
        }
      },
      addEntityModal: {
        comments: {
          title: 'Modal para agregar nueva entidad externa',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Nueva Entidad Externa',
        errors: {
          isOpenRequired: 'AddEntityModal: isOpen debe ser boolean',
          entityFormRequired: 'AddEntityModal: entityForm es requerido y debe ser un objeto',
          onCloseRequired: 'AddEntityModal: onClose debe ser una función',
          onSubmitRequired: 'AddEntityModal: onSubmit debe ser una función',
          updateFormRequired: 'AddEntityModal: updateEntityForm debe ser una función',
          isLoadingRequired: 'AddEntityModal: isLoading debe ser boolean',
          isFormValidRequired: 'AddEntityModal: isFormValid debe ser una función'
        },
        fields: {
          name: {
            label: 'Nombre de la Entidad *',
            placeholder: 'Ej: Banco Nacional'
          },
          code: {
            label: 'Código *',
            placeholder: 'Ej: BN'
          },
          type: {
            label: 'Tipo de Entidad *'
          },
          maxUsers: {
            label: 'Límite de Usuarios',
            placeholder: 'Sin límite'
          },
          description: {
            label: 'Descripción',
            placeholder: 'Descripción de la entidad...'
          },
          contact: {
            title: 'Información de Contacto',
            name: {
              label: 'Nombre del Contacto',
              placeholder: 'Nombre del contacto principal'
            },
            email: {
              label: 'Email del Contacto',
              placeholder: 'contacto@entidad.com'
            },
            phone: {
              label: 'Teléfono del Contacto',
              placeholder: '999-999-999'
            }
          }
        },
        buttons: {
          cancel: 'Cancelar',
          submit: 'Crear Entidad',
          submitting: 'Creando...'
        }
      },
      entityHeader: {
        comments: {
          title: 'Header de la gestión de entidades externas',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Gestión de Entidades Externas',
        subtitle: 'Configura las entidades de donde pueden venir los afiliados externos',
        errors: {
          statsRequired: 'EntityHeader: stats es requerido y debe ser un objeto',
          onOpenAddEntityRequired: 'EntityHeader: onOpenAddEntity debe ser una función',
          onOpenAddAdminRequired: 'EntityHeader: onOpenAddAdmin debe ser una función'
        },
        buttons: {
          newEntity: {
            full: 'Nueva Entidad',
            short: 'Agregar Entidad'
          },
          createAdmin: {
            full: 'Crear Admin Externo',
            short: 'Crear Admin'
          }
        },
        stats: {
          totalEntities: {
            label: 'Total Entidades',
            icon: 'fas fa-building'
          },
          activeEntities: {
            label: 'Ent. Activas',
            icon: 'fas fa-check-circle'
          },
          users: {
            label: 'Usuarios',
            icon: 'fas fa-users'
          },
          admins: {
            label: 'Admins',
            icon: 'fas fa-user-shield'
          }
        }
      },
      entityList: {
        comments: {
          title: 'Lista de entidades externas con vista desktop y móvil',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Entidades Registradas',
        errors: {
          entitiesRequired: 'EntityList: entities debe ser un array',
          onToggleStatusRequired: 'EntityList: onToggleStatus debe ser una función',
          onOpenAddAdminRequired: 'EntityList: onOpenAddAdmin debe ser una función',
          getEntityTypeIconRequired: 'EntityList: getEntityTypeIcon debe ser una función',
          getEntityTypeColorRequired: 'EntityList: getEntityTypeColor debe ser una función',
          getUsagePercentageRequired: 'EntityList: getUsagePercentage debe ser una función',
          getUsageColorClassRequired: 'EntityList: getUsageColorClass debe ser una función'
        },
        status: {
          active: 'Activa',
          inactive: 'Inactiva'
        },
        fields: {
          code: 'Código:',
          users: 'Usuarios:',
          admin: 'Admin:',
          type: 'Tipo:',
          noAdmin: 'Sin admin',
          usageLabel: 'Uso de usuarios'
        },
        buttons: {
          deactivate: 'Desactivar',
          activate: 'Activar',
          createAdmin: 'Crear Admin'
        },
        online: 'Online',
        usersFormat: '{active} / {max}'
      }
    },
    externalUsers: {
      addEntityAdminModal: {
        comments: {
          title: 'Modal para crear nueva entidad externa con administrador',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Crear Nueva Entidad Externa',
        subtitle: 'La entidad se creará junto con su administrador obligatorio',
        errors: {
          isOpenRequired: 'AddEntityAdminModal: isOpen debe ser boolean',
          entityAdminFormRequired: 'AddEntityAdminModal: entityAdminForm es requerido y debe ser un objeto',
          onCloseRequired: 'AddEntityAdminModal: onClose debe ser una función',
          onSubmitRequired: 'AddEntityAdminModal: onSubmit debe ser una función',
          updateFormRequired: 'AddEntityAdminModal: updateForm debe ser una función',
          isLoadingRequired: 'AddEntityAdminModal: isLoading debe ser boolean',
          isFormValidRequired: 'AddEntityAdminModal: isFormValid debe ser una función'
        },
        sections: {
          entity: {
            title: 'Información de la Entidad',
            fields: {
              name: {
                label: 'Nombre de la Entidad *',
                placeholder: 'Ej: Banco de la Nación'
              },
              code: {
                label: 'Código de Entidad *',
                placeholder: 'Ej: BN, BCR, RIMAC'
              },
              type: {
                label: 'Tipo de Entidad *'
              }
            }
          },
          admin: {
            title: 'Administrador de la Entidad (Obligatorio)',
            fields: {
              name: {
                label: 'Nombre Completo del Administrador *',
                placeholder: 'Nombre y apellidos del administrador'
              },
              username: {
                label: 'Usuario de Acceso *',
                placeholder: 'usuario_admin'
              },
              password: {
                label: 'Contraseña *',
                placeholder: 'Contraseña segura',
                hint: 'La contraseña se mostrará al crear el administrador'
              },
              email: {
                label: 'Email Corporativo *',
                placeholder: 'admin@entidad.com'
              },
              phone: {
                label: 'Teléfono de Contacto',
                placeholder: '999-999-999'
              }
            }
          }
        },
        note: {
          title: 'Importante:',
          text: 'Una vez creada la entidad con su administrador, el administrador podrá agregar usuarios adicionales desde su panel de control.'
        },
        buttons: {
          cancel: 'Cancelar',
          submit: 'Crear Entidad y Administrador',
          submitting: 'Creando...'
        }
      },
      hierarchicalView: {
        comments: {
          title: 'Vista jerárquica de entidades externas con usuarios',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          entitiesRequired: 'HierarchicalView: entities debe ser un array',
          expandedEntityRequired: 'HierarchicalView: expandedEntity debe ser string o null',
          onToggleExpansionRequired: 'HierarchicalView: onToggleExpansion debe ser una función',
          onToggleUserStatusRequired: 'HierarchicalView: onToggleUserStatus debe ser una función',
          getEntityIconRequired: 'HierarchicalView: getEntityIcon debe ser una función',
          getEntityColorRequired: 'HierarchicalView: getEntityColor debe ser una función',
          getUserStatusColorRequired: 'HierarchicalView: getUserStatusColor debe ser una función',
          getUserStatusTextRequired: 'HierarchicalView: getUserStatusText debe ser una función'
        },
        fields: {
          code: 'Código: {code}',
          users: 'Usuarios',
          active: 'Activos',
          monthlyServices: 'Servicios/Mes',
          lastAccess: 'Último acceso: {date}',
          services: 'Servicios: {count}'
        },
        sections: {
          admin: {
            title: 'Administrador de Entidad',
            status: {
              active: 'Activo',
              inactive: 'Inactivo'
            },
            noAdmin: {
              error: 'Error: Entidad sin administrador',
              contact: 'Contacte al administrador del sistema'
            }
          },
          users: {
            title: 'Usuarios ({count})',
            noUsers: 'No hay usuarios registrados',
            noAdminError: 'Error: La entidad no tiene administrador',
            registerInfo: 'Los usuarios externos se registran directamente desde el aplicativo'
          }
        },
        buttons: {
          deactivate: 'Desactivar',
          activate: 'Activar',
          edit: 'Editar'
        }
      },
      usersHeader: {
        comments: {
          title: 'Header de la gestión de usuarios de entidades externas',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        title: 'Gestión de Entidades Externas',
        subtitle: 'Administración jerárquica de entidades, administradores y usuarios',
        errors: {
          globalStatsRequired: 'UsersHeader: globalStats es requerido y debe ser un objeto',
          viewModeRequired: 'UsersHeader: viewMode debe ser un string',
          searchTermRequired: 'UsersHeader: searchTerm debe ser un string',
          onToggleViewModeRequired: 'UsersHeader: onToggleViewMode debe ser una función',
          onOpenAddEntityRequired: 'UsersHeader: onOpenAddEntity debe ser una función',
          onSearchChangeRequired: 'UsersHeader: onSearchChange debe ser una función'
        },
        buttons: {
          viewMode: {
            list: 'Vista Lista',
            hierarchical: 'Vista Jerárquica'
          },
          newEntity: 'Nueva Entidad'
        },
        stats: {
          entities: 'Entidades',
          admins: 'Administradores',
          totalUsers: 'Usuarios Totales',
          activeUsers: 'Usuarios Activos',
          monthlyServices: 'Servicios/Mes'
        },
        search: {
          placeholder: 'Buscar por entidad, administrador, usuario o código...'
        }
      }
    },
    map: {
      assignmentControls: {
        comments: {
          title: 'Componente de controles de asignación',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          handleAssignUnitRequired: 'AssignmentControls: handleAssignUnit debe ser una función',
          clearSelectionsRequired: 'AssignmentControls: clearSelections debe ser una función'
        },
        readyToAssign: {
          title: 'Listo para Asignar',
          emergency: 'Emergencia:',
          unit: 'Unidad:'
        },
        emergencySelected: {
          title: 'Emergencia Seleccionada',
          instruction: 'Seleccione una unidad disponible para asignar'
        },
        unitSelected: {
          title: 'Unidad Seleccionada',
          instruction: 'Seleccione una emergencia para asignar'
        },
        button: {
          assign: 'Asignar'
        }
      },
      emergencyMarkers: {
        comments: {
          title: 'Componente de marcadores de emergencias',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          emergenciesArray: 'EmergencyMarkers: emergencies debe ser un array',
          getEmergencyIconFunction: 'EmergencyMarkers: getEmergencyIcon debe ser una función',
          handleEmergencyClickFunction: 'EmergencyMarkers: handleEmergencyClick debe ser una función',
          handleSetArrivalTimeFunction: 'EmergencyMarkers: handleSetArrivalTime debe ser una función',
          getPriorityClassFunction: 'EmergencyMarkers: getPriorityClass debe ser una función'
        },
        popup: {
          labels: {
            patient: 'Paciente:',
            description: 'Descripción:',
            location: 'Ubicación:',
            time: 'Tiempo:'
          },
          timeUnit: ' min',
          buttons: {
            setArrivalTime: 'Establecer Tiempo de Llegada',
            selectForAssignment: 'Seleccionar para Asignación'
          }
        }
      },
      mapController: {
        comments: {
          title: 'Controlador para eventos del mapa',
          approach: 'ENFOQUE BALANCEADO: Solo manejo de eventos simples'
        },
        errors: {
          onMapClickFunction: 'MapController: onMapClick debe ser una función'
        }
      },
      mapInstructions: {
        comments: {
          title: 'Componente de instrucciones del mapa',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con contenido estático'
        },
        title: 'Instrucciones',
        steps: {
          step1: '1. Haga clic en una emergencia (rojo/amarillo/verde)',
          step2: '2. Haga clic en una unidad disponible (verde)',
          step3: '3. Confirme la asignación en el panel superior',
          step4: '4. La unidad cambiará a estado "En Camino"'
        }
      },
      mapLegend: {
        comments: {
          title: 'Componente de leyenda del mapa',
          approach: 'ENFOQUE BALANCEADO: Solo presentación y clases estáticas'
        },
        title: 'Leyenda del Mapa',
        sections: {
          emergencies: {
            title: 'Emergencias Pendientes',
            priorities: {
              high: 'Alta Prioridad',
              medium: 'Media Prioridad',
              low: 'Baja Prioridad'
            }
          },
          units: {
            title: 'Unidades Médicas',
            status: {
              available: 'Disponible',
              onWay: 'En Camino',
              onSite: 'En Sitio'
            }
          }
        }
      },
      mapStats: {
        comments: {
          title: 'Componente de estadísticas del mapa',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con cálculos locales simples'
        },
        title: 'Estadísticas Rápidas',
        errors: {
          pendingEmergenciesArray: 'MapStats: pendingEmergencies debe ser un array',
          availableUnitsArray: 'MapStats: availableUnits debe ser un array',
          busyUnitsArray: 'MapStats: busyUnits debe ser un array',
          totalUnitsNumber: 'MapStats: totalUnits debe ser un número'
        },
        stats: {
          pendingEmergencies: 'Emergencias Pendientes:',
          availableUnits: 'Unidades Disponibles:',
          busyUnits: 'Unidades Ocupadas:',
          totalUnits: 'Total Unidades:'
        }
      },
      unitMarkers: {
        comments: {
          title: 'Componente de marcadores de unidades médicas',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          availableUnitsArray: 'UnitMarkers: availableUnits debe ser un array',
          busyUnitsArray: 'UnitMarkers: busyUnits debe ser un array',
          getUnitIconFunction: 'UnitMarkers: getUnitIcon debe ser una función',
          getUnitStatusClassFunction: 'UnitMarkers: getUnitStatusClass debe ser una función'
        },
        popup: {
          status: {
            available: 'DISPONIBLE',
            enRoute: 'EN CAMINO',
            onSite: 'EN SITIO',
            enRouteText: 'En camino',
            onSiteText: 'En sitio'
          },
          labels: {
            driver: 'Conductor:',
            type: 'Tipo:',
            plate: 'Placa:',
            services: 'Servicios:',
            completed: ' completados',
            status: 'Estado:'
          },
          button: {
            selectForAssignment: 'Seleccionar para Asignación'
          }
        }
      }
    },
    reports: {
      financialReport: {
        title: 'Gestión Financiera',
        tabs: {
          dashboard: 'Dashboard',
          transactions: 'Transacciones',
          pending: 'Pendientes',
          analysis: 'Análisis'
        },
        buttons: {
          registerManual: 'Registrar Ingreso Manual',
          excel: 'Excel',
          pdf: 'PDF'
        },
        metrics: {
          totalRevenue: {
            title: 'Ingresos Totales',
            subtitle: 'Acumulado total'
          },
          monthlyRevenue: {
            title: 'Ingresos del Mes',
            subtitle: 'Mes actual'
          },
          todayRevenue: {
            title: 'Ingresos Hoy',
            subtitle: 'Día actual'
          },
          averageTransaction: {
            title: 'Transacción Promedio',
            subtitle: 'Por transacción'
          },
          growth: {
            title: 'Crecimiento',
            subtitle: 'Mensual',
            noData: 'Sin datos'
          }
        },
        revenueByType: {
          title: 'Ingresos por Tipo',
          types: {
            subscription: 'Plan Familiar',
            additional: 'Servicio Adicional',
            corporate: 'Contrato Corporativo',
            particular: 'Particular',
            manual: 'Manual'
          }
        },
        transactions: {
          title: 'Últimas Transacciones',
          subtitle: 'Mostrando las 10 más recientes',
          headers: {
            date: 'Fecha',
            concept: 'Concepto',
            type: 'Tipo',
            amount: 'Monto',
            status: 'Estado'
          },
          defaultConcept: 'Servicio médico',
          types: {
            subscription: 'Plan Familiar',
            additional: 'Adicional',
            corporate: 'Corporativo',
            particular: 'Particular',
            manual: 'Manual'
          },
          status: {
            completed: 'Completado',
            pending: 'Pendiente',
            cancelled: 'Cancelado'
          },
          empty: 'No hay transacciones registradas'
        },
        indicator: {
          online: 'Online'
        },
        modals: {
          registerManual: {
            title: 'Registrar Ingreso Manual',
            fields: {
              concept: {
                label: 'Concepto',
                placeholder: 'Ej: Pago de servicio'
              },
              amount: {
                label: 'Monto (S/)',
                placeholder: '0.00'
              },
              type: {
                label: 'Tipo',
                options: {
                  manual: 'Manual',
                  subscription: 'Plan Familiar',
                  additional: 'Servicio Adicional',
                  corporate: 'Corporativo',
                  particular: 'Particular'
                }
              }
            },
            buttons: {
              register: 'Registrar',
              cancel: 'Cancelar'
            },
            validation: 'Por favor completa todos los campos',
            success: {
              title: 'Registrado',
              message: 'El ingreso ha sido registrado exitosamente'
            }
          },
          exportExcel: {
            title: 'Exportando a Excel',
            message: 'El archivo se descargará en breve...'
          },
          exportPDF: {
            title: 'Exportando a PDF',
            message: 'El archivo se descargará en breve...'
          }
        }
      },
      geographyReport: {
        title: 'Análisis Geográfico',
        subtitle: 'Distribución de servicios y cobertura por zonas de Lima Metropolitana',
        kpis: {
          totalUsers: 'Usuarios Totales',
          emergencies: 'Emergencias',
          averageTime: 'Tiempo Promedio',
          coverage: 'Cobertura',
          coveredZones: 'Zonas Cubiertas',
          vsLastMonth: '↑ {percentage}% vs mes anterior',
          units: '{available}/{total} unidades',
          limaMetro: '100% Lima Metro'
        },
        performance: {
          excellent: '✓ Excelente',
          improvable: '⚠ Mejorable'
        },
        executive: {
          title: 'Resumen Ejecutivo',
          subtitle: 'Principales métricas y tendencias geográficas',
          cards: {
            leader: {
              title: 'Distrito Líder',
              description: '{district} con {count} usuarios',
              percentage: '{percentage}% del total'
            },
            fastest: {
              title: 'Respuesta Más Rápida',
              description: '{district}: {time} min promedio',
              percentage: '{percentage}% bajo objetivo'
            },
            opportunity: {
              title: 'Oportunidad',
              description: '{district} necesita refuerzo',
              average: '{time} min promedio'
            }
          }
        },
        serviceTrend: {
          title: 'Tendencia de Servicios',
          legend: {
            emergencies: 'Emergencias',
            urgencies: 'Urgencias',
            homeVisits: 'Domicilio',
            transfers: 'Traslados'
          },
          tooltips: {
            emergencies: 'Emergencias: {count}',
            urgencies: 'Urgencias: {count}',
            homeVisits: 'Médico Domicilio: {count}',
            transfers: 'Traslado Programado: {count}'
          },
          periods: {
            days30: 'Hace 30 días',
            days25: 'Hace 25 días',
            days20: 'Hace 20 días',
            days15: 'Hace 15 días',
            days10: 'Hace 10 días',
            days5: 'Hace 5 días',
            today: 'Hoy',
            months3: 'Hace 3 meses',
            months2: 'Hace 2 meses',
            lastMonth: 'Mes pasado',
            thisMonth: 'Este mes'
          }
        },
        userGrowth: {
          title: 'Crecimiento de Usuarios',
          periods: {
            months3: 'Hace 3m',
            months2: 'Hace 2m',
            lastMonth: 'Pasado',
            current: 'Actual'
          },
          trend: 'tendencia'
        },
        districtAnalysis: {
          title: 'Análisis Integral por Distrito',
          subtitle: 'Servicios solicitados, usuarios y métricas operativas',
          overview: 'Vista general',
          filters: {
            label: 'Filtro:',
            all: 'Todos',
            north: 'Norte',
            center: 'Centro', 
            south: 'Sur'
          },
          cards: {
            totalServices: 'Total Servicios',
            totalUsers: 'Total Usuarios',
            totalEmergencies: 'Total Emergencias',
            averageResponse: 'Promedio Respuesta',
            shortAvgResponse: 'Prom. Resp.'
          },
          districts: {
            miraflores: 'Miraflores',
            sanIsidro: 'San Isidro',
            surco: 'Surco',
            sanBorja: 'San Borja',
            laMolina: 'La Molina',
            barranco: 'Barranco',
            jesusMaria: 'Jesús María',
            magdalena: 'Magdalena',
            lince: 'Lince',
            callao: 'Callao',
            sanMiguel: 'San Miguel',
            limaCenter: 'Lima Centro'
          },
          services: {
            emergenciesToday: 'Emergencias hoy',
            urgenciesToday: 'Urgencias hoy',
            homeVisitsToday: 'Domicilio hoy',
            transfersToday: 'Traslados hoy',
            totalEmergencies: 'Total Emergencias',
            shortEmergencies: 'Emergencias'
          },
          empty: 'No hay datos disponibles'
        },
        registrationAnalysis: {
          title: 'Análisis de Registros y Solicitudes',
          userStatus: {
            title: 'Estado de Usuarios Registrados',
            total: 'Total registrados',
            growth: 'Crecimiento',
            lastRegistrations: 'Últimos registros'
          },
          requestStatus: {
            title: 'Estado de Solicitudes de Registro',
            pending: 'Pendientes',
            approved: 'Aprobadas',
            rejected: 'Rechazadas',
            created: 'Usuarios creados',
            notProcessed: 'No procesadas',
            requireReview: 'Requieren revisión'
          },
          planRequests: {
            title: 'Solicitudes por Tipo de Plan',
            familiar: 'Familiar',
            corporate: 'Corporativo',
            external: 'Externo',
            protectedArea: 'Área Protegida'
          }
        },
        planAnalysis: {
          title: 'Análisis Detallado por Plan',
          summary: 'Resumen por Tipo de Plan',
          headers: {
            planType: 'Tipo de Plan',
            users: 'Usuarios',
            servicesUsed: 'Servicios Usados',
            annualRevenue: 'Ingresos Anuales',
            utilization: 'Utilización'
          },
          plans: {
            familiar: 'Planes Familiares',
            corporate: 'Planes Corporativos',
            external: 'Usuarios Externos',
            unknown: 'Plan Desconocido'
          },
          stats: {
            users: '{count} usuario(s)',
            employees: '{count} empleados',
            services: '{used} de {total} usados',
            utilization: '{percentage}%',
            noData: 'No hay datos de planes disponibles'
          }
        },
        activeUsers: {
          title: 'Usuarios Más Activos',
          headers: {
            user: 'Usuario',
            type: 'Tipo',
            plan: 'Plan',
            status: 'Estado',
            memberSince: 'Miembro desde'
          },
          userTypes: {
            user: 'Usuario',
            company: 'Empresa',
            ambulance: 'Ambulancia',
            admin: 'Admin'
          },
          status: {
            active: 'Activo',
            inactive: 'Inactivo'
          },
          noPlan: 'Sin plan',
          empty: 'No se encontraron usuarios con actividad en el período seleccionado.'
        },
        userDistribution: {
          title: 'Distribución de Usuarios',
          byType: 'Distribución por Tipo',
          noUsers: 'No hay usuarios registrados'
        },
        serviceUtilization: {
          title: 'Utilización de Servicios',
          distribution: 'Distribución de Servicios',
          byPlan: 'Utilización por Plan',
          planHelp: 'Plan Help',
          noServices: 'No hay servicios registrados',
          noData: 'No hay datos de servicios disponibles'
        },
        responseTime: {
          title: 'Análisis Tiempos Respuesta',
          times: 'Tiempos de Respuesta',
          bySchedule: 'Análisis por Horarios',
          average: 'Promedio',
          minimum: 'Mínimo',
          maximum: 'Máximo',
          total: 'Total',
          percentage: '{percentage}% respuestas rápidas (< 10 min)',
          schedules: {
            dawn: 'Madrugada (00-06)',
            morning: 'Mañana (06-12)',
            afternoon: 'Tarde (12-18)',
            night: 'Noche (18-24)'
          },
          noData: 'Sin datos de emergencias completadas'
        },
        unitUtilization: {
          title: 'Utilización de Unidades',
          distribution: 'Distribución de Unidades',
          status: {
            available: 'Disponible',
            enRoute: 'En Ruta',
            busy: 'Ocupada',
            offDuty: 'Fuera de Servicio',
            maintenance: 'Mantenimiento'
          },
          noUnits: 'No hay unidades registradas',
          locationUnavailable: 'Ubicación no disponible',
          unitUnspecified: 'Unidad no especificada'
        },
        coverage: {
          title: 'Métricas de Cobertura',
          normal: 'Utilización Normal',
          high: 'Utilización Alta',
          critical: 'Utilización Crítica',
          low: 'Utilización Baja',
          available: 'Disponible',
          inUse: 'En Uso',
          capacity: 'Capacidad',
          gap: 'Brecha de Cobertura',
          statusTitle: 'Estatus de Cobertura',
          optimal: '✓ Cobertura óptima alcanzada',
          needsMore: '⚠ Se requieren {count} unidades adicionales para cobertura óptima',
          coverageLabel: 'Cobertura: {districts}'
        },
        emergencyDensity: {
          title: 'Densidad de Emergencias por Horario',
          moreEmergencies: 'más emergencias',
          insight: 'Insight',
          peakPeriod: '{period} es el período de mayor actividad',
          basedOn: 'Basado en {count} emergencias completadas',
          averageTime: 'Tiempo promedio: {time} minutos'
        },
        alerts: {
          title: 'Alertas de Performance',
          allGood: {
            title: 'Todo Normal',
            message: 'Sistema funcionando correctamente',
            description: 'Todas las métricas de performance están dentro de los objetivos establecidos'
          },
          critical: 'Crítico',
          warning: 'Advertencia',
          responseTimeCritical: {
            title: 'Tiempo de respuesta crítico',
            description: '{district} excede significativamente el objetivo'
          },
          responseTimeHigh: {
            title: 'Tiempo de respuesta elevado',
            description: '{district} cerca del límite objetivo'
          },
          satisfactionLow: {
            title: 'Satisfacción por debajo del objetivo',
            description: 'basado en {count} encuestas'
          },
          satisfactionNoData: 'No hay suficientes encuestas para evaluar',
          unitsLow: {
            title: 'Disponibilidad de unidades baja',
            description: 'Solo {count} unidades operativas'
          },
          actionRequired: 'Acción Requerida',
          pendingRequests: 'Hay {count} solicitud(es) de registro pendiente(s) que requieren revisión'
        },
        system: {
          currentStatus: 'Estado actual del sistema',
          noActivity: 'Sin actividad',
          unlimited: 'ILIMITADO'
        },
        actions: {
          download: 'Descargar',
          expand: 'Expandir'
        },
        months: {
          jan: 'Ene',
          feb: 'Feb',
          mar: 'Mar',
          apr: 'Abr',
          may: 'May',
          jun: 'Jun',
          jul: 'Jul',
          aug: 'Ago',
          sep: 'Sep',
          oct: 'Oct',
          nov: 'Nov',
          dec: 'Dic'
        },
        weeks: {
          week1: 'Sem 1',
          week2: 'Sem 2',
          week3: 'Sem 3',
          week4: 'Sem 4'
        },
        units: {
          minutes: 'min',
          currency: 'S/',
          employees: 'empleados',
          unitsNeeded: 'unidades necesarias'
        }
      },
      reportsAnalytics: {
        title: 'Reportes y Analytics',
        loading: 'Cargando reporte...',
        dateRange: {
          startLabel: 'Fecha de inicio',
          endLabel: 'Fecha de fin',
          last30Days: 'Últimos 30 días',
          selectPeriod: 'Seleccionar período'
        },
        export: {
          pdf: 'PDF',
          excel: 'Excel',
          pdfTitle: 'PDF Preparado',
          pdfMessage: 'Se ha abierto una nueva ventana. Presiona Ctrl+P para imprimir o guardar como PDF',
          excelTitle: 'Excel Generado',
          excelMessage: 'El archivo Excel ha sido descargado exitosamente',
          printButton: '🖨️ Imprimir/Guardar como PDF',
          closeButton: '❌ Cerrar'
        },
        reportTitles: {
          overview: 'Resumen General',
          users: 'Usuarios',
          services: 'Servicios',
          performance: 'Performance',
          geography: 'Geografía',
          finanzas: 'Finanzas',
          surveys: 'Encuestas de Calidad',
          default: 'Reporte'
        },
        tabs: {
          overview: {
            label: 'Resumen General',
            short: 'Resumen',
            icon: 'fas fa-chart-pie'
          },
          users: {
            label: 'Usuarios',
            short: 'Usuarios',
            icon: 'fas fa-users'
          },
          services: {
            label: 'Servicios',
            short: 'Servicios',
            icon: 'fas fa-ambulance'
          },
          performance: {
            label: 'Performance',
            short: 'Performance',
            icon: 'fas fa-tachometer-alt'
          },
          geography: {
            label: 'Geografía',
            short: 'Geografía',
            icon: 'fas fa-map-marked-alt'
          },
          finanzas: {
            label: 'Finanzas',
            short: 'Finanzas',
            icon: 'fas fa-coins'
          },
          surveys: {
            label: 'Encuestas de Calidad',
            short: 'Encuestas',
            icon: 'fas fa-poll'
          }
        },
        pdfTemplate: {
          title: 'Reporte {reportTitle} - HelpMED',
          period: 'Período:',
          generationDate: 'Fecha de generación:',
          system: 'Sistema:',
          systemName: 'HelpMED - Plataforma de Emergencias Médicas',
          contentLabel: 'Contenido del reporte {reportTitle}'
        },
        excelTemplate: {
          headers: {
            metric: 'Métrica',
            value: 'Valor',
            change: 'Cambio'
          },
          sampleData: {
            totalUsers: 'Total Usuarios',
            completedServices: 'Servicios Completados',
            totalRevenue: 'Ingresos Totales'
          }
        }
      },
      overviewReport: {
        comments: {
          title: 'Componente para el reporte Overview (Vista General)',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
            rule2: 'Siguiendo Regla #2: Solo presentación, lógica en hook'
          }
        },
        loading: 'Generando vista general...',
        noData: {
          title: 'Sin datos disponibles',
          message: 'No hay información suficiente para generar la vista general.'
        },
        metrics: {
          totalUsers: 'Usuarios Totales',
          servicesProvided: 'Servicios Prestados',
          totalRevenue: 'Ingresos Totales',
          satisfaction: 'Satisfacción',
          surveys: '{count} encuestas',
          vsPreviousPeriod: '{sign}{value}% vs período anterior'
        },
        kpis: {
          title: 'KPIs Operacionales',
          responseTime: {
            label: 'Tiempo Promedio Respuesta',
            objective: 'Objetivo: < 15 min',
            unit: '{time} min'
          },
          successRate: {
            label: 'Tasa de Éxito',
            objective: 'Objetivo: > 95%',
            unit: '{percentage}%'
          },
          customerSatisfaction: {
            label: 'Satisfacción Cliente',
            objective: 'Objetivo: > 4.0',
            unit: '{rating}/5.0'
          },
          status: {
            achieved: 'Cumplido',
            notAchieved: 'No cumplido',
            monitoring: 'En seguimiento'
          }
        },
        serviceDistribution: {
          title: 'Distribución de Servicios',
          types: {
            emergency: 'Emergencias',
            scheduled: 'Citas Programadas',
            transfer: 'Traslados',
            consultation: 'Consultas'
          },
          chartPlaceholder: 'Gráfico circular disponible en la exportación PDF'
        },
        export: {
          title: 'Exportar Reporte',
          pdf: 'Descargar PDF',
          excel: 'Descargar Excel'
        }
      },
      overviewReportSimple: {
        kpis: {
          totalUsers: 'Total Usuarios',
          activeEmergencies: 'Emergencias Activas',
          totalRevenue: 'Ingresos Totales',
          completedServices: 'Servicios Completados'
        },
        systemStatus: {
          title: 'Estado del Sistema',
          userTypes: 'Tipos de Usuario',
          totalTransactions: 'Total Transacciones',
          completedEmergencies: 'Emergencias Completadas'
        }
      },
      performanceReport: {
        metrics: {
          titles: {
            responseTime: 'Tiempo Respuesta',
            satisfaction: 'Satisfacción',
            availability: 'Disponibilidad',
            unitAvailability: 'Disponibilidad Unidades'
          },
          targets: {
            responseTime: '< 10 min',
            satisfaction: '> 90%',
            availability: '> 90%'
          },
          targetPrefix: 'Objetivo: ',
          noData: 'Sin datos disponibles',
          basedOnServices: 'Basado en {count} servicios',
          noSurveys: 'Sin encuestas disponibles'
        },
        responseTimeAnalysis: {
          title: 'Análisis de Tiempos de Respuesta',
          noCompletedEmergencies: 'Sin datos de emergencias completadas',
          timeRanges: {
            veryFast: '< 5 min',
            fast: '5-10 min',
            moderate: '10-15 min',
            slow: '> 15 min'
          },
          statistics: {
            average: 'Promedio',
            minimum: 'Mínimo',
            maximum: 'Máximo'
          },
          emergenciesAnalyzed: '{count} emergencias analizadas'
        },
        unitUtilization: {
          title: 'Utilización de Unidades',
          availabilityPrefix: 'Disponibilidad: ',
          statusLabels: {
            available: 'Disponible',
            enRoute: 'En Ruta',
            busy: 'Ocupada',
            outOfService: 'Fuera de Servicio'
          },
          summary: {
            operationalUnits: '{active}/{total} unidades operativas',
            activeUnits: '{active}/{total} unidades activas',
            unitsLabel: 'unidades',
            currentUtilization: 'Utilización actual: {utilization}%'
          },
          categories: {
            totalUnits: 'Total Unidades',
            operational: 'Operativas',
            inService: 'En Servicio'
          },
          noUnitsAvailable: 'Sin unidades disponibles'
        },
        performanceAlerts: {
          title: 'Alertas de Performance',
          status: {
            normal: 'Todo Normal',
            critical: 'Crítico',
            warning: 'Advertencia'
          },
          alerts: {
            criticalResponseTime: {
              title: 'Tiempo de respuesta crítico',
              message: 'Promedio actual: {value}, excede significativamente el objetivo'
            },
            elevatedResponseTime: {
              title: 'Tiempo de respuesta elevado',
              message: 'Promedio actual: {value}, cerca del límite objetivo'
            },
            lowSatisfaction: {
              title: 'Satisfacción por debajo del objetivo',
              message: 'No hay suficientes encuestas para evaluar'
            },
            lowAvailability: {
              title: 'Disponibilidad de unidades baja',
              message: 'Solo {active} de {total} unidades operativas'
            },
            systemNormal: {
              title: 'Sistema funcionando correctamente',
              message: 'Todas las métricas de performance están dentro de los objetivos establecidos'
            }
          }
        }
      },
      servicesReport: {
        serviceMetricCard: {
          total: 'Total:',
          completed: 'Completados:',
          inProgress: 'En progreso:'
        },
        serviceTypes: {
          emergencies: 'Emergencias',
          homeDoctor: 'Médico Domicilio',
          urgencies: 'Urgencias',
          transfers: 'Traslados',
          medicalHome: 'Médico a Domicilio'
        },
        serviceDistribution: {
          title: 'Distribución de Servicios',
          totalServices: 'Total Servicios Utilizados',
          noServices: 'No hay servicios registrados'
        },
        utilizationByPlan: {
          title: 'Utilización por Plan',
          users: '{count} usuario(s)',
          utilization: 'Utilización',
          used: '{used} usados',
          total: '{total} total',
          noData: 'No hay datos de planes disponibles'
        },
        detailedAnalysis: {
          title: 'Análisis Detallado por Plan',
          headers: {
            plan: 'Plan',
            users: 'Usuarios',
            emergencies: 'Emergencias',
            urgencies: 'Urgencias',
            homeVisits: 'Domicilio',
            transfers: 'Traslados'
          },
          planTypes: {
            familiar: 'Familiar',
            corporate: 'Corporativo',
            protectedArea: 'Área Protegida',
            unknown: 'Plan Desconocido'
          },
          noData: 'No hay datos para analizar',
          notAvailable: 'N/A'
        }
      },
      usersReport: {
        title: 'Reporte de Usuarios',
        filters: {
          title: 'Filtros de Usuario',
          types: {
            all: 'Todos los tipos',
            familiar: 'Solo Familiares',
            corporate: 'Solo Corporativos'
          }
        },
        userRegistrationChart: {
          title: 'Análisis de Registros y Solicitudes',
          systemStatus: 'Estado actual del sistema',
          userRegistrationStatus: {
            title: 'Estado de Usuarios Registrados',
            active: 'Usuarios Activos',
            inactive: 'Usuarios Inactivos',
            percentOfTotal: '% del total'
          },
          registrationRequestStatus: {
            title: 'Estado de Solicitudes de Registro',
            pending: 'Pendientes',
            approved: 'Aprobadas',
            rejected: 'Rechazadas',
            description: {
              pending: 'Requieren revisión',
              approved: 'Usuarios creados',
              rejected: 'No procesadas'
            }
          },
          requestsByPlanType: {
            title: 'Solicitudes por Tipo de Plan',
            planTypes: {
              familiar: 'Familiar',
              corporate: 'Corporativo',
              external: 'Externo'
            }
          },
          actionRequired: {
            title: 'Acción Requerida',
            message: 'Hay {count} solicitud(es) de registro pendiente(s) que requieren revisión.'
          }
        },
        activeUsersTable: {
          title: 'Usuarios Más Activos',
          filter: {
            label: 'Filtro: ',
            all: 'Todos'
          },
          headers: {
            user: 'Usuario',
            type: 'Tipo',
            plan: 'Plan',
            servicesUsed: 'Servicios Usados',
            utilization: 'Utilización',
            status: 'Estado',
            memberSince: 'Miembro desde'
          },
          status: {
            active: 'Activo',
            inactive: 'Inactivo'
          },
          pagination: {
            employees: 'empleados',
            ofTotal: 'de {total}'
          },
          noActiveUsers: {
            title: 'No hay usuarios activos',
            description: 'No se encontraron usuarios con actividad en el período seleccionado.'
          },
          summaryStats: {
            totalServicesUsed: 'Servicios Totales Usados',
            averageUtilization: 'Utilización Promedio',
            activeUsers: 'Usuarios Activos'
          },
          planTypes: {
            noPlan: 'Sin plan',
            protectedArea: 'Área Protegida'
          },
          userTypes: {
            user: 'Usuario',
            company: 'Empresa'
          },
          noActivity: 'Sin actividad'
        }
      }
    },
    revenue: {
      financialDashboard: {
        comments: {
          title: 'Componente para el dashboard financiero con KPIs principales',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
            rule2: 'Siguiendo Regla #2: Solo presentación, datos del hook'
          }
        },
        kpis: {
          totalRevenue: {
            title: 'Ingresos Totales',
            subtitle: 'Acumulado total'
          },
          monthlyRevenue: {
            title: 'Ingresos del Mes',
            subtitle: 'Mes actual'
          },
          dailyRevenue: {
            title: 'Ingresos Hoy',
            subtitle: 'Día actual'
          },
          averageTransaction: {
            title: 'Transacción Promedio',
            subtitle: 'Por transacción'
          }
        },
        sections: {
          transactionTypes: {
            title: 'Ingresos por Tipo de Transacción'
          },
          trends: {
            title: 'Tendencia de Ingresos (Últimos 6 Meses)',
            transactions: '{count} trans.'
          },
          transactionStatus: {
            completed: 'Completadas',
            pending: 'Pendientes',
            failed: 'Fallidas'
          }
        },
        transactionTypes: {
          service_payment: 'Pago de Servicio',
          plan_payment: 'Pago de Plan',
          additional_fee: 'Tarifa Adicional',
          refund: 'Reembolso',
          adjustment: 'Ajuste',
          consultation_fee: 'Consulta Médica',
          emergency_fee: 'Emergencia',
          transfer_fee: 'Traslado',
          insurance_payment: 'Seguro',
          other: 'Otro'
        }
      },
      transactionModal: {
        comments: {
          title: 'Modal para agregar/editar transacciones',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
            rule4: 'Siguiendo Regla #4: Validación completa de inputs'
          }
        },
        title: {
          edit: 'Editar Transacción',
          new: 'Nueva Transacción'
        },
        fields: {
          concept: {
            label: 'Concepto *',
            placeholder: 'Descripción de la transacción'
          },
          amount: {
            label: 'Monto (S/) *',
            placeholder: '0.00'
          },
          transactionType: {
            label: 'Tipo de Transacción *'
          },
          clientName: {
            label: 'Nombre del Cliente',
            placeholder: 'Nombre completo del cliente'
          },
          companyName: {
            label: 'Nombre de la Empresa',
            placeholder: 'Razón social o empresa'
          },
          paymentMethod: {
            label: 'Método de Pago'
          },
          notes: {
            label: 'Notas Adicionales',
            placeholder: 'Información adicional sobre la transacción (opcional)'
          }
        },
        transactionTypes: {
          service_payment: 'Pago de Servicio',
          plan_payment: 'Pago de Plan',
          additional_fee: 'Tarifa Adicional',
          consultation_fee: 'Consulta Médica',
          emergency_fee: 'Servicio de Emergencia',
          transfer_fee: 'Traslado',
          insurance_payment: 'Pago de Seguro',
          refund: 'Reembolso',
          adjustment: 'Ajuste',
          other: 'Otro'
        },
        paymentMethods: {
          cash: 'Efectivo',
          card: 'Tarjeta',
          transfer: 'Transferencia',
          check: 'Cheque',
          digital: 'Pago Digital',
          insurance: 'Seguro',
          other: 'Otro'
        },
        errors: {
          conceptRequired: 'El concepto es requerido',
          conceptMinLength: 'El concepto debe tener al menos 3 caracteres',
          amountRequired: 'El monto es requerido',
          amountMinValue: 'El monto debe ser mayor a 0',
          amountMaxValue: 'El monto no puede exceder S/ 50,000',
          typeRequired: 'El tipo de transacción es requerido',
          clientRequired: 'Debe especificar un cliente o empresa'
        },
        buttons: {
          cancel: 'Cancelar',
          update: 'Actualizar',
          register: 'Registrar',
          transaction: 'Transacción'
        }
      },
      transactionsList: {
        comments: {
          title: 'Componente para la lista de transacciones con filtros',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
            rule2: 'Siguiendo Regla #2: Solo presentación, lógica delegada'
          }
        },
        filters: {
          title: 'Filtros de Búsqueda',
          fields: {
            from: 'Desde',
            to: 'Hasta',
            type: 'Tipo',
            status: 'Estado',
            search: 'Búsqueda'
          },
          placeholders: {
            search: 'Buscar por concepto, cliente...'
          },
          options: {
            allTypes: 'Todos los tipos',
            allStatuses: 'Todos los estados'
          },
          clearFilters: 'Limpiar filtros',
          transactionsFound: '{count} transacciones encontradas'
        },
        transactionTypes: {
          service_payment: 'Pago de Servicio',
          plan_payment: 'Pago de Plan',
          additional_fee: 'Tarifa Adicional',
          refund: 'Reembolso',
          adjustment: 'Ajuste'
        },
        statuses: {
          completed: 'Completado',
          pending: 'Pendiente',
          failed: 'Fallido',
          cancelled: 'Cancelado'
        },
        list: {
          title: 'Transacciones',
          loading: {
            title: 'Cargando...',
            message: 'Obteniendo transacciones'
          },
          empty: {
            title: 'No hay transacciones',
            message: 'No se encontraron transacciones con los filtros seleccionados.'
          },
          headers: {
            date: 'Fecha',
            concept: 'Concepto',
            client: 'Cliente',
            type: 'Tipo',
            amount: 'Monto',
            status: 'Estado',
            actions: 'Acciones'
          },
          actions: {
            edit: 'Editar transacción',
            delete: 'Eliminar transacción'
          }
        }
      }
    },
    shared: {
      adminHeader: {
        comments: {
          title: 'Header del dashboard de administrador',
          approach: 'COMPONENTE UI PURO - Solo presentación, CERO lógica (Regla #2)',
          logic: 'Toda la lógica está en useAdminHeader',
          optimization: 'Optimizado con React.memo (Regla #13)',
          size: 'Menos de 200 líneas (Regla #3)'
        },
        logo: {
          alt: 'Help MED Logo'
        },
        userMenu: {
          ariaLabel: 'Menu de usuario',
          role: 'Administrador',
          logout: 'Cerrar Sesión'
        }
      },
      statsGrid: {
        comments: {
          title: 'Grid de estadísticas',
          approach: 'COMPONENTE UI PURO - Solo presentación, CERO lógica (Regla #2)',
          logic: 'Toda la lógica está en useStatsGrid',
          optimization: 'Optimizado con React.memo (Regla #13)',
          size: 'Menos de 200 líneas (Regla #3)'
        }
      }
    },
    survey: {
      surveyAnalytics: {
        comments: {
          title: 'Componente para análisis y métricas de encuestas',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación, datos calculados en hook'
        },
        filters: {
          title: 'Análisis de Satisfacción',
          subtitle: 'Métricas y tendencias de las encuestas de satisfacción',
          showing: 'Mostrando: {dateFilter} • {planFilter}',
          dateOptions: {
            last7days: 'Últimos 7 días',
            last30days: 'Últimos 30 días',
            last3months: 'Últimos 3 meses',
            all: 'Todo el período'
          },
          planOptions: {
            all: 'Todos los planes',
            familiar: 'Plan Familiar',
            corporativo: 'Plan Corporativo'
          }
        },
        metrics: {
          totalResponses: {
            label: 'Total Respuestas'
          },
          averageRating: {
            label: 'Calificación Promedio',
            format: '{rating}/5.0'
          },
          npsScore: {
            label: 'Net Promoter Score',
            format: '{score}%',
            noData: 'Sin datos'
          },
          trend: {
            label: 'Tendencia',
            improving: 'Mejorando',
            declining: 'Declinando',
            stable: 'Estable'
          }
        },
        questionAnalysis: {
          title: 'Calificación Promedio por Pregunta',
          ratingFormat: '{rating}/5.0'
        },
        ratingDistribution: {
          title: 'Distribución de Calificaciones',
          countFormat: '{count}',
          percentageFormat: '({percentage}%)'
        },
        npsAnalysis: {
          title: 'Análisis NPS Detallado',
          promoters: {
            label: 'Promotores (4-5)',
            percentageFormat: '{percentage}%'
          },
          passives: {
            label: 'Pasivos (3)',
            percentageFormat: '{percentage}%'
          },
          detractors: {
            label: 'Detractores (1-2)',
            percentageFormat: '{percentage}%'
          },
          scoreFormat: 'NPS: {score}%'
        },
        emptyState: {
          title: 'Sin respuestas de encuestas',
          message: 'No se encontraron respuestas de encuestas con los filtros seleccionados. Ajusta los filtros o espera a que se generen más respuestas.'
        }
      },
      surveyConfiguration: {
        comments: {
          title: 'Componente para configuración de preguntas de encuesta',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación, lógica delegada'
        },
        header: {
          title: 'Configuración de Encuesta',
          subtitle: 'Personaliza las preguntas que verán los usuarios después del servicio',
          editButton: 'Editar Preguntas',
          cancelButton: 'Cancelar',
          saveButton: 'Guardar Cambios'
        },
        editMode: {
          title: 'Modo de edición activado.',
          message: 'Puedes modificar el texto, categoría e ícono de cada pregunta. Los cambios se aplicarán después de guardar.'
        },
        questionsList: {
          title: 'Preguntas de la Encuesta ({count})',
          addButton: 'Agregar Pregunta',
          questionLabel: 'Texto de la pregunta',
          categoryLabel: 'Categoría',
          placeholder: 'Escribe la pregunta que verán los usuarios',
          characterCount: '{length}/200 caracteres',
          activeCheckbox: 'Pregunta activa (se mostrará en la encuesta)',
          activeStatus: 'Activa',
          inactiveStatus: 'Inactiva',
          deleteTooltip: 'Eliminar pregunta'
        },
        categories: {
          tiempo: 'Tiempo de Respuesta',
          personal: 'Personal Médico',
          calidad: 'Calidad del Servicio',
          comunicacion: 'Comunicación',
          recomendacion: 'Recomendación',
          general: 'General'
        },
        icons: {
          clock: 'fas fa-clock',
          userMd: 'fas fa-user-md',
          heart: 'fas fa-heart',
          comments: 'fas fa-comments',
          star: 'fas fa-star',
          question: 'fas fa-question',
          thumbsUp: 'fas fa-thumbs-up',
          medicalKit: 'fas fa-medical-kit',
          stethoscope: 'fas fa-stethoscope',
          ambulance: 'fas fa-ambulance'
        },
        emptyState: {
          title: 'No hay preguntas',
          message: 'Agrega al menos una pregunta para configurar la encuesta.'
        },
        tips: {
          title: 'Consejos para Preguntas Efectivas',
          items: {
            clear: 'Usa un lenguaje claro y directo',
            specific: 'Enfócate en aspectos específicos del servicio',
            short: 'Mantén las preguntas cortas y específicas',
            grouped: 'Agrupa preguntas por categorías relacionadas',
            nps: 'Incluye una pregunta de recomendación (NPS)',
            limit: 'Máximo 10 preguntas para evitar fatiga'
          }
        }
      },
      surveyResponsesList: {
        comments: {
          title: 'Componente para lista detallada de respuestas de encuestas',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación, datos del hook'
        },
        loading: {
          title: 'Cargando...',
          message: 'Obteniendo respuestas de encuestas'
        },
        emptyState: {
          title: 'Sin respuestas disponibles',
          message: 'No se encontraron respuestas de encuestas con los filtros seleccionados.'
        },
        header: {
          title: 'Respuestas Detalladas ({count})',
          subtitle: 'Listado completo de todas las respuestas de encuestas de satisfacción'
        },
        responseItem: {
          serviceFormat: '{serviceType} • ID: {serviceId}',
          ratingFormat: '{rating}/5.0',
          questionRatingFormat: '{rating}/5'
        },
        sections: {
          questionsTitle: 'Calificaciones por Pregunta',
          commentsTitle: 'Comentarios del Usuario',
          npsLabel: 'Clasificación NPS:',
          npsCategories: {
            promoter: 'Promotor',
            passive: 'Pasivo',
            detractor: 'Detractor'
          }
        }
      }
    },
    user: {
      locationMapModal: {
        comments: {
          title: 'Modal con mapa interactivo para seleccionar ubicación',
          description: 'Usa OpenStreetMap sin necesidad de API keys'
        },
        header: {
          title: 'Seleccionar Ubicación en el Mapa'
        },
        search: {
          placeholder: 'Buscar dirección... (Ej: Av. Arequipa 1234, Lima)',
          searchButton: 'Buscar',
          myLocationButton: 'Mi Ubicación'
        },
        instructions: {
          title: 'Instrucciones:',
          items: {
            click: '• Haz clic en el mapa para seleccionar',
            drag: '• Arrastra el marcador para ajustar',
            search: '• Usa la búsqueda para encontrar direcciones'
          }
        },
        coordinates: {
          latitudeLabel: 'Latitud',
          longitudeLabel: 'Longitud',
          addressLabel: 'Dirección detectada'
        },
        buttons: {
          cancel: 'Cancelar',
          confirm: 'Confirmar Ubicación'
        },
        errors: {
          addressNotFound: 'No se encontró la dirección. Intente ser más específico.',
          searchError: 'Error al buscar la dirección',
          locationError: 'No se pudo obtener tu ubicación actual',
          geocodeError: 'Error obteniendo dirección:'
        },
        map: {
          attribution: '© OpenStreetMap contributors',
          coordinateFormat: 'Lat: {lat}, Lng: {lng}'
        }
      },
      registrationRequestCard: {
        comments: {
          title: 'Componente para mostrar solicitudes de registro pendientes',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación, datos del hook'
        },
        status: {
          pending: 'Pendiente',
          approved: 'Aprobada',
          rejected: 'Rechazada'
        },
        badges: {
          externalClient: 'Cliente Externo'
        },
        fields: {
          dni: 'DNI: {dni}',
          request: 'Solicitud: {date}',
          entity: 'Entidad:',
          code: 'Código: {code}'
        },
        sections: {
          requestedPlan: 'Plan Solicitado:',
          medicalConditions: 'Condiciones Médicas:',
          comments: 'Comentarios:',
          rejectionReason: 'Motivo de rechazo:'
        },
        plans: {
          externalNoLimits: 'Cliente Externo - Sin límites',
          externalWithLimits: 'Cliente Externo - Con límites',
          format: '{planType} - {planSubtype}'
        },
        buttons: {
          approve: 'Aprobar',
          reject: 'Rechazar'
        }
      },
      userCard: {
        comments: {
          title: 'Componente para mostrar tarjeta de usuario en desktop y mobile',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación, datos del hook'
        },
        status: {
          active: 'Activo',
          inactive: 'Inactivo',
          online: 'Online'
        },
        planStatus: {
          expired: 'Vencido',
          health: 'Salud'
        },
        userTypes: {
          familiar: {
            affiliatesFormat: '{count} afiliado{plural}',
            daysFormat: '{days} días'
          },
          corporativo: {
            servicesFormat: '{used}/{total} servicios',
            percentageFormat: '({percentage}%)'
          },
          default: {
            name: 'Usuario',
            subtitle: 'Sin información'
          }
        },
        fields: {
          contact: 'Contacto:',
          ruc: 'RUC:',
          employees: 'Empleados:',
          services: 'Servicios:',
          usage: 'Uso:',
          renewal: 'Renovación:',
          monthlyCost: 'Costo Mensual:',
          id: 'ID:',
          phone: 'Teléfono:',
          email: 'Email:'
        },
        buttons: {
          viewDetail: 'Ver Detalle',
          registerUsage: 'Registrar servicios consumidos',
          manageAdditional: 'Gestionar servicios adicionales',
          manageAffiliates: 'Gestionar afiliados',
          activateUser: 'Activar usuario',
          deactivateUser: 'Desactivar usuario',
          editUser: 'Editar usuario',
          deleteUser: 'Eliminar usuario',
          registerUseShort: 'Registrar uso',
          addServicesShort: '+ Servicios',
          addServicesMobile: 'Agregar servicios adicionales',
          manageAffiliatesMobile: 'Gestionar afiliados del plan familiar',
          toggleStatusMobile: 'Activar/Desactivar usuario',
          deleteUserMobile: 'Eliminar usuario del sistema'
        },
        icons: {
          familiar: 'fas fa-user',
          corporativo: 'fas fa-building',
          externo: 'fas fa-users',
          admin: 'fas fa-user-shield',
          default: 'fas fa-user'
        }
      },
      userFormModal: {
        comments: {
          title: 'Modal para creación y edición de usuarios',
          rule3: 'Siguiendo Regla #3: Componente específico <200 líneas',
          rule2: 'Siguiendo Regla #2: Solo presentación y validación básica'
        },
        title: {
          edit: 'Editar',
          create: 'Crear',
          user: 'Usuario'
        },
        fields: {
          username: 'Nombre de Usuario',
          password: 'Contraseña',
          passwordPlaceholder: {
            new: 'Ingrese contraseña',
            edit: 'Dejar en blanco para mantener actual'
          },
          passwordNote: 'Dejar en blanco para mantener la contraseña actual',
          showPassword: 'Mostrar contraseña',
          hidePassword: 'Ocultar contraseña'
        },
        buttons: {
          cancel: 'Cancelar',
          update: 'Actualizar',
          create: 'Crear',
          userSuffix: 'Usuario'
        },
        familiar: {
          fullName: 'Nombre Completo',
          dni: 'DNI',
          dniPlaceholder: '12345678',
          dniNote: 'Debe contener exactamente 8 dígitos',
          email: 'Email',
          phone: 'Teléfono',
          birthDate: 'Fecha de Nacimiento',
          plan: 'Plan',
          selectPlan: 'Seleccionar plan...',
          address: 'Dirección',
          addressPlaceholder: 'Av. Principal 123, Distrito, Ciudad',
          plans: {
            help: 'Plan Help',
            basic: 'Plan Básico',
            vip: 'Plan VIP',
            gold: 'Plan Dorado'
          }
        },
        corporate: {
          companyName: 'Nombre de la Empresa',
          ruc: 'RUC Empresa',
          mainAddress: 'Dirección Principal de la Empresa',
          addressPlaceholder: 'Ej: Av. Principal 1234, Comuna, Ciudad',
          gpsLocation: 'Ubicación GPS Exacta',
          selectOnMap: 'Seleccionar en Mapa',
          locationConfigured: 'Ubicación configurada',
          coordinates: 'Coordenadas:',
          detectedAddress: 'Dirección detectada:',
          change: 'Cambiar',
          recommendedGPS: 'Recomendado: Configure la ubicación GPS para máxima precisión en emergencias',
          gpsNote: 'Las coordenadas GPS garantizan que la ambulancia llegue al lugar exacto en emergencias',
          mainContact: 'Contacto Principal',
          contractedServices: 'Servicios Contratados',
          contractAmount: 'Monto de Contrato',
          amountPlaceholder: '0.00',
          additionalBranches: 'Sedes Adicionales (Opcional)',
          branchesNote: 'Agregue otras direcciones donde la empresa tiene operaciones',
          branchPlaceholder: 'Dirección de la sede (Ej: Av. Sur 5678, Comuna, Ciudad)',
          add: 'Agregar',
          noBranches: 'No hay sedes agregadas'
        },
        external: {
          fullName: 'Nombre Completo',
          clientCompany: 'Empresa Cliente',
          planType: 'Tipo de Plan',
          selectType: 'Seleccionar tipo...',
          case1: 'Caso 1 - Sin límites',
          case2: 'Caso 2 - Con límites',
          affiliateId: 'ID Afiliado'
        },
        admin: {
          fullName: 'Nombre Completo',
          position: 'Cargo',
          email: 'Email',
          phone: 'Teléfono'
        }
      }
    },
    users: {
      usersFilters: {
        comments: {
          title: 'Filtros para la lista de usuarios',
          approach: 'ENFOQUE BALANCEADO: Clases estáticas en componente, lógica en hook',
          optimization: 'Optimizado con React.memo solo si hay problemas de performance medidos'
        },
        errors: {
          onSearchChange: 'UsersFilters: onSearchChange debe ser una función',
          onStatusChange: 'UsersFilters: onStatusChange debe ser una función',
          filterError: 'Error en filtros: {error}'
        },
        labels: {
          searchPlaceholder: 'Buscar por nombre o email...',
          searchLabel: 'Buscar usuarios',
          statusFilterLabel: 'Filtrar por estado'
        }
      },
      usersList: {
        comments: {
          title: 'Lista de usuarios para administración',
          approach: 'ENFOQUE BALANCEADO: Clases estáticas en componente, lógica compleja en hook',
          optimization: 'React.memo solo si se detectan problemas de performance'
        },
        errors: {
          usersArray: 'UsersList: users debe ser un array',
          onUpdateFunction: 'UsersList: onUpdate debe ser una función',
          onDeleteFunction: 'UsersList: onDelete debe ser una función',
          loadingError: 'Error al cargar usuarios: {error}',
          errorPrefix: 'Error: {error}'
        },
        buttons: {
          retry: 'Reintentar',
          delete: 'Eliminar'
        },
        emptyState: {
          message: 'No se encontraron usuarios'
        },
        headers: {
          user: 'Usuario',
          role: 'Rol',
          plan: 'Plan',
          status: 'Estado',
          registrationDate: 'Fecha de registro',
          actions: 'Acciones'
        }
      }
    },
    notifications: {
      alertsView: {
        comments: {
          title: 'Vista de alertas activas y notificaciones',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          filteredNotificationsArray: 'AlertsView: filteredNotifications debe ser un array',
          mutedAlertsObject: 'AlertsView: mutedAlerts es requerido y debe ser un objeto',
          notificationConfigObject: 'AlertsView: notificationConfig es requerido y debe ser un objeto',
          onToggleMuteFunction: 'AlertsView: onToggleMute debe ser una función',
          onAlertClickFunction: 'AlertsView: onAlertClick debe ser una función',
          onRemoveNotificationFunction: 'AlertsView: onRemoveNotification debe ser una función'
        },
        muteButtons: {
          muted: '(Silenciado)',
          mode: 'Modo: '
        },
        title: 'Actividad Reciente',
        emptyState: {
          title: 'Todo está en orden',
          subtitle: 'No hay alertas ni notificaciones pendientes'
        }
      },
      configView: {
        comments: {
          title: 'Vista de configuración del sistema de notificaciones',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          notificationConfigObject: 'ConfigView: notificationConfig es requerido y debe ser un objeto',
          onUpdateConfigFunction: 'ConfigView: onUpdateConfig debe ser una función',
          onSaveConfigFunction: 'ConfigView: onSaveConfig debe ser una función',
          onResetConfigFunction: 'ConfigView: onResetConfig debe ser una función',
          isLoadingBoolean: 'ConfigView: isLoading debe ser boolean'
        },
        info: {
          title: 'Configuración de Umbrales',
          description: 'Los umbrales de alertas (servicios bajos, vencimiento de contratos, etc.) se configuran en la sección',
          section: ' Administrador → Configuración'
        },
        popupBehavior: {
          title: 'Comportamiento de Popups de Emergencia',
          autoShow: 'Mostrar popup automático para nuevas emergencias',
          duration: 'Duración del popup (segundos)',
          sosNeverClose: 'Nunca cerrar automáticamente emergencias SOS',
          playSound: 'Reproducir sonido al recibir emergencia'
        },
        alertTypes: {
          title: 'Tipos de Alertas Activas'
        },
        notificationMode: {
          title: 'Modo de Notificación'
        },
        buttons: {
          reset: 'Restablecer valores por defecto',
          save: 'Guardar Configuración',
          saving: 'Guardando...'
        }
      },
      notificationsHeader: {
        comments: {
          title: 'Header del sistema de notificaciones con tabs',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          activeTabString: 'NotificationsHeader: activeTab debe ser un string',
          activeAlertsArray: 'NotificationsHeader: activeAlerts debe ser un array',
          onTabChangeFunction: 'NotificationsHeader: onTabChange debe ser una función'
        },
        title: 'Alertas y Notificaciones',
        activeAlerts: '{count} alerta(s) activa(s)'
      },
      summaryStats: {
        comments: {
          title: 'Panel de estadísticas resumidas del sistema',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          summaryStatsObject: 'SummaryStats: summaryStats es requerido y debe ser un objeto'
        },
        stats: {
          activeEmergencies: 'Emergencias Activas',
          availableAmbulances: 'Ambulancias Libres',
          activeClients: 'Clientes Activos',
          todayServices: 'Servicios Hoy'
        }
      }
    },
    planconfig: {
      additionalPricingModal: {
        comments: {
          title: 'Modal para configuración de precios adicionales',
          description: 'Incluye costos base por servicio'
        },
        title: 'Configuración de Precios Adicionales',
        sections: {
          baseCosts: {
            title: 'Costos Base por Servicio',
            services: {
              emergency: {
                label: 'EMERGENCIA',
                description: 'Servicio de emergencia básico'
              },
              urgentMedical: {
                label: 'URGENCIA MÉDICA',
                description: 'Atención médica de urgencia'
              },
              homeDoctor: {
                label: 'MÉDICO DOMICILIO',
                description: 'Consulta médica domiciliaria'
              },
              scheduledTransfer: {
                label: 'TRASLADO PROGRAMADO',
                description: 'Traslado no urgente'
              },
              protectedZone: {
                label: 'ZONA PROTEGIDA',
                description: 'Servicio incluido en ubicación'
              }
            }
          },
          info: {
            title: 'Información sobre los costos base',
            description: 'Estos son los precios base para cada tipo de servicio. Los costos finales pueden variar según las condiciones específicas del servicio.'
          },
          summary: {
            title: 'Resumen de Configuración',
            totalServices: 'Total de servicios configurados:',
            servicesCount: '{count} servicios',
            mostExpensive: 'Servicio más costoso:',
            currency: 'S/'
          }
        },
        buttons: {
          cancel: 'Cancelar',
          save: 'Guardar Configuración'
        }
      },
      planCard: {
        comments: {
          title: 'Tarjeta individual de plan con todas sus características',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          planObject: 'PlanCard: plan es requerido y debe ser un objeto',
          onEditFunction: 'PlanCard: onEdit debe ser una función',
          onDeleteFunction: 'PlanCard: onDelete debe ser una función',
          onDuplicateFunction: 'PlanCard: onDuplicate debe ser una función',
          onSelectFunction: 'PlanCard: onSelect debe ser una función',
          isSelectedBoolean: 'PlanCard: isSelected debe ser boolean',
          isLoadingBoolean: 'PlanCard: isLoading debe ser boolean'
        },
        status: {
          active: 'Activo',
          inactive: 'Inactivo'
        },
        actions: {
          edit: 'Editar plan',
          duplicate: 'Duplicar plan',
          delete: 'Eliminar plan'
        },
        pricing: {
          perMonth: '/mes',
          perEmployee: '/empleado',
          customPrice: 'Precio personalizado',
          currency: 'PEN',
          setupFee: '+ S/ {fee} setup'
        },
        limits: {
          unlimitedEmergencies: 'Emergencias ilimitadas',
          urgencies: '{count} urgencias',
          homeDoctors: '{count} médicos a domicilio',
          moreServices: '+ {count} servicios más'
        },
        sections: {
          includedServices: 'Servicios Incluidos',
          benefits: 'Beneficios'
        },
        footer: {
          maxResponseTime: 'Respuesta máxima: {time} min'
        }
      },
      planFilters: {
        comments: {
          title: 'Componente de filtros y búsqueda para planes',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          searchTermString: 'PlanFilters: searchTerm debe ser string',
          filterTypeString: 'PlanFilters: filterType debe ser string',
          sortByString: 'PlanFilters: sortBy debe ser string',
          onSearchFunction: 'PlanFilters: onSearch debe ser una función',
          onFilterChangeFunction: 'PlanFilters: onFilterChange debe ser una función',
          onSortChangeFunction: 'PlanFilters: onSortChange debe ser una función',
          onClearFiltersFunction: 'PlanFilters: onClearFilters debe ser una función'
        },
        title: 'Filtros y Búsqueda',
        searchPlaceholder: 'Buscar planes por nombre o descripción...',
        filterOptions: {
          all: 'Todos los Planes',
          familiar: 'Familiares',
          corporativo: 'Corporativos',
          externo: 'Externos'
        },
        sortOptions: {
          name: 'Por Nombre',
          price: 'Por Precio',
          created: 'Por Fecha de Creación'
        },
        labels: {
          categoryLabel: 'Categoría de Plan',
          sortLabel: 'Ordenar por',
          clearFilters: 'Limpiar Filtros',
          activeFilters: 'Filtros activos:',
          searchIndicator: 'Búsqueda: "{term}"',
          categoryIndicator: 'Categoría: {category}',
          sortIndicator: 'Orden: {sort}'
        }
      },
      planFormModal: {
        comments: {
          title: 'Modal para crear/editar planes',
          approach: 'ENFOQUE BALANCEADO: Lógica de formulario simple con validación de props'
        },
        errors: {
          isOpenBoolean: 'PlanFormModal: isOpen debe ser boolean',
          editingPlanObject: 'PlanFormModal: editingPlan debe ser objeto o null',
          onCloseFunction: 'PlanFormModal: onClose debe ser una función',
          onSaveFunction: 'PlanFormModal: onSave debe ser una función',
          isLoadingBoolean: 'PlanFormModal: isLoading debe ser boolean'
        },
        title: {
          edit: 'Editar Plan',
          create: 'Crear Nuevo Plan'
        },
        fields: {
          category: {
            label: 'Categoría *',
            options: {
              familiar: 'Familiar',
              corporativo: 'Corporativo',
              externo: 'Externo'
            }
          },
          planKey: {
            label: 'Clave del Plan *',
            placeholder: 'Ej: BASICO, VIP, PREMIUM'
          },
          planName: {
            label: 'Nombre del Plan *',
            placeholder: 'Plan Básico'
          },
          targetMarket: {
            label: 'Mercado Objetivo',
            placeholder: 'Familias clase media'
          },
          description: {
            label: 'Descripción *',
            placeholder: 'Descripción detallada del plan...'
          },
          pricing: {
            title: 'Configuración de Precios',
            monthly: 'Precio Mensual (S/)',
            quarterly: 'Precio Trimestral (S/)',
            annual: 'Precio Anual (S/)',
            perEmployee: 'Precio por Empleado/Mes (S/)',
            minimumEmployees: 'Mínimo de Empleados',
            setupFee: 'Tarifa de Configuración (S/)'
          },
          activeStatus: 'Plan activo para nuevas suscripciones'
        },
        buttons: {
          cancel: 'Cancelar',
          saving: 'Guardando...',
          update: 'Actualizar',
          create: 'Crear',
          plan: ' Plan'
        }
      },
      planHeader: {
        comments: {
          title: 'Header del sistema de configuración de planes',
          approach: 'ENFOQUE BALANCEADO: Solo presentación con validación de props'
        },
        errors: {
          planStatsObject: 'PlanHeader: planStats es requerido y debe ser un objeto',
          onCreatePlanFunction: 'PlanHeader: onCreatePlan debe ser una función',
          onExportExcelFunction: 'PlanHeader: onExportExcel debe ser una función',
          onExportPDFFunction: 'PlanHeader: onExportPDF debe ser una función',
          onExportCSVFunction: 'PlanHeader: onExportCSV debe ser una función',
          onOpenPricingFunction: 'PlanHeader: onOpenPricing debe ser una función',
          isLoadingBoolean: 'PlanHeader: isLoading debe ser boolean'
        },
        title: 'Configuración de Planes',
        subtitle: 'Gestiona planes familiares, corporativos y externos',
        buttons: {
          createPlan: 'Crear Plan',
          excel: 'Excel',
          pdf: 'PDF',
          csv: 'CSV',
          additionalPricing: 'Precios Adicionales'
        },
        stats: {
          totalPlans: 'Total Planes',
          active: 'Activos',
          familiar: 'Familiares',
          corporate: 'Corporativos'
        },
        tools: {
          title: 'Herramientas de Gestión'
        }
      },
      planStatCard: {
        comments: {
          title: 'Componente para mostrar estadísticas rápidas de planes',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente pequeño y enfocado (<50 líneas)',
            rule2: 'Siguiendo Regla #2: Solo presentación, sin lógica compleja'
          }
        }
      }
    },
    registration: {
      requestCard: {
        comments: {
          title: 'Componente para mostrar información de una solicitud de registro',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente pequeño y enfocado (<200 líneas)',
            rule2: 'Siguiendo Regla #2: Solo presentación, sin lógica compleja'
          }
        },
        status: {
          pending: 'PENDIENTE',
          approved: 'APROBADA',
          rejected: 'RECHAZADA'
        },
        fields: {
          email: 'Email:',
          phone: 'Teléfono:',
          dni: 'DNI:',
          plan: 'Plan:',
          city: 'Ciudad:',
          date: 'Fecha:',
          emergencyContact: 'Contacto Emergencia:',
          relation: 'Relación:',
          emergencyPhone: 'Tel. Emergencia:'
        },
        sections: {
          medicalConditions: 'Condiciones Médicas:',
          comments: 'Comentarios:',
          rejectionReason: 'Motivo del Rechazo:'
        },
        footer: {
          id: 'ID:',
          request: 'Solicitud:'
        },
        buttons: {
          approve: {
            full: 'Aprobar',
            short: 'OK'
          },
          reject: {
            full: 'Rechazar',
            short: 'NO'
          },
          activateServices: {
            full: 'Activar Servicios',
            short: 'Activar'
          },
          viewDetail: {
            full: 'Ver Detalle',
            short: 'Ver'
          }
        }
      },
      requestStats: {
        comments: {
          title: 'Componente para mostrar estadísticas de solicitudes de registro',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente pequeño y enfocado (<50 líneas)',
            rule2: 'Siguiendo Regla #2: Solo presentación, sin lógica compleja'
          }
        },
        stats: {
          pending: 'Pendientes',
          approved: 'Aprobadas',
          rejected: 'Rechazadas',
          total: 'Total'
        }
      },
      requestDetailModal: {
        comments: {
          title: 'Modal para mostrar el detalle completo de una solicitud de registro',
          rules: {
            rule3: 'Siguiendo Regla #3: Componente enfocado y modular',
            rule2: 'Siguiendo Regla #2: Solo presentación, lógica delegada a props'
          }
        },
        title: 'Detalle de Solicitud - {name}',
        sections: {
          personalData: 'Datos Personales',
          location: 'Ubicación',
          selectedPlan: 'Plan Seleccionado',
          emergencyContact: 'Contacto de Emergencia',
          medicalConditions: 'Condiciones Médicas',
          additionalComments: 'Comentarios Adicionales',
          rejectionReason: 'Motivo del Rechazo',
          trackingInfo: 'Información de Seguimiento'
        },
        fields: {
          fullName: 'Nombre completo:',
          dni: 'DNI:',
          birthDate: 'Fecha de nacimiento:',
          email: 'Email:',
          phone: 'Teléfono:',
          address: 'Dirección:',
          district: 'Distrito:',
          city: 'Ciudad:',
          coordinates: 'Coordenadas:',
          planType: 'Tipo de plan:',
          category: 'Categoría:',
          subtype: 'Subtipo:',
          monthlyPayment: 'Pago mensual:',
          name: 'Nombre:',
          relation: 'Relación:',
          requestId: 'ID de solicitud:',
          requestDate: 'Fecha de solicitud:',
          currentStatus: 'Estado actual:',
          processedAt: 'Procesada el:',
          userId: 'ID de usuario:',
          processedBy: 'Procesada por:'
        },
        status: {
          pending: 'PENDIENTE',
          approved: 'APROBADA',
          rejected: 'RECHAZADA'
        },
        buttons: {
          close: 'Cerrar',
          approveRequest: 'Aprobar Solicitud',
          rejectRequest: 'Rechazar Solicitud',
          activateServices: 'Activar Servicios'
        }
      }
    },
    registrationManagement: {
      comments: {
        title: 'Componente principal para gestión de solicitudes de registro',
        refactored: 'REFACTORIZADO siguiendo TODAS las reglas:',
        rules: {
          rule2: '✅ Regla #2: Solo presentación, lógica compleja en hook',
          rule3: '✅ Regla #3: <200 líneas (actualmente ~140 líneas)',
          rule8: '✅ Regla #8: Manejo de errores delegado al hook',
          rule10: '✅ Regla #10: Arquitectura modular - componentes separados'
        }
      },
      errors: {
        managementError: 'Error en gestión de solicitudes: {error}'
      },
      header: {
        title: 'Gestión de Solicitudes de Registro',
        subtitle: 'Administra las solicitudes de nuevos clientes'
      },
      filters: {
        label: 'Filtrar por estado:',
        options: {
          all: 'Todas',
          pending: 'Pendientes',
          approved: 'Aprobadas',
          rejected: 'Rechazadas'
        }
      },
      list: {
        title: 'Solicitudes ({count})',
        loading: {
          title: 'Cargando...',
          message: 'Obteniendo solicitudes de registro'
        },
        empty: {
          title: 'No hay solicitudes',
          message: 'No se encontraron solicitudes con los filtros seleccionados.'
        }
      }
    },
    reportsAnalytics: {
      comments: {
        title: 'Sistema completo de reportes y analytics para administradores'
      },
      header: {
        title: 'Reportes y Analytics'
      },
      dateFilters: {
        startDateLabel: 'Fecha de inicio',
        endDateLabel: 'Fecha de fin',
        last30Days: 'Últimos 30 días'
      },
      exportButtons: {
        pdf: 'PDF',
        excel: 'Excel'
      },
      exportMessages: {
        pdfReady: {
          title: 'PDF Preparado',
          text: 'Se ha abierto una nueva ventana. Presiona Ctrl+P para imprimir o guardar como PDF'
        },
        excelGenerated: {
          title: 'Excel Generado',
          text: 'El archivo Excel ha sido descargado exitosamente'
        }
      },
      reportTitles: {
        overview: 'Resumen General',
        users: 'Usuarios',
        services: 'Servicios',
        performance: 'Performance',
        geography: 'Geografía',
        finanzas: 'Finanzas',
        surveys: 'Encuestas de Calidad',
        default: 'Reporte'
      },
      tabs: [
        { id: 'overview', label: 'Resumen General', icon: 'fas fa-chart-pie', short: 'Resumen' },
        { id: 'users', label: 'Usuarios', icon: 'fas fa-users', short: 'Usuarios' },
        { id: 'services', label: 'Servicios', icon: 'fas fa-ambulance', short: 'Servicios' },
        { id: 'performance', label: 'Performance', icon: 'fas fa-tachometer-alt', short: 'Performance' },
        { id: 'geography', label: 'Geografía', icon: 'fas fa-map-marked-alt', short: 'Geografía' },
        { id: 'finanzas', label: 'Finanzas', icon: 'fas fa-coins', short: 'Finanzas' },
        { id: 'surveys', label: 'Encuestas de Calidad', icon: 'fas fa-poll', short: 'Encuestas' }
      ],
      dateRange: {
        selectPeriod: 'Seleccionar período'
      },
      overview: {
        mainMetrics: 'Métricas Principales',
        userDistribution: 'Distribución de Usuarios por Plan',
        metrics: {
          totalUsers: 'Total Usuarios',
          completedServices: 'Servicios Completados', 
          totalRevenue: 'Ingresos Totales',
          avgResponseTime: 'Tiempo Promedio Respuesta'
        }
      },
      users: {
        userAnalysis: 'Análisis de Usuarios',
        usersByType: 'Usuarios por Tipo'
      },
      services: {
        serviceAnalysis: 'Análisis de Servicios',
        servicesByType: 'Servicios por Tipo'
      },
      geography: {
        geographicAnalysis: 'Análisis Geográfico',
        executiveSummary: 'Resumen Ejecutivo',
        leaderDistrict: 'Distrito Líder',
        fastestResponse: 'Respuesta Más Rápida', 
        opportunity: 'Oportunidad'
      },
      performance: {
        responseTime: 'Tiempo Respuesta',
        unitAvailability: 'Disponibilidad Unidades',
        satisfaction: 'Satisfacción',
        serviceTrends: 'Tendencia de Servicios',
        serviceTypes: {
          emergencies: 'Emergencias',
          urgencies: 'Urgencias',
          home: 'Domicilio',
          transfers: 'Traslados'
        }
      },
      cards: {
        totalUsers: 'Total Usuarios',
        activeEmergencies: 'Emergencias Activas',
        totalRevenue: 'Ingresos Totales',
        clientSatisfaction: 'Satisfacción Cliente',
        emergencies: 'Emergencias',
        homeService: 'Médico a Domicilio',
        urgencies: 'Urgencias',
        transfers: 'Traslados'
      },
      userFilters: {
        title: 'Filtros de Usuario'
      }
    },
    revenueManagement: {
      comments: {
        title: 'Componente principal para gestión financiera y de ingresos',
        refactored: 'REFACTORIZADO siguiendo TODAS las reglas:',
        rules: {
          rule2: '✅ Regla #2: Solo presentación, lógica compleja en hook useRevenueManagement',
          rule3: '✅ Regla #3: <200 líneas (actualmente ~190 líneas)',
          rule8: '✅ Regla #8: Manejo de errores delegado al hook',
          rule10: '✅ Regla #10: Arquitectura modular - componentes separados',
          rule4: '✅ Regla #4: Validación completa en formularios'
        }
      },
      errors: {
        managementError: 'Error en gestión financiera: {error}'
      },
      header: {
        title: 'Gestión Financiera',
        subtitle: 'Control de ingresos, transacciones y reportes financieros'
      },
      buttons: {
        newTransaction: 'Nueva Transacción',
        pdf: 'PDF',
        excel: 'Excel',
        clearFilters: 'Limpiar Filtros'
      },
      tabs: {
        dashboard: 'Panel Financiero',
        transactions: 'Transacciones',
        reports: 'Reportes'
      },
      filters: {
        dateRange: 'Rango de fechas:',
        transactionType: 'Tipo de transacción:',
        status: 'Estado:',
        all: 'Todos',
        income: 'Ingresos', 
        expense: 'Gastos',
        pending: 'Pendiente',
        completed: 'Completado',
        cancelled: 'Cancelado'
      },
      loading: {
        message: 'Cargando datos financieros...'
      },
      empty: {
        noTransactions: 'No hay transacciones disponibles',
        noFilteredTransactions: 'No se encontraron transacciones con los filtros aplicados',
        title: 'Sin Transacciones Registradas',
        description: 'Comienza registrando tu primera transacción para ver métricas y reportes financieros.',
        registerFirst: 'Registrar Primera Transacción'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'KPIs y métricas principales'
      },
      transactions: {
        title: 'Transacciones',
        subtitle: 'Lista detallada con filtros'
      },
      footer: {
        systemInfo: 'Sistema financiero HelpMED - Actualizado en tiempo real',
        totalShown: 'Total mostrado:'
      },
      tooltips: {
        download: 'Descargar reporte',
        expand: 'Expandir vista completa'
      }
    },
    surveyManagement: {
      errors: {
        loadModule: 'Error al cargar el módulo de encuestas'
      },
      header: {
        title: 'Gestión de Encuestas de Satisfacción',
        subtitle: 'Configura preguntas y revisa resultados de satisfacción del cliente',
        systemEvaluation: 'Sistema de evaluación 1-5 estrellas'
      },
      tabs: {
        configure: 'Configurar Preguntas',
        results: 'Ver Resultados'
      },
      editModal: {
        title: 'Editar Preguntas',
        question: 'Pregunta {number}',
        category: 'Categoría',
        categories: {
          quality: 'Calidad',
          personal: 'Personal',
          communication: 'Comunicación',
          recommendation: 'Recomendación',
          time: 'Tiempo'
        },
        active: 'Activa',
        saveChanges: 'Guardar Cambios',
        cancel: 'Cancelar',
        success: {
          title: 'Cambios guardados',
          message: 'Las preguntas se han actualizado correctamente'
        }
      },
      survey: {
        incomplete: {
          title: 'Encuesta incompleta',
          message: 'Por favor califique todas las preguntas antes de enviar'
        },
        submitted: {
          title: 'Encuesta enviada',
          message: 'Gracias por sus respuestas. Su opinión es muy importante para nosotros.'
        },
        systemEvaluation: {
          title: 'Evaluación del Sistema',
          message: 'El sistema ha evaluado automáticamente basándose en métricas del servicio'
        }
      },
      export: {
        title: 'Exportando datos',
        message: 'El archivo se descargará en breve...',
        reportButton: 'Exportar Reporte'
      },
      metrics: {
        totalResponses: 'Total Respuestas',
        averageRating: 'Calificación Promedio',
        npsScore: 'NPS Score',
        todayResponses: 'Respuestas Hoy',
        responseRate: 'Tasa Respuesta'
      }
    },
    systemConfiguration: {
      header: {
        title: 'Configuración del Sistema',
        subtitle: 'Configura alertas, notificaciones y métodos de pago'
      },
      tabs: {
        alerts: 'Alertas y Notificaciones',
        payments: 'Métodos de Pago'
      },
      save: {
        title: 'Guardado',
        message: 'Configuración de {type} actualizada correctamente'
      },
      preview: {
        title: 'Vista Previa de Alerta',
        defaultMessage: 'Vista previa de la alerta seleccionada'
      },
      serviceAlerts: {
        title: 'Alertas de Servicios Agotándose',
        corporateClients: 'Clientes Corporativos',
        familiarClients: 'Clientes Familiares',
        thresholdLabel: 'Umbral de Alerta (servicios restantes)',
        servicesUnit: 'servicios',
        remainingMessage: 'Te quedan solo {count} servicios restantes',
        viewAlert: 'Ver Alerta',
        corporateThresholdInfo: 'Los corporativos serán una alerta cuando tengan {count} o menos servicios restantes',
        familiarThresholdInfo: 'Los familiares serán una alerta cuando tengan {count} o menos servicios restantes'
      },
      contractAlerts: {
        title: 'Alertas de Vencimiento de Contratos',
        corporateContracts: 'Contratos Corporativos',
        daysBeforeLabel: 'Días antes del vencimiento para alertar',
        daysUnit: 'días',
        previewTitle: 'Vista Previa de la Alerta',
        contractNotifications: 'Notificaciones de contratos por vencer:',
        daysRemaining: '{days} días restantes',
        contractExpiringMessage: 'Tu contrato corporativo vence próximamente'
      },
      notifications: {
        title: 'Configuración de Notificaciones',
        email: {
          title: 'Recordatorios por Email Automáticos',
          description: 'Enviar emails automáticos cuando los servicios estén por agotarse'
        },
        sms: {
          title: 'Notificaciones SMS',
          description: 'Enviar mensajes de texto para alertas críticas'
        }
      }
    }
  },
  
  // Panel Familiar
  familiar: {
    title: 'Panel Familiar',
    welcome: 'Bienvenido',
    services: {
      medical: 'Emergencia Médica',
      mechanical: 'Asistencia Mecánica',
      fire: 'Bomberos',
      police: 'Policía'
    },
    emergency: {
      request: 'Solicitar Emergencia',
      tracking: 'Seguimiento de Emergencia',
      history: 'Historial de Emergencias'
    }
  },
  
  // Formularios
  forms: {
    fields: {
      name: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      dni: 'DNI',
      ruc: 'RUC',
      birthDate: 'Fecha de Nacimiento',
      gender: 'Género',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      description: 'Descripción',
      observations: 'Observaciones',
      requiredIndicator: '*'
    },
    placeholders: {
      email: 'correo@ejemplo.com',
      phone: '+51 999888777',
      search: 'Buscar...',
      select: 'Seleccione una opción'
    },
    validation: {
      required: 'Este campo es requerido',
      minLength: 'Mínimo {min} caracteres',
      maxLength: 'Máximo {max} caracteres',
      email: 'Ingrese un email válido',
      phone: 'Ingrese un teléfono válido',
      passwordMatch: 'Las contraseñas no coinciden'
    },
    buttons: {
      cancel: 'Cancelar',
      submit: 'Agregar',
      submitting: 'Agregando...',
      save: 'Guardar',
      saving: 'Guardando...'
    },
    accessibility: {
      closeModal: 'Cerrar modal',
      requiredField: 'Campo requerido'
    }
  }
}
// Exportación por defecto para compatibilidad
export default LABELS
