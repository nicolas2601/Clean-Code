// Aplicación Express principal
// Demuestra configuración del servidor y middleware

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { UserRoutes } from './routes/userRoutes';
import { DIContainer } from './container/DIContainer';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { IPasswordHasher } from './interfaces/IRepository';

/**
 * Clase principal de la aplicación
 * Demuestra:
 * - Configuración centralizada
 * - Uso del contenedor DI
 * - Manejo de middleware
 * - Organización de rutas
 */
export class App {
  private app: Application;
  private userRoutes: UserRoutes;
  private container: DIContainer;

  constructor() {
    this.app = express();
    this.container = DIContainer.getInstance();
    this.userRoutes = new UserRoutes();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.initializeData();
  }

  /**
   * Configura middleware global
   */
  private setupMiddleware(): void {
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Parser de JSON
    this.app.use(express.json({ limit: '10mb' }));
    
    // Parser de URL encoded
    this.app.use(express.urlencoded({ extended: true }));

    // Servir archivos estáticos desde la carpeta public
    this.app.use('/public', express.static('public'));

    // Logging middleware
    this.app.use(this.loggingMiddleware);
  }

  /**
   * Configura las rutas de la aplicación
   */
  private setupRoutes(): void {
    // Ruta raíz - Frontend
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
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
  private setupErrorHandling(): void {
    this.app.use(this.errorHandler);
  }

  /**
   * Inicializa datos de ejemplo
   */
  private async initializeData(): Promise<void> {
    try {
      const userRepo = this.container.get<InMemoryUserRepository>('IUserRepository');
      const passwordHasher = this.container.get<IPasswordHasher>('IPasswordHasher');
      
      // Crear usuario de ejemplo si no existe
      const existingUser = await userRepo.findByEmail('admin@example.com');
      if (!existingUser) {
        const hashedPassword = await passwordHasher.hash('admin123');
        await userRepo.create({
          email: 'admin@example.com',
          name: 'Administrador',
          password: 'admin123',
          passwordHash: hashedPassword
        } as any);
        
        console.log('✅ Usuario de ejemplo creado: admin@example.com / admin123');
      }
    } catch (error) {
      console.error('❌ Error al inicializar datos:', error);
    }
  }

  /**
   * Middleware de logging
   */
  private loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  };

  /**
   * Health check endpoint
   */
  private healthCheck = (req: Request, res: Response): void => {
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
  private apiInfo = (req: Request, res: Response): void => {
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
  private getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userRepo = this.container.get<InMemoryUserRepository>('IUserRepository');
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
    } catch (error) {
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
  private notFoundHandler = (req: Request, res: Response): void => {
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
  private errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.error('❌ Error no manejado:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  };

  /**
   * Obtiene la instancia de Express
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Inicia el servidor
   */
  public listen(port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`🚀 Servidor iniciado en puerto ${port}`);
      console.log(`📚 Documentación: http://localhost:${port}/api`);
      console.log(`❤️  Health check: http://localhost:${port}/health`);
      console.log(`📊 Estadísticas: http://localhost:${port}/api/stats`);
    });
  }
}