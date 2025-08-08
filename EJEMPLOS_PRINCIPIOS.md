# 📚 Ejemplos Detallados de Principios SOLID, Cohesión y Acoplamiento

## 🎯 Principios SOLID - Ejemplos Prácticos

### 1. 🔧 Single Responsibility Principle (SRP)

> "Una clase debe tener una sola razón para cambiar"

#### ❌ **Ejemplo INCORRECTO - Violación del SRP**

```typescript
// Esta clase tiene MÚLTIPLES responsabilidades
class UserManager {
  // Responsabilidad 1: Gestión de usuarios
  createUser(userData: any): User {
    return new User(userData.name, userData.email);
  }
  
  // Responsabilidad 2: Hash de contraseñas
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  
  // Responsabilidad 3: Envío de emails
  sendWelcomeEmail(user: User): void {
    const emailContent = `Bienvenido ${user.name}`;
    // lógica de envío de email
  }
  
  // Responsabilidad 4: Logging
  logUserAction(action: string): void {
    console.log(`User action: ${action}`);
  }
  
  // Responsabilidad 5: Validación
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

**Problemas:**
- Si cambia la lógica de hash, hay que modificar UserManager
- Si cambia el servicio de email, hay que modificar UserManager
- Difícil de testear (muchas dependencias)
- Viola el principio de responsabilidad única

#### ✅ **Ejemplo CORRECTO - Cumplimiento del SRP**

```typescript
// Responsabilidad única: Representar un usuario
class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string
  ) {}
}

// Responsabilidad única: Hash de contraseñas
class PasswordHasher {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  
  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}

// Responsabilidad única: Envío de emails
class EmailService {
  sendWelcomeEmail(user: User): void {
    const emailContent = `Bienvenido ${user.name}`;
    // lógica de envío de email
  }
}

// Responsabilidad única: Logging
class Logger {
  logUserAction(userId: string, action: string): void {
    console.log(`[${new Date().toISOString()}] User ${userId}: ${action}`);
  }
}

// Responsabilidad única: Validación
class Validator {
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// Responsabilidad única: Orquestar la creación de usuarios
class UserService {
  constructor(
    private passwordHasher: PasswordHasher,
    private emailService: EmailService,
    private logger: Logger,
    private validator: Validator
  ) {}
  
  createUser(userData: any): User {
    // Validar
    if (!this.validator.validateEmail(userData.email)) {
      throw new Error('Email inválido');
    }
    
    // Crear usuario
    const user = new User(generateId(), userData.name, userData.email);
    
    // Enviar email de bienvenida
    this.emailService.sendWelcomeEmail(user);
    
    // Log de la acción
    this.logger.logUserAction(user.id, 'Usuario creado');
    
    return user;
  }
}
```

**Beneficios:**
- Cada clase tiene una responsabilidad específica
- Fácil de testear (dependencias inyectadas)
- Fácil de mantener y modificar
- Reutilizable

---

### 2. 🔓 Open/Closed Principle (OCP)

> "Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación"

#### ❌ **Ejemplo INCORRECTO - Violación del OCP**

```typescript
class NotificationService {
  sendNotification(type: string, message: string, recipient: string): void {
    if (type === 'email') {
      // Lógica de email
      console.log(`Enviando email a ${recipient}: ${message}`);
    } else if (type === 'sms') {
      // Lógica de SMS
      console.log(`Enviando SMS a ${recipient}: ${message}`);
    } else if (type === 'push') {
      // Lógica de push notification
      console.log(`Enviando push a ${recipient}: ${message}`);
    }
    // Para agregar WhatsApp, hay que MODIFICAR esta clase
  }
}
```

**Problemas:**
- Para agregar un nuevo tipo de notificación, hay que modificar la clase
- Viola el principio abierto/cerrado
- Difícil de testear cada tipo por separado

#### ✅ **Ejemplo CORRECTO - Cumplimiento del OCP**

```typescript
// Abstracción base
interface INotificationChannel {
  send(message: string, recipient: string): void;
}

// Implementaciones específicas (extensiones)
class EmailNotification implements INotificationChannel {
  send(message: string, recipient: string): void {
    console.log(`📧 Enviando email a ${recipient}: ${message}`);
  }
}

class SmsNotification implements INotificationChannel {
  send(message: string, recipient: string): void {
    console.log(`📱 Enviando SMS a ${recipient}: ${message}`);
  }
}

class PushNotification implements INotificationChannel {
  send(message: string, recipient: string): void {
    console.log(`🔔 Enviando push a ${recipient}: ${message}`);
  }
}

// Nueva extensión SIN modificar código existente
class WhatsAppNotification implements INotificationChannel {
  send(message: string, recipient: string): void {
    console.log(`💬 Enviando WhatsApp a ${recipient}: ${message}`);
  }
}

// Servicio que usa las abstracciones
class NotificationService {
  private channels: Map<string, INotificationChannel> = new Map();
  
