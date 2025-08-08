// Principio SRP: Solo se encarga de la gestión de tokens JWT

import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';
import { ITokenService } from '../interfaces/IRepository';

/**
 * Servicio para manejo de tokens JWT
 * Demuestra:
 * - SRP: Solo maneja operaciones de tokens
 * - Alta cohesión: métodos relacionados con JWT
 * - Configuración centralizada
 */
export class JwtTokenService implements ITokenService {
  private readonly secretKey: Secret;
  private readonly expiresIn: string | number;

  constructor(secretKey: string = 'your-secret-key', expiresIn: string = '24h') {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  /**
   * Genera un token JWT
   */
  generateToken(payload: object): string {
    if (!payload || typeof payload !== 'object') {
      throw new Error('El payload debe ser un objeto válido');
    }

    return sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
      issuer: 'solid-demo-app'
    } as any);
  }

  /**
   * Verifica y decodifica un token JWT
   */
  verifyToken(token: string): object | null {
    try {
      if (!token) {
        return null;
      }

      const decoded = verify(token, this.secretKey);
      return typeof decoded === 'object' ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrae el token del header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remueve 'Bearer '
  }
}