# Script de PowerShell para configurar variables en Vercel
# Ejecutar: .\setup-vercel-env.ps1

Write-Host "🚀 Configurando variables de entorno en Vercel..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Configurando JWT_SECRET..." -ForegroundColor Yellow
vercel env add JWT_SECRET
Write-Host "✅ JWT_SECRET configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando JWT_EXPIRES_IN..." -ForegroundColor Yellow
vercel env add JWT_EXPIRES_IN
Write-Host "✅ JWT_EXPIRES_IN configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando NODE_ENV..." -ForegroundColor Yellow
vercel env add NODE_ENV
Write-Host "✅ NODE_ENV configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando CORS_ORIGIN..." -ForegroundColor Yellow
vercel env add CORS_ORIGIN
Write-Host "✅ CORS_ORIGIN configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando LOG_LEVEL..." -ForegroundColor Yellow
vercel env add LOG_LEVEL
Write-Host "✅ LOG_LEVEL configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando BCRYPT_ROUNDS..." -ForegroundColor Yellow
vercel env add BCRYPT_ROUNDS
Write-Host "✅ BCRYPT_ROUNDS configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando RATE_LIMIT_WINDOW_MS..." -ForegroundColor Yellow
vercel env add RATE_LIMIT_WINDOW_MS
Write-Host "✅ RATE_LIMIT_WINDOW_MS configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Configurando RATE_LIMIT_MAX_REQUESTS..." -ForegroundColor Yellow
vercel env add RATE_LIMIT_MAX_REQUESTS
Write-Host "✅ RATE_LIMIT_MAX_REQUESTS configurado" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 Variables configuradas exitosamente!" -ForegroundColor Green
Write-Host "💜 Ahora ejecuta: vercel --prod" -ForegroundColor Magenta