  registerChannel(type: string, channel: INotificationChannel): void {
    this.channels.set(type, channel);
  }
  
  sendNotification(type: string, message: string, recipient: string): void {
    const channel = this.channels.get(type);
    if (!channel) {
      throw new Error(`Canal de notificación '${type}' no encontrado`);
    }
    channel.send(message, recipient);
  }
}

// Uso
const notificationService = new NotificationService();
notificationService.registerChannel('email', new EmailNotification());
notificationService.registerChannel('sms', new SmsNotification());
notificationService.registerChannel('push', new PushNotification());
notificationService.registerChannel('whatsapp', new WhatsAppNotification()); // ¡Sin modificar código existente!
```

---

### 3. 🔄 Liskov Substitution Principle (LSP)

> "Los objetos de una superclase deben ser reemplazables con objetos de sus subclases sin alterar el funcionamiento del programa"

#### ❌ **Ejemplo INCORRECTO - Violación del LSP**

```typescript
class Bird {
  fly(): void {
    console.log('El pájaro está volando');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Los pingüinos no pueden volar'); // ¡Viola LSP!
  }
}

// Función que usa Bird
function makeBirdFly(bird: Bird): void {
  bird.fly(); // ¡Falla con Penguin!
}

const penguin = new Penguin();
makeBirdFly(penguin); // ¡Error!
```

#### ✅ **Ejemplo CORRECTO - Cumplimiento del LSP**

```typescript
// Abstracción más específica
interface IMovable {
  move(): void;
}

interface IFlyable extends IMovable {
  fly(): void;
}

interface ISwimmable extends IMovable {
  swim(): void;
}

// Implementaciones que respetan LSP
class Eagle implements IFlyable {
  move(): void {
    this.fly();
  }
  
  fly(): void {
    console.log('El águila está volando');
  }
}

class Penguin implements ISwimmable {
  move(): void {
    this.swim();
  }
  
  swim(): void {
    console.log('El pingüino está nadando');
  }
}

class Duck implements IFlyable, ISwimmable {
  move(): void {
    // Puede elegir cómo moverse
    this.fly();
  }
  
  fly(): void {
    console.log('El pato está volando');
  }
  
