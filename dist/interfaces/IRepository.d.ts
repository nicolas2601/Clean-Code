import { IUser, ICreateUser, IUpdateUser } from './IUser';
/**
 * Interface genérica para repositorio
 * Demuestra el principio de Inversión de Dependencias
 */
export interface IRepository<T, CreateT, UpdateT> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: CreateT): Promise<T>;
    update(id: string, data: UpdateT): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
/**
 * Interface específica para repositorio de usuarios
 * Extiende la interface genérica con métodos específicos
 */
export interface IUserRepository extends IRepository<IUser, ICreateUser, IUpdateUser> {
    findByEmail(email: string): Promise<IUser | null>;
    existsByEmail(email: string): Promise<boolean>;
}
/**
 * Interface para servicios de hash de contraseñas
 * Separada para cumplir SRP y facilitar testing
 */
export interface IPasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
/**
 * Interface para servicios de tokens JWT
 * Separada para cumplir SRP
 */
export interface ITokenService {
    generateToken(payload: object): string;
    verifyToken(token: string): object | null;
}
//# sourceMappingURL=IRepository.d.ts.map