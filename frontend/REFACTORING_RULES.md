# 📋 Reglas de Refactorización - HelpMED Frontend

## 🎯 **Objetivo**
Transformar el código actual en una aplicación mantenible, segura y escalable sin comprometer la funcionalidad existente.

---

## 🔑 **1. CREDENCIALES Y URLs**

### ❌ **Prohibido Absoluto**
- Hardcodear credenciales reales o tokens de producción
- URLs de endpoints productivos en el código

### ✅ **Permitido Solo para Desarrollo**
```javascript
// ✅ BIEN - Mocks/dummies aislados
// src/mocks/auth.js
export const MOCK_USERS = {
  admin: { username: 'admin', password: 'demo123' },
  familiar: { username: 'familiar', password: 'demo123' }
}

// ❌ MAL - En componentes de producción
const LoginScreen = () => {
  const adminPass = 'admin123' // ❌ NUNCA
}
```

### 📁 **Ubicación Obligatoria**
- Todos los mocks en `src/mocks/` o `src/__fixtures__/`
- Separados del código de producción
- Con comentarios claros de "SOLO DESARROLLO"

---

## 🖼️ **2. SEPARACIÓN UI Y LÓGICA - ENFOQUE BALANCEADO**

### 🎯 **Principio Fundamental**
**Separación pragmática: Lógica de negocio compleja en hooks, estructura y presentación en componentes.**

### 🔄 **Enfoque Balanceado - Lo que va en cada lugar**

#### **En Hooks/Services (Lógica)**
- ✅ Llamadas a API y fetching de datos
- ✅ Transformación compleja de datos
- ✅ Validaciones de negocio
- ✅ Cálculos y algoritmos complejos
- ✅ Estado complejo y side effects
- ✅ Clases CSS dinámicas (basadas en estado)

#### **En Componentes (Presentación)**
- ✅ Estructura HTML/JSX
- ✅ Clases CSS estáticas
- ✅ Textos y labels estáticos
- ✅ Mapeos simples sin lógica
- ✅ Validaciones triviales (ej: `hasAccess = user?.role === 'ADMIN'`)
- ✅ Configuración local de componentes

### ❌ **Prohibido - Mezcla Compleja**
```javascript
// ❌ MAL - Lógica compleja mezclada
const UserDashboard = () => {
  const [users, setUsers] = useState([])
  
  // ❌ Fetch directo en componente
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers)
  }, [])
  
  // ❌ Cálculos complejos en componente
  const processedData = users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`,
    age: calculateAge(u.birthDate),
    permissions: calculatePermissions(u.role)
  }))
  
  return <div>{/* UI */}</div>
}
```

### ✅ **Correcto - Enfoque Balanceado**
```javascript
// ✅ BIEN - Componente con estructura visible
const UserDashboard = () => {
  // Hook maneja lógica compleja
  const { users, loading, error } = useUsers()
  const { processedUsers } = useProcessedUsers(users)
  
  // Validación simple local es aceptable
  const isEmpty = users.length === 0
  
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} />
  
  // Estructura y clases estáticas en el componente
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
      {isEmpty ? (
        <p className="text-gray-500">No hay usuarios</p>
      ) : (
        <UserList users={processedUsers} />
      )}
    </div>
  )
}

// src/hooks/useUsers.js - Solo lógica de negocio
export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  return { users, loading, error }
}
```

### 📊 **Guía de Decisión**

| Situación | Va en Hook | Va en Componente |
|-----------|------------|------------------|
| `className="bg-white rounded"` | ❌ | ✅ |
| `className={isActive ? 'bg-blue' : 'bg-gray'}` | ✅ | ❌ |
| `const hasAccess = user?.role === 'ADMIN'` | ❌ | ✅ (trivial) |
| `const permissions = calculateComplexPermissions(user)` | ✅ | ❌ |
| Mapeo simple: `users.map(u => <UserCard />)` | ❌ | ✅ |
| Transformación: `users.filter().sort().group()` | ✅ | ❌ |

### 📝 **Regla de Oro Actualizada**
> **Pragmatismo sobre dogma**: Si mover algo al hook no mejora testabilidad, reusabilidad o claridad → déjalo en el componente

---

## 📦 **3. COMPONENTES PEQUEÑOS Y CLAROS**

### 📏 **Límites Estrictos**
- **Máximo absoluto**: 200 líneas por componente
- **Recomendado**: 150 líneas o menos
- **Si supera**: Dividir inmediatamente

### 🔍 **Criterios para Dividir**
```javascript
// ❌ MAL - Componente que hace múltiples cosas
const ComplexDashboard = () => {
  // 50 líneas de lógica de autenticación
  // 40 líneas de manejo de datos
  // 60 líneas de UI principal  
  // 30 líneas de modales
  // 20 líneas de formularios
  // = 200+ líneas → DIVIDIR
}

