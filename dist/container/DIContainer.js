"use strict";
// Patrón Dependency Injection Container
// Demuestra inversión de control y gestión centralizada de dependencias
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
const InMemoryUserRepository_1 = require("../repositories/InMemoryUserRepository");
const PasswordHasher_1 = require("../services/PasswordHasher");
const TokenService_1 = require("../services/TokenService");
const UserService_1 = require("../services/UserService");
/**
 * Contenedor de Inyección de Dependencias
 * Demuestra:
 * - Inversión de Control (IoC)
 * - Patrón Singleton para servicios
 * - Configuración centralizada de dependencias
 * - Facilita testing y intercambio de implementaciones
 */
class DIContainer {
    constructor() {
        this.services = new Map();
        this.registerServices();
    }
    /**
     * Patrón Singleton para el contenedor
     */
    static getInstance() {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }
    /**
     * Registra todos los servicios y sus dependencias
     * Demuestra configuración centralizada
     */
    registerServices() {
        // Servicios base (sin dependencias)
        this.services.set('IPasswordHasher', new PasswordHasher_1.BcryptPasswordHasher(12));
        this.services.set('ITokenService', new TokenService_1.JwtTokenService(process.env.JWT_SECRET || 'demo-secret-key', '24h'));
        this.services.set('IUserRepository', new InMemoryUserRepository_1.InMemoryUserRepository());
        // Servicios con dependencias
        this.services.set('UserService', new UserService_1.UserService(this.get('IUserRepository'), this.get('IPasswordHasher'), this.get('ITokenService')));
    }
    /**
     * Obtiene un servicio del contenedor
     */
    get(serviceName) {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Servicio '${serviceName}' no encontrado en el contenedor`);
        }
        return service;
    }
    /**
     * Registra un servicio personalizado
     * Útil para testing o configuraciones específicas
     */
    register(serviceName, implementation) {
        this.services.set(serviceName, implementation);
    }
    /**
     * Reemplaza un servicio existente
     * Útil para testing con mocks
     */
    replace(serviceName, implementation) {
        if (!this.services.has(serviceName)) {
            throw new Error(`Servicio '${serviceName}' no existe para reemplazar`);
        }
        this.services.set(serviceName, implementation);
    }
    /**
     * Verifica si un servicio está registrado
     */
    has(serviceName) {
        return this.services.has(serviceName);
    }
    /**
     * Obtiene la lista de servicios registrados
     */
    getRegisteredServices() {
        return Array.from(this.services.keys());
    }
    /**
     * Limpia el contenedor (útil para testing)
     */
    clear() {
        this.services.clear();
    }
    /**
     * Reinicia el contenedor con la configuración por defecto
     */
    reset() {
        this.clear();
        this.registerServices();
    }
    /**
     * Crea una nueva instancia del contenedor (para testing)
     */
    static createTestInstance() {
        const container = new DIContainer();
        return container;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=DIContainer.js.map