# Presentación: Principios SOLID, Cohesión y Acoplamiento
## Demostración Práctica con Node.js + TypeScript

---

## 📋 Agenda de la Presentación

### 1. Introducción (5 min)
- ¿Qué son los principios SOLID?
- Importancia de la cohesión y acoplamiento
- Demostración del proyecto en vivo

### 2. Principios SOLID - Teoría y Práctica (25 min)
- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle  
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

### 3. Cohesión y Acoplamiento (10 min)
- Definiciones y ejemplos
- Implementación en el proyecto

### 4. Inyección de Dependencias (10 min)
- Patrón implementado
- Beneficios demostrados

---

## 🚀 Demostración en Vivo

### Paso 1: Mostrar el Frontend Funcionando
```bash
# Abrir en el navegador:
http://localhost:3001/
```

**Qué mostrar:**
- Interfaz interactiva que demuestra cada principio
- Pruebas de API en tiempo real
- Resultados visuales de cada endpoint

### Paso 2: Explicar la Arquitectura
```
proyecto/
├── src/
│   ├── interfaces/     # Contratos (ISP, DIP)
│   ├── services/       # Lógica de negocio (SRP)
│   ├── repositories/   # Acceso a datos (SRP, OCP)
│   ├── container/      # Inyección de dependencias
│   └── routes/         # Controladores (SRP)
├── public/             # Frontend interactivo
└── .env               # Variables de entorno
```

---

## 📖 Principios SOLID - Explicación Detallada

### 🔹 S - Single Responsibility Principle (SRP)

**Definición:** Una clase debe tener una sola razón para cambiar.

**Ejemplo en el código:**
```typescript
// ❌ MALO: Múltiples responsabilidades
class User {
  validateEmail() { /* validación */ }
  hashPassword() { /* encriptación */ }
  saveToDatabase() { /* persistencia */ }
  sendEmail() { /* notificación */ }
}

// ✅ BUENO: Responsabilidad única
class UserValidator {
  validateEmail(email: string): boolean { /* solo validación */ }
}

class PasswordHasher {
  hash(password: string): string { /* solo encriptación */ }
}

class UserRepository {
  save(user: User): Promise<void> { /* solo persistencia */ }
}
```

**Mostrar en el proyecto:**
- `src/services/UserService.ts` - Solo lógica de usuarios
- `src/services/TokenService.ts` - Solo manejo de JWT
- `src/services/PasswordHasher.ts` - Solo encriptación

### 🔹 O - Open/Closed Principle (OCP)

**Definición:** Abierto para extensión, cerrado para modificación.

**Ejemplo en el código:**
```typescript
// ✅ Extensible sin modificar código existente
interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}

// Implementación en memoria
class InMemoryUserRepository implements IUserRepository {
  // implementación...
}

// Nueva implementación sin modificar código existente
class DatabaseUserRepository implements IUserRepository {
  // nueva implementación...
}
```

**Mostrar en el proyecto:**
- `src/interfaces/IRepository.ts` - Contratos extensibles
- `src/repositories/InMemoryUserRepository.ts` - Implementación actual
- Posibilidad de agregar `DatabaseUserRepository` sin cambios

### 🔹 L - Liskov Substitution Principle (LSP)

**Definición:** Los objetos derivados deben ser sustituibles por sus objetos base.

**Ejemplo en el código:**
```typescript
interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

// Cualquier implementación debe cumplir el contrato
class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

// Otra implementación intercambiable
class ArgonPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    // implementación con Argon2
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    // verificación con Argon2
  }
}
```

**Mostrar en el proyecto:**
- `src/services/PasswordHasher.ts` - Implementación intercambiable
- Demostrar que se puede cambiar sin afectar otros componentes

### 🔹 I - Interface Segregation Principle (ISP)

**Definición:** Los clientes no deben depender de interfaces que no usan.

**Ejemplo en el código:**
```typescript
// ❌ MALO: Interfaz muy grande
interface IUserOperations {
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User>;
  sendEmail(user: User): Promise<void>;
  generateReport(): Promise<string>;
}

// ✅ BUENO: Interfaces específicas
interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}

interface IEmailService {
  sendEmail(to: string, subject: string): Promise<void>;
}

interface IReportGenerator {
  generateUserReport(): Promise<string>;
}
```

**Mostrar en el proyecto:**
- `src/interfaces/IRepository.ts` - Interfaces específicas
- Cada servicio implementa solo lo que necesita

### 🔹 D - Dependency Inversion Principle (DIP)

**Definición:** Depender de abstracciones, no de concreciones.

**Ejemplo en el código:**
```typescript
// ❌ MALO: Dependencia directa
class UserService {
  private userRepo = new InMemoryUserRepository(); // ¡Acoplado!
  
  async createUser(userData: any) {
    return this.userRepo.create(userData);
  }
}

// ✅ BUENO: Inyección de dependencias
class UserService {
  constructor(
    private userRepo: IUserRepository, // ¡Abstracción!
    private passwordHasher: IPasswordHasher
  ) {}
  
  async createUser(userData: any) {
    return this.userRepo.create(userData);
  }
}
```

**Mostrar en el proyecto:**
- `src/container/DIContainer.ts` - Contenedor de dependencias
- `src/services/UserService.ts` - Inyección en constructor
- Configuración en `src/app.ts`

---

