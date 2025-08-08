"use strict";
// Aplicación Express principal
// Demuestra configuración del servidor y middleware
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = require("./routes/userRoutes");
const DIContainer_1 = require("./container/DIContainer");
/**
 * Clase principal de la aplicación
 * Demuestra:
 * - Configuración centralizada
 * - Uso del contenedor DI
 * - Manejo de middleware
 * - Organización de rutas
 */
class App {
    constructor() {
        /**
         * Middleware de logging
         */
        this.loggingMiddleware = (req, res, next) => {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${req.method} ${req.path}`);
            next();
        };
        /**
         * Health check endpoint
         */
        this.healthCheck = (req, res) => {
            res.status(200).json({
                success: true,
                message: 'API funcionando correctamente',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        };
        /**
         * Información de la API
         */
        this.apiInfo = (req, res) => {
            res.status(200).json({
                success: true,
                message: 'API de demostración de principios SOLID',
                version: '1.0.0',
                endpoints: {
                    users: {
                        'POST /api/users/register': 'Registrar usuario',
                        'POST /api/users/login': 'Iniciar sesión',
                        'GET /api/users/profile': 'Obtener perfil (requiere auth)',
                        'PUT /api/users/profile': 'Actualizar perfil (requiere auth)',
                        'PUT /api/users/change-password': 'Cambiar contraseña (requiere auth)',
                        'DELETE /api/users/profile': 'Eliminar cuenta (requiere auth)',
                        'GET /api/users': 'Listar usuarios (requiere auth)',
                        'GET /api/users/:id': 'Obtener usuario por ID (requiere auth)'
                    },
                    other: {
                        'GET /health': 'Health check',
                        'GET /api/stats': 'Estadísticas del sistema'
                    }
                },
                principles: {
                    'SOLID': 'Principios de diseño orientado a objetos',
                    'DI': 'Inyección de dependencias',
                    'Cohesion': 'Alta cohesión en clases y módulos',
                    'Coupling': 'Bajo acoplamiento entre componentes'
                }
            });
        };
        /**
         * Endpoint de estadísticas
         */
        this.getStats = async (req, res) => {
            try {
                const userRepo = this.container.get('IUserRepository');
                const stats = userRepo.getStats();
                const services = this.container.getRegisteredServices();
                res.status(200).json({
                    success: true,
                    message: 'Estadísticas del sistema',
                    data: {
                        users: stats,
                        services: {
                            registered: services,
                            count: services.length
                        },
                        system: {
                            uptime: process.uptime(),
                            memory: process.memoryUsage(),
                            nodeVersion: process.version
                        }
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener estadísticas',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        };
        /**
         * Manejo de rutas no encontradas
         */
        this.notFoundHandler = (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint no encontrado',
                path: req.path,
                method: req.method
            });
        };
        /**
         * Manejo global de errores
         */
        this.errorHandler = (error, req, res, next) => {
            console.error('❌ Error no manejado:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        };
        this.app = (0, express_1.default)();
        this.container = DIContainer_1.DIContainer.getInstance();
        this.userRoutes = new userRoutes_1.UserRoutes();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
        this.initializeData();
    }
    /**
     * Configura middleware global
     */
    setupMiddleware() {
        // CORS
        this.app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }));
        // Parser de JSON
        this.app.use(express_1.default.json({ limit: '10mb' }));
        // Parser de URL encoded
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Servir archivos estáticos desde la carpeta public
        this.app.use('/public', express_1.default.static('public'));
        // Logging middleware
        this.app.use(this.loggingMiddleware);
    }
    /**
     * Configura las rutas de la aplicación
     */
    setupRoutes() {
        // Ruta raíz - Frontend
        this.app.get('/', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
        });
        // Ruta de salud
        this.app.get('/health', this.healthCheck);
        // Ruta de información de la API
        this.app.get('/api', this.apiInfo);
        // Rutas de usuarios
        this.app.use('/api/users', this.userRoutes.getRouter());
        // Ruta para estadísticas (demuestra extensibilidad)
        this.app.get('/api/stats', this.getStats);
        // Manejo de rutas no encontradas
        this.app.use('*', this.notFoundHandler);
    }
    /**
     * Configura manejo global de errores
     */
    setupErrorHandling() {
        this.app.use(this.errorHandler);
    }
    /**
     * Inicializa datos de ejemplo
     */
    async initializeData() {
        try {
            const userRepo = this.container.get('IUserRepository');
            const passwordHasher = this.container.get('IPasswordHasher');
            // Crear usuario de ejemplo si no existe
            const existingUser = await userRepo.findByEmail('admin@example.com');
            if (!existingUser) {
                const hashedPassword = await passwordHasher.hash('admin123');
                await userRepo.create({
                    email: 'admin@example.com',
                    name: 'Administrador',
                    password: 'admin123',
                    passwordHash: hashedPassword
                });
                console.log('✅ Usuario de ejemplo creado: admin@example.com / admin123');
            }
        }
        catch (error) {
            console.error('❌ Error al inicializar datos:', error);
        }
    }
    /**
     * Obtiene la instancia de Express
     */
    getApp() {
        return this.app;
    }
    /**
     * Inicia el servidor
     */
    listen(port = 3000) {
        this.app.listen(port, () => {
            console.log(`🚀 Servidor iniciado en puerto ${port}`);
            console.log(`📚 Documentación: http://localhost:${port}/api`);
            console.log(`❤️  Health check: http://localhost:${port}/health`);
            console.log(`📊 Estadísticas: http://localhost:${port}/api/stats`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map