# Refactorización - Eliminación de Hardcodeo

## 📋 Resumen de Cambios

Se ha eliminado todo el hardcodeo de datos en los componentes React, creando una arquitectura más escalable y mantenible.

## 🏗️ Nueva Estructura

### 1. **Archivos de Configuración**
```
frontend/src/config/
├── constants.js    # Constantes de la aplicación
├── labels.js       # Textos y etiquetas (i18n ready)
├── mockData.js     # Datos mock para desarrollo
└── api.js          # Configuración de endpoints
```

### 2. **Servicios API**
```
frontend/src/services/
├── api.service.js       # Servicio base para llamadas HTTP
├── emergency.service.js # Gestión de emergencias
├── ambulance.service.js # Gestión de ambulancias
└── user.service.js      # Gestión de usuarios
```

### 3. **Hooks Personalizados**
```
frontend/src/hooks/
├── useApiData.js    # Hook genérico para consumo de API
└── useEmergency.js  # Hook específico para emergencias
```

## 🚀 Cómo Usar

### Instalación
```bash
cd frontend
npm install
```

### Desarrollo con Mock Data
```bash
# Ejecutar frontend + JSON Server
npm run dev:all

# O por separado:
npm run dev         # Frontend en http://localhost:5173
npm run json-server # API Mock en http://localhost:3002
```

### Variables de Entorno
1. Copiar `.env.example` a `.env`
2. Configurar las variables según tu entorno:
```env
VITE_API_URL=http://localhost:3001        # API real
VITE_MOCK_API_URL=http://localhost:3002   # JSON Server
VITE_ENABLE_MOCK_DATA=true                # Usar datos mock
```

## 📝 Ejemplos de Uso

### Usando Configuración
```javascript
import { APP_CONFIG, EMERGENCY_STATUS } from '../config/constants'
import { LABELS } from '../config/labels'

// En lugar de:
const title = "Panel Ambulancia"

// Usar:
const title = LABELS.ambulance.title
```

### Consumiendo API con Hooks
```javascript
import { useEmergencies } from '../hooks/useEmergency'

function EmergencyList() {
  const { data, loading, error, refetch } = useEmergencies()
  
  if (loading) return <div>{LABELS.messages.loading}</div>
  if (error) return <div>{LABELS.messages.error}</div>
  
  return (
    <div>
      {data?.map(emergency => (
        <EmergencyCard key={emergency.id} data={emergency} />
      ))}
    </div>
  )
}
```

### Usando Servicios Directamente
```javascript
import emergencyService from '../services/emergency.service'

async function handleEmergencyCreate(data) {
  try {
    const result = await emergencyService.createEmergency(data)
    console.log('Emergencia creada:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 🔄 Estrategia de Migración

### Fase 1: Desarrollo (Actual)
- ✅ JSON Server con datos mock
- ✅ Servicios con fallback a mock data
- ✅ Variables de entorno para configuración

### Fase 2: Integración con Backend
1. Implementar endpoints reales en el backend
2. Cambiar `VITE_ENABLE_MOCK_DATA=false`
3. Configurar `VITE_API_URL` con la URL del backend
4. Los servicios automáticamente usarán la API real

### Fase 3: Producción
1. Eliminar dependencia de JSON Server
2. Configurar variables de producción
3. Optimizar bundle sin datos mock

## 📦 Datos Disponibles en JSON Server

- **Users**: `/users`
- **Emergencies**: `/emergencies`
- **Ambulances**: `/ambulances`
- **Affiliates**: `/affiliates`
- **Contracts**: `/contracts`
- **Plans**: `/plans`
- **Districts**: `/districts`
- **Notifications**: `/notifications`
- **Stats**: `/stats`

## 🎯 Beneficios

1. **Separación de Responsabilidades**: Datos separados de la lógica de UI
2. **Fácil Mantenimiento**: Cambios centralizados en archivos de configuración
3. **Preparado para i18n**: Estructura lista para múltiples idiomas
4. **Mock Data Automático**: Desarrollo sin dependencia del backend
5. **Transición Suave**: Fácil migración de mock a API real
6. **Type Safety Ready**: Estructura preparada para TypeScript

## 🔧 Próximos Pasos Recomendados

1. **TypeScript**: Migrar a TypeScript para type safety
2. **i18n**: Implementar react-i18next para soporte multiidioma
3. **Estado Global**: Implementar Redux/Zustand para estado compartido
4. **Cache**: Implementar React Query/SWR para cache de datos
5. **Tests**: Agregar tests unitarios y de integración

## 📚 Documentación de Servicios

Cada servicio incluye manejo de errores y fallback a datos mock:

```javascript
// Ejemplo de servicio con fallback
async getEmergencies() {
  try {
    return await apiService.get('/emergencies')
  } catch (error) {
    console.error('Error:', error)
    return MOCK_DATA.emergencies // Fallback automático
  }
}
```

Esto garantiza que la aplicación funcione incluso sin backend disponible.