  swim(): void {
    console.log('El pato está nadando');
  }
}

// Funciones que respetan LSP
function makeAnimalMove(animal: IMovable): void {
  animal.move(); // Funciona con cualquier implementación
}

function makeFlyableAnimalFly(animal: IFlyable): void {
  animal.fly(); // Solo acepta animales que pueden volar
}
```

---

### 4. 🔀 Interface Segregation Principle (ISP)

> "Los clientes no deben ser forzados a depender de interfaces que no usan"

#### ❌ **Ejemplo INCORRECTO - Violación del ISP**

```typescript
// Interface "gorda" que viola ISP
interface IWorker {
  work(): void;
  eat(): void;
  sleep(): void;
  code(): void;
  design(): void;
  test(): void;
}

// Un desarrollador tiene que implementar TODO
class Developer implements IWorker {
  work(): void { console.log('Desarrollando...'); }
  eat(): void { console.log('Comiendo...'); }
  sleep(): void { console.log('Durmiendo...'); }
  code(): void { console.log('Programando...'); }
  design(): void { throw new Error('No soy diseñador'); } // ¡Forzado a implementar!
  test(): void { console.log('Testeando...'); }
}

// Un diseñador también tiene que implementar TODO
class Designer implements IWorker {
  work(): void { console.log('Diseñando...'); }
  eat(): void { console.log('Comiendo...'); }
  sleep(): void { console.log('Durmiendo...'); }
  code(): void { throw new Error('No soy programador'); } // ¡Forzado a implementar!
  design(): void { console.log('Diseñando UI...'); }
  test(): void { throw new Error('No hago testing'); } // ¡Forzado a implementar!
}
```

#### ✅ **Ejemplo CORRECTO - Cumplimiento del ISP**

```typescript
// Interfaces segregadas y específicas
interface IWorkable {
  work(): void;
}

interface IEatable {
  eat(): void;
}

interface ISleepable {
  sleep(): void;
}

interface ICodable {
  code(): void;
}

interface IDesignable {
  design(): void;
}

interface ITestable {
  test(): void;
}

// Cada clase implementa solo lo que necesita
class Developer implements IWorkable, IEatable, ISleepable, ICodable, ITestable {
  work(): void { console.log('Desarrollando...'); }
  eat(): void { console.log('Comiendo...'); }
  sleep(): void { console.log('Durmiendo...'); }
  code(): void { console.log('Programando...'); }
  test(): void { console.log('Testeando...'); }
  // No necesita implementar IDesignable
}

class Designer implements IWorkable, IEatable, ISleepable, IDesignable {
  work(): void { console.log('Diseñando...'); }
  eat(): void { console.log('Comiendo...'); }
  sleep(): void { console.log('Durmiendo...'); }
  design(): void { console.log('Diseñando UI...'); }
  // No necesita implementar ICodable ni ITestable
}

class FullStackDeveloper implements IWorkable, IEatable, ISleepable, ICodable, IDesignable, ITestable {
  work(): void { console.log('Trabajando full-stack...'); }
  eat(): void { console.log('Comiendo...'); }
  sleep(): void { console.log('Durmiendo...'); }
  code(): void { console.log('Programando...'); }
  design(): void { console.log('Diseñando...'); }
  test(): void { console.log('Testeando...'); }
}
```

---

### 5. 🔄 Dependency Inversion Principle (DIP)

> "Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones"

#### ❌ **Ejemplo INCORRECTO - Violación del DIP**

```typescript
// Módulo de bajo nivel (implementación concreta)
class MySQLDatabase {
  save(data: any): void {
    console.log('Guardando en MySQL:', data);
  }
  
  find(id: string): any {
    console.log('Buscando en MySQL:', id);
    return { id, name: 'Usuario' };
  }
}

// Módulo de alto nivel que DEPENDE de implementación concreta
class UserService {
  private database: MySQLDatabase; // ¡Dependencia concreta!
  
  constructor() {
    this.database = new MySQLDatabase(); // ¡Acoplamiento fuerte!
  }
  
  createUser(userData: any): void {
    this.database.save(userData);
  }
  
  getUser(id: string): any {
    return this.database.find(id);
  }
}
```

**Problemas:**
- UserService está acoplado a MySQL
- Difícil cambiar a otra base de datos
- Imposible testear con mocks
- Viola DIP

#### ✅ **Ejemplo CORRECTO - Cumplimiento del DIP**

```typescript
// Abstracción (no depende de implementaciones)
interface IDatabase {
  save(data: any): void;
  find(id: string): any;
}

// Implementaciones concretas (dependen de la abstracción)
class MySQLDatabase implements IDatabase {
  save(data: any): void {
    console.log('💾 Guardando en MySQL:', data);
  }
  
