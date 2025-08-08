# Variables de Entorno para Vercel

## 🚀 Configuración para Despliegue en Vercel

Estas son las variables de entorno que debes configurar en tu proyecto de Vercel:

### 📋 Variables Obligatorias

```bash
# Configuración JWT (CRÍTICO - Cambiar en producción)
JWT_SECRET=tu-clave-jwt-super-segura-para-produccion-2024
JWT_EXPIRES_IN=24h

# Configuración del entorno
NODE_ENV=production

# Configuración de CORS (Cambiar por tu dominio de Vercel)
CORS_ORIGIN=https://tu-proyecto.vercel.app

# Configuración de logging
LOG_LEVEL=error

# Configuración de seguridad
BCRYPT_ROUNDS=12

# Configuración de rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 🔧 Cómo Configurar en Vercel

#### Opción 1: Dashboard de Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Navega a **Settings** → **Environment Variables**
3. Agrega cada variable una por una:

| Variable | Value | Environment |
|----------|-------|-------------|
| `JWT_SECRET` | `tu-clave-jwt-super-segura-para-produccion-2024` | Production, Preview, Development |
| `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `CORS_ORIGIN` | `https://tu-proyecto.vercel.app` | Production, Preview, Development |
| `LOG_LEVEL` | `error` | Production |
| `BCRYPT_ROUNDS` | `12` | Production, Preview, Development |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Production, Preview, Development |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Production, Preview, Development |

#### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Configurar variables desde la terminal
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add NODE_ENV
vercel env add CORS_ORIGIN
vercel env add LOG_LEVEL
vercel env add BCRYPT_ROUNDS
vercel env add RATE_LIMIT_WINDOW_MS
vercel env add RATE_LIMIT_MAX_REQUESTS
```

### ⚠️ Consideraciones Importantes

#### 1. JWT_SECRET
- **NUNCA** uses la misma clave que en desarrollo
- Genera una clave segura: `openssl rand -base64 32`
- Ejemplo: `A8f9K2mN7pQ1rS4tU6vW8xY0zB3cD5eF7gH9jK2lM4nP6qR8sT0uV2wX4yZ6aB8c`

#### 2. CORS_ORIGIN
- Reemplaza `https://tu-proyecto.vercel.app` con tu URL real de Vercel
- Si tienes múltiples dominios, sepáralos con comas
- Ejemplo: `https://mi-proyecto-solid.vercel.app`

#### 3. NODE_ENV
- Debe ser `production` para el entorno de producción
- Vercel lo configura automáticamente, pero es buena práctica especificarlo

#### 4. LOG_LEVEL
- En producción usa `error` o `warn` para reducir logs
- En desarrollo puedes usar `info` o `debug`

### 🔒 Variables Sensibles

Estas variables contienen información sensible y deben manejarse con cuidado:

- ✅ `JWT_SECRET` - Clave para firmar tokens JWT
- ✅ `BCRYPT_ROUNDS` - Configuración de encriptación

### 📝 Variables Opcionales (No necesarias para Vercel)

Estas variables del archivo `.env` local NO son necesarias en Vercel:

```bash
# ❌ NO configurar en Vercel
PORT=3001                    # Vercel maneja esto automáticamente
DB_HOST=localhost            # No usamos base de datos externa
DB_PORT=5432                 # No usamos base de datos externa
DB_NAME=solid_demo           # No usamos base de datos externa
DB_USER=postgres             # No usamos base de datos externa
DB_PASSWORD=password         # No usamos base de datos externa
```

### 🚀 Comandos de Despliegue

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Desplegar (desde la raíz del proyecto)
vercel

# 4. Para despliegues posteriores
vercel --prod
```

### 📋 Checklist Pre-Despliegue

- [ ] Configurar todas las variables de entorno en Vercel
- [ ] Cambiar `JWT_SECRET` por una clave segura
- [ ] Actualizar `CORS_ORIGIN` con tu dominio de Vercel
- [ ] Verificar que `NODE_ENV=production`
- [ ] Compilar el proyecto localmente: `npm run build`
- [ ] Probar que no hay errores de TypeScript

### 🔍 Verificación Post-Despliegue

Después del despliegue, verifica estos endpoints:

- `https://tu-proyecto.vercel.app/` - Frontend
- `https://tu-proyecto.vercel.app/health` - Health check
- `https://tu-proyecto.vercel.app/api` - Documentación API
- `https://tu-proyecto.vercel.app/api/stats` - Estadísticas

### 🆘 Solución de Problemas

#### Error: "JWT_SECRET is not defined"
- Verifica que configuraste `JWT_SECRET` en las variables de entorno de Vercel

#### Error: "CORS policy"
- Actualiza `CORS_ORIGIN` con tu dominio real de Vercel

#### Error: "Cannot find module"
- Ejecuta `npm run build` localmente para verificar que no hay errores de compilación

---

**¡Tu proyecto está listo para Vercel! 🎉**

Recuerda que este proyecto demuestra principios SOLID y será una excelente demostración en producción.