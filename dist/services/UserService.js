"use strict";
// Principio DIP: Depende de abstracciones, no de implementaciones concretas
// Principio SRP: Solo se encarga de la lógica de negocio de usuarios
// Inyección de Dependencias: Recibe dependencias por constructor
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/**
 * Servicio de usuarios que demuestra:
 * - DIP: Depende de interfaces, no de implementaciones
 * - SRP: Solo maneja lógica de negocio de usuarios
 * - Inyección de Dependencias: Recibe servicios por constructor
 * - Bajo acoplamiento: No conoce implementaciones específicas
 */
class UserService {
    constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }
    /**
     * Registra un nuevo usuario
     * Demuestra orquestación de servicios
     */
    async registerUser(userData) {
        // Validar datos de entrada
        this.validateUserData(userData);
        // Verificar si el email ya existe
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Ya existe un usuario con este email');
        }
        // Hash de la contraseña
        const passwordHash = await this.passwordHasher.hash(userData.password);
        // Crear usuario
        const user = await this.userRepository.create({
            ...userData,
            passwordHash
        });
        // Generar token
        const token = this.tokenService.generateToken({
            userId: user.id,
            email: user.email
        });
        return { user, token };
    }
    /**
     * Autentica un usuario
     * Demuestra uso de múltiples servicios
     */
    async authenticateUser(credentials) {
        // Validar credenciales
        if (!credentials.email || !credentials.password) {
            throw new Error('Email y contraseña son requeridos');
        }
        // Buscar usuario (necesitamos acceso al hash de contraseña)
        const userRepo = this.userRepository;
        const user = await userRepo.findByEmailWithPassword(credentials.email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        // Verificar contraseña
        const isValidPassword = await this.passwordHasher.compare(credentials.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        // Generar token
        const token = this.tokenService.generateToken({
            userId: user.id,
            email: user.email
        });
        return {
            user: user.toPublicObject(),
            token
        };
    }
    /**
     * Obtiene un usuario por ID
     */
    async getUserById(id) {
        if (!id) {
            throw new Error('ID de usuario requerido');
        }
        return await this.userRepository.findById(id);
    }
    /**
     * Obtiene todos los usuarios
     */
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    /**
     * Actualiza un usuario
     */
    async updateUser(id, updateData) {
        if (!id) {
            throw new Error('ID de usuario requerido');
        }
        // Validar datos de actualización
        if (updateData.email) {
            this.validateEmail(updateData.email);
        }
        if (updateData.name) {
            this.validateName(updateData.name);
        }
        return await this.userRepository.update(id, updateData);
    }
    /**
     * Elimina un usuario
     */
    async deleteUser(id) {
        if (!id) {
            throw new Error('ID de usuario requerido');
        }
        return await this.userRepository.delete(id);
    }
    /**
     * Cambia la contraseña de un usuario
     */
    async changePassword(userId, currentPassword, newPassword) {
        // Obtener usuario con contraseña
        const userRepo = this.userRepository;
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const userWithPassword = await userRepo.findByEmailWithPassword(user.email);
        if (!userWithPassword) {
            throw new Error('Usuario no encontrado');
        }
        // Verificar contraseña actual
        const isCurrentPasswordValid = await this.passwordHasher.compare(currentPassword, userWithPassword.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new Error('Contraseña actual incorrecta');
        }
        // Hash de la nueva contraseña
        const newPasswordHash = await this.passwordHasher.hash(newPassword);
        // Actualizar contraseña
        return await userRepo.updatePassword(userId, newPasswordHash);
    }
    /**
     * Verifica un token JWT
     */
    verifyToken(token) {
        const decoded = this.tokenService.verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded) || !('email' in decoded)) {
            return null;
        }
        return {
            userId: decoded.userId,
            email: decoded.email
        };
    }
    /**
     * Valida los datos de usuario
     * Método privado que demuestra encapsulación
     */
    validateUserData(userData) {
        this.validateEmail(userData.email);
        this.validateName(userData.name);
        this.validatePassword(userData.password);
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Formato de email inválido');
        }
    }
    validateName(name) {
        if (!name || name.trim().length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
    }
    validatePassword(password) {
        if (!password || password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map