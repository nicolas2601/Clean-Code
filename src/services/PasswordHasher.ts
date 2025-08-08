// Principio SRP: Solo se encarga del hash de contraseñas
// Alta cohesión: todos los métodos están relacionados con el hash

import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../interfaces/IRepository';

/**
 * Servicio para hash de contraseñas
 * Demuestra:
 * - SRP: Solo maneja operaciones de hash
 * - Alta cohesión: métodos relacionados
 * - Implementación de interface (DIP)
 */
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds;
  }

  /**
   * Genera un hash de la contraseña
   */
  async hash(password: string): Promise<string> {
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña con su hash
   */
  async compare(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }
    
    return await bcrypt.compare(password, hash);
  }
}