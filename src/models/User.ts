// Principio SRP: Responsabilidad Única
// Alta cohesión: todos los métodos están relacionados con la entidad Usuario

import { IUser } from '../interfaces/IUser';
import { v4 as uuidv4 } from 'uuid';

/**
 * Clase User que demuestra:
 * - SRP: Solo se encarga de representar un usuario
 * - Alta cohesión: todos los métodos están relacionados
 * - Bajo acoplamiento: no depende de implementaciones concretas
 */
export class User implements IUser {
  public readonly id: string;
  public email: string;
  public name: string;
  public readonly createdAt: Date;
  private _passwordHash: string;

  constructor(
    email: string,
    name: string,
    passwordHash: string,
    id?: string,
    createdAt?: Date
  ) {
    this.id = id || uuidv4();
    this.email = this.validateEmail(email);
    this.name = this.validateName(name);
    this._passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
  }

  /**
   * Valida el formato del email
   * Demuestra encapsulación y validación de datos
   */
  private validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Formato de email inválido');
    }
    return email.toLowerCase();
  }

  /**
   * Valida el nombre del usuario
   */
  private validateName(name: string): string {
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    return name.trim();
  }

  /**
   * Getter para el hash de la contraseña
   * Demuestra encapsulación
   */
  public get passwordHash(): string {
    return this._passwordHash;
  }

  /**
   * Actualiza el email del usuario
   */
  public updateEmail(newEmail: string): void {
    this.email = this.validateEmail(newEmail);
  }

  /**
   * Actualiza el nombre del usuario
   */
  public updateName(newName: string): void {
    this.name = this.validateName(newName);
  }

  /**
   * Actualiza el hash de la contraseña
   */
  public updatePasswordHash(newPasswordHash: string): void {
    if (!newPasswordHash) {
      throw new Error('El hash de contraseña no puede estar vacío');
    }
    this._passwordHash = newPasswordHash;
  }

  /**
   * Convierte el usuario a un objeto plano (sin el hash de contraseña)
   * Demuestra el principio de ocultación de información
   */
  public toPublicObject(): Omit<IUser, 'passwordHash'> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt
    };
  }

  /**
   * Convierte el usuario a un objeto completo (para persistencia)
   */
  public toFullObject(): IUser & { passwordHash: string } {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      passwordHash: this._passwordHash
    };
  }
}