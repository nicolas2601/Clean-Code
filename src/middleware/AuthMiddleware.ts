// Middleware de autenticación
// Demuestra SRP y separación de responsabilidades

import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '../container/DIContainer';
import { UserService } from '../services/UserService';
import { JwtTokenService } from '../services/TokenService';

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
export class AuthMiddleware {
  private userService: UserService;
  private tokenService: JwtTokenService;

  constructor() {
    const container = DIContainer.getInstance();
    this.userService = container.get<UserService>('UserService');
    this.tokenService = container.get<JwtTokenService>('ITokenService');
  }

  /**
   * Middleware para verificar autenticación
   */
  public authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = this.tokenService.extractTokenFromHeader(authHeader);

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token de acceso requerido'
        });
        return;
      }

      const decoded = this.userService.verifyToken(token);
      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
        return;
      }

      // Verificar que el usuario aún existe
      const user = await this.userService.getUserById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      // Agregar información del usuario al request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  /**
   * Middleware opcional de autenticación
   * No falla si no hay token, pero agrega info del usuario si está presente
   */
  public optionalAuthenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = this.tokenService.extractTokenFromHeader(authHeader);

      if (token) {
        const decoded = this.userService.verifyToken(token);
        if (decoded) {
          const user = await this.userService.getUserById(decoded.userId);
          if (user) {
            req.user = {
              userId: decoded.userId,
              email: decoded.email
            };
          }
        }
      }

      next();
    } catch (error) {
      // En modo opcional, continuamos sin autenticación
      next();
    }
  };
}