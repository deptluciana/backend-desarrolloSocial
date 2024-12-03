import { Router } from 'express';
import { register, login, logout, registerPending } from '../controllers/auth.controllers.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getPendingUsers, acceptPendingUser, rejectPendingUser } from '../controllers/auth.controllers.js';


const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/register-pending', validateSchema(registerSchema), registerPending); 
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout);

//usuarios pendientes
router.get('/solicitudes', getPendingUsers);
router.post('/solicitudes/:id/accept', authMiddleware(), acceptPendingUser);
router.post('/solicitudes/:id/reject', authMiddleware(), rejectPendingUser);

router.get('/check', authMiddleware(), (req, res) => {
  console.log('Verificando autenticación...');
  if (req.user) {
    console.log('Usuario autenticado:', req.user);
    return res.status(200).json({ authenticated: true, user: req.user });
  } else {
    console.log('No se encontró un usuario autenticado.');
    return res.status(401).json({ authenticated: false });
  }
});

export default router;
