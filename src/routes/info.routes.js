import { Router } from 'express';
import { createInfo, getInfoBySection, deleteInfo, updateInfo } from '../controllers/info.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para crear un nuevo panel
router.post('/', authMiddleware(['admin']), createInfo);

// Ruta para obtener información por sección
router.get('/:section', authMiddleware(), getInfoBySection);

router.put('/:id', authMiddleware(['admin']), updateInfo);

// Ruta para eliminar un panel completo
router.delete('/:id', authMiddleware(['admin']), deleteInfo);

export default router;
