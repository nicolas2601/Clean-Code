"use strict";
// Principio SRP: Solo se encarga de la gestión de tokens JWT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
/**
 * Servicio para manejo de tokens JWT
 * Demuestra:
 * - SRP: Solo maneja operaciones de tokens
 * - Alta cohesión: métodos relacionados con JWT
 * - Configuración centralizada
 */
class JwtTokenService {
    constructor(secretKey = 'your-secret-key', expiresIn = '24h') {
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }
    /**
     * Genera un token JWT
     */
    generateToken(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new Error('El payload debe ser un objeto válido');
        }
        return (0, jsonwebtoken_1.sign)(payload, this.secretKey, {
            expiresIn: this.expiresIn,
            issuer: 'solid-demo-app'
        });
    }
    /**
     * Verifica y decodifica un token JWT
     */
    verifyToken(token) {
        try {
            if (!token) {
                return null;
            }
            const decoded = (0, jsonwebtoken_1.verify)(token, this.secretKey);
            return typeof decoded === 'object' ? decoded : null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Extrae el token del header Authorization
     */
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7); // Remueve 'Bearer '
    }
}
exports.JwtTokenService = JwtTokenService;
//# sourceMappingURL=TokenService.js.map