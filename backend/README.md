# 🏥 SOS HelpMed - Backend API

API backend para el sistema de emergencias médicas SOS HelpMed, construida con JSON Server para desarrollo y despliegue rápido.

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Desarrollo Local
```bash
npm run dev
# Servidor corriendo en: http://localhost:4001
```

### Producción/Railway
```bash
npm start
# Usa variable PORT del entorno
```

## 📊 Endpoints Principales

| Endpoint | Descripción |
|----------|-------------|
| `GET /health` | Health check del servidor |
| `GET /api/info` | Información de la API |
| `GET /users` | Usuarios del sistema |
| `GET /pendingEmergencies` | Emergencias pendientes |
| `GET /adminPlanConfiguration` | Configuración de planes |
| `GET /surveyResponses` | Respuestas de encuestas |
| `GET /externalEntities` | Entidades externas |

## 🌐 Despliegue en Railway

### 1. Conectar Repositorio
- Crear nuevo proyecto en Railway
- Conectar este repositorio
- Seleccionar carpeta `backend/`

### 2. Configuración Automática
Railway detectará automáticamente:
- ✅ `package.json` 
- ✅ Script `start`
- ✅ Variable `$PORT`

### 3. Variables de Entorno
No necesita configuración adicional, todo está incluido.

## 🔧 Configuración CORS

El servidor está configurado para aceptar requests desde:
- ✅ `localhost:5173` (desarrollo)
- ✅ `*.railway.app` (producción)
- ✅ `*.vercel.app` (frontend alternativo)
- ✅ `*.netlify.app` (frontend alternativo)

## 📁 Estructura

```
backend/
├── db.json           # Base de datos JSON
├── server.js         # Servidor customizado
├── package.json      # Dependencias
└── README.md         # Esta documentación
```

## 🔗 Integración con Frontend

El frontend debe configurar la URL del API:

```javascript
// .env.production
VITE_API_URL=https://tu-backend.railway.app
```

## 🛠️ Desarrollo

### Endpoints de Utilidad
- `GET /health` - Verificar estado del servidor
- `GET /api/info` - Información detallada de la API

### Logs
El servidor muestra información detallada al iniciar:
```
🚀 SOS HelpMed API Server is running on port 4001
📊 JSON Server UI: http://localhost:4001
🔗 API Base URL: http://localhost:4001  
❤️  Health Check: http://localhost:4001/health
```

---

### 📞 Soporte
Para problemas con el backend, verificar:
1. Logs del servidor
2. Health check endpoint
3. Configuración CORS