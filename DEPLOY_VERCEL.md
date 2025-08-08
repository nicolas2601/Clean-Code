# 🚀 Guía de Despliegue en Vercel

## Pasos para Desplegar tu Proyecto SOLID en Vercel

### 📋 Pre-requisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Proyecto subido a GitHub/GitLab/Bitbucket
- ✅ Node.js instalado localmente

### 🔧 Paso 1: Preparar el Proyecto

```bash
# 1. Compilar el proyecto
npm run build

# 2. Verificar que no hay errores
npm start
```

### 🌐 Paso 2: Configurar Variables de Entorno

#### Variables Obligatorias en Vercel:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `JWT_SECRET` | `[GENERAR_NUEVA_CLAVE]` | Clave secreta para JWT (¡CAMBIAR!) |
| `JWT_EXPIRES_IN` | `24h` | Tiempo de expiración del token |
| `NODE_ENV` | `production` | Entorno de producción |
| `CORS_ORIGIN` | `https://tu-proyecto.vercel.app` | Dominio permitido para CORS |
| `LOG_LEVEL` | `error` | Nivel de logging |
| `BCRYPT_ROUNDS` | `12` | Rounds para bcrypt |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Ventana de rate limiting |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Máximo de requests |

#### 🔐 Generar JWT_SECRET Seguro:

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online (usar con precaución)
# https://generate-secret.vercel.app/32
```

### 🚀 Paso 3: Desplegar en Vercel

#### Opción A: Dashboard de Vercel (Recomendado)

1. **Conectar Repositorio:**
   - Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click en "New Project"
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket
   - Selecciona tu proyecto

2. **Configurar Build:**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Configurar Variables de Entorno:**
   - En "Environment Variables"
   - Agrega cada variable de la tabla anterior
   - Selecciona "Production", "Preview", "Development"

4. **Deploy:**
   - Click "Deploy"
   - Espera a que termine el build

#### Opción B: Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Configurar variables de entorno
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NODE_ENV production
vercel env add CORS_ORIGIN production
vercel env add LOG_LEVEL production
vercel env add BCRYPT_ROUNDS production
vercel env add RATE_LIMIT_WINDOW_MS production
vercel env add RATE_LIMIT_MAX_REQUESTS production

# 4. Desplegar
vercel --prod
```

### 🔍 Paso 4: Verificar Despliegue

Después del despliegue, verifica estos endpoints:

```bash
# Reemplaza 'tu-proyecto' con tu URL real
https://tu-proyecto.vercel.app/           # Frontend
https://tu-proyecto.vercel.app/health     # Health check
https://tu-proyecto.vercel.app/api        # Documentación
https://tu-proyecto.vercel.app/api/stats  # Estadísticas
```

### 📝 Paso 5: Actualizar CORS_ORIGIN

1. Copia tu URL de Vercel (ej: `https://solid-demo-abc123.vercel.app`)
2. Ve a Settings → Environment Variables en Vercel
3. Edita `CORS_ORIGIN` con tu URL real
4. Redeploy el proyecto

### 🧪 Paso 6: Probar Funcionalidades

#### Test del Frontend:
1. Abre tu URL de Vercel
2. Prueba el login con:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Verifica que todas las funciones trabajen

#### Test de APIs:
```bash
# Health Check
curl https://tu-proyecto.vercel.app/health

# Login
curl -X POST https://tu-proyecto.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Stats
curl https://tu-proyecto.vercel.app/api/stats
```

### 🔧 Configuración Avanzada

#### Archivo vercel.json
El proyecto incluye un archivo `vercel.json` optimizado para serverless:

```json
{
  "version": 2,
  "name": "solid-principles-demo",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/public/(.*)",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index"
    }
  ]
}
```

#### Estructura Serverless
El proyecto ahora usa una estructura optimizada para Vercel:
- `api/index.ts`: Punto de entrada principal para las funciones serverless
- `public/`: Archivos estáticos servidos directamente
- Todas las rutas se manejan a través de la función serverless

#### Custom Domain (Opcional):
1. Ve a Settings → Domains en Vercel
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones
4. Actualiza `CORS_ORIGIN` con tu nuevo dominio

#### Analytics (Opcional):
1. Ve a Analytics en tu dashboard de Vercel
2. Habilita Web Analytics
3. Agrega el script a tu `public/index.html`

### 🆘 Solución de Problemas

#### Error: "Function Timeout"
```json
// En vercel.json, aumenta maxDuration
{
  "functions": {
    "dist/index.js": {
      "maxDuration": 60
    }
  }
}
```

#### Error: "Module not found"
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Ejecuta `npm run build` localmente para verificar

#### Error: "CORS policy"
- Verifica que `CORS_ORIGIN` tenga tu URL correcta de Vercel
- No incluyas `/` al final de la URL

#### Error: "JWT malformed"
- Verifica que `JWT_SECRET` esté configurado correctamente
- Genera una nueva clave secreta

### 📊 Monitoreo Post-Despliegue

#### Logs en Tiempo Real:
```bash
vercel logs tu-proyecto.vercel.app
```

#### Métricas en Dashboard:
- Functions: Tiempo de ejecución
- Bandwidth: Transferencia de datos
- Requests: Número de peticiones

### 🔄 Actualizaciones Futuras

```bash
# Para actualizaciones automáticas:
# 1. Push a tu repositorio
# 2. Vercel detecta cambios automáticamente
# 3. Redeploy automático

# Para actualizaciones manuales:
vercel --prod
```

### 🎯 Checklist Final

- [ ] ✅ Proyecto compilado sin errores
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ JWT_SECRET cambiado por uno seguro
- [ ] ✅ CORS_ORIGIN actualizado con URL de Vercel
- [ ] ✅ Frontend funcionando
- [ ] ✅ APIs respondiendo correctamente
- [ ] ✅ Login de prueba funcionando
- [ ] ✅ Health check respondiendo
- [ ] ✅ Estadísticas disponibles

---

## 🎉 ¡Felicitaciones!

Tu proyecto de demostración de principios SOLID está ahora desplegado en Vercel y disponible para el mundo.

**URLs importantes:**
- 🌐 **Frontend:** `https://tu-proyecto.vercel.app/`
- 📚 **API Docs:** `https://tu-proyecto.vercel.app/api`
- ❤️ **Health:** `https://tu-proyecto.vercel.app/health`
- 📊 **Stats:** `https://tu-proyecto.vercel.app/api/stats`

**Credenciales de prueba:**
- 📧 **Email:** `admin@example.com`
- 🔑 **Password:** `admin123`

¡Perfecto para presentaciones y demostraciones! 🚀