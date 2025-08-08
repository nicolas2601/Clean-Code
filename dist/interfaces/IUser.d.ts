/**
 * Interface base para entidad Usuario
 * Demuestra el principio de Segregación de Interfaces
 */
export interface IUser {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}
/**
 * Interface para operaciones de autenticación
 * Separada de IUser para cumplir ISP
 */
export interface IUserAuth {
    email: string;
    password: string;
}
/**
 * Interface para datos de creación de usuario
 */
export interface ICreateUser {
    email: string;
    name: string;
    password: string;
}
/**
 * Interface para actualización de usuario
 */
export interface IUpdateUser {
    name?: string;
    email?: string;
}
//# sourceMappingURL=IUser.d.ts.map