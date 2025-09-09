#!/usr/bin/env node

/**
 * Script profesional para iniciar el entorno de desarrollo
 * Maneja automáticamente json-server y el servidor de desarrollo
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

async function startJsonServer() {
  return new Promise((resolve, reject) => {
    log('🚀 Iniciando JSON Server...', 'blue');
    
    if (!checkFileExists('db.json')) {
      log('❌ Error: db.json no encontrado', 'red');
      reject(new Error('db.json not found'));
      return;
    }

    const jsonServer = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '4001', '--host', '0.0.0.0'], {
      stdio: 'inherit',
      shell: true
    });

    jsonServer.on('error', (err) => {
      log(`❌ Error iniciando JSON Server: ${err.message}`, 'red');
      reject(err);
    });

    // Esperar un poco para que el servidor inicie
    setTimeout(() => {
      log('✅ JSON Server iniciado en http://localhost:4001', 'green');
      resolve(jsonServer);
    }, 2000);
  });
}

async function startViteServer() {
  return new Promise((resolve, reject) => {
    log('🚀 Iniciando Vite Dev Server...', 'blue');
    
    const viteServer = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    viteServer.on('error', (err) => {
      log(`❌ Error iniciando Vite Server: ${err.message}`, 'red');
      reject(err);
    });

    setTimeout(() => {
      log('✅ Vite Dev Server iniciado en http://localhost:5173', 'green');
      resolve(viteServer);
    }, 3000);
  });
}

async function main() {
  try {
    log('🔧 Iniciando entorno de desarrollo profesional...', 'bold');
    
    // Verificar que estamos en el directorio correcto
    if (!checkFileExists('package.json')) {
      log('❌ Error: package.json no encontrado. Ejecuta desde el directorio del frontend.', 'red');
      process.exit(1);
    }

    // Iniciar JSON Server
    const jsonServer = await startJsonServer();
    
    // Pequeña pausa antes de iniciar Vite
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Iniciar Vite Server
    const viteServer = await startViteServer();

    log('\n🎉 Entorno de desarrollo iniciado exitosamente!', 'green');
    log('📡 JSON Server: http://localhost:4001', 'blue');
    log('🌐 Frontend: http://localhost:5173', 'blue');
    log('\n⚡ Presiona Ctrl+C para detener ambos servidores\n', 'yellow');

    // Manejar señales de cierre
    process.on('SIGINT', () => {
      log('\n🛑 Deteniendo servidores...', 'yellow');
      
      if (jsonServer && !jsonServer.killed) {
        jsonServer.kill('SIGTERM');
      }
      
      if (viteServer && !viteServer.killed) {
        viteServer.kill('SIGTERM');
      }
      
      setTimeout(() => {
        log('✅ Servidores detenidos correctamente', 'green');
        process.exit(0);
      }, 1000);
    });

    process.on('SIGTERM', () => {
      if (jsonServer && !jsonServer.killed) {
        jsonServer.kill('SIGTERM');
      }
      if (viteServer && !viteServer.killed) {
        viteServer.kill('SIGTERM');
      }
      process.exit(0);
    });

  } catch (error) {
    log(`❌ Error crítico: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();