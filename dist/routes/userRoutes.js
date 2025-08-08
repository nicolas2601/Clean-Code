"use strict";
// Rutas de usuarios
// Demuestra organización de endpoints y uso de middleware
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
/**
 * Configuración de rutas para usuarios
 * Demuestra:
 * - Organización de endpoints
 * - Uso de middleware de autenticación
 * - Separación de responsabilidades
 */
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new UserController_1.UserController();
        this.authMiddleware = new AuthMiddleware_1.AuthMiddleware();
        this.setupRoutes();
    }
    /**
     * Configura todas las rutas de usuarios
     */
    setupRoutes() {
        // Rutas públicas (sin autenticación)
        this.router.post('/register', this.userController.register);
        this.router.post('/login', this.userController.login);
        // Rutas que requieren autenticación
        this.router.get('/profile', this.authMiddleware.authenticate, this.userController.getProfile);
        this.router.put('/profile', this.authMiddleware.authenticate, this.userController.updateProfile);
        this.router.put('/change-password', this.authMiddleware.authenticate, this.userController.changePassword);
        this.router.delete('/profile', this.authMiddleware.authenticate, this.userController.deleteProfile);
        // Rutas administrativas (requieren autenticación)
        this.router.get('/', this.authMiddleware.authenticate, this.userController.getAllUsers);
        this.router.get('/:id', this.authMiddleware.authenticate, this.userController.getUserById);
    }
    /**
     * Obtiene el router configurado
     */
    getRouter() {
        return this.router;
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=userRoutes.js.map