import { IUser } from '../interfaces/IUser';
/**
 * Clase User que demuestra:
 * - SRP: Solo se encarga de representar un usuario
 * - Alta cohesión: todos los métodos están relacionados
 * - Bajo acoplamiento: no depende de implementaciones concretas
 */
export declare class User implements IUser {
    readonly id: string;
    email: string;
    name: string;
    readonly createdAt: Date;
    private _passwordHash;
    constructor(email: string, name: string, passwordHash: string, id?: string, createdAt?: Date);
    /**
     * Valida el formato del email
     * Demuestra encapsulación y validación de datos
     */
    private validateEmail;
    /**
     * Valida el nombre del usuario
     */
    private validateName;
    /**
     * Getter para el hash de la contraseña
     * Demuestra encapsulación
     */
    get passwordHash(): string;
    /**
     * Actualiza el email del usuario
     */
    updateEmail(newEmail: string): void;
    /**
     * Actualiza el nombre del usuario
     */
    updateName(newName: string): void;
    /**
     * Actualiza el hash de la contraseña
     */
    updatePasswordHash(newPasswordHash: string): void;
    /**
     * Convierte el usuario a un objeto plano (sin el hash de contraseña)
     * Demuestra el principio de ocultación de información
     */
    toPublicObject(): Omit<IUser, 'passwordHash'>;
    /**
     * Convierte el usuario a un objeto completo (para persistencia)
     */
    toFullObject(): IUser & {
        passwordHash: string;
    };
}
//# sourceMappingURL=User.d.ts.map