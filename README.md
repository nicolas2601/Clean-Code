# 🚀 Demostración Completa de Principios SOLID
## Node.js + TypeScript + Frontend Interactivo

## 📋 Descripción

Este proyecto es una **demostración práctica** de los principios fundamentales de la programación orientada a objetos y el diseño de software limpio. Implementa un sistema de gestión de usuarios usando **Node.js**, **Express** y **TypeScript** con una interfaz web interactiva para presentaciones y aprendizaje.

## 🌟 Características Nuevas

- ✅ **Frontend Interactivo**: Interfaz web que demuestra cada principio
- ✅ **Presentación Integrada**: Guía paso a paso para explicar conceptos
- ✅ **Pruebas en Vivo**: APIs funcionales con resultados visuales
- ✅ **Documentación Completa**: Guías detalladas para presentaciones
- ✅ **Variables de Entorno**: Configuración flexible del proyecto

## 🎯 Principios Implementados

### 🔧 Principios SOLID

#### 1. **S**ingle Responsibility Principle (SRP)
- **`User`**: Solo maneja la representación de un usuario
- **`UserService`**: Solo maneja lógica de negocio de usuarios
- **`BcryptPasswordHasher`**: Solo maneja hash de contraseñas
- **`JwtTokenService`**: Solo maneja tokens JWT
- **`UserController`**: Solo maneja requests HTTP
- **`InMemoryUserRepository`**: Solo maneja persistencia de usuarios

#### 2. **O**pen/Closed Principle (OCP)
- **Interfaces**: `IUserRepository`, `IPasswordHasher`, `ITokenService` permiten extensión sin modificación
- **Repositorio**: Se puede cambiar de memoria a base de datos sin modificar código existente
- **Servicios**: Nuevos servicios de hash o tokens pueden agregarse fácilmente

#### 3. **L**iskov Substitution Principle (LSP)
- Cualquier implementación de `IUserRepository` puede reemplazar a `InMemoryUserRepository`
- Cualquier implementación de `IPasswordHasher` puede reemplazar a `BcryptPasswordHasher`

#### 4. **I**nterface Segregation Principle (ISP)
- **`IUser`**: Interface básica de usuario
- **`IUserAuth`**: Interface específica para autenticación
- **`ICreateUser`**: Interface específica para creación
- **`IUpdateUser`**: Interface específica para actualización

#### 5. **D**ependency Inversion Principle (DIP)
- **`UserService`** depende de abstracciones (`IUserRepository`, `IPasswordHasher`, `ITokenService`)
- **`DIContainer`** maneja todas las dependencias
- Las clases de alto nivel no dependen de implementaciones concretas

### 🔗 Cohesión y Acoplamiento

#### ✅ **Alta Cohesión**
- **`User`**: Todos los métodos están relacionados con la entidad usuario
- **`UserService`**: Todos los métodos manejan lógica de negocio de usuarios
- **`BcryptPasswordHasher`**: Todos los métodos están relacionados con hash
- **`AuthMiddleware`**: Todos los métodos están relacionados con autenticación

#### ✅ **Bajo Acoplamiento**
- **Interfaces**: Las clases dependen de abstracciones, no de implementaciones
- **Inyección de Dependencias**: Las dependencias se inyectan, no se crean internamente
- **Separación de responsabilidades**: Cada clase tiene una responsabilidad específica

### 💉 Inyección de Dependencias

#### **DIContainer**
```typescript
// Registro centralizado de dependencias
this.services.set('UserService', new UserService(
  this.get<IUserRepository>('IUserRepository'),
  this.get<IPasswordHasher>('IPasswordHasher'),
  this.get<ITokenService>('ITokenService')
));
```

#### **Constructor Injection**
```typescript
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}
}
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### Uso
El servidor se ejecuta en `http://localhost:3000`

## 📚 API Endpoints

### Públicos
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /health` - Health check
- `GET /api` - Información de la API

### Autenticados (requieren Bearer token)
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/change-password` - Cambiar contraseña
- `DELETE /api/users/profile` - Eliminar cuenta
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/stats` - Estadísticas del sistema

## 🧪 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Obtener Perfil
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── interfaces/          # Interfaces y contratos
│   ├── IUser.ts        # Interfaces de usuario
│   └── IRepository.ts  # Interfaces de repositorio y servicios
├── models/             # Modelos de dominio
│   └── User.ts         # Entidad Usuario
├── services/           # Servicios de aplicación
│   ├── UserService.ts  # Lógica de negocio de usuarios
│   ├── PasswordHasher.ts # Servicio de hash
│   └── TokenService.ts # Servicio de tokens
├── repositories/       # Capa de persistencia
│   └── InMemoryUserRepository.ts # Repositorio en memoria
├── controllers/        # Controladores HTTP
│   └── UserController.ts # Controlador de usuarios
├── middleware/         # Middleware de Express
│   └── AuthMiddleware.ts # Middleware de autenticación
├── routes/            # Definición de rutas
│   └── userRoutes.ts  # Rutas de usuarios
├── container/         # Inyección de dependencias
│   └── DIContainer.ts # Contenedor DI
├── app.ts            # Configuración de Express
└── index.ts          # Punto de entrada
```

