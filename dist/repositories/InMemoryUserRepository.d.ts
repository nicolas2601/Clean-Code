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
export declare class InMemoryUserRepository implements IUserRepository {
    private users;
    /**
     * Busca un usuario por ID
     */
    findById(id: string): Promise<IUser | null>;
    /**
     * Obtiene todos los usuarios
     */
    findAll(): Promise<IUser[]>;
    /**
     * Busca un usuario por email
     */
    findByEmail(email: string): Promise<IUser | null>;
    /**
     * Verifica si existe un usuario con el email dado
     */
    existsByEmail(email: string): Promise<boolean>;
    /**
     * Crea un nuevo usuario
     */
    create(data: ICreateUser & {
        passwordHash: string;
    }): Promise<IUser>;
    /**
     * Actualiza un usuario existente
     */
    update(id: string, data: IUpdateUser): Promise<IUser | null>;
    /**
     * Elimina un usuario
     */
    delete(id: string): Promise<boolean>;
    /**
     * Obtiene el usuario completo (incluyendo hash de contraseña)
     * Método interno para autenticación
     */
    findByEmailWithPassword(email: string): Promise<User | null>;
    /**
     * Actualiza el hash de contraseña de un usuario
     */
    updatePassword(id: string, passwordHash: string): Promise<boolean>;
    /**
     * Obtiene estadísticas del repositorio
     * Demuestra extensibilidad sin modificar la interface base
     */
    getStats(): {
        totalUsers: number;
        createdToday: number;
    };
}
//# sourceMappingURL=InMemoryUserRepository.d.ts.map