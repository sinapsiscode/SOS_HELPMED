# 🚀 Guía de Deployment en Railway - SOS HelpMed

## 📁 Estructura del Proyecto

```
SOS_HELPMED/
├── frontend/              # React + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.production
│
├── backend/               # JSON Server API
│   ├── db.json           # Base de datos
│   ├── server.js         # Servidor customizado
│   ├── package.json      # Dependencias del backend
│   └── README.md
│
├── DEPLOYMENT_GUIDE.md   # Esta guía
└── README.md
```

## 🎯 Plan de Deployment

### 🔄 Paso 1: Deployment del Backend

#### 1.1 Crear Proyecto en Railway
1. Ir a [Railway](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Seleccionar tu repositorio `SOS_HELPMED`

#### 1.2 Configurar Servicio Backend
1. En Railway → "Add Service" → "GitHub Repo"
2. **Root Directory:** `/backend`
3. Railway detectará automáticamente:
   - ✅ `package.json`
   - ✅ `npm start`
   - ✅ Puerto desde `$PORT`

#### 1.3 Variables de Entorno (Automáticas)
- ✅ `PORT`: Railway lo asigna automáticamente
- ✅ CORS: Ya configurado en `server.js`
- ✅ No necesita configuración adicional

#### 1.4 Obtener URL del Backend
Después del deployment obtendrás algo como:
```
https://backend-production-xxxx.up.railway.app
```

### 🔄 Paso 2: Deployment del Frontend

#### 2.1 Actualizar Variables de Entorno
1. Editar `frontend/.env.production`
2. Cambiar URL del backend:
```bash
VITE_API_URL=https://tu-backend-real.railway.app
```

#### 2.2 Crear Segundo Servicio
1. En el mismo proyecto Railway → "Add Service"
2. **Root Directory:** `/frontend`
3. Railway detectará:
   - ✅ `package.json`
   - ✅ `npm run build`
   - ✅ Vite como build tool

#### 2.3 Configurar Build Settings
Variables automáticas de Railway:
- ✅ `BUILD_COMMAND`: `npm run build`
- ✅ `START_COMMAND`: `npm run preview`

## 🧪 Paso 3: Testing

### 3.1 Backend Testing
```bash
# Health check
curl https://tu-backend.railway.app/health

# API info
curl https://tu-backend.railway.app/api/info

# Test data
curl https://tu-backend.railway.app/users
```

### 3.2 Frontend Testing
1. Abrir `https://tu-frontend.railway.app`
2. Verificar login con usuarios de prueba
3. Verificar que carga datos del backend

## 📋 Checklist de Deployment

### ✅ Backend Ready
- [ ] `backend/package.json` creado
- [ ] `backend/server.js` configurado
- [ ] `backend/db.json` copiado
- [ ] CORS configurado para Railway domains
- [ ] Health check endpoint funcionando

### ✅ Frontend Ready  
- [ ] `.env.production` actualizado
- [ ] URL del backend configurada
- [ ] Build funciona localmente
- [ ] No hardcodeo de localhost

### ✅ Railway Config
- [ ] Backend service deployado
- [ ] Frontend service deployado
- [ ] URLs obtenidas
- [ ] Cross-service communication funcionando

## 🔧 Comandos de Desarrollo Local

### Backend
```bash
cd backend
npm install
npm run dev
# http://localhost:4001
```

### Frontend
```bash
cd frontend
npm install  
npm run dev
# http://localhost:5173
```

### Full Stack
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

## 🚨 Troubleshooting

### Backend Issues
- ✅ Verificar `backend/package.json` existe
- ✅ Verificar `"start": "node server.js"`
- ✅ Verificar puerto `$PORT`

### Frontend Issues
- ✅ Verificar `.env.production` tiene URL correcta
- ✅ Verificar build funciona: `npm run build`
- ✅ Verificar preview: `npm run preview`

### CORS Issues
- ✅ Verificar `server.js` incluye tu dominio frontend
- ✅ Agregar nuevo dominio si es necesario

---

## 🎉 Resultado Final

Tendrás 2 URLs funcionando:
- 🌐 **Frontend**: `https://sos-helpmed-frontend.railway.app`
- 🔌 **Backend**: `https://sos-helpmed-backend.railway.app`

**¡Tu aplicación estará completamente funcional en la nube!** 🚀