import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import passwordRoutes from './routes/password.routes.js'
import fileRoutes from './routes/file.routes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const whitelist = ['http://127.0.0.1:5501', 'https://mi-dominio.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
};


// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser()); 
app.use(cors(corsOptions));

// Servir la carpeta 'uploads' como estática para acceder a los archivos subidos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas 
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/users', userRoutes)
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

export default app;
