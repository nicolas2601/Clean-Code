"use strict";
// Controlador de usuarios
// Demuestra patrón MVC y manejo de HTTP
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const DIContainer_1 = require("../container/DIContainer");
/**
 * Controlador de usuarios
 * Demuestra:
 * - SRP: Solo maneja requests HTTP relacionados con usuarios
 * - Uso del contenedor DI
 * - Manejo consistente de errores
 * - Separación entre lógica de negocio y presentación
 */
class UserController {
    constructor() {
        /**
         * Registra un nuevo usuario
         * POST /api/users/register
         */
        this.register = async (req, res) => {
            try {
                const userData = req.body;
                const result = await this.userService.registerUser(userData);
                res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    data: {
                        user: result.user,
                        token: result.token
                    }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al registrar usuario');
            }
        };
        /**
         * Autentica un usuario
         * POST /api/users/login
         */
        this.login = async (req, res) => {
            try {
                const credentials = req.body;
                const result = await this.userService.authenticateUser(credentials);
                res.status(200).json({
                    success: true,
                    message: 'Autenticación exitosa',
                    data: {
                        user: result.user,
                        token: result.token
                    }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al autenticar usuario', 401);
            }
        };
        /**
         * Obtiene el perfil del usuario autenticado
         * GET /api/users/profile
         */
        this.getProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                    return;
                }
                const user = await this.userService.getUserById(req.user.userId);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Perfil obtenido exitosamente',
                    data: { user }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al obtener perfil');
            }
        };
        /**
         * Obtiene todos los usuarios
         * GET /api/users
         */
        this.getAllUsers = async (req, res) => {
            try {
                const users = await this.userService.getAllUsers();
                res.status(200).json({
                    success: true,
                    message: 'Usuarios obtenidos exitosamente',
                    data: {
                        users,
                        count: users.length
                    }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al obtener usuarios');
            }
        };
        /**
         * Obtiene un usuario por ID
         * GET /api/users/:id
         */
        this.getUserById = async (req, res) => {
            try {
                const { id } = req.params;
                const user = await this.userService.getUserById(id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Usuario obtenido exitosamente',
                    data: { user }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al obtener usuario');
            }
        };
        /**
         * Actualiza el perfil del usuario autenticado
         * PUT /api/users/profile
         */
        this.updateProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                    return;
                }
                const updateData = req.body;
                const updatedUser = await this.userService.updateUser(req.user.userId, updateData);
                if (!updatedUser) {
                    res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Perfil actualizado exitosamente',
                    data: { user: updatedUser }
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al actualizar perfil');
            }
        };
        /**
         * Cambia la contraseña del usuario autenticado
         * PUT /api/users/change-password
         */
        this.changePassword = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                    return;
                }
                const { currentPassword, newPassword } = req.body;
                if (!currentPassword || !newPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'Contraseña actual y nueva contraseña son requeridas'
                    });
                    return;
                }
                const success = await this.userService.changePassword(req.user.userId, currentPassword, newPassword);
                if (!success) {
                    res.status(400).json({
                        success: false,
                        message: 'Error al cambiar contraseña'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Contraseña cambiada exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al cambiar contraseña');
            }
        };
        /**
         * Elimina el usuario autenticado
         * DELETE /api/users/profile
         */
        this.deleteProfile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no autenticado'
                    });
                    return;
                }
                const success = await this.userService.deleteUser(req.user.userId);
                if (!success) {
                    res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Usuario eliminado exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'Error al eliminar usuario');
            }
        };
        const container = DIContainer_1.DIContainer.getInstance();
        this.userService = container.get('UserService');
    }
    /**
     * Maneja errores de manera consistente
     * Demuestra DRY y manejo centralizado de errores
     */
    handleError(res, error, defaultMessage, statusCode = 400) {
        const message = error instanceof Error ? error.message : defaultMessage;
        res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map