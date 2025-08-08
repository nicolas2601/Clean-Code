"use strict";
// Principio SRP: Solo se encarga del hash de contraseñas
// Alta cohesión: todos los métodos están relacionados con el hash
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptPasswordHasher = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Servicio para hash de contraseñas
 * Demuestra:
 * - SRP: Solo maneja operaciones de hash
 * - Alta cohesión: métodos relacionados
 * - Implementación de interface (DIP)
 */
class BcryptPasswordHasher {
    constructor(saltRounds = 12) {
        this.saltRounds = saltRounds;
    }
    /**
     * Genera un hash de la contraseña
     */
    async hash(password) {
        if (!password || password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        return await bcryptjs_1.default.hash(password, this.saltRounds);
    }
    /**
     * Compara una contraseña con su hash
     */
    async compare(password, hash) {
        if (!password || !hash) {
            return false;
        }
        return await bcryptjs_1.default.compare(password, hash);
    }
}
exports.BcryptPasswordHasher = BcryptPasswordHasher;
//# sourceMappingURL=PasswordHasher.js.map