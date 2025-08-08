/**
 * Contenedor de Inyección de Dependencias
 * Demuestra:
 * - Inversión de Control (IoC)
 * - Patrón Singleton para servicios
 * - Configuración centralizada de dependencias
 * - Facilita testing y intercambio de implementaciones
 */
export declare class DIContainer {
    private static instance;
    private services;
    private constructor();
    /**
     * Patrón Singleton para el contenedor
     */
    static getInstance(): DIContainer;
    /**
     * Registra todos los servicios y sus dependencias
     * Demuestra configuración centralizada
     */
    private registerServices;
    /**
     * Obtiene un servicio del contenedor
     */
    get<T>(serviceName: string): T;
    /**
     * Registra un servicio personalizado
     * Útil para testing o configuraciones específicas
     */
    register<T>(serviceName: string, implementation: T): void;
    /**
     * Reemplaza un servicio existente
     * Útil para testing con mocks
     */
    replace<T>(serviceName: string, implementation: T): void;
    /**
     * Verifica si un servicio está registrado
     */
    has(serviceName: string): boolean;
    /**
     * Obtiene la lista de servicios registrados
     */
    getRegisteredServices(): string[];
    /**
     * Limpia el contenedor (útil para testing)
     */
    clear(): void;
    /**
     * Reinicia el contenedor con la configuración por defecto
     */
    reset(): void;
    /**
     * Crea una nueva instancia del contenedor (para testing)
     */
    static createTestInstance(): DIContainer;
}
//# sourceMappingURL=DIContainer.d.ts.map