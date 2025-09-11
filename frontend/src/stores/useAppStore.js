import { create } from 'zustand'
import apiService from '../services/api'
import databaseService from '../services/database.service'

const useAppStore = create((set, get) => {
  const store = {
    // ========== ESTADO GENERAL ==========
    currentUser: null,
    isLoggedIn: false,
    currentScreen: 'splash',
    activeSection: 'emergency',
    isLoading: false,

    // ========== SOLICITUDES DE CONTACTO ==========
    contactRequests: [],

    // ========== SOLICITUDES DE REGISTRO ==========
    registrationRequests: [],

    // ========== ENCUESTAS DE SATISFACCIÓN ==========
    surveyQuestions: null,
    surveyResponses: [],
    pendingSurveys: [],

    // ========== USUARIOS AMBULANCIA ==========
    ambulanceUsers: [],

    // ========== ESTADO DE EMERGENCIAS ==========
    currentEmergency: null,
    emergencyType: 'medical',
    emergencyStatus: 'idle',
    assignedUnit: null,
    trackingInterval: null,
    sosTimer: null,
    estimatedArrivalTime: null, // Tiempo estimado de llegada (manual por admin)
    activeEmergencies: [], // Lista vacía - cargar desde API

    // ========== NOTIFICACIONES ==========
    notifications: [],
    systemAlerts: [],

    // ========== DATOS DEL SISTEMA (ADMIN) ==========
    systemMetrics: null,
    systemSettings: {
      corporateServicesAlertThreshold: 2,
      familiarServicesAlertThreshold: 1,
      contractExpirationAlertDays: 15,
      autoEmailReminders: true,
      smsNotifications: true
    },
    allUsers: {
      admin: [],
      familiar: [],
      corporativo: [],
      externo: []
    },

    // ========== HISTORIAL Y SERVICIOS ==========
    emergencyHistory: [],
    availableUnits: [],

    // ========== TRANSACCIONES Y FINANZAS ==========
    transactions: [],
    revenueSummary: {
      totalRevenue: 0,
      byType: {
        SUBSCRIPTION: 0,
        ADDITIONAL_SERVICE: 0,
        CORPORATE_CONTRACT: 0,
        PARTICULAR: 0,
        MANUAL_ENTRY: 0
      },
      byPlan: {},
      byPeriod: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0
      }
    },

    // ========== ACCIONES DE AUTENTICACIÓN ==========
    login: async (username, password) => {
      set({ isLoading: true })

      // Bloquear acceso a externo2 (Caso 2)
      if (username === 'externo2' || password === 'ext456') {
        set({ isLoading: false })
        return { success: false, error: 'Acceso temporalmente deshabilitado' }
      }

      // Simular delay de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Autenticación contra la API usando databaseService
      let user = null
      try {
        const users = await databaseService.getUsers()
        console.log('Users from API:', users)
        console.log('Looking for:', { username, password })
        
        user = users.find(u => u.username === username && u.password === password)
        console.log('Found user:', user)
      } catch (error) {
        console.error('Error conectando con API:', error)
        set({ isLoading: false })
        return { success: false, error: 'Error de conexión con el servidor' }
      }

      if (user) {
        // Bloquear también si el usuario encontrado es externo2
        if (
          user.username === 'externo2' ||
          (user.role === 'EXTERNO' && user.plan?.subtype === 'CASO_2')
        ) {
          set({ isLoading: false })
          return { success: false, error: 'Acceso temporalmente deshabilitado' }
        }

        // Determinar la pantalla según el rol
        let targetScreen = 'dashboard'
        console.log('User role:', user.role)
        
        if (user.role === 'ADMIN') {
          targetScreen = 'admin'
        } else if (user.role === 'CORPORATIVO') {
          targetScreen = 'corporate'
        } else if (user.role === 'EXTERNO') {
          targetScreen = 'external'
        } else if (user.role === 'EXTERNO_ADMIN') {
          targetScreen = 'external-admin'
        } else if (user.role === 'AMBULANCE') {
          targetScreen = 'ambulance'
        }

        console.log('Target screen:', targetScreen)

        set({
          currentUser: user,
          isLoggedIn: true,
          currentScreen: targetScreen,
          isLoading: false
        })

        console.log('Store updated, currentScreen:', targetScreen)

        // Cargar datos específicos según el tipo de usuario
        get().loadUserSpecificData(user)

        return { success: true, user }
      } else {
        set({ isLoading: false })
        return { success: false, error: 'Credenciales inválidas' }
      }
    },

    logout: () => {
      set({
        currentUser: null,
        isLoggedIn: false,
        currentScreen: 'login',
        activeSection: 'emergency',
        currentEmergency: null,
        emergencyStatus: 'idle',
        assignedUnit: null,
        notifications: [],
        systemAlerts: [],
        emergencyHistory: []
      })
    },

    // ========== NAVEGACIÓN ==========
    setCurrentScreen: (screen) => set({ currentScreen: screen }),
    setActiveSection: (section) => set({ activeSection: section }),

    // ========== GESTIÓN DE EMERGENCIAS ==========
    requestEmergency: async (
      type,
      description,
      location,
      extraContacts = [],
      affiliateInfo = null
    ) => {
      const user = get().currentUser
      if (!user) return { success: false, error: 'Usuario no autenticado' }

      // Validar límites según el tipo de usuario y plan
      const canRequest = get().validateServiceLimits(user, type)
      if (!canRequest.allowed) {
        return { success: false, error: canRequest.reason }
      }

      // Preparar datos de ubicación
      const locationData =
        location && typeof location === 'object'
          ? {
              coordinates: {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy
              },
              altitude: location.altitude,
              altitudeAccuracy: location.altitudeAccuracy,
              heading: location.heading,
              speed: location.speed,
              timestamp: location.timestamp,
              address: location.address || 'Obteniendo dirección...'
            }
          : { address: location || 'Ubicación no disponible' }

      // Validar y preparar contactos extra
      const validExtraContacts = Array.isArray(extraContacts)
        ? extraContacts
            .filter(
              (contact) =>
                contact &&
                typeof contact.name === 'string' &&
                contact.name.trim() &&
                typeof contact.phone === 'string' &&
                contact.phone.trim()
            )
            .map((contact) => ({
              name: contact.name.trim(),
              phone: contact.phone.trim(),
              relation: contact.relation || 'Contacto de emergencia'
            }))
        : []

      const emergency = {
        id: `emg_${Date.now()}`,
        user_id: user.id,
        type,
        description,
        location: locationData,
        extraContacts: validExtraContacts,
        affiliateInfo: affiliateInfo || {
          id: 'titular',
          name: user.profile?.name || user.name,
          relation: 'Titular'
        },
        timestamp: new Date(),
        status: 'pending',
        isCritical: type === 'sos',
        medicalRecord: null // Se llenará cuando la ambulancia registre las acciones
      }

      // Persistir emergencia en la base de datos
      try {
        await databaseService.createEmergency(emergency)
        console.log('Emergencia creada en la base de datos:', emergency.id)
      } catch (error) {
        console.error('Error al crear emergencia en la base de datos:', error)
      }

      set((state) => ({
        currentEmergency: emergency,
        emergencyStatus: 'requested',
        emergencyType: type,
        // Agregar a la lista de emergencias activas (para el admin)
        activeEmergencies: [...state.activeEmergencies, emergency]
      }))

      // Proceso de asignación más rápido para SOS
      const assignmentDelay = type === 'sos' ? 500 : 2000

      setTimeout(() => {
        const availableUnit = get().getAvailableUnit(locationData)
        if (availableUnit) {
          set({
            assignedUnit: availableUnit,
            emergencyStatus: 'assigned'
          })

          // Actualizar límites del usuario
          get().updateUserLimits(user.id, type)

          const contactsInfo =
            validExtraContacts.length > 0
              ? ` • ${validExtraContacts.length} contacto(s) extra notificado(s)`
              : ''

          // Solo mostrar notificación básica sin tiempo para usuarios familiares
          if (user.role === 'FAMILIAR') {
            get().addNotification({
              type: type === 'sos' ? 'critical' : 'success',
              title: type === 'sos' ? '🚨 UNIDAD DE EMERGENCIA ASIGNADA' : 'Unidad Asignada',
              message: `${availableUnit.id} ha sido asignada a tu solicitud${contactsInfo}`,
              timestamp: new Date()
            })
          } else {
            // Para otros roles, mostrar información más detallada
            get().addNotification({
              type: type === 'sos' ? 'critical' : 'success',
              title: type === 'sos' ? '🚨 UNIDAD DE EMERGENCIA ASIGNADA' : 'Unidad Asignada',
              message: `${availableUnit.id} está en camino a tu ubicación${locationData.coordinates ? ` (Precisión: ${locationData.coordinates.accuracy.toFixed(1)}m)` : ''}${contactsInfo}`,
              timestamp: new Date()
            })
          }
        }
      }, assignmentDelay)

      return { success: true, emergency }
    },

    // ========== VALIDACIÓN DE LÍMITES ==========
    validateServiceLimits: (user, serviceType) => {
      if (!user || !user.plan) return { allowed: false, reason: 'Usuario sin plan válido' }

      switch (user.role) {
        case 'FAMILIAR':
          return get().validateFamiliarLimits(user, serviceType)
        case 'CORPORATIVO':
          return get().validateCorporateLimits(user, serviceType)
        case 'EXTERNO':
          return get().validateExternalLimits(user, serviceType)
        default:
          return { allowed: true }
      }
    },

    validateFamiliarLimits: (user, serviceType, affiliateId = null) => {
      const { plan, service_usage, affiliates = [] } = user

      // Validar que el afiliado esté activo si se especifica
      if (affiliateId) {
        const affiliate = affiliates.find((a) => a.id === affiliateId)
        if (!affiliate) {
          return { allowed: false, reason: 'Afiliado no encontrado' }
        }
        if (affiliate.status !== 'active') {
          return { allowed: false, reason: 'Afiliado inactivo' }
        }
      }

      // Plan Help - No tiene límite de afiliados
      const activeAffiliates = affiliates.filter((a) => a.status === 'active')

      // Plan Help - límite total flexible compartido entre titular y afiliados
      if (plan.subtype === 'HELP') {
        const remainingServices = service_usage.current_period.remaining_services
        if (remainingServices <= 0) {
          return {
            allowed: false,
            reason: `Han agotado los ${plan.total_services} servicios del Plan Help (titular + ${activeAffiliates.length} afiliados)`
          }
        }
        return {
          allowed: true,
          remaining: remainingServices,
          affiliatesCount: activeAffiliates.length
        }
      }

      // Otros planes familiares - límites específicos por tipo compartidos
      const serviceLimit = service_usage.current_period.breakdown[serviceType]
      if (serviceLimit === 'ILIMITADO') {
        return {
          allowed: true,
          affiliatesCount: activeAffiliates.length
        }
      }

      if (serviceLimit.used >= serviceLimit.limit) {
        return {
          allowed: false,
          reason: `Han agotado los ${serviceLimit.limit} servicios de ${serviceType} (compartidos entre titular + ${activeAffiliates.length} afiliados)`,
          canPurchaseAdditional: true,
          additionalCost: get().getAdditionalServiceCost(serviceType),
          affiliatesCount: activeAffiliates.length
        }
      }

      return {
        allowed: true,
        remaining: serviceLimit.limit - serviceLimit.used,
        affiliatesCount: activeAffiliates.length
      }
    },

    validateCorporateLimits: (user, serviceType) => {
      const { service_usage } = user

      if (serviceType !== 'EMERGENCIA') {
        return { allowed: false, reason: 'Solo se permiten emergencias en Área Protegida' }
      }

      if (service_usage.current_period.remaining_services <= 0) {
        return {
          allowed: false,
          reason: 'La empresa ha agotado sus servicios contratados',
          canPurchaseAdditional: true,
          additionalCost: user.billing.additional_service_rate
        }
      }

      return { allowed: true, remaining: service_usage.current_period.remaining_services }
    },

    validateExternalLimits: (user, serviceType) => {
      const { plan, service_usage, client_company } = user

      // Caso 1 - Sin límites
      if (plan.subtype === 'CASO_1') {
        return { allowed: true, billing: 'direct' }
      }

      // Caso 2 - Con límites individuales y generales
      const individualRemaining = service_usage.current_period.individual_remaining
      const generalRemaining = client_company.general_services_remaining

      if (individualRemaining <= 0) {
        return {
          allowed: false,
          reason: 'Has agotado tus 3 servicios anuales',
          canPurchaseAdditional: true,
          additionalCost: service_usage.billing_info.cost_per_additional_service
        }
      }

      if (generalRemaining <= 0) {
        return {
          allowed: false,
          reason: 'La empresa ha agotado el límite general de servicios'
        }
      }

      return {
        allowed: true,
        remaining: Math.min(individualRemaining, generalRemaining)
      }
    },

    // ========== ACTUALIZACIÓN DE LÍMITES ==========
    updateUserLimits: (userId, serviceType) => {
      // Esta función actualizaría los límites en una BD real
      // Por ahora solo simulamos la actualización
      console.log(`Actualizando límites para usuario ${userId}, servicio ${serviceType}`)
    },

    // ========== FUNCIONES AUXILIARES ==========
    getAvailableUnit: (location) => {
      // Sin unidades disponibles - cargar desde API
      const units = []

      // Sin unidades disponibles
      const selectedUnit = null

      // Actualizar el estado de la emergencia para incluir la unidad asignada
      setTimeout(() => {
        const { currentEmergency } = get()
        if (currentEmergency) {
          set({
            currentEmergency: {
              ...currentEmergency,
              assignedUnit: selectedUnit,
              status: 'EN_PROGRESO'
            }
          })
        }
      }, 1000)

      return selectedUnit
    },

    getAdditionalServiceCost: (serviceType) => {
      const costs = {
        URGENCIA: 85000,
        MEDICO_DOMICILIO: 95000,
        TRASLADO_PROGRAMADO: 120000,
        ZONA_PROTEGIDA: 150000
      }
      return costs[serviceType] || 85000
    },

    // ========== CARGA DE DATOS ESPECÍFICOS ==========
    loadUserSpecificData: (user) => {
      // Cargar todos los usuarios independientemente del rol para el historial médico
      get().loadAllUsersData()

      switch (user.role) {
        case 'ADMIN':
          get().loadAdminData()
          break
        case 'FAMILIAR':
          get().loadFamiliarData(user)
          break
        case 'CORPORATIVO':
          get().loadCorporateData(user)
          break
        case 'EXTERNO':
          get().loadExternalData(user)
          break
      }
    },

    loadAllUsersData: async () => {
      try {
        // Cargar usuarios desde la base de datos
        const users = await databaseService.getUsers()
        
        const usersByRole = {
          admin: users.filter(u => u.role === 'ADMIN'),
          familiar: users.filter(u => u.role === 'FAMILIAR'),
          corporativo: users.filter(u => u.role === 'CORPORATIVO'),
          externo: users.filter(u => u.role === 'EXTERNO')
        }
        
        set({ 
          allUsers: usersByRole,
          ambulanceUsers: users.filter(u => u.role === 'AMBULANCE')
        })
        
        return usersByRole
      } catch (error) {
        console.error('Error loading users:', error)
        // Mantener datos vacíos en caso de error
        set({
          allUsers: {
            admin: [],
            familiar: [],
            corporativo: [],
            externo: []
          }
        })
        return null
      }
    },

    loadAdminData: () => {
      set({
        systemMetrics: null, // Cargar desde API
        systemAlerts: [],
        allUsers: {
          admin: [],
          familiar: [],
          corporativo: [],
          externo: []
        }
      })
    },

    loadFamiliarData: (user) => {
      // Cargar historial específico del usuario familiar
      const history = get().getUserHistory(user.id)
      set({ emergencyHistory: history })
    },

    loadCorporateData: (user) => {
      // Cargar datos corporativos
      const history = get().getUserHistory(user.id)
      set({ emergencyHistory: history })
    },

    loadExternalData: (user) => {
      // Cargar datos de usuario externo
      const history = get().getUserHistory(user.id)
      set({ emergencyHistory: history })
    },

    getUserHistory: (userId) => {
      // Retornar historial vacío - cargar desde API
      return []
    },

    // ========== NOTIFICACIONES ==========
    addNotification: async (notification) => {
      const newNotification = { ...notification, id: Date.now() }
      
      // Persistir notificación en la base de datos
      try {
        await databaseService.createNotification(newNotification)
        console.log('Notificación creada en la base de datos:', newNotification.id)
      } catch (error) {
        console.error('Error al crear notificación en la base de datos:', error)
      }
      
      set((state) => ({
        notifications: [...state.notifications, newNotification]
      }))
    },

    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    },

    // ========== SOLICITUDES DE CONTACTO ==========
    requestServiceExpansion: (serviceType, reason, urgency = 'media') => {
      const user = get().currentUser
      if (!user) return { success: false, error: 'Usuario no autenticado' }

      const newRequest = {
        id: `contact_${Date.now()}`,
        userId: user.id,
        userName: user.profile.name,
        userType: user.role,
        planName: user.plan.name,
        serviceType,
        reason,
        urgency,
        contactPhone: user.profile.phone,
        contactEmail: user.profile.email,
        requestDate: new Date(),
        status: 'pendiente',
        companyName: user.company?.name || user.client_company?.name,
        currentUsage: get().getCurrentUsage(user, serviceType)
      }

      set((state) => ({
        contactRequests: [...state.contactRequests, newRequest]
      }))

      get().addNotification({
        type: 'info',
        title: 'Solicitud Enviada',
        message: 'Tu solicitud de ampliación de servicios ha sido enviada al equipo administrativo',
        timestamp: new Date()
      })

      return { success: true, request: newRequest }
    },

    getCurrentUsage: (user, serviceType) => {
      if (!user.service_usage?.current_period) return null

      if (user.plan.subtype === 'HELP') {
        return {
          used:
            (user.plan.total_services || 10) -
            (user.service_usage.current_period.remaining_services || 0),
          total: user.plan.total_services || 10,
          remaining: user.service_usage.current_period.remaining_services || 0
        }
      }

      const breakdown = user.service_usage.current_period.breakdown
      if (serviceType && breakdown[serviceType] && typeof breakdown[serviceType] === 'object') {
        return {
          used: breakdown[serviceType].used,
          total: breakdown[serviceType].limit,
          remaining: breakdown[serviceType].limit - breakdown[serviceType].used
        }
      }

      if (user.role === 'CORPORATIVO') {
        return {
          used:
            (user.company?.contracted_services || 50) -
            (user.service_usage.current_period.remaining_services || 0),
          total: user.company?.contracted_services || 50,
          remaining: user.service_usage.current_period.remaining_services || 0
        }
      }

      if (user.role === 'EXTERNO') {
        return {
          used: 3 - (user.service_usage.current_period.individual_remaining || 0),
          total: 3,
          remaining: user.service_usage.current_period.individual_remaining || 0
        }
      }

      return null
    },

    // ========== GESTIÓN DE SOLICITUDES DE REGISTRO ==========
    submitRegistrationRequest: async (formData) => {
      const newRequest = {
        id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        requestDate: new Date().toISOString(),
        status: 'pending',
        userId: null,
        rejectionReason: null
      }

      set((state) => ({
        registrationRequests: [...state.registrationRequests, newRequest]
      }))

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return newRequest
    },

    approveRegistrationRequest: async (requestId) => {
      const request = get().registrationRequests.find((r) => r.id === requestId)
      if (!request) throw new Error('Solicitud no encontrada')

      // Crear nuevo usuario
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      const newUser = {
        id: newUserId,
        username: `${request.name.toLowerCase()}_${request.lastName.toLowerCase()}`.replace(
          /\s+/g,
          ''
        ),
        password: 'temp123', // Contraseña temporal
        role: request.planType === 'corporativo' ? 'CORPORATIVO' : 'FAMILIAR',
        profile: {
          name: `${request.name} ${request.lastName}`,
          email: request.email,
          phone: request.phone,
          dni: request.dni,
          birthDate: request.birthDate,
          address: request.address,
          district: request.district,
          city: request.city,
          emergencyContact: {
            name: request.emergencyContactName,
            phone: request.emergencyContactPhone,
            relation: request.emergencyContactRelation
          },
          medicalConditions: request.medicalConditions,
          memberSince: new Date().toISOString()
        },
        plan: {
          type: request.planType.toUpperCase(),
          subtype: request.planSubtype.toUpperCase(),
          name: get().getPlanName(request.planType, request.planSubtype),
          status: 'active',
          startDate: new Date().toISOString(),
          servicesActive: false // Inicia con servicios desactivados
        },
        service_usage: get().initializeServiceUsage(request.planType, request.planSubtype),
        billing: get().initializeBilling(request.planType, request.planSubtype)
      }

      // Persistir el nuevo usuario en la base de datos
      try {
        await databaseService.createUser(newUser)
        console.log('Usuario creado en la base de datos:', newUser.id)
      } catch (error) {
        console.error('Error al crear usuario en la base de datos:', error)
        // Continuar con la actualización local aunque falle la persistencia
      }

      // Actualizar solicitud
      set((state) => ({
        registrationRequests: state.registrationRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'approved',
                userId: newUserId,
                approvedDate: new Date().toISOString()
              }
            : r
        ),
        allUsers: {
          ...state.allUsers,
          [request.planType]: [...(state.allUsers[request.planType] || []), newUser]
        }
      }))

      // Registrar ingreso automático según el tipo de plan
      if (request.planType === 'familiar') {
        // Obtener configuración del plan y registrar suscripción
        const planConfig = get().getPlanConfiguration(request.planType, request.planSubtype)
        if (planConfig && planConfig.pricing) {
          get().registerSubscriptionRevenue(newUser, newUser.plan, planConfig.pricing)
        }
      } else if (request.planType === 'corporativo') {
        // Registrar contrato corporativo
        const planConfig = get().getPlanConfiguration(request.planType, request.planSubtype)
        const employees = request.employees || 10
        if (planConfig) {
          get().registerCorporateContract(newUser, employees, planConfig)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      return newUser
    },

    rejectRegistrationRequest: async (requestId, reason) => {
      set((state) => ({
        registrationRequests: state.registrationRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'rejected',
                rejectionReason: reason,
                rejectedDate: new Date().toISOString()
              }
            : r
        )
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    activateUserServices: async (userId) => {
      // Encontrar el usuario en todas las categorías
      const state = get()
      let userFound = false
      let userCategory = null

      Object.keys(state.allUsers).forEach((category) => {
        const userIndex = state.allUsers[category].findIndex((u) => u.id === userId)
        if (userIndex !== -1) {
          userFound = true
          userCategory = category

          set((state) => ({
            allUsers: {
              ...state.allUsers,
              [category]: state.allUsers[category].map((u) =>
                u.id === userId
                  ? {
                      ...u,
                      plan: {
                        ...u.plan,
                        servicesActive: true,
                        activationDate: new Date().toISOString()
                      }
                    }
                  : u
              )
            }
          }))
        }
      })

      if (!userFound) {
        throw new Error('Usuario no encontrado')
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    // Funciones auxiliares para inicialización
    getPlanName: (planType, planSubtype) => {
      const planNames = {
        familiar: {
          help: '',
          basico: '',
          vip: '',
          dorado: ''
        },
        corporativo: {
          area_protegida: 'Área Protegida'
        }
      }
      return planNames[planType]?.[planSubtype] || ''
    },

    initializeServiceUsage: (planType, planSubtype) => {
      if (planType === 'familiar') {
        if (planSubtype === 'help') {
          return {
            current_period: {
              total_services: 16,
              remaining_services: 16,
              services_used: 0,
              reset_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
            }
          }
        } else {
          return {
            current_period: {
              breakdown: {
                EMERGENCIA: { used: 0, limit: planSubtype === 'dorado' ? 'ILIMITADO' : 5 },
                URGENCIA: { used: 0, limit: planSubtype === 'vip' ? 8 : 3 },
                MEDICO_DOMICILIO: { used: 0, limit: planSubtype === 'vip' ? 5 : 2 },
                TRASLADO_PROGRAMADO: { used: 0, limit: planSubtype === 'vip' ? 3 : 1 }
              },
              reset_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
            }
          }
        }
      } else if (planType === 'corporativo') {
        return {
          current_period: {
            remaining_services: 50,
            services_used: 0,
            reset_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
          }
        }
      }
      return {}
    },

    initializeBilling: (planType, planSubtype) => {
      const costs = {
        familiar: {
          help: 89000,
          basico: 129000,
          vip: 189000,
          dorado: 289000
        },
        corporativo: {
          area_protegida: 450000
        }
      }

      return {
        monthly_cost: 0,
        next_billing_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        payment_method: 'pending',
        status: 'active'
      }
    },

    // ========== GESTIÓN DE AMBULANCIAS ==========
    updateAmbulanceLocation: (ambulanceId, location) => {
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.map((ambulance) =>
          ambulance.id === ambulanceId
            ? {
                ...ambulance,
                currentLocation: location,
                locationHistory: [...(ambulance.locationHistory || []).slice(-49), location] // Mantener últimas 50
              }
            : ambulance
        )
      }))
    },

    acceptEmergency: async (emergencyId, ambulanceId) => {
      // Simular aceptación de emergencia
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.map((ambulance) =>
          ambulance.id === ambulanceId ? { ...ambulance, currentStatus: 'en_route' } : ambulance
        ),
        currentEmergency: {
          id: emergencyId,
          type: 'medical',
          title: '',
          description: '',
          timestamp: new Date().toISOString(),
          location: {
            address: '',
            latitude: 0,
            longitude: 0
          },
          patient: {
            name: '',
            age: 0,
            condition: ''
          },
          contact: {
            phone: '',
            name: ''
          },
          priority: 'Alta',
          assignedAmbulance: ambulanceId
        }
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    completeEmergency: async (emergencyId, medicalData) => {
      const state = get()
      const emergency = state.currentEmergency
      const ambulanceId = emergency?.assignedAmbulance

      if (!emergency || !emergency.affiliateInfo) {
        throw new Error('No se encontró información de la emergencia o del afiliado')
      }

      // Verificar si el servicio fue reclasificado
      const wasReclassified = medicalData.actualServiceType !== medicalData.originalServiceType

      // Crear registro médico completo
      const medicalRecord = {
        id: `med_${Date.now()}`,
        emergencyId,
        patientId: emergency.affiliateInfo.id,
        patientName: emergency.affiliateInfo.name,
        patientRelation: emergency.affiliateInfo.relation,
        originalServiceType: medicalData.originalServiceType,
        actualServiceType: medicalData.actualServiceType,
        wasReclassified,
        classificationReason: medicalData.classificationReason,
        serviceDate: emergency.timestamp,
        completedDate: new Date().toISOString(),
        diagnosis: medicalData.diagnosis,
        treatment: medicalData.treatment,
        observations: medicalData.observations,
        completedBy: medicalData.completedBy,
        ambulanceUnit: medicalData.ambulanceUnit,
        // Información adicional de la emergencia
        emergencyLocation: emergency.location,
        emergencyDescription: emergency.description
      }

      // Si el servicio fue reclasificado, ajustar los contadores del plan
      if (wasReclassified && emergency.user_id) {
        const user = state.familiarUsers.find((u) => u.id === emergency.user_id)

        if (user && user.plan) {
          // Mapeo de tipos de servicio a campos del plan
          const serviceTypeToField = {
            EMERGENCIA: 'emergencies',
            URGENCIA: 'urgentCare',
            MEDICO_DOMICILIO: 'doctorVisits',
            TRASLADO: 'protectedZone'
          }

          const originalField = serviceTypeToField[medicalData.originalServiceType]
          const actualField = serviceTypeToField[medicalData.actualServiceType]

          // Solo ajustar si no fue una falsa alarma y si los campos son diferentes
          if (medicalData.actualServiceType !== 'FALSA_ALARMA' && originalField !== actualField) {
            // Restaurar el contador del servicio original (no se usó)
            if (originalField && user.plan.usage[originalField] > 0) {
              user.plan.usage[originalField]--
            }

            // Descontar del servicio real utilizado
            if (actualField) {
              // Verificar si tiene servicios disponibles
              const availableServices = user.plan.limits[actualField] - user.plan.usage[actualField]
              if (availableServices > 0 || user.plan.limits[actualField] === -1) {
                user.plan.usage[actualField]++
              }
            }

            // Actualizar el usuario en el estado
            set((state) => ({
              familiarUsers: state.familiarUsers.map((u) =>
                u.id === user.id
                  ? {
                      ...u,
                      plan: {
                        ...u.plan,
                        usage: { ...user.plan.usage }
                      }
                    }
                  : u
              )
            }))
          }
        }
      }

      // Actualizar el estado de la ambulancia
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.map((ambulance) =>
          ambulance.id === ambulanceId
            ? {
                ...ambulance,
                currentStatus: 'available',
                stats: {
                  ...ambulance.stats,
                  completedServices: (ambulance.stats?.completedServices || 0) + 1
                }
              }
            : ambulance
        ),
        currentEmergency: {
          ...state.currentEmergency,
          status: 'completed',
          medicalRecord
        }
      }))

      // Guardar en el historial médico del afiliado
      await get().saveMedicalRecord(emergency.user_id, emergency.affiliateInfo.id, medicalRecord)

      // Limpiar emergencia actual después de un momento
      setTimeout(() => {
        set({ currentEmergency: null })
      }, 2000)

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    createAmbulanceUser: async (formData) => {
      const newAmbulance = {
        id: `amb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        username: formData.username,
        password: formData.password,
        role: 'AMBULANCE',
        profile: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          license: formData.license,
          memberSince: new Date().toISOString()
        },
        ambulance: {
          unit_id: formData.unit_id,
          type: formData.type,
          plate: formData.plate,
          equipment: formData.equipment,
          capacity: parseInt(formData.capacity)
        },
        status: formData.status,
        currentStatus: 'off_duty',
        currentLocation: null,
        locationHistory: [],
        stats: {
          completedServices: 0,
          totalDistance: 0,
          averageResponseTime: 0
        },
        createdAt: new Date().toISOString()
      }

      set((state) => ({
        ambulanceUsers: [...state.ambulanceUsers, newAmbulance]
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      return newAmbulance
    },

    updateAmbulanceUser: async (ambulanceId, formData) => {
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.map((ambulance) =>
          ambulance.id === ambulanceId
            ? {
                ...ambulance,
                username: formData.username,
                ...(formData.password && { password: formData.password }),
                profile: {
                  ...ambulance.profile,
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  license: formData.license
                },
                ambulance: {
                  ...ambulance.ambulance,
                  unit_id: formData.unit_id,
                  type: formData.type,
                  plate: formData.plate,
                  equipment: formData.equipment,
                  capacity: parseInt(formData.capacity)
                },
                status: formData.status
              }
            : ambulance
        )
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    deleteAmbulanceUser: async (ambulanceId) => {
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.filter((ambulance) => ambulance.id !== ambulanceId)
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    // ========== GESTIÓN DE ASIGNACIÓN MANUAL ==========
    updateAmbulanceStatus: async (unitId, newStatus) => {
      set((state) => ({
        ambulanceUsers: state.ambulanceUsers.map((ambulance) => {
          if (ambulance.ambulance?.unit_id === unitId || ambulance.id === unitId) {
            return {
              ...ambulance,
              currentStatus: newStatus,
              lastStatusUpdate: new Date().toISOString()
            }
          }
          return ambulance
        })
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
    },

    assignUnitToEmergency: async (emergencyId, unitId) => {
      const state = get()

      // Actualizar estado de la ambulancia
      await state.updateAmbulanceStatus(unitId, 'en_route')

      // Simular asignación de emergencia (en implementación real se conectaría con backend)
      set((state) => ({
        // Agregar lógica para manejar asignaciones si es necesario
        // Por ahora solo actualizamos el estado de la ambulancia
      }))

      return { success: true }
    },

    pendingEmergencies: [], // Será poblado dinámicamente o desde backend

    // ========== GESTIÓN DE NOTAS DE EMERGENCIA ==========
    addEmergencyNote: async (emergencyId, noteData) => {
      // En una implementación real, esto se sincronizaría con el backend
      // Por ahora lo simulamos localmente
      console.log('Nota agregada a emergencia:', emergencyId, noteData)

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300))

      return { success: true, noteId: noteData.id }
    },

    // ========== GESTIÓN DE HISTORIAL MÉDICO ==========
    saveMedicalRecord: async (userId, affiliateId, medicalRecord) => {
      const state = get()

      // Buscar el usuario en allUsers
      let userFound = false
      Object.keys(state.allUsers).forEach((category) => {
        const userIndex = state.allUsers[category].findIndex((u) => u.id === userId)
        if (userIndex !== -1) {
          userFound = true

          set((state) => ({
            allUsers: {
              ...state.allUsers,
              [category]: state.allUsers[category].map((u) => {
                if (u.id === userId) {
                  // Inicializar historial médico si no existe
                  if (!u.medicalHistory) {
                    u.medicalHistory = {}
                  }

                  // Inicializar historial del afiliado si no existe
                  if (!u.medicalHistory[affiliateId]) {
                    u.medicalHistory[affiliateId] = {
                      patientInfo: {
                        name: medicalRecord.patientName,
                        relation: medicalRecord.patientRelation
                      },
                      records: [],
                      medications: []
                    }
                  }

                  // Agregar el nuevo registro
                  u.medicalHistory[affiliateId].records.push(medicalRecord)

                  // Si hay medicamentos recomendados, agregarlos a la lista
                  if (medicalRecord.recommendedMedications) {
                    const medications = medicalRecord.recommendedMedications
                      .split(',')
                      .map((med) => med.trim())
                      .filter((med) => med.length > 0)
                      .map((med) => ({
                        id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                        medication: med,
                        prescribedDate: medicalRecord.completedDate,
                        prescribedBy: medicalRecord.attendedBy,
                        emergencyId: medicalRecord.emergencyId,
                        status: 'active'
                      }))

                    u.medicalHistory[affiliateId].medications.push(...medications)
                  }

                  return u
                }
                return u
              })
            }
          }))
        }
      })

      // También actualizar el usuario actual si coincide
      if (state.currentUser && state.currentUser.id === userId) {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            medicalHistory: {
              ...state.currentUser.medicalHistory,
              [affiliateId]:
                state.allUsers[state.currentUser.role.toLowerCase()]?.find((u) => u.id === userId)
                  ?.medicalHistory?.[affiliateId] || {}
            }
          }
        }))
      }

      await new Promise((resolve) => setTimeout(resolve, 300))
    },

    getMedicalHistory: (userId, affiliateId = null) => {
      const state = get()
      let userMedicalHistory = null

      // Buscar primero en familiarUsers si existe
      if (state.familiarUsers && Array.isArray(state.familiarUsers)) {
        const familiarUser = state.familiarUsers.find((u) => u.id === userId)
        if (familiarUser && familiarUser.medicalHistory) {
          userMedicalHistory = familiarUser.medicalHistory
        }
      }

      // Si no se encuentra, buscar en allUsers
      if (!userMedicalHistory && state.allUsers) {
        Object.values(state.allUsers).forEach((users) => {
          if (Array.isArray(users)) {
            const user = users.find((u) => u.id === userId)
            if (user && user.medicalHistory) {
              userMedicalHistory = user.medicalHistory
            }
          }
        })
      }

      // Si aún no se encuentra, intentar buscar directamente en el estado
      if (!userMedicalHistory) {
        // Buscar en todos los arrays de usuarios disponibles
        const userArrays = [
          state.familiarUsers,
          state.corporateUsers,
          state.externalUsers,
          state.adminUsers
        ].filter((arr) => Array.isArray(arr))

        for (const userArray of userArrays) {
          const user = userArray.find((u) => u && u.id === userId)
          if (user && user.medicalHistory) {
            userMedicalHistory = user.medicalHistory
            break
          }
        }
      }

      if (!userMedicalHistory) return []

      if (affiliateId) {
        const history = userMedicalHistory[affiliateId]
        // Si es un array, retornarlo; si es un objeto, convertirlo en array
        if (Array.isArray(history)) {
          return history
        } else if (history && typeof history === 'object') {
          return Object.values(history)
        }
        return []
      }

      // Retornar todos los historiales como un array plano
      const allHistories = []
      Object.values(userMedicalHistory).forEach((history) => {
        if (Array.isArray(history)) {
          allHistories.push(...history)
        } else if (history && typeof history === 'object') {
          allHistories.push(history)
        }
      })

      // Ordenar por fecha más reciente primero
      return allHistories.sort((a, b) => {
        const dateA = new Date(a.completedDate || a.serviceDate || 0)
        const dateB = new Date(b.completedDate || b.serviceDate || 0)
        return dateB - dateA
      })
    },

    // ========== ACTUALIZACIÓN DE PERFIL DE USUARIO ==========
    updateUserProfile: async (userId, profileData) => {
      const state = get()

      // Encontrar el usuario actual y actualizarlo
      if (state.currentUser && state.currentUser.id === userId) {
        // Actualizar usuario actual en sesión
        const updatedUser = {
          ...state.currentUser,
          profile: {
            ...state.currentUser.profile,
            phone: profileData.phone,
            email: profileData.email
          },
          // También actualizar campos de nivel superior si existen
          phone: profileData.phone,
          email: profileData.email
        }

        set({ currentUser: updatedUser })

        // Actualizar también en allUsers si es aplicable
        const userRole = state.currentUser.role.toLowerCase()
        if (state.allUsers[userRole]) {
          set((state) => ({
            allUsers: {
              ...state.allUsers,
              [userRole]: state.allUsers[userRole].map((u) =>
                u.id === userId
                  ? {
                      ...u,
                      profile: {
                        ...u.profile,
                        phone: profileData.phone,
                        email: profileData.email
                      },
                      phone: profileData.phone,
                      email: profileData.email
                    }
                  : u
              )
            }
          }))
        }
      }

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { success: true }
    },

    // ========== TRASLADOS PROGRAMADOS ==========
    transfers: [],

    requestTransfer: async (transferData) => {
      const newTransfer = {
        ...transferData,
        id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      }

      set((state) => ({
        transfers: [...state.transfers, newTransfer]
      }))

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800))

      return { success: true, transfer: newTransfer }
    },

    getAllTransfers: async (userId) => {
      const state = get()

      // Filtrar traslados por usuario
      const userTransfers = state.transfers.filter((transfer) => transfer.userId === userId)

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300))

      return userTransfers
    },

    updateTransferStatus: async (transferId, newStatus) => {
      set((state) => ({
        transfers: state.transfers.map((transfer) =>
          transfer.id === transferId
            ? { ...transfer, status: newStatus, updatedAt: new Date().toISOString() }
            : transfer
        )
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    },

    cancelTransfer: async (transferId) => {
      set((state) => ({
        transfers: state.transfers.map((transfer) =>
          transfer.id === transferId
            ? {
                ...transfer,
                status: 'cancelled',
                cancelledAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : transfer
        )
      }))

      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    },

    getTransferById: (transferId) => {
      const state = get()
      return state.transfers.find((transfer) => transfer.id === transferId)
    },

    // ========== CONFIGURACIÓN DEL SISTEMA ==========
    updateSystemSettings: async (newSettings) => {
      // En una implementación real, esto se sincronizaría con el backend
      set((state) => ({
        systemSettings: {
          ...state.systemSettings,
          ...newSettings
        }
      }))

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return { success: true }
    },

    getSystemSettings: () => {
      return get().systemSettings
    },

    // ========== COMPRA DE SERVICIOS ADICIONALES ==========
    purchaseAdditionalServices: async (userId, quantity, paymentData) => {
      const state = get()

      // Actualizar usuario actual si coincide
      if (state.currentUser && state.currentUser.id === userId) {
        const updatedUser = {
          ...state.currentUser,
          service_usage: {
            ...state.currentUser.service_usage,
            current_period: {
              ...state.currentUser.service_usage.current_period,
              remaining_services:
                (state.currentUser.service_usage.current_period.remaining_services || 0) + quantity,
              total_limit:
                (state.currentUser.service_usage.current_period.total_limit || 0) + quantity
            }
          }
        }

        set({ currentUser: updatedUser })
      }

      // Actualizar en allUsers también
      Object.keys(state.allUsers).forEach((category) => {
        const userIndex = state.allUsers[category].findIndex((u) => u.id === userId)
        if (userIndex !== -1) {
          set((state) => ({
            allUsers: {
              ...state.allUsers,
              [category]: state.allUsers[category].map((u) =>
                u.id === userId
                  ? {
                      ...u,
                      service_usage: {
                        ...u.service_usage,
                        current_period: {
                          ...u.service_usage.current_period,
                          remaining_services:
                            (u.service_usage.current_period.remaining_services || 0) + quantity,
                          total_limit: (u.service_usage.current_period.total_limit || 0) + quantity
                        }
                      }
                    }
                  : u
              )
            }
          }))
        }
      })

      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return { success: true, transactionId: `PAY-${Date.now()}` }
    },

    // ========== ESTADO GENERAL ==========
    setLoading: (loading) => set({ isLoading: loading }),

    // ========== GESTIÓN DE TIEMPO DE LLEGADA (ADMIN) ==========
    setEstimatedArrivalTime: (emergencyId, minutes) => {
      // Actualizar el tiempo estimado de llegada para una emergencia específica
      set((state) => {
        const updatedEmergencies = state.activeEmergencies.map((emg) =>
          emg.id === emergencyId
            ? { ...emg, estimatedArrivalTime: minutes, lastUpdated: new Date() }
            : emg
        )

        // Si es la emergencia actual, actualizar también
        if (state.currentEmergency?.id === emergencyId) {
          return {
            activeEmergencies: updatedEmergencies,
            estimatedArrivalTime: minutes,
            currentEmergency: {
              ...state.currentEmergency,
              estimatedArrivalTime: minutes
            }
          }
        }

        return { activeEmergencies: updatedEmergencies }
      })

      // Notificar al usuario (solo admin ve esta notificación)
      get().addNotification({
        type: 'info',
        title: 'Tiempo de llegada actualizado',
        message: `Tiempo estimado: ${minutes} minutos`,
        timestamp: new Date()
      })
    },

    updateEmergencyStatus: (emergencyId, status, additionalData = {}) => {
      set((state) => {
        const updatedEmergencies = state.activeEmergencies.map((emg) =>
          emg.id === emergencyId
            ? { ...emg, status, ...additionalData, lastUpdated: new Date() }
            : emg
        )

        if (state.currentEmergency?.id === emergencyId) {
          return {
            activeEmergencies: updatedEmergencies,
            emergencyStatus: status,
            currentEmergency: {
              ...state.currentEmergency,
              status,
              ...additionalData
            }
          }
        }

        return { activeEmergencies: updatedEmergencies }
      })
    },

    // ========== GESTIÓN DE ENCUESTAS DE SATISFACCIÓN ==========
    submitSurvey: async (surveyData) => {
      try {
        // Agregar la respuesta a la lista
        set((state) => ({
          surveyResponses: [
            ...state.surveyResponses,
            {
              id: `survey_${Date.now()}`,
              userId: state.currentUser?.id,
              userType: state.currentUser?.role === 'CORPORATIVO' ? 'corporativo' : 'familiar',
              ...surveyData
            }
          ],
          // Remover de pendientes si existe
          pendingSurveys: state.pendingSurveys.filter((s) => s.serviceId !== surveyData.serviceId)
        }))

        // Notificar al usuario
        get().addNotification({
          type: 'success',
          title: 'Encuesta Enviada',
          message: 'Gracias por tu retroalimentación',
          timestamp: new Date()
        })

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Error al enviar la encuesta' }
      }
    },

    updateSurveyQuestions: async (questions) => {
      try {
        set({ surveyQuestions: questions })

        // Notificar actualización
        get().addNotification({
          type: 'info',
          title: 'Preguntas Actualizadas',
          message: 'Las preguntas de la encuesta han sido modificadas',
          timestamp: new Date()
        })

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Error al actualizar preguntas' }
      }
    },

    getSurveyAnalytics: () => {
      const responses = get().surveyResponses

      if (responses.length === 0) {
        return {
          totalResponses: 0,
          averageRating: 0,
          nps: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      }

      // Calcular métricas
      const totalResponses = responses.length
      const averageRating =
        responses.reduce((sum, r) => sum + parseFloat(r.average), 0) / totalResponses

      // Calcular distribución
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      responses.forEach((r) => {
        const avg = Math.round(parseFloat(r.average))
        distribution[avg]++
      })

      // Calcular NPS (basado en pregunta 5 - recomendación)
      const npsRatings = responses.map((r) => r.ratings.question5).filter((r) => r)
      const promoters = npsRatings.filter((r) => r >= 4).length
      const detractors = npsRatings.filter((r) => r <= 2).length
      const nps =
        npsRatings.length > 0 ? Math.round(((promoters - detractors) / npsRatings.length) * 100) : 0

      return {
        totalResponses,
        averageRating: averageRating.toFixed(1),
        nps,
        distribution,
        responses
      }
    },

    addPendingSurvey: (serviceId, serviceType) => {
      set((state) => ({
        pendingSurveys: [
          ...state.pendingSurveys,
          {
            serviceId,
            serviceType,
            createdAt: new Date()
          }
        ]
      }))
    },

    // ========== GESTIÓN DE SERVICIOS ADICIONALES ==========
    addExtraServices: async (userId, userType, extras) => {
      set((state) => {
        const updateUser = (user) => {
          if (!user || user.id !== userId) return user

          const newUser = { ...user }

          // Para plan HELP - agregar servicios generales
          if (user.plan?.subtype === 'HELP' && extras.generalServices) {
            const currentRemaining = user.service_usage?.current_period?.remaining_services || 0
            newUser.service_usage = {
              ...user.service_usage,
              current_period: {
                ...user.service_usage?.current_period,
                remaining_services: currentRemaining + extras.generalServices,
                extra_services:
                  (user.service_usage?.current_period?.extra_services || 0) + extras.generalServices
              }
            }
          }
          // Para otros planes - agregar servicios específicos
          else {
            const breakdown = { ...user.service_usage?.current_period?.breakdown }

            // Para corporativos - solo servicios de emergencia
            if (extras.emergency > 0) {
              const currentRemaining = user.service_usage?.current_period?.remaining_services || 0
              const currentContractServices = user.plan?.contract_services || 0
              console.log('Agregando emergencias para corporativo:', {
                userId,
                currentRemaining,
                currentContractServices,
                toAdd: extras.emergency,
                newRemaining: currentRemaining + extras.emergency,
                newContract: currentContractServices + extras.emergency
              })

              // Actualizar tanto el plan como el uso de servicios
              newUser.plan = {
                ...user.plan,
                contract_services: currentContractServices + extras.emergency
              }

              newUser.service_usage = {
                ...user.service_usage,
                current_period: {
                  ...user.service_usage?.current_period,
                  remaining_services: currentRemaining + extras.emergency,
                  extra_services:
                    (user.service_usage?.current_period?.extra_services || 0) + extras.emergency,
                  extra_services_added: true,
                  extra_services_date: new Date().toISOString()
                }
              }
              return newUser
            }

            if (extras.urgencias > 0) {
              breakdown.URGENCIA = {
                ...breakdown.URGENCIA,
                limit: (breakdown.URGENCIA?.limit || 0) + extras.urgencias,
                extra: (breakdown.URGENCIA?.extra || 0) + extras.urgencias
              }
            }

            if (extras.medico > 0) {
              breakdown.MEDICO_DOMICILIO = {
                ...breakdown.MEDICO_DOMICILIO,
                limit: (breakdown.MEDICO_DOMICILIO?.limit || 0) + extras.medico,
                extra: (breakdown.MEDICO_DOMICILIO?.extra || 0) + extras.medico
              }
            }

            if (extras.traslados > 0) {
              breakdown.TRASLADO_PROGRAMADO = {
                ...breakdown.TRASLADO_PROGRAMADO,
                limit: (breakdown.TRASLADO_PROGRAMADO?.limit || 0) + extras.traslados,
                extra: (breakdown.TRASLADO_PROGRAMADO?.extra || 0) + extras.traslados
              }
            }

            if (extras.examenes > 0) {
              breakdown.EXAMENES_LABORATORIO = {
                ...breakdown.EXAMENES_LABORATORIO,
                limit: (breakdown.EXAMENES_LABORATORIO?.limit || 0) + extras.examenes,
                extra: (breakdown.EXAMENES_LABORATORIO?.extra || 0) + extras.examenes
              }
            }

            newUser.service_usage = {
              ...user.service_usage,
              current_period: {
                ...user.service_usage?.current_period,
                breakdown,
                extra_services_added: true,
                extra_services_date: new Date().toISOString()
              }
            }
          }

          return newUser
        }

        // Actualizar en allUsers
        const newAllUsers = { ...state.allUsers }
        if (newAllUsers[userType]) {
          newAllUsers[userType] = newAllUsers[userType].map(updateUser)
        }

        // También actualizar en familiarUsers si es tipo familiar
        let newFamiliarUsers = state.familiarUsers
        if (userType === 'familiar') {
          newFamiliarUsers = state.familiarUsers?.map(updateUser)
        }

        // También actualizar en corporateUsers si es tipo corporativo
        let newCorporateUsers = state.corporateUsers
        if (userType === 'corporativo') {
          newCorporateUsers = state.corporateUsers?.map(updateUser)
        }

        // También actualizar currentUser si es el usuario actual
        let newCurrentUser = state.currentUser
        if (state.currentUser && state.currentUser.id === userId) {
          newCurrentUser = updateUser(state.currentUser)
        }

        return {
          allUsers: newAllUsers,
          familiarUsers: newFamiliarUsers,
          corporateUsers: newCorporateUsers,
          currentUser: newCurrentUser
        }
      })

      // Persistir cambios en la base de datos
      const state = get()
      const updatedUser = state.allUsers[userType]?.find(u => u.id === userId)
      if (updatedUser) {
        try {
          await databaseService.updateUser(userId, updatedUser)
          console.log('Usuario actualizado en la base de datos con servicios adicionales')
        } catch (error) {
          console.error('Error al actualizar usuario en la base de datos:', error)
        }
      }

      console.log('Servicios adicionales agregados para usuario:', userId, extras)
    },

    // ========== CONSUMIR SERVICIOS ==========
    consumeServices: async (userId, userType, amount) => {
      set((state) => {
        const updateUser = (user) => {
          if (!user || user.id !== userId) return user

          const newUser = { ...user }
          const currentUsed = user.service_usage?.current_period?.used_services || 0
          const currentRemaining = user.service_usage?.current_period?.remaining_services || 0

          // Aumentar servicios consumidos y disminuir disponibles
          newUser.service_usage = {
            ...user.service_usage,
            current_period: {
              ...user.service_usage?.current_period,
              used_services: currentUsed + amount,
              remaining_services: Math.max(0, currentRemaining - amount)
            }
          }

          return newUser
        }

        // Actualizar en allUsers
        const newAllUsers = { ...state.allUsers }
        if (newAllUsers[userType]) {
          newAllUsers[userType] = newAllUsers[userType].map(updateUser)
        }

        // También actualizar en familiarUsers si es tipo familiar
        let newFamiliarUsers = state.familiarUsers
        if (userType === 'familiar') {
          newFamiliarUsers = state.familiarUsers?.map(updateUser)
        }

        // También actualizar en corporateUsers si es tipo corporativo
        let newCorporateUsers = state.corporateUsers
        if (userType === 'corporativo') {
          newCorporateUsers = state.corporateUsers?.map(updateUser)
        }

        // También actualizar currentUser si es el usuario actual
        let newCurrentUser = state.currentUser
        if (state.currentUser && state.currentUser.id === userId) {
          newCurrentUser = updateUser(state.currentUser)
        }

        return {
          allUsers: newAllUsers,
          familiarUsers: newFamiliarUsers,
          corporateUsers: newCorporateUsers,
          currentUser: newCurrentUser
        }
      })

      // Persistir cambios en la base de datos
      const state = get()
      const updatedUser = state.allUsers[userType]?.find(u => u.id === userId)
      if (updatedUser) {
        try {
          await databaseService.updateUser(userId, updatedUser)
          console.log('Usuario actualizado en la base de datos después de consumir servicios')
        } catch (error) {
          console.error('Error al actualizar usuario en la base de datos:', error)
        }
      }

      console.log('Servicios consumidos para usuario:', userId, amount)
    },

    // ========== HELPERS DE CONFIGURACIÓN ==========
    getPlanConfiguration: (planType, planSubtype) => {
      // Mock de configuración de planes - debería venir de PlanConfiguration
      const configs = {
        familiar: {
          HELP: { name: '', pricing: { annually: 0 } },
          BASICO: { name: '', pricing: { annually: 0 } },
          VIP: { name: '', pricing: { annually: 0 } },
          DORADO: { name: '', pricing: { annually: 0 } }
        },
        corporativo: {
          EMPRESARIAL_BASICO: { name: '', pricing: { per_employee: 0 } },
          EMPRESARIAL_PREMIUM: { name: '', pricing: { per_employee: 0 } }
        }
      }
      return configs[planType]?.[planSubtype] || null
    },

    // ========== GESTIÓN DE TRANSACCIONES FINANCIERAS ==========
    addTransaction: (transaction) => {
      const newTransaction = {
        id: `TRX-${Date.now()}`,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: 'COMPLETED',
        ...transaction
      }

      set((state) => {
        const updatedTransactions = [...state.transactions, newTransaction]
        const updatedSummary = get().calculateRevenueSummary(updatedTransactions)

        return {
          transactions: updatedTransactions,
          revenueSummary: updatedSummary
        }
      })

      return newTransaction
    },

    calculateRevenueSummary: (transactions) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisWeek = new Date(today)
      thisWeek.setDate(today.getDate() - 7)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisYear = new Date(now.getFullYear(), 0, 1)

      const summary = {
        totalRevenue: 0,
        byType: {
          SUBSCRIPTION: 0,
          ADDITIONAL_SERVICE: 0,
          CORPORATE_CONTRACT: 0,
          PARTICULAR: 0,
          MANUAL_ENTRY: 0
        },
        byPlan: {},
        byPeriod: {
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          thisYear: 0
        }
      }

      transactions.forEach((transaction) => {
        if (transaction.status === 'COMPLETED') {
          const amount = transaction.amount || 0
          const transactionDate = new Date(transaction.date)

          // Total general
          summary.totalRevenue += amount

          // Por tipo
          if (summary.byType[transaction.type] !== undefined) {
            summary.byType[transaction.type] += amount
          }

          // Por plan
          if (transaction.planType) {
            if (!summary.byPlan[transaction.planType]) {
              summary.byPlan[transaction.planType] = 0
            }
            summary.byPlan[transaction.planType] += amount
          }

          // Por período
          if (transactionDate >= today) {
            summary.byPeriod.today += amount
          }
          if (transactionDate >= thisWeek) {
            summary.byPeriod.thisWeek += amount
          }
          if (transactionDate >= thisMonth) {
            summary.byPeriod.thisMonth += amount
          }
          if (transactionDate >= thisYear) {
            summary.byPeriod.thisYear += amount
          }
        }
      })

      return summary
    },

    registerSubscriptionRevenue: (user, plan, pricing) => {
      const transaction = {
        type: 'SUBSCRIPTION',
        category: 'AUTOMATIC',
        userId: user.id,
        userName: user.name,
        planType: plan.name,
        concept: `Suscripción anual - ${plan.name}`,
        amount: pricing.annually || 0,
        paymentMethod: 'PENDING',
        notes: `Usuario creado por administrador`,
        createdBy: 'SYSTEM'
      }

      return get().addTransaction(transaction)
    },

    registerCorporateContract: (company, employees, planData) => {
      const annualAmount = employees * (planData.pricing?.per_employee || 0) * 12
      const transaction = {
        type: 'CORPORATE_CONTRACT',
        category: 'AUTOMATIC',
        companyId: company.id,
        companyName: company.name,
        concept: `Contrato corporativo - ${company.name} (${employees} empleados)`,
        amount: annualAmount,
        paymentMethod: 'INVOICE',
        recurring: true,
        notes: `Plan: ${planData.name}, Empleados: ${employees}`,
        createdBy: 'SYSTEM'
      }

      return get().addTransaction(transaction)
    },

    registerAdditionalService: (user, serviceType, cost) => {
      const transaction = {
        type: 'ADDITIONAL_SERVICE',
        category: 'AUTOMATIC',
        userId: user.id,
        userName: user.name,
        concept: `Servicio adicional - ${serviceType}`,
        amount: cost,
        paymentMethod: 'PENDING',
        notes: `Servicio que excede límites del plan`,
        createdBy: 'SYSTEM'
      }

      return get().addTransaction(transaction)
    },

    registerManualTransaction: (transactionData) => {
      const transaction = {
        ...transactionData,
        type: transactionData.type || 'MANUAL_ENTRY',
        category: 'MANUAL',
        createdBy: get().currentUser?.id || 'ADMIN'
      }

      return get().addTransaction(transaction)
    },

    updateTransaction: (transactionId, updates) => {
      set((state) => {
        const updatedTransactions = state.transactions.map((t) =>
          t.id === transactionId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        )

        return {
          transactions: updatedTransactions,
          revenueSummary: get().calculateRevenueSummary(updatedTransactions)
        }
      })
    },

    deleteTransaction: (transactionId) => {
      set((state) => {
        const updatedTransactions = state.transactions.filter((t) => t.id !== transactionId)

        return {
          transactions: updatedTransactions,
          revenueSummary: get().calculateRevenueSummary(updatedTransactions)
        }
      })
    },

    // ========== FUNCIONES DE ACTUALIZACIÓN PARA HOOKS ==========
    setAllUsers: (usersByRole) => set({ allUsers: usersByRole }),
    setActiveEmergencies: (emergencies) => set({ activeEmergencies: emergencies }),
    setAmbulanceUsers: (ambulanceUsers) => set({ ambulanceUsers: ambulanceUsers }),
    setSurveyResponses: (responses) => set({ surveyResponses: responses }),
    setNotifications: (notifications) => set({ notifications: notifications })
  }

  // Exponer el store globalmente para acceso desde mockdata
  if (typeof window !== 'undefined') {
    window.__helpmed_store__ = { getState: () => get() }
  }

  return store
})

export default useAppStore
