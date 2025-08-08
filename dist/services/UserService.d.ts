import { IUserRepository, IPasswordHasher, ITokenService } from '../interfaces/IRepository';
import { IUser, ICreateUser, IUpdateUser, IUserAuth } from '../interfaces/IUser';
/**
 * Servicio de usuarios que demuestra:
 * - DIP: Depende de interfaces, no de implementaciones
 * - SRP: Solo maneja lógica de negocio de usuarios
 * - Inyección de Dependencias: Recibe servicios por constructor
 * - Bajo acoplamiento: No conoce implementaciones específicas
 */
export declare class UserService {
    private readonly userRepository;
    private readonly passwordHasher;
    private readonly tokenService;
    constructor(userRepository: IUserRepository, passwordHasher: IPasswordHasher, tokenService: ITokenService);
    /**
     * Registra un nuevo usuario
     * Demuestra orquestación de servicios
     */
    registerUser(userData: ICreateUser): Promise<{
        user: IUser;
        token: string;
    }>;
    /**
     * Autentica un usuario
     * Demuestra uso de múltiples servicios
     */
    authenticateUser(credentials: IUserAuth): Promise<{
        user: IUser;
        token: string;
    }>;
    /**
     * Obtiene un usuario por ID
     */
    getUserById(id: string): Promise<IUser | null>;
    /**
     * Obtiene todos los usuarios
     */
    getAllUsers(): Promise<IUser[]>;
    /**
     * Actualiza un usuario
     */
    updateUser(id: string, updateData: IUpdateUser): Promise<IUser | null>;
    /**
     * Elimina un usuario
     */
    deleteUser(id: string): Promise<boolean>;
    /**
     * Cambia la contraseña de un usuario
     */
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    /**
     * Verifica un token JWT
     */
    verifyToken(token: string): {
        userId: string;
        email: string;
    } | null;
    /**
     * Valida los datos de usuario
     * Método privado que demuestra encapsulación
     */
    private validateUserData;
    private validateEmail;
    private validateName;
    private validatePassword;
}
//# sourceMappingURL=UserService.d.ts.map