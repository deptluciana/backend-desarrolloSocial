import { Router } from 'express';
import { createCapacitacion, getCapacitacionById, getAllCapacitaciones, updateCapacitacion, deleteCapacitacion } from '../controllers/capacitaciones.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para crear un nuevo evento
router.post('/', authMiddleware(['admin']), createCapacitacion);

// Ruta para obtener todos los eventos
router.get('/', getAllCapacitaciones);

// Ruta para obtener un evento por ID
router.get('/:id', authMiddleware(), getCapacitacionById);

// Ruta para actualizar un evento por ID
router.put('/:id', authMiddleware(['admin']), updateCapacitacion);

// Ruta para eliminar un evento
router.delete('/:id', authMiddleware(['admin']), deleteCapacitacion);

export default router;
