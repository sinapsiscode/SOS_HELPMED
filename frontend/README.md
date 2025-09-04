# Help MED - Emergencias Médicas

Una aplicación React moderna para la gestión de emergencias médicas, desarrollada con las últimas tecnologías web.

## 🚀 Tecnologías Utilizadas

- **React**: 18.3.1
- **Vite**: 5.4.0 (compatible con Node 22)
- **Node.js**: 22.14.0
- **npm**: 10.9.2
- **Tailwind CSS**: 3.4.1
- **PostCSS**: 8.4.35
- **Autoprefixer**: 10.4.17
- **Zustand**: 4.5.0 (gestión de estado)
- **SweetAlert2**: 11.10.5 (notificaciones)
- **JavaScript** (sin TypeScript)

## 📋 Requisitos Previos

- Node.js 22.14.0 o superior
- npm 10.9.2 o superior
- Sistema operativo: Windows (desarrollado para ejecutarse en entorno Windows)

## 🛠️ Instalación y Configuración

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes git instalado
   git clone [url-del-repositorio]
   cd helpmed-react
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación en modo desarrollo**
   ```bash
   npm start
   ```
   
   La aplicación se abrirá automáticamente en `http://localhost:3000` (o el siguiente puerto disponible).

## 🏗️ Scripts Disponibles

- `npm start` - Inicia la aplicación en modo desarrollo
- `npm run dev` - Inicia la aplicación en modo desarrollo (alias de start)
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🎯 Características Principales

### 🔐 Sistema de Autenticación
- Pantalla de login con credenciales de demostración
- Gestión de sesiones con Zustand

### 🚨 Gestión de Emergencias
- Solicitud de emergencias médicas
- Solicitud de consultas médicas
- Botón SOS para emergencias críticas
- Seguimiento en tiempo real del estado de la emergencia

### 📱 Interfaz Responsive
- Diseño mobile-first con Tailwind CSS
- Navegación por pestañas en la parte inferior
- Componentes modernos y accesibles

### 📊 Dashboard Completo
- **Sección Emergencias**: Solicitar y gestionar emergencias
- **Historial**: Ver emergencias anteriores
- **Unidades**: Estado de las ambulancias y unidades médicas
- **Perfil**: Información personal y configuración

### 🔔 Notificaciones
- Integración con SweetAlert2 para alertas elegantes
- Notificaciones en tiempo real
- Confirmaciones de acciones importantes

## 👤 Credenciales de Demostración

Para probar la aplicación, utiliza estas credenciales:

- **Usuario**: `demo`
- **Contraseña**: `demo123`

## 🎨 Personalización

### Colores Principales
La aplicación utiliza un esquema de colores médicos definido en `tailwind.config.js`:

- **Rojo Principal**: #D32F2F (emergencias)
- **Azul Principal**: #1976D2 (información)
- **Verde**: #4CAF50 (éxito)
- **Naranja**: #FF9800 (advertencias)

### Componentes Principales

```
src/
├── components/
│   ├── Dashboard.jsx          # Contenedor principal
│   ├── Header.jsx            # Cabecera con información del usuario
│   ├── LoginScreen.jsx       # Pantalla de inicio de sesión
│   ├── SplashScreen.jsx      # Pantalla de carga inicial
│   ├── EmergencySection.jsx  # Sección de emergencias
│   ├── HistorySection.jsx    # Historial de emergencias
│   ├── UnitsSection.jsx      # Estado de unidades médicas
│   └── ProfileSection.jsx    # Perfil y configuración
├── stores/
│   └── useAppStore.js        # Estado global con Zustand
└── styles/
    └── index.css             # Estilos base y Tailwind
```

## 🔧 Configuración de Desarrollo

### ESLint
El proyecto incluye configuración de ESLint para mantener la calidad del código:
```bash
npm run lint
```

### Tailwind CSS
Configuración personalizada en `tailwind.config.js` con:
- Colores del tema médico
- Fuentes personalizadas (Roboto, Inter)
- Sombras y efectos específicos

### Vite
Configuración optimizada para desarrollo y producción en `vite.config.js`.

## 🚀 Despliegue

Para crear una versión de producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` listos para ser desplegados en cualquier servidor web.

## 🐛 Solución de Problemas

### Error de puerto en uso
Si el puerto 3000 está ocupado, Vite automáticamente utilizará el siguiente puerto disponible (3001, 3002, etc.).

### Problemas con dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Problemas de compatibilidad
Asegúrate de estar utilizando las versiones exactas especificadas:
- Node.js 22.14.0
- npm 10.9.2

## 📝 Notas Adicionales

- **Desarrollo Cross-Platform**: Aunque el proyecto está optimizado para Windows, funciona correctamente en Linux/Ubuntu durante el desarrollo.
- **Responsive Design**: La aplicación está optimizada para dispositivos móviles y de escritorio.
- **Accesibilidad**: Componentes diseñados siguiendo las mejores prácticas de accesibilidad web.
- **Performance**: Optimizado con Vite para tiempos de carga rápidos y hot-reload eficiente.

## 👨‍💻 Soporte

Para reportar problemas o solicitar características, crea un issue en el repositorio del proyecto.

---

**Help MED** - Emergencias Médicas 24/7 🏥