import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createUser, updateUser, deleteUser, getUser, getAllUsers, getProfile, updateUserProfile } from '../controllers/user.controllers.js';

const router = Router();


// Obtener el perfil del usuario autenticado
router.get('/profile', authMiddleware(), getProfile);
// Ruta para editar perfil del usuario (protegida con autenticación)
router.put('/profile', authMiddleware(), updateUserProfile);

// Rutas accesibles solo para administradores
router.post('/create', authMiddleware(['admin']), createUser);
router.put('/:id', authMiddleware(['admin']), updateUser);
router.delete('/:id', authMiddleware(['admin']) , deleteUser);
router.get('/:id', authMiddleware(['admin']), getUser);
router.get('/', authMiddleware(['admin']), getAllUsers);



export default router;
