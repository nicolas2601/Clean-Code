import { Request, Response, NextFunction } from 'express';
/**
 * Interface para extender Request con información del usuario
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}
/**
 * Middleware de autenticación
 * Demuestra:
 * - SRP: Solo se encarga de autenticación
 * - Uso del contenedor DI
 * - Separación de responsabilidades
 */
export declare class AuthMiddleware {
    private userService;
    private tokenService;
    constructor();
    /**
     * Middleware para verificar autenticación
     */
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Middleware opcional de autenticación
     * No falla si no hay token, pero agrega info del usuario si está presente
     */
    optionalAuthenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthMiddleware.d.ts.map