  find(id: string): any {
    console.log('🔍 Buscando en MySQL:', id);
    return { id, name: 'Usuario MySQL' };
  }
}

class MongoDatabase implements IDatabase {
  save(data: any): void {
    console.log('🍃 Guardando en MongoDB:', data);
  }
  
  find(id: string): any {
    console.log('🔍 Buscando en MongoDB:', id);
    return { id, name: 'Usuario Mongo' };
  }
}

class InMemoryDatabase implements IDatabase {
  private data: Map<string, any> = new Map();
  
  save(data: any): void {
    console.log('🧠 Guardando en memoria:', data);
    this.data.set(data.id, data);
  }
  
  find(id: string): any {
    console.log('🔍 Buscando en memoria:', id);
    return this.data.get(id);
  }
}

// Módulo de alto nivel que depende de abstracción
class UserService {
  constructor(
    private database: IDatabase // ¡Depende de abstracción!
  ) {}
  
  createUser(userData: any): void {
    this.database.save(userData);
  }
  
  getUser(id: string): any {
    return this.database.find(id);
  }
}

// Configuración externa (Dependency Injection)
const mysqlService = new UserService(new MySQLDatabase());
const mongoService = new UserService(new MongoDatabase());
const memoryService = new UserService(new InMemoryDatabase());

// Para testing
const mockDatabase = {
  save: jest.fn(),
  find: jest.fn().mockReturnValue({ id: '1', name: 'Test User' })
};
const testService = new UserService(mockDatabase);
```

---

## 🔗 Cohesión y Acoplamiento

### 📈 Alta Cohesión

> "Los elementos dentro de un módulo están fuertemente relacionados"

#### ✅ **Ejemplo de Alta Cohesión**

```typescript
// Todos los métodos están relacionados con operaciones matemáticas
class MathOperations {
  add(a: number, b: number): number {
    return a + b;
  }
  
  subtract(a: number, b: number): number {
    return a - b;
  }
  
  multiply(a: number, b: number): number {
    return a * b;
  }
  
  divide(a: number, b: number): number {
    if (b === 0) throw new Error('División por cero');
    return a / b;
  }
}

// Todos los métodos están relacionados con validación de usuarios
class UserValidator {
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }
  
  validateAge(age: number): boolean {
    return age >= 18 && age <= 120;
  }
  
  validateName(name: string): boolean {
    return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  }
}
```

#### ❌ **Ejemplo de Baja Cohesión**

```typescript
// Métodos no relacionados entre sí (baja cohesión)
class Utilities {
  // Operación matemática
  calculateTax(amount: number): number {
    return amount * 0.21;
  }
  
  // Operación de string
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Operación de red
  sendEmail(to: string, subject: string): void {
    console.log(`Enviando email a ${to}: ${subject}`);
  }
  
  // Operación de archivo
  readFile(path: string): string {
    return 'contenido del archivo';
  }
  
  // Operación de base de datos
  saveUser(user: any): void {
    console.log('Guardando usuario:', user);
  }
}
```

### 📉 Bajo Acoplamiento

> "Los módulos tienen pocas dependencias entre sí"

#### ✅ **Ejemplo de Bajo Acoplamiento**

```typescript
// Interfaces para bajo acoplamiento
interface ILogger {
  log(message: string): void;
}

interface IEmailService {
  send(to: string, subject: string, body: string): void;
}

interface IUserRepository {
  save(user: User): void;
  findById(id: string): User | null;
}

// Clase con bajo acoplamiento (depende de abstracciones)
class UserRegistrationService {
  constructor(
    private logger: ILogger,
    private emailService: IEmailService,
    private userRepository: IUserRepository
  ) {}
  