## 🔍 Ejemplos Prácticos de Principios

### 1. Single Responsibility Principle (SRP)

**❌ Violación del SRP:**
```typescript
class User {
  // Responsabilidad 1: Representar usuario
  constructor(public name: string, public email: string) {}
  
  // Responsabilidad 2: Hash de contraseñas (VIOLA SRP)
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  
  // Responsabilidad 3: Envío de emails (VIOLA SRP)
  sendWelcomeEmail(): void {
    // lógica de envío de email
  }
}
```

**✅ Cumplimiento del SRP:**
```typescript
// Una responsabilidad: representar usuario
class User {
  constructor(public name: string, public email: string) {}
}

// Una responsabilidad: hash de contraseñas
class PasswordHasher {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}

// Una responsabilidad: envío de emails
class EmailService {
  sendWelcomeEmail(user: User): void {
    // lógica de envío de email
  }
}
```

### 2. Dependency Inversion Principle (DIP)

**❌ Violación del DIP:**
```typescript
class UserService {
  private userRepository: MySQLUserRepository; // Depende de implementación concreta
  
  constructor() {
    this.userRepository = new MySQLUserRepository(); // Acoplamiento fuerte
  }
}
```

**✅ Cumplimiento del DIP:**
```typescript
class UserService {
  constructor(
    private userRepository: IUserRepository // Depende de abstracción
  ) {}
}

// La implementación concreta se inyecta desde afuera
const userService = new UserService(new MySQLUserRepository());
```

### 3. Alta Cohesión vs Baja Cohesión

**❌ Baja Cohesión:**
```typescript
class Utils {
  hashPassword(password: string): string { /* ... */ }
  sendEmail(to: string, subject: string): void { /* ... */ }
  calculateTax(amount: number): number { /* ... */ }
  formatDate(date: Date): string { /* ... */ }
  // Métodos no relacionados entre sí
}
```

**✅ Alta Cohesión:**
```typescript
class PasswordService {
  hash(password: string): string { /* ... */ }
  compare(password: string, hash: string): boolean { /* ... */ }
  generateSalt(): string { /* ... */ }
  // Todos los métodos están relacionados con contraseñas
}
```

### 4. Inyección de Dependencias

**❌ Sin Inyección de Dependencias:**
```typescript
class UserService {
  private userRepository: IUserRepository;
  private passwordHasher: IPasswordHasher;
  
  constructor() {
    // Crea dependencias internamente (acoplamiento fuerte)
    this.userRepository = new InMemoryUserRepository();
    this.passwordHasher = new BcryptPasswordHasher();
  }
}
```

**✅ Con Inyección de Dependencias:**
```typescript
class UserService {
  constructor(
    private userRepository: IUserRepository,    // Inyectado
    private passwordHasher: IPasswordHasher     // Inyectado
  ) {}
}

// Configuración externa (DIContainer)
const userService = new UserService(
  container.get('IUserRepository'),
  container.get('IPasswordHasher')
);
```

## 🧪 Testing

La arquitectura facilita el testing mediante:

```typescript
// Mock de dependencias para testing
const mockRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  // ...
};

const mockPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn()
};

// Inyección de mocks
const userService = new UserService(
  mockRepository as any,
  mockPasswordHasher as any,
  mockTokenService as any
);
```

## 🔧 Configuración

### Variables de Entorno
```bash
PORT=3000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## 📈 Beneficios de esta Arquitectura

1. **Mantenibilidad**: Código fácil de mantener y modificar
2. **Testabilidad**: Fácil de testear con mocks
3. **Escalabilidad**: Fácil de extender con nuevas funcionalidades
4. **Flexibilidad**: Fácil intercambio de implementaciones
5. **Reutilización**: Componentes reutilizables
6. **Separación de responsabilidades**: Cada clase tiene una función específica

## 🚀 Extensiones Posibles

- Cambiar repositorio en memoria por base de datos (PostgreSQL, MongoDB)
- Agregar cache con Redis
- Implementar diferentes estrategias de hash
- Agregar logging estructurado
- Implementar rate limiting
- Agregar validación con Joi o Zod
- Implementar paginación
- Agregar roles y permisos

## 👨‍💻 Autor

Nicolas 

---

**¡Este proyecto demuestra cómo aplicar principios de diseño sólidos para crear código mantenible, testeable y escalable!** 🎉