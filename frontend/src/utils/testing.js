// Utilidades avanzadas para testing

// Mock data generators
export const mockDataGenerators = {
  // Generar usuario aleatorio
  generateUser: (type = 'FAMILIAR', plan = 'BASICO') => ({
    id: `${type}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    email: `user${Math.floor(Math.random() * 1000)}@test.com`,
    password: 'password123',
    role: type,
    status: 'ACTIVO',
    profile: {
      name: `Usuario Test ${Math.floor(Math.random() * 1000)}`,
      rut: `${Math.floor(Math.random() * 20000000) + 10000000}-${Math.floor(Math.random() * 10)}`,
      phone: `+51 9 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      address: 'Dirección Test 123, Lima',
      birthDate: '1990-01-01'
    },
    plan: plan,
    limits: generateLimitsForPlan(plan),
    usage: generateRandomUsage()
  }),

  // Generar emergencia aleatoria
  generateEmergency: (userId) => ({
    id: `EMG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    userId,
    type: ['EMERGENCIA', 'URGENCIA', 'CONSULTA'][Math.floor(Math.random() * 3)],
    priority: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'][Math.floor(Math.random() * 4)],
    status: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'][Math.floor(Math.random() * 4)],
    description: 'Emergencia de prueba generada automáticamente',
    location: {
      address: 'Ubicación Test, Lima',
      coordinates: { lat: -33.4489, lng: -70.6693 }
    },
    timestamp: new Date().toISOString(),
    assignedUnit: `AMB-${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`
  }),

  // Generar unidad médica aleatoria
  generateUnit: () => ({
    id: `AMB-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
    name: `Ambulancia ${Math.floor(Math.random() * 100) + 1}`,
    type: ['AMBULANCIA_BASICA', 'AMBULANCIA_AVANZADA', 'UNIDAD_MOVIL'][
      Math.floor(Math.random() * 3)
    ],
    status: ['DISPONIBLE', 'EN_SERVICIO', 'MANTENIMIENTO'][Math.floor(Math.random() * 3)],
    location: {
      lat: -33.4489 + (Math.random() - 0.5) * 0.1,
      lng: -70.6693 + (Math.random() - 0.5) * 0.1,
      address: 'Ubicación Test, Lima'
    },
    crew: [
      { name: 'Dr. Test', role: 'Médico' },
      { name: 'Enfermero Test', role: 'Enfermero' }
    ]
  })
}

// Helpers para generar datos relacionados
const generateLimitsForPlan = (plan) => {
  const limits = {
    HELP: { EMERGENCIA: 'ILIMITADO', URGENCIA: 'ILIMITADO', MEDICO_DOMICILIO: 0 },
    BASICO: { EMERGENCIA: 'ILIMITADO', URGENCIA: 3, MEDICO_DOMICILIO: 2 },
    VIP: { EMERGENCIA: 'ILIMITADO', URGENCIA: 6, MEDICO_DOMICILIO: 4 },
    DORADO: { EMERGENCIA: 'ILIMITADO', URGENCIA: 'ILIMITADO', MEDICO_DOMICILIO: 8 }
  }
  return limits[plan] || limits.BASICO
}

const generateRandomUsage = () => ({
  EMERGENCIA: Math.floor(Math.random() * 5),
  URGENCIA: Math.floor(Math.random() * 3),
  MEDICO_DOMICILIO: Math.floor(Math.random() * 2),
  TRASLADO_PROGRAMADO: Math.floor(Math.random() * 2)
})

// Test utilities para componentes React
export const renderWithProviders = (component, options = {}) => {
  const { initialState = {}, ...renderOptions } = options

  // Wrapper que incluye providers necesarios
  const Wrapper = ({ children }) => {
    return <div data-testid="test-wrapper">{children}</div>
  }

  return { ...render(component, { wrapper: Wrapper, ...renderOptions }) }
}

// Simuladores de eventos
export const simulateEvent = {
  click: (element) => {
    element.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    )
  },

  change: (element, value) => {
    const event = new Event('change', { bubbles: true })
    element.value = value
    element.dispatchEvent(event)
  },

  keyPress: (element, key) => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true
      })
    )
  }
}

