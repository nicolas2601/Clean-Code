import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware';
/**
 * Controlador de usuarios
 * Demuestra:
 * - SRP: Solo maneja requests HTTP relacionados con usuarios
 * - Uso del contenedor DI
 * - Manejo consistente de errores
 * - Separación entre lógica de negocio y presentación
 */
export declare class UserController {
    private userService;
    constructor();
    /**
     * Registra un nuevo usuario
     * POST /api/users/register
     */
    register: (req: Request, res: Response) => Promise<void>;
    /**
     * Autentica un usuario
     * POST /api/users/login
     */
    login: (req: Request, res: Response) => Promise<void>;
    /**
     * Obtiene el perfil del usuario autenticado
     * GET /api/users/profile
     */
    getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    /**
     * Obtiene todos los usuarios
     * GET /api/users
     */
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    /**
     * Obtiene un usuario por ID
     * GET /api/users/:id
     */
    getUserById: (req: Request, res: Response) => Promise<void>;
    /**
     * Actualiza el perfil del usuario autenticado
     * PUT /api/users/profile
     */
    updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    /**
     * Cambia la contraseña del usuario autenticado
     * PUT /api/users/change-password
     */
    changePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    /**
     * Elimina el usuario autenticado
     * DELETE /api/users/profile
     */
    deleteProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    /**
     * Maneja errores de manera consistente
     * Demuestra DRY y manejo centralizado de errores
     */
    private handleError;
}
//# sourceMappingURL=UserController.d.ts.map