import { Application } from 'express';
/**
 * Clase principal de la aplicación
 * Demuestra:
 * - Configuración centralizada
 * - Uso del contenedor DI
 * - Manejo de middleware
 * - Organización de rutas
 */
export declare class App {
    private app;
    private userRoutes;
    private container;
    constructor();
    /**
     * Configura middleware global
     */
    private setupMiddleware;
    /**
     * Configura las rutas de la aplicación
     */
    private setupRoutes;
    /**
     * Configura manejo global de errores
     */
    private setupErrorHandling;
    /**
     * Inicializa datos de ejemplo
     */
    private initializeData;
    /**
     * Middleware de logging
     */
    private loggingMiddleware;
    /**
     * Health check endpoint
     */
    private healthCheck;
    /**
     * Información de la API
     */
    private apiInfo;
    /**
     * Endpoint de estadísticas
     */
    private getStats;
    /**
     * Manejo de rutas no encontradas
     */
    private notFoundHandler;
    /**
     * Manejo global de errores
     */
    private errorHandler;
    /**
     * Obtiene la instancia de Express
     */
    getApp(): Application;
    /**
     * Inicia el servidor
     */
    listen(port?: number): void;
}
//# sourceMappingURL=app.d.ts.map