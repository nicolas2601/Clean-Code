import { Router } from 'express';
/**
 * Configuración de rutas para usuarios
 * Demuestra:
 * - Organización de endpoints
 * - Uso de middleware de autenticación
 * - Separación de responsabilidades
 */
export declare class UserRoutes {
    private router;
    private userController;
    private authMiddleware;
    constructor();
    /**
     * Configura todas las rutas de usuarios
     */
    private setupRoutes;
    /**
     * Obtiene el router configurado
     */
    getRouter(): Router;
}
//# sourceMappingURL=userRoutes.d.ts.map