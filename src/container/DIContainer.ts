// Patrón Dependency Injection Container
// Demuestra inversión de control y gestión centralizada de dependencias

import { IUserRepository, IPasswordHasher, ITokenService } from '../interfaces/IRepository';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { BcryptPasswordHasher } from '../services/PasswordHasher';
import { JwtTokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';

/**
 * Contenedor de Inyección de Dependencias
 * Demuestra:
 * - Inversión de Control (IoC)
 * - Patrón Singleton para servicios
 * - Configuración centralizada de dependencias
 * - Facilita testing y intercambio de implementaciones
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  /**
   * Patrón Singleton para el contenedor
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Registra todos los servicios y sus dependencias
   * Demuestra configuración centralizada
   */
  private registerServices(): void {
    // Servicios base (sin dependencias)
    this.services.set('IPasswordHasher', new BcryptPasswordHasher(12));
    this.services.set('ITokenService', new JwtTokenService(
      process.env.JWT_SECRET || 'demo-secret-key',
      '24h'
    ));
    this.services.set('IUserRepository', new InMemoryUserRepository());

    // Servicios con dependencias
    this.services.set('UserService', new UserService(
      this.get<IUserRepository>('IUserRepository'),
      this.get<IPasswordHasher>('IPasswordHasher'),
      this.get<ITokenService>('ITokenService')
    ));
  }

  /**
   * Obtiene un servicio del contenedor
   */
  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Servicio '${serviceName}' no encontrado en el contenedor`);
    }
    return service as T;
  }

  /**
   * Registra un servicio personalizado
   * Útil para testing o configuraciones específicas
   */
  public register<T>(serviceName: string, implementation: T): void {
    this.services.set(serviceName, implementation);
  }

  /**
   * Reemplaza un servicio existente
   * Útil para testing con mocks
   */
  public replace<T>(serviceName: string, implementation: T): void {
    if (!this.services.has(serviceName)) {
      throw new Error(`Servicio '${serviceName}' no existe para reemplazar`);
    }
    this.services.set(serviceName, implementation);
  }

  /**
   * Verifica si un servicio está registrado
   */
  public has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Obtiene la lista de servicios registrados
   */
  public getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Limpia el contenedor (útil para testing)
   */
  public clear(): void {
    this.services.clear();
  }

  /**
   * Reinicia el contenedor con la configuración por defecto
   */
  public reset(): void {
    this.clear();
    this.registerServices();
  }

  /**
   * Crea una nueva instancia del contenedor (para testing)
   */
  public static createTestInstance(): DIContainer {
    const container = new DIContainer();
    return container;
  }
}