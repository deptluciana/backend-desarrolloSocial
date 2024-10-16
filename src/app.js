import express from 'express';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import cors from "cors";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import passwordRoutes from './routes/password.routes.js'
import fileRoutes from './routes/file.routes.js'
import path from 'path';
import { FRONTEND_URL, FRONTEND_URL_WWW} from './config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import infoRoutes from './routes/info.routes.js'
import eventoRoutes from './routes/eventos.routes.js'
import capacitacionRoutes from './routes/capacitaciones.routes.js'

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = [
  FRONTEND_URL,
  FRONTEND_URL_WWW
];

// Configuración de CORS
const corsOptions = {
  origin: function(origin, callback){
    // Permitir solicitudes sin origen (como desde herramientas de prueba)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ["POST", "PUT", "DELETE", "GET", "OPTIONS"],
  credentials: true, // Permitir el envío de cookies
};

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

app.use((req, res, next) => {
  console.log(`Origen de la solicitud: ${req.headers.origin}`);
  next();
});

// Servir la carpeta 'uploads' como estática para acceder a los archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas 
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/capacitacion', capacitacionRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});


app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

export default app;
