#!/usr/bin/env node

/**
 * Script profesional para iniciar el entorno de desarrollo
 * Ahora maneja el backend separado y el servidor de desarrollo
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

async function startBackendServer() {
  return new Promise((resolve, reject) => {
    // Verificar si el backend existe
    const backendPath = path.join(__dirname, '..', '..', 'backend');
    if (!checkFileExists(backendPath)) {
      log('❌ Carpeta backend no encontrada', 'red');
      log('   Ejecutar: npm run setup:backend', 'yellow');
      reject(new Error('Backend no encontrado'));
      return;
    }

    // Verificar si las dependencias del backend están instaladas
    const backendNodeModules = path.join(backendPath, 'node_modules');
    if (!checkFileExists(backendNodeModules)) {
      log('❌ Dependencias del backend no instaladas', 'red');
      log('   Ejecutar: npm run setup:backend', 'yellow');
      reject(new Error('Backend dependencies not installed'));
      return;
    }

    log('🔄 Iniciando Backend Server...', 'yellow');
    
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: backendPath,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let serverReady = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Backend: ${output.trim()}`);
      if (output.includes('Server is running') || output.includes('4001')) {
        if (!serverReady) {
          log('✅ Backend Server iniciado en puerto 4001', 'green');
          serverReady = true;
          resolve(backendProcess);
        }
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('EADDRINUSE')) {
        log('⚠️  Puerto 4001 ya está en uso', 'yellow');
        log('   El backend ya está ejecutándose', 'yellow');
        resolve(null); // No es un error crítico
      } else {
        console.error(`Backend Error: ${error}`);
      }
    });

    backendProcess.on('error', (error) => {
      log(`Error iniciando Backend: ${error.message}`, 'red');
      reject(error);
    });

    // Timeout después de 15 segundos
    setTimeout(() => {
      if (!serverReady) {
        log('⏰ Timeout iniciando Backend Server', 'yellow');
        resolve(null);
      }
    }, 15000);
  });
}

async function startViteServer() {
  return new Promise((resolve, reject) => {
    log('🔄 Iniciando Vite Dev Server...', 'blue');
    
    const viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let serverReady = false;

    viteProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Frontend: ${output.trim()}`);
      if (output.includes('Local:') || output.includes('5173')) {
        if (!serverReady) {
          log('✅ Vite Dev Server iniciado', 'green');
          serverReady = true;
          resolve(viteProcess);
        }
      }
    });

    viteProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('deprecated')) {
        console.error(`Frontend Error: ${error}`);
      }
    });

    viteProcess.on('error', (error) => {
      log(`Error iniciando Vite: ${error.message}`, 'red');
      reject(error);
    });

    setTimeout(() => {
      if (!serverReady) {
        log('⏰ Timeout iniciando Vite Server', 'yellow');
        resolve(null);
      }
    }, 10000);
  });
}

async function main() {
  log(`${colors.bold}🚀 SOS HelpMed - Iniciando Entorno de Desarrollo${colors.reset}`, 'green');
  log('', 'reset');

  const processes = [];

  try {
    // Iniciar Backend Server
    log('📦 Paso 1: Iniciando Backend...', 'blue');
    const backendProcess = await startBackendServer();
    if (backendProcess) {
      processes.push(backendProcess);
    }

    // Esperar un poco antes de iniciar el frontend
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Iniciar Vite
    log('🎨 Paso 2: Iniciando Frontend...', 'blue');
    const viteProcess = await startViteServer();
    if (viteProcess) {
      processes.push(viteProcess);
    }

    log('', 'reset');
    log('✅ Entorno de desarrollo iniciado correctamente!', 'green');
    log('', 'reset');
    log('🌐 URLs disponibles:', 'bold');
    log('   Frontend: http://localhost:5173', 'blue');
    log('   Backend:  http://localhost:4001', 'blue');
    log('   Health:   http://localhost:4001/health', 'blue');
    log('', 'reset');
    log('📝 Para detener: Ctrl+C', 'yellow');
    log('', 'reset');

    // Manejar Ctrl+C para cerrar todos los procesos
    process.on('SIGINT', () => {
      log('', 'reset');
      log('🛑 Deteniendo servidores...', 'yellow');
      
      processes.forEach((proc, index) => {
        if (proc && !proc.killed) {
          proc.kill('SIGTERM');
          log(`✅ Proceso ${index + 1} detenido`, 'green');
        }
      });
      
      setTimeout(() => {
        log('👋 ¡Hasta luego!', 'green');
        process.exit(0);
      }, 1000);
    });

    // Mantener el proceso principal vivo
    process.stdin.resume();

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    log('', 'reset');
    log('🔧 Soluciones posibles:', 'yellow');
    log('   1. npm run setup:backend', 'yellow');
    log('   2. npm run setup:full', 'yellow');
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Error crítico: ${error.message}`, 'red');
  process.exit(1);
});