  registerUser(userData: any): User {
    // Crear usuario
    const user = new User(userData.name, userData.email);
    
    // Guardar (bajo acoplamiento - no sabe cómo se guarda)
    this.userRepository.save(user);
    
    // Log (bajo acoplamiento - no sabe cómo se loggea)
    this.logger.log(`Usuario registrado: ${user.email}`);
    
    // Email (bajo acoplamiento - no sabe cómo se envía)
    this.emailService.send(
      user.email,
      'Bienvenido',
      'Gracias por registrarte'
    );
    
    return user;
  }
}
```

#### ❌ **Ejemplo de Alto Acoplamiento**

```typescript
// Clase con alto acoplamiento (depende de implementaciones concretas)
class UserRegistrationService {
  private logger: ConsoleLogger;        // Acoplamiento fuerte
  private emailService: SMTPEmailService; // Acoplamiento fuerte
  private userRepository: MySQLUserRepository; // Acoplamiento fuerte
  
  constructor() {
    // Crea dependencias internamente (alto acoplamiento)
    this.logger = new ConsoleLogger();
    this.emailService = new SMTPEmailService('smtp.gmail.com', 587);
    this.userRepository = new MySQLUserRepository('localhost', 'users_db');
  }
  
  registerUser(userData: any): User {
    const user = new User(userData.name, userData.email);
    
    // Alto acoplamiento - conoce detalles de implementación
    this.userRepository.connectToDatabase();
    this.userRepository.save(user);
    this.userRepository.closeConnection();
    
    this.logger.writeToConsole(`Usuario registrado: ${user.email}`);
    
    this.emailService.connectToSMTP();
    this.emailService.send(user.email, 'Bienvenido', 'Gracias por registrarte');
    this.emailService.disconnectFromSMTP();
    
    return user;
  }
}
```

---

## 💉 Inyección de Dependencias - Patrones

### 1. Constructor Injection (Recomendado)

```typescript
class UserService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private emailService: IEmailService
  ) {}
  
  // Métodos que usan las dependencias inyectadas
}
```

### 2. Setter Injection

```typescript
class UserService {
  private userRepository: IUserRepository;
  private passwordHasher: IPasswordHasher;
  
  setUserRepository(repository: IUserRepository): void {
    this.userRepository = repository;
  }
  
  setPasswordHasher(hasher: IPasswordHasher): void {
    this.passwordHasher = hasher;
  }
}
```

### 3. Interface Injection

```typescript
interface IUserRepositoryInjectable {
  injectUserRepository(repository: IUserRepository): void;
}

class UserService implements IUserRepositoryInjectable {
  private userRepository: IUserRepository;
  
  injectUserRepository(repository: IUserRepository): void {
    this.userRepository = repository;
  }
}
```

### 4. Service Locator Pattern

```typescript
class ServiceLocator {
  private static services: Map<string, any> = new Map();
  
  static register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }
  
  static get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Servicio '${name}' no encontrado`);
    }
    return service as T;
  }
}

class UserService {
  private get userRepository(): IUserRepository {
    return ServiceLocator.get<IUserRepository>('UserRepository');
  }
  
  private get passwordHasher(): IPasswordHasher {
    return ServiceLocator.get<IPasswordHasher>('PasswordHasher');
  }
}
```

---

## 🎯 Resumen de Beneficios

### ✅ **Con Principios SOLID**
- ✨ Código mantenible y escalable
- 🧪 Fácil de testear
- 🔄 Fácil de modificar y extender
- 🔧 Componentes reutilizables
- 🐛 Menos bugs
- 👥 Mejor colaboración en equipo

### ❌ **Sin Principios SOLID**
- 💥 Código frágil y difícil de mantener
- 🚫 Difícil de testear
- 🔒 Resistente al cambio
- 🔗 Alto acoplamiento
- 🐛 Más propenso a bugs
- 😰 Miedo a modificar código

---

**¡Aplicar estos principios desde el inicio del proyecto te ahorrará mucho tiempo y dolores de cabeza en el futuro!** 🚀