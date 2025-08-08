import { IPasswordHasher } from '../interfaces/IRepository';
/**
 * Servicio para hash de contraseñas
 * Demuestra:
 * - SRP: Solo maneja operaciones de hash
 * - Alta cohesión: métodos relacionados
 * - Implementación de interface (DIP)
 */
export declare class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds;
    constructor(saltRounds?: number);
    /**
     * Genera un hash de la contraseña
     */
    hash(password: string): Promise<string>;
    /**
     * Compara una contraseña con su hash
     */
    compare(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=PasswordHasher.d.ts.map