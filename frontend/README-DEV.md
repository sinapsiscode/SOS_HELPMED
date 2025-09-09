# 🚀 Guía de Desarrollo Profesional - HelpMed Frontend

## 📋 Inicio Rápido

### Opción 1: Inicio Automático (Recomendado)
```bash
npm run dev:pro
```
Este comando inicia automáticamente:
- ✅ JSON Server (puerto 4001)
- ✅ Vite Dev Server (puerto 5173)
- ✅ Manejo de errores
- ✅ Cierre coordinado con Ctrl+C

### Opción 2: Inicio Manual
```bash
# Terminal 1: JSON Server
npm run json-server

# Terminal 2: Vite Dev Server  
npm run dev
```

## 🌐 URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación principal |
| **API Mock** | http://localhost:4001 | JSON Server con datos |
| **API Proxy** | http://localhost:5173/api | Proxy a JSON Server |

## 🔧 Configuración de Entorno

### Variables de Entorno (.env.development)
```bash
VITE_API_URL=http://localhost:4001
VITE_ENABLE_MOCK_DATA=false
VITE_JSON_SERVER_PORT=4001
VITE_DEV_SERVER_PORT=5173
```

## 📊 Sistema de Datos

### Fallback Inteligente
- ✅ **Con JSON Server:** Datos dinámicos desde db.json
- ✅ **Sin JSON Server:** Datos estáticos de respaldo
- ✅ **Nunca falla:** Sistema resistente a errores

### Estructura de Datos
```
db.json
├── users[]           # Usuarios del sistema
├── emergencies[]     # Emergencias activas
├── paymentConfig{}   # Configuración de pagos
├── registrationConfig{} # Opciones de registro
└── transferConfig{}  # Tipos de traslados
```

## 👥 Usuarios Demo Disponibles

### Administradores
- `admin` / `admin123` - Administrador principal

### Planes Familiares
- `familiar` / `familiar123` - Usuario familiar básico
- `help_user` / `help123` - Ana Rodríguez (Plan Help)
- `basico_user` / `basico123` - Carmen López (Plan Básico)
- `vip_user` / `vip123` - Eduardo Silva (Plan VIP)
- `dorado_user` / `dorado123` - Alejandra Vega (Plan Dorado)

### Corporativos
- `empresa_abc` / `corp123` - Empresa ABC
- `empresa_xyz` / `corp456` - Centro Médico XYZ
- `hotel_plaza` / `hotel789` - Hotel Plaza

### Ambulancias
- `conductor` / `conductor123` - Carlos Mendoza

### Externos
- `externo1` / `ext123` - Usuario externo caso 1
- `externo2` / `ext456` - Usuario externo caso 2

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev:pro          # Inicio profesional automatizado
npm run dev              # Solo Vite dev server
npm run json-server      # Solo JSON server

# Testing
npm test                 # Tests en modo watch
npm run test:ci          # Tests CI con coverage

# Linting & Formatting
npm run lint             # Verificar código
npm run lint:fix         # Arreglar errores automáticamente
npm run format           # Formatear código

# Build
npm run build            # Construir para producción
npm run preview          # Preview del build
```

## 🔍 Debugging

### Verificar JSON Server
```bash
curl http://localhost:4001/users | head -10
```

### Verificar Proxy
```javascript
// En consola del navegador (F12)
fetch('/api/users').then(r => r.json()).then(console.log)
```

### Limpiar Cache
- F12 → Application → Clear Storage
- Ctrl+F5 (recarga forzada)

## ⚡ Características Profesionales

### Sistema de Fallback Robusto
- ❌ **Error:** App se rompe si JSON server falla
- ✅ **Profesional:** App funciona siempre, con datos de respaldo

### Geolocalización Inteligente
- ❌ **Error:** Falla en HTTP (solo HTTPS)
- ✅ **Profesional:** Simulación automática en desarrollo

### Configuración por Entorno
- ❌ **Error:** URLs hardcodeadas
- ✅ **Profesional:** Variables de entorno por ambiente

### Scripts Automatizados
- ❌ **Error:** Iniciar servidores manualmente
- ✅ **Profesional:** Un comando inicia todo

## 🚨 Solución de Problemas

### Dashboard no carga datos
1. Verificar que JSON server esté ejecutándose
2. Limpiar cache del navegador
3. Usar `npm run dev:pro` en lugar de `npm run dev`

### Error de CORS
- El proxy de Vite maneja CORS automáticamente
- Verificar configuración en `vite.config.js`

### Error de geolocalización
- Sistema de fallback automático activado
- Ubicaciones simuladas en Lima, Perú

---

## 📞 Soporte

Para problemas técnicos, revisar:
1. Esta guía
2. Logs en consola del navegador
3. Output del terminal donde corre JSON server