// Validadores personalizados para testing
export const testValidators = {
  // Validar estructura de usuario
  validateUserStructure: (user) => {
    const requiredFields = ['id', 'email', 'role', 'profile', 'plan']
    const requiredProfileFields = ['name', 'rut', 'phone']

    for (const field of requiredFields) {
      if (!user[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    for (const field of requiredProfileFields) {
      if (!user.profile[field]) {
        throw new Error(`Missing required profile field: ${field}`)
      }
    }

    return true
  },

  // Validar estructura de emergencia
  validateEmergencyStructure: (emergency) => {
    const requiredFields = ['id', 'userId', 'type', 'status', 'timestamp']

    for (const field of requiredFields) {
      if (!emergency[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    return true
  },

  // Validar límites de servicio
  validateServiceLimits: (user, serviceType) => {
    const limits = user.limits[serviceType]
    const usage = user.usage[serviceType] || 0

    if (limits === 'ILIMITADO') return true
    if (typeof limits === 'number' && usage <= limits) return true

    return false
  }
}

// Performance testing utilities
export const performanceTests = {
  // Medir tiempo de renderizado
  measureRenderTime: async (component) => {
    const start = performance.now()
    render(component)
    const end = performance.now()
    return end - start
  },

  // Medir tiempo de respuesta de función
  measureFunctionTime: (fn, ...args) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()

    return {
      result,
      executionTime: end - start
    }
  },

  // Test de stress para componentes con muchos datos
  stressTest: (component, dataCount = 1000) => {
    const largeDataSet = Array.from({ length: dataCount }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      data: `Data for item ${i}`
    }))

    const start = performance.now()
    render(component, { props: { data: largeDataSet } })
    const end = performance.now()

    return {
      dataCount,
      renderTime: end - start,
      averageTimePerItem: (end - start) / dataCount
    }
  }
}

// Mocks para APIs
export const apiMocks = {
  // Mock successful API response
  mockSuccessResponse: (data) => ({
    ok: true,
    status: 200,
    json: async () => ({ success: true, data }),
    text: async () => JSON.stringify({ success: true, data })
  }),

  // Mock error API response
  mockErrorResponse: (status = 500, message = 'Internal Server Error') => ({
    ok: false,
    status,
    json: async () => ({ success: false, error: message }),
    text: async () => JSON.stringify({ success: false, error: message })
  }),

  // Mock fetch function
  mockFetch: (responses) => {
    const mockFn = jest.fn()
    responses.forEach((response, index) => {
      mockFn.mockReturnValueOnce(Promise.resolve(response))
    })
    global.fetch = mockFn
    return mockFn
  }
}

// Utilidades para testing de estado
export const stateTestUtils = {
  // Crear estado inicial para testing
  createInitialState: (overrides = {}) => ({
    currentUser: null,
    currentScreen: 'login',
    isLoading: false,
    error: null,
    users: [],
    emergencies: [],
    units: [],
    ...overrides
  }),

  // Verificar transiciones de estado
  verifyStateTransition: (beforeState, afterState, expectedChanges) => {
    const changes = {}

    for (const key in expectedChanges) {
      if (beforeState[key] !== afterState[key]) {
        changes[key] = {
          before: beforeState[key],
          after: afterState[key],
          expected: expectedChanges[key]
        }
      }
    }

    return changes
  }
}

// Simuladores de dispositivos y condiciones
export const deviceSimulators = {
  // Simular conexión lenta
  simulateSlowConnection: (delay = 2000) => {
    const originalFetch = global.fetch
    global.fetch = async (...args) => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return originalFetch(...args)
    }

    return () => {
      global.fetch = originalFetch
    }
  },

  // Simular offline
  simulateOffline: () => {
    const originalOnLine = navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    })

    return () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: originalOnLine
      })
    }
  },

  // Simular dispositivo móvil
  simulateMobile: () => {
    const originalUserAgent = navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 667
    })

    return () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: originalUserAgent
      })
    }
  }
}

// Utilities para testing de accesibilidad
export const accessibilityTests = {
  // Verificar contraste de colores
  checkColorContrast: (backgroundColor, textColor) => {
    // Implementación simplificada
    const bgLuminance = getRelativeLuminance(backgroundColor)
    const textLuminance = getRelativeLuminance(textColor)

    const contrast =
      (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05)

    return {
      contrast,
      passAA: contrast >= 4.5,
      passAAA: contrast >= 7
    }
  },

  // Verificar navegación por teclado
  checkKeyboardNavigation: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    return {
      focusableCount: focusableElements.length,
      hasFocusableElements: focusableElements.length > 0,
      elements: Array.from(focusableElements)
    }
  }
}

// Helper function para luminancia relativa
const getRelativeLuminance = (color) => {
  // Implementación simplificada para colores hex
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  return 0.5 // Default para otros formatos
}

// Test runners personalizados
export const customTestRunners = {
  // Ejecutar test de integración
  runIntegrationTest: async (testSuite) => {
    const results = []

    for (const test of testSuite) {
      const start = performance.now()
      try {
        await test.fn()
        results.push({
          name: test.name,
          status: 'passed',
          duration: performance.now() - start
        })
      } catch (error) {
        results.push({
          name: test.name,
          status: 'failed',
          error: error.message,
          duration: performance.now() - start
        })
      }
    }

    return results
  },

  // Ejecutar test de carga
  runLoadTest: async (testFn, iterations = 100) => {
    const results = []
    const start = performance.now()

    for (let i = 0; i < iterations; i++) {
      const iterationStart = performance.now()
      try {
        await testFn()
        results.push({
          iteration: i + 1,
          status: 'passed',
          duration: performance.now() - iterationStart
        })
      } catch (error) {
        results.push({
          iteration: i + 1,
          status: 'failed',
          error: error.message,
          duration: performance.now() - iterationStart
        })
      }
    }

    const totalDuration = performance.now() - start
    const passed = results.filter((r) => r.status === 'passed').length
    const failed = results.filter((r) => r.status === 'failed').length

    return {
      totalIterations: iterations,
      passed,
      failed,
      passRate: (passed / iterations) * 100,
      totalDuration,
      averageDuration: totalDuration / iterations,
      results
    }
  }
}

export default {
  mockDataGenerators,
  renderWithProviders,
  simulateEvent,
  testValidators,
  performanceTests,
  apiMocks,
  stateTestUtils,
  deviceSimulators,
  accessibilityTests,
  customTestRunners
}
