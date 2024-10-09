import { Router } from 'express';
import { createEvento, getAllEventos, getEventoById, updateEvento, deleteEvento } from '../controllers/eventos.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para crear un nuevo evento
router.post('/', authMiddleware(['admin']), createEvento);

// Ruta para obtener todos los eventos
router.get('/', authMiddleware(), getAllEventos);

// Ruta para obtener un evento por ID
router.get('/:id', authMiddleware(), getEventoById);

// Ruta para actualizar un evento por ID
router.put('/:id', authMiddleware(['admin']), updateEvento);

// Ruta para eliminar un evento
router.delete('/:id', authMiddleware(['admin']), deleteEvento);

export default router;
