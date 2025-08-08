"use strict";
// Principio SRP: Responsabilidad Única
// Alta cohesión: todos los métodos están relacionados con la entidad Usuario
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
/**
 * Clase User que demuestra:
 * - SRP: Solo se encarga de representar un usuario
 * - Alta cohesión: todos los métodos están relacionados
 * - Bajo acoplamiento: no depende de implementaciones concretas
 */
class User {
    constructor(email, name, passwordHash, id, createdAt) {
        this.id = id || (0, uuid_1.v4)();
        this.email = this.validateEmail(email);
        this.name = this.validateName(name);
        this._passwordHash = passwordHash;
        this.createdAt = createdAt || new Date();
    }
    /**
     * Valida el formato del email
     * Demuestra encapsulación y validación de datos
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Formato de email inválido');
        }
        return email.toLowerCase();
    }
    /**
     * Valida el nombre del usuario
     */
    validateName(name) {
        if (!name || name.trim().length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        return name.trim();
    }
    /**
     * Getter para el hash de la contraseña
     * Demuestra encapsulación
     */
    get passwordHash() {
        return this._passwordHash;
    }
    /**
     * Actualiza el email del usuario
     */
    updateEmail(newEmail) {
        this.email = this.validateEmail(newEmail);
    }
    /**
     * Actualiza el nombre del usuario
     */
    updateName(newName) {
        this.name = this.validateName(newName);
    }
    /**
     * Actualiza el hash de la contraseña
     */
    updatePasswordHash(newPasswordHash) {
        if (!newPasswordHash) {
            throw new Error('El hash de contraseña no puede estar vacío');
        }
        this._passwordHash = newPasswordHash;
    }
    /**
     * Convierte el usuario a un objeto plano (sin el hash de contraseña)
     * Demuestra el principio de ocultación de información
     */
    toPublicObject() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt
        };
    }
    /**
     * Convierte el usuario a un objeto completo (para persistencia)
     */
    toFullObject() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt,
            passwordHash: this._passwordHash
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map