## 🔗 Cohesión y Acoplamiento

### Alta Cohesión
**Definición:** Elementos relacionados están juntos y trabajan hacia un objetivo común.

**Ejemplos en el proyecto:**
```typescript
// ✅ Alta cohesión: Todo relacionado con tokens
class TokenService {
  generateToken(payload: any): string { /* */ }
  verifyToken(token: string): any { /* */ }
  refreshToken(token: string): string { /* */ }
}

// ✅ Alta cohesión: Todo relacionado con usuarios
class UserService {
  createUser(userData: any): Promise<User> { /* */ }
  authenticateUser(credentials: any): Promise<string> { /* */ }
  getUserProfile(id: string): Promise<User> { /* */ }
}
```

### Bajo Acoplamiento
**Definición:** Mínima dependencia entre módulos.

**Ejemplos en el proyecto:**
```typescript
// ✅ Bajo acoplamiento: Usa interfaces
class UserService {
  constructor(
    private userRepo: IUserRepository,    // No conoce la implementación
    private passwordHasher: IPasswordHasher // No conoce la implementación
  ) {}
}

// ✅ Cambiar implementación sin afectar UserService
container.register('IUserRepository', new DatabaseUserRepository());
```

---

## 🏗️ Inyección de Dependencias

### Patrón Implementado
```typescript
// Contenedor DI (Singleton)
class DIContainer {
  private static instance: DIContainer;
  private dependencies = new Map<string, any>();
  
  register<T>(key: string, implementation: T): void {
    this.dependencies.set(key, implementation);
  }
  
  get<T>(key: string): T {
    return this.dependencies.get(key);
  }
}
```

### Beneficios Demostrados
1. **Testabilidad:** Fácil inyección de mocks
2. **Flexibilidad:** Cambio de implementaciones
3. **Mantenibilidad:** Código desacoplado
4. **Escalabilidad:** Fácil agregar nuevas funcionalidades

---

## 🎯 Demostración Práctica en el Frontend

### Funcionalidades a Mostrar:

1. **Login de Usuario**
   - Demuestra: UserService, PasswordHasher, TokenService
   - Principios: SRP, DIP

2. **Obtener Perfil**
   - Demuestra: Autenticación JWT, UserRepository
   - Principios: SRP, ISP

3. **Listar Usuarios**
   - Demuestra: Repository pattern, Paginación
   - Principios: OCP, LSP

4. **Estadísticas del Sistema**
   - Demuestra: Extensibilidad, Nuevas funcionalidades
   - Principios: OCP, SRP

### Código del Frontend Interactivo:
```javascript
// Ejemplo de llamada a API
async function testLogin() {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    })
  });
  
  const result = await response.json();
  // Mostrar resultado en la interfaz
}
```

---

## 📊 Métricas de Calidad del Código

### Indicadores Implementados:
- ✅ **Responsabilidad única:** Cada clase tiene un propósito específico
- ✅ **Bajo acoplamiento:** Uso de interfaces y DI
- ✅ **Alta cohesión:** Funcionalidades relacionadas agrupadas
- ✅ **Extensibilidad:** Fácil agregar nuevas funcionalidades
- ✅ **Testabilidad:** Dependencias inyectables
- ✅ **Mantenibilidad:** Código limpio y organizado

---

## 🎬 Guión de Presentación

### Introducción (5 min)
1. "Hoy vamos a ver principios fundamentales del desarrollo de software"
2. Abrir `http://localhost:3001/` en el navegador
3. "Este es un proyecto real que implementa todos estos principios"
4. Mostrar la interfaz funcionando

### Demostración SOLID (25 min)
**Para cada principio:**
1. Explicar la teoría (2 min)
2. Mostrar código malo vs bueno (2 min)
3. Demostrar en el proyecto (1 min)

### Cohesión y Acoplamiento (10 min)
1. Definiciones con ejemplos
2. Mostrar implementación en el proyecto
3. Demostrar beneficios

### Inyección de Dependencias (10 min)
1. Explicar el patrón
2. Mostrar el contenedor DI
3. Demostrar flexibilidad

### Conclusión (5 min)
1. Recapitular beneficios
2. Mostrar métricas de calidad
3. Preguntas y respuestas

---

## 🔧 Comandos para la Demostración

```bash
# Iniciar el proyecto
npm install
npm run build
PORT=3001 npm start

# Abrir en navegador
http://localhost:3001/

# APIs disponibles
http://localhost:3001/api          # Documentación
http://localhost:3001/health       # Health check
http://localhost:3001/api/stats    # Estadísticas
```

---

## 📝 Notas para el Presentador

- **Tiempo total:** 55 minutos + 5 min preguntas
- **Enfoque:** Práctica sobre teoría
- **Interactividad:** Usar el frontend para demostrar conceptos
- **Código:** Mostrar ejemplos reales del proyecto
- **Beneficios:** Enfatizar ventajas prácticas de cada principio

---

## 🎯 Objetivos de Aprendizaje

Al final de esta presentación, los asistentes podrán:

1. ✅ Identificar violaciones de principios SOLID
2. ✅ Implementar inyección de dependencias
3. ✅ Diseñar código con alta cohesión y bajo acoplamiento
4. ✅ Aplicar estos principios en proyectos reales
5. ✅ Evaluar la calidad del código usando estas métricas

---

**¡Listo para la presentación! 🚀**