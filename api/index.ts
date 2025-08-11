import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { UserRoutes } from '../src/routes/userRoutes';
import { DIContainer } from '../src/container/DIContainer';

// Crear la aplicación Express
const app = express();

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, '../public')));

// Ruta raíz para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Configurar rutas de la API
const container = DIContainer.getInstance();
const userRoutesInstance = new UserRoutes();
app.use('/api', userRoutesInstance.getRouter());

// Estadísticas del sistema
app.get('/api/stats', (req, res) => {
  const userService = container.get<any>('UserService');
  const stats = {
    totalUsers: userService.getAllUsers().length,
    timestamp: new Date().toISOString(),
    principles: {
      'Single Responsibility': 'Cada clase tiene una única responsabilidad',
      'Open/Closed': 'Abierto para extensión, cerrado para modificación',
      'Liskov Substitution': 'Los objetos derivados deben ser sustituibles',
      'Interface Segregation': 'Interfaces específicas mejor que generales',
      'Dependency Inversion': 'Depender de abstracciones, no de concreciones'
    },
    architecture: {
      cohesion: 'Alta cohesión en módulos',
      coupling: 'Bajo acoplamiento entre componentes',
      injection: 'Inyección de dependencias implementada'
    }
  };
  res.json(stats);
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Exportar para Vercel
export default app;

// También exportar como función para Vercel
export const handler = (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};