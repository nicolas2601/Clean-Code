// Rutas de usuarios
// Demuestra organización de endpoints y uso de middleware

import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * Configuración de rutas para usuarios
 * Demuestra:
 * - Organización de endpoints
 * - Uso de middleware de autenticación
 * - Separación de responsabilidades
 */
export class UserRoutes {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  /**
   * Configura todas las rutas de usuarios
   */
  private setupRoutes(): void {
    // Rutas públicas (sin autenticación)
    this.router.post('/register', this.userController.register);
    this.router.post('/login', this.userController.login);
    
    // Rutas que requieren autenticación
    this.router.get('/profile', 
      this.authMiddleware.authenticate, 
      this.userController.getProfile
    );
    
    this.router.put('/profile', 
      this.authMiddleware.authenticate, 
      this.userController.updateProfile
    );
    
    this.router.put('/change-password', 
      this.authMiddleware.authenticate, 
      this.userController.changePassword
    );
    
    this.router.delete('/profile', 
      this.authMiddleware.authenticate, 
      this.userController.deleteProfile
    );
    
    // Rutas administrativas (requieren autenticación)
    this.router.get('/', 
      this.authMiddleware.authenticate, 
      this.userController.getAllUsers
    );
    
    this.router.get('/:id', 
      this.authMiddleware.authenticate, 
      this.userController.getUserById
    );
  }

  /**
   * Obtiene el router configurado
   */
  public getRouter(): Router {
    return this.router;
  }
}