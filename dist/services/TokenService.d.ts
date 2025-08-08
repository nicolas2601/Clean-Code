import { ITokenService } from '../interfaces/IRepository';
/**
 * Servicio para manejo de tokens JWT
 * Demuestra:
 * - SRP: Solo maneja operaciones de tokens
 * - Alta cohesión: métodos relacionados con JWT
 * - Configuración centralizada
 */
export declare class JwtTokenService implements ITokenService {
    private readonly secretKey;
    private readonly expiresIn;
    constructor(secretKey?: string, expiresIn?: string);
    /**
     * Genera un token JWT
     */
    generateToken(payload: object): string;
    /**
     * Verifica y decodifica un token JWT
     */
    verifyToken(token: string): object | null;
    /**
     * Extrae el token del header Authorization
     */
    extractTokenFromHeader(authHeader: string | undefined): string | null;
}
//# sourceMappingURL=TokenService.d.ts.map