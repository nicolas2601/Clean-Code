"use strict";
// Middleware de autenticación
// Demuestra SRP y separación de responsabilidades
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const DIContainer_1 = require("../container/DIContainer");
/**
 * Middleware de autenticación
 * Demuestra:
 * - SRP: Solo se encarga de autenticación
 * - Uso del contenedor DI
 * - Separación de responsabilidades
 */
class AuthMiddleware {
    constructor() {
        /**
         * Middleware para verificar autenticación
         */
        this.authenticate = async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                const token = this.tokenService.extractTokenFromHeader(authHeader);
                if (!token) {
                    res.status(401).json({
                        success: false,
                        message: 'Token de acceso requerido'
                    });
                    return;
                }
                const decoded = this.userService.verifyToken(token);
                if (!decoded) {
                    res.status(401).json({
                        success: false,
                        message: 'Token inválido o expirado'
                    });
                    return;
                }
                // Verificar que el usuario aún existe
                const user = await this.userService.getUserById(decoded.userId);
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                    return;
                }
                // Agregar información del usuario al request
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email
                };
                next();
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error interno del servidor',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        };
        /**
         * Middleware opcional de autenticación
         * No falla si no hay token, pero agrega info del usuario si está presente
         */
        this.optionalAuthenticate = async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                const token = this.tokenService.extractTokenFromHeader(authHeader);
                if (token) {
                    const decoded = this.userService.verifyToken(token);
                    if (decoded) {
                        const user = await this.userService.getUserById(decoded.userId);
                        if (user) {
                            req.user = {
                                userId: decoded.userId,
                                email: decoded.email
                            };
                        }
                    }
                }
                next();
            }
            catch (error) {
                // En modo opcional, continuamos sin autenticación
                next();
            }
        };
        const container = DIContainer_1.DIContainer.getInstance();
        this.userService = container.get('UserService');
        this.tokenService = container.get('ITokenService');
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map