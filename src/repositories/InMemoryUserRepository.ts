// Principio DIP: Implementación concreta que depende de abstracciones
// Principio OCP: Abierto para extensión, cerrado para modificación

import { IUserRepository } from '../interfaces/IRepository';
import { IUser, ICreateUser, IUpdateUser } from '../interfaces/IUser';
import { User } from '../models/User';

/**
 * Repositorio en memoria para usuarios
 * Demuestra:
 * - DIP: Implementa la interface IUserRepository
 * - SRP: Solo se encarga de la persistencia de usuarios
 * - OCP: Puede ser extendido sin modificar código existente
 * - Alta cohesión: todos los métodos están relacionados con persistencia
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  /**
   * Busca un usuario por ID
   */
  async findById(id: string): Promise<IUser | null> {
    const user = this.users.get(id);
    return user ? user.toPublicObject() : null;
  }

  /**
   * Obtiene todos los usuarios
   */
  async findAll(): Promise<IUser[]> {
    return Array.from(this.users.values()).map(user => user.toPublicObject());
  }

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const user = Array.from(this.users.values())
      .find(u => u.email.toLowerCase() === email.toLowerCase());
    
    return user ? user.toPublicObject() : null;
  }

  /**
   * Verifica si existe un usuario con el email dado
   */
  async existsByEmail(email: string): Promise<boolean> {
    return Array.from(this.users.values())
      .some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Crea un nuevo usuario
   */
  async create(data: ICreateUser & { passwordHash: string }): Promise<IUser> {
    // Verificar si el email ya existe
    const emailExists = await this.existsByEmail(data.email);
    if (emailExists) {
      throw new Error('Ya existe un usuario con este email');
    }

    const user = new User(
      data.email,
      data.name,
      data.passwordHash
    );

    this.users.set(user.id, user);
    return user.toPublicObject();
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, data: IUpdateUser): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    // Verificar si el nuevo email ya existe (si se está actualizando)
    if (data.email && data.email !== user.email) {
      const emailExists = await this.existsByEmail(data.email);
      if (emailExists) {
        throw new Error('Ya existe un usuario con este email');
      }
      user.updateEmail(data.email);
    }

    if (data.name) {
      user.updateName(data.name);
    }

    return user.toPublicObject();
  }

  /**
   * Elimina un usuario
   */
  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  /**
   * Obtiene el usuario completo (incluyendo hash de contraseña)
   * Método interno para autenticación
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return Array.from(this.users.values())
      .find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Actualiza el hash de contraseña de un usuario
   */
  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    user.updatePasswordHash(passwordHash);
    return true;
  }

  /**
   * Obtiene estadísticas del repositorio
   * Demuestra extensibilidad sin modificar la interface base
   */
  getStats(): { totalUsers: number; createdToday: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const createdToday = Array.from(this.users.values())
      .filter(user => user.createdAt >= today).length;

    return {
      totalUsers: this.users.size,
      createdToday
    };
  }
}