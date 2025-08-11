#!/usr/bin/env node

/**
 * 🚀 Script de Configuración Automática para Vercel
 * Genera variables de entorno seguras para el despliegue
 * 
 * Uso: node setup-vercel.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🌟 Configurando proyecto SOLID para Vercel...');
console.log('');

// Generar JWT_SECRET seguro
const jwtSecret = crypto.randomBytes(32).toString('base64');

// Variables de entorno para Vercel
const vercelEnvVars = {
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: '24h',
  NODE_ENV: 'production',
  CORS_ORIGIN: 'https://tu-proyecto.vercel.app', // Cambiar por tu dominio
  LOG_LEVEL: 'error',
  BCRYPT_ROUNDS: '12',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100'
};

// Crear archivo .env.vercel
const envContent = Object.entries(vercelEnvVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync('.env.vercel', envContent);

console.log('✅ Archivo .env.vercel creado con variables seguras');
console.log('');
console.log('📋 Variables generadas:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

Object.entries(vercelEnvVars).forEach(([key, value]) => {
  const displayValue = key === 'JWT_SECRET' ? `${value.substring(0, 8)}...` : value;
  console.log(`${key.padEnd(25)} = ${displayValue}`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('🚀 Próximos pasos:');
console.log('1. Subir proyecto a GitHub');
console.log('2. Importar en Vercel');
console.log('3. Configurar variables de entorno en Vercel Dashboard');
console.log('4. Actualizar CORS_ORIGIN con tu dominio real');
console.log('');
console.log('💜 ¡Listo para desplegar! uwu');

// Crear comandos para Vercel CLI
const cliCommands = Object.entries(vercelEnvVars)
  .map(([key, value]) => `vercel env add ${key}`)
  .join('\n');

fs.writeFileSync('vercel-env-commands.txt', cliCommands);
console.log('📝 Comandos CLI guardados en: vercel-env-commands.txt');

// Crear script de PowerShell para Windows
const psScript = `# Script de PowerShell para configurar variables en Vercel
# Ejecutar: .\\setup-vercel-env.ps1

Write-Host "🚀 Configurando variables de entorno en Vercel..." -ForegroundColor Cyan
Write-Host ""

${Object.entries(vercelEnvVars)
  .map(([key, value]) => `Write-Host "Configurando ${key}..." -ForegroundColor Yellow\nvercel env add ${key}\nWrite-Host "✅ ${key} configurado" -ForegroundColor Green\nWrite-Host ""`)
  .join('\n')}

Write-Host "🎯 Variables configuradas exitosamente!" -ForegroundColor Green
Write-Host "💜 Ahora ejecuta: vercel --prod" -ForegroundColor Magenta`;

fs.writeFileSync('setup-vercel-env.ps1', psScript);
console.log('🔧 Script PowerShell creado: setup-vercel-env.ps1');
console.log('');
console.log('🌟 ¡Todo listo para el despliegue! ✨');