// ✅ BIEN - Componentes enfocados
const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardStats />
      <DashboardContent />
      <DashboardModals />
    </DashboardLayout>
  )
}
```

### 📋 **Checklist para División**
- [ ] ¿El componente hace más de una cosa principal?
- [ ] ¿Hay secciones que podrían ser reutilizables?
- [ ] ¿El nombre del componente es muy genérico?
- [ ] ¿Hay más de 3 useEffect diferentes?

---

## 🔒 **4. VALIDACIÓN DE INPUTS**

### 🛡️ **Regla Absoluta**
**Todo input del usuario DEBE validarse antes de llegar al backend.**

### 📚 **Librerías Recomendadas**
- **Yup**: Esquemas de validación
- **Zod**: TypeScript-first validation
- **React Hook Form**: Formularios performantes

### ✅ **Implementación Correcta**
```javascript
// src/schemas/userSchema.js
import * as yup from 'yup'

export const userSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email requerido'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Debe contener letras y números')
    .required('Password requerido'),
  age: yup
    .number()
    .min(18, 'Debe ser mayor de edad')
    .max(120, 'Edad inválida')
    .required('Edad requerida')
})

// En componente
const UserForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema)
  })
  
  const onSubmit = (data) => {
    // data ya está validada
    userService.create(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

### ❌ **Validación Insuficiente**
```javascript
// ❌ MAL - Sin validación
const handleSubmit = (data) => {
  api.post('/users', data) // Datos sin validar al backend
}

// ❌ MAL - Validación básica
const handleSubmit = (data) => {
  if (!data.email) return // Validación insuficiente
  api.post('/users', data)
}
```

---

## ⚡ **5. LAZY LOADING EN RUTAS**

### 🎯 **Objetivo**
El bundle inicial NO debe superar 200kb.

### ✅ **Implementación Obligatoria**
```javascript
// src/App.jsx
import { lazy, Suspense } from 'react'

// ✅ Lazy loading para rutas pesadas
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const FamiliarDashboard = lazy(() => import('./components/familiar/FamiliarDashboard'))
const CorporateDashboard = lazy(() => import('./components/corporate/CorporateDashboard'))

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} /> {/* Ruta crítica sin lazy */}
      
      <Route path="/admin/*" element={
        <Suspense fallback={<DashboardSkeleton />}>
          <AdminDashboard />
        </Suspense>
      } />
      
      <Route path="/familiar/*" element={
        <Suspense fallback={<DashboardSkeleton />}>
          <FamiliarDashboard />
        </Suspense>
      } />
    </Routes>
  </BrowserRouter>
)
```

### 📊 **Análisis de Bundle**
```bash
# Comando obligatorio antes de deploy
npm run build
npm run analyze

# Verificar que:
# - Chunk inicial < 200kb
# - Chunks por ruta < 500kb
# - Total optimizado
```

---

## 📝 **6. FUNCIONES COMPLEJAS DOCUMENTADAS**

### 📏 **Criterios para Documentar**
- Funciones >15 líneas
- >2 condiciones anidadas
- Manipula dinero/cálculos críticos
- Integra APIs externas
- Transforma estructuras de datos complejas

### ✅ **Documentación Correcta**
```javascript
/**
 * Calcula el costo total de un plan médico incluyendo descuentos y recargos
 * 
 * @param {Object} plan - Plan médico seleccionado
 * @param {string} plan.type - Tipo de plan (basic, premium, corporate)
 * @param {number} plan.basePrice - Precio base mensual
 * @param {Object} user - Datos del usuario
 * @param {number} user.age - Edad del usuario
 * @param {boolean} user.hasPreexistingConditions - Si tiene condiciones preexistentes
 * @param {Object} discounts - Descuentos aplicables
 * 
 * @returns {Object} Resultado del cálculo
 * @returns {number} result.total - Precio total final
 * @returns {number} result.discount - Descuento aplicado
 * @returns {string} result.breakdown - Desglose del cálculo
 * 
 * @example
 * const cost = calculatePlanCost(
 *   { type: 'premium', basePrice: 150 },
 *   { age: 35, hasPreexistingConditions: false },
 *   { familyDiscount: 0.1 }
 * )
 * // Returns: { total: 135, discount: 15, breakdown: "..." }
 */
const calculatePlanCost = (plan, user, discounts) => {
  // Implementación compleja...
}
```

### ❌ **Sin Documentación (Prohibido)**
```javascript
// ❌ MAL - Función compleja sin documentar
const calculatePlanCost = (plan, user, discounts) => {
  let total = plan.basePrice
  if (user.age > 65) total *= 1.2
  if (user.hasPreexistingConditions) total *= 1.3
  if (discounts.familyDiscount) total *= (1 - discounts.familyDiscount)
  // ... 20 líneas más de lógica compleja sin explicar
  return { total, breakdown: generateBreakdown(total) }
}
```

---

## 🧪 **7. TESTS EN LÓGICA CRÍTICA**

### 🎯 **Testing Obligatorio**
- Hooks de negocio
- Autenticación y autorización
- Cálculos de dinero/precios
- Validaciones de formularios críticos
- Reducers/acciones de estado global

### ✅ **Ejemplos de Tests Requeridos**
```javascript
// src/hooks/__tests__/useAuth.test.js
describe('useAuth', () => {
  it('should login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('admin', 'password123')
    })
    
    expect(result.current.user).toBeDefined()
    expect(result.current.isAuthenticated).toBe(true)
  })
  
  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('invalid', 'credentials')
    })
    
    expect(result.current.error).toBeDefined()
    expect(result.current.isAuthenticated).toBe(false)
  })
})

// src/utils/__tests__/priceCalculator.test.js
describe('calculatePlanCost', () => {
  it('should apply age surcharge correctly', () => {
    const plan = { type: 'basic', basePrice: 100 }
    const user = { age: 70, hasPreexistingConditions: false }
    
    const result = calculatePlanCost(plan, user, {})
    
    expect(result.total).toBe(120) // 20% surcharge for 65+
  })
})
```

### 📊 **Coverage Mínimo**
- **Lógica crítica**: 90% coverage
- **Hooks de negocio**: 80% coverage
- **Componentes UI**: 60% coverage

---

## 🎯 **8. MANEJO DE ERRORES OBLIGATORIO**

### 🛡️ **Estructura Consistente**
```javascript
// Todos los servicios deben retornar:
{
  success: boolean,
  data?: any,
  error?: string,
  code?: string
}
```

### ✅ **Implementación Correcta**
```javascript
// src/services/userService.js
export const userService = {
  async getAll() {
    try {
      const response = await api.get('/users')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      logger.error('Failed to fetch users', error)
      return {
        success: false,
        error: error.message || 'Error al obtener usuarios',
        code: error.code
      }
    }
  }
}

// En componentes/hooks
const useUsers = () => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null
  })
  
  const fetchUsers = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await userService.getAll()
    
    if (result.success) {
      setState({ data: result.data, loading: false, error: null })
    } else {
      setState(prev => ({ ...prev, loading: false, error: result.error }))
      toast.error(result.error) // Feedback visual
    }
  }
  
  return { ...state, fetchUsers }
}
```

### ❌ **Manejo Incorrecto**
```javascript
// ❌ MAL - Sin try/catch
const fetchUsers = async () => {
  const users = await api.get('/users') // Puede fallar
  setUsers(users)
}

// ❌ MAL - Error handling inconsistente  
const fetchUsers = async () => {
  try {
    const users = await api.get('/users')
    setUsers(users)
  } catch (error) {
    console.log(error) // Solo log, sin feedback al usuario
  }
}
```

---

## 🧹 **9. CONSISTENCIA Y ESTILO DE CÓDIGO**

### 🔧 **Herramientas Obligatorias**
- **ESLint**: Debe pasar sin errores
- **Prettier**: Formateo automático
- **Husky**: Pre-commit hooks

### 📝 **Convenciones de Nomenclatura**
```javascript
// ✅ Variables y funciones: camelCase
const userName = 'john'
const calculateTotal = () => {}

// ✅ Componentes: PascalCase
const UserDashboard = () => {}
const HeaderNavigation = () => {}

// ✅ Archivos: kebab-case
user-dashboard.jsx
header-navigation.jsx
user-service.js

// ✅ Constantes: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_ATTEMPTS = 3

// ✅ Hooks: camelCase con "use" prefix
const useAuth = () => {}
const useUserData = () => {}
```

### 📁 **Estructura de Imports**
```javascript
// 1. React y librerías externas
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'

// 2. Servicios y stores propios
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'

// 3. Componentes propios
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

// 4. Utilities y constantes
import { formatCurrency } from '../utils/formatters'
import { API_ENDPOINTS } from '../constants/api'

// 5. Estilos (si existen)
import './component.css'
```

---

## 🏗️ **10. ARQUITECTURA MODULAR CLARA**

### 📁 **Estructura Obligatoria**
```
src/
├── components/          # UI Components
│   ├── ui/             # Componentes básicos reutilizables
│   ├── shared/         # Componentes compartidos
│   └── [feature]/      # Componentes por funcionalidad
├── hooks/              # Custom hooks (lógica de negocio)
├── services/           # APIs y servicios externos
├── stores/             # Estado global (Zustand)
├── utils/              # Funciones utilitarias
├── constants/          # Constantes de la aplicación
├── schemas/            # Esquemas de validación
└── types/              # TypeScript types (si aplica)
```

### 🔗 **Inyección de Dependencias**
```javascript
// ❌ MAL - Componente depende directamente de servicio
const UserList = () => {
  useEffect(() => {
    userService.getAll().then(setUsers) // Dependencia directa
  }, [])
}

// ✅ BIEN - Inyección a través de hook
const UserList = () => {
  const { users, loading, error } = useUsers() // Hook inyecta dependencia
}

// Hook maneja la dependencia
const useUsers = () => {
  // Aquí se puede cambiar fácilmente el servicio
  return useQuery('users', userService.getAll)
}
```

---

## 🚀 **11. AUTOMATIZACIÓN DE CALIDAD**

### 📝 **Git Hooks Obligatorios**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test -- --coverage --watchAll=false"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 📋 **Convención de Commits**
```bash
# Formato obligatorio
type(scope): description

# Tipos válidos:
feat(auth): add login with biometric
fix(dashboard): resolve memory leak in user list
refactor(hooks): extract user logic to custom hook
test(utils): add unit tests for price calculator
docs(readme): update installation instructions
```

---

## 🔍 **12. LOGGING Y MONITOREO**

### 📊 **Sistema de Logging**
```javascript
// src/utils/logger.js
const logger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data)
    }
  },
  
  info: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data)
    }
    // En producción: enviar a servicio de logging
  },
  
  error: (message, error, context) => {
    console.error(`[ERROR] ${message}`, { error, context })
    
    // En producción: enviar a Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      sentryService.captureException(error, { 
        message, 
        context,
        timestamp: new Date().toISOString()
      })
    }
  }
}

export { logger }
```

### ❌ **Prohibido en Producción**
```javascript
// ❌ Console.logs directos
console.log('Usuario logueado:', user) // Expone datos sensibles

// ❌ Información sensible en logs
logger.debug('Login attempt', { 
  username, 
  password // ❌ NUNCA loggear passwords
})
```

---

## ⏳ **13. PERFORMANCE OPTIMIZADA - ENFOQUE MEDIDO**

### 🎯 **Optimizaciones Basadas en Métricas**

#### **React.memo - Solo cuando sea necesario**
```javascript
// ⚠️ MEDIR PRIMERO - No optimizar prematuramente
// Usar React DevTools Profiler para identificar re-renders problemáticos

// ✅ BIEN - Componente con re-renders frecuentes medidos
const ExpensiveUserList = React.memo(({ users, filters }) => {
  // Componente que se re-renderiza 50+ veces por interacción
  return users.map(user => <ComplexUserCard key={user.id} {...user} />)
})

// ❌ MAL - Optimización prematura sin métricas
const SimpleButton = React.memo(({ onClick, text }) => {
  // Componente simple que no necesita memo
  return <button onClick={onClick}>{text}</button>
})
```

### 📊 **Cuándo Optimizar**

| Técnica | Usar cuando | NO usar cuando |
|---------|-------------|----------------|
| `React.memo` | Re-renders >10 por interacción | Componentes simples |
| `useMemo` | Cálculos >100ms | Cálculos triviales |
| `useCallback` | Funciones pasadas a componentes memoizados | Handlers simples |
| Virtualización | Listas >50 elementos | Listas pequeñas |

### 🔍 **Proceso de Optimización**
```javascript
// 1. MEDIR - Identificar bottlenecks reales
// Usar React DevTools Profiler

// 2. OPTIMIZAR - Solo lo necesario
const OptimizedComponent = () => {
  // Solo optimizar después de medir
  const expensiveValue = useMemo(() => {
    return heavyCalculation(data) // Solo si toma >100ms
  }, [data])
  
  return <div>{expensiveValue}</div>
}

// 3. VERIFICAR - Confirmar mejora
// Volver a medir con DevTools
```

#### **useMemo para Cálculos Costosos**
```javascript
const ExpensiveComponent = ({ items, filters }) => {
  // ✅ Memoizar cálculos costosos
  const filteredItems = useMemo(() => {
    return items
      .filter(item => matchesFilters(item, filters))
      .sort((a, b) => calculateScore(b) - calculateScore(a))
  }, [items, filters])
  
  return <ItemList items={filteredItems} />
}
```

#### **useCallback para Funciones**
```javascript
const TodoList = ({ todos }) => {
  // ✅ Memoizar funciones pasadas como props
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])
  
  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
  ))
}
```

#### **Virtualización para Listas Grandes**
```javascript
// ✅ Para listas >50 elementos
import { FixedSizeList as List } from 'react-window'

const VirtualizedUserList = ({ users }) => (
  <List
    height={400}
    itemCount={users.length}
    itemSize={60}
    itemData={users}
  >
    {UserRow}
  </List>
)
```

### 📊 **Métricas de Performance**
- **Time to Interactive**: <3 segundos
- **First Contentful Paint**: <1.5 segundos
- **Listas virtualizadas**: >50 elementos
- **Bundle size**: <200kb inicial

---

## 🧭 **14. REGISTRO DE DECISIONES TÉCNICAS (ADR)**

### 📝 **Documentación Obligatoria**
Cambios significativos deben documentarse en `/docs/ADR.md`

### 📋 **Template de ADR**
```markdown
# ADR-001: Migración de Redux a Zustand

## Estado
Aceptado

## Contexto
- Redux genera boilerplate excesivo
- Team pequeño no necesita DevTools complejas
- Bundle size alto con Redux Toolkit

## Decisión
Migrar estado global de Redux a Zustand

## Consecuencias

### Positivas
- 70% menos código boilerplate
- Bundle 30kb más pequeño
- API más simple y directa

### Negativas
- Menos tooling de debugging
- Team debe aprender nueva API
- Migración gradual requerida

## Fecha
2024-01-15

## Revisión
Revisar en 3 meses (2024-04-15)
```

---

## ✅ **CHECKLIST DE REFACTORING - ENFOQUE BALANCEADO**

### **Antes de cada Commit:**
- [ ] Componente <200 líneas
- [ ] Lógica COMPLEJA extraída a hooks/servicios (no toda)
- [ ] Inputs validados
- [ ] Errores manejados correctamente
- [ ] Console.logs de debug pueden quedarse temporalmente
- [ ] ESLint sin errores críticos
- [ ] Prettier aplicado
- [ ] Tests actualizados para lógica de negocio

### **Antes de cada PR:**
- [ ] Tests de lógica crítica
- [ ] Documentación de funciones complejas
- [ ] Performance optimizada
- [ ] Bundle size verificado
- [ ] Componentes divididos apropiadamente
- [ ] Convenciones de nomenclatura seguidas

### **Antes de cada Release:**
- [ ] ADR actualizado (si hay cambios arquitectónicos)
- [ ] Coverage de tests >80% en lógica crítica
- [ ] Performance auditada
- [ ] Security scan ejecutado
- [ ] Build optimizado
- [ ] Lazy loading verificado

---

## 🏆 **REGLAS DE ORO - RESUMEN (ENFOQUE BALANCEADO)**

1. **🔑 JAMÁS** hardcodear credenciales reales
2. **🖼️ PRAGMÁTICO** separar lógica compleja, mantener estructura simple en componentes
3. **📦 NUNCA** componentes >200 líneas
4. **🔒 OBLIGATORIO** validar todos los inputs
5. **⚡ REQUERIDO** lazy loading en rutas pesadas
6. **📝 ESENCIAL** documentar funciones complejas (>15 líneas)
7. **🧪 CRÍTICO** testear lógica de negocio
8. **🎯 VITAL** manejar todos los errores consistentemente
9. **🧹 FUNDAMENTAL** seguir convenciones de código
10. **🏗️ MANDATORIO** arquitectura modular clara
11. **🚀 NECESARIO** automatización de calidad
12. **🔍 IMPORTANTE** logging estructurado (sin console.log directo)
13. **⏳ MEDIDO** optimizar performance solo donde métricas lo justifiquen
14. **🧭 VALIOSO** documentar decisiones técnicas

### 🎯 **Principio Guía**
> **"Hacer lo correcto, no lo perfecto"** - Priorizar código mantenible y entendible sobre pureza extrema

---

**Estas reglas garantizan código maintainable, seguro y escalable para el largo plazo.**