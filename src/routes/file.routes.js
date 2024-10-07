// backend/routes/file.routes.js
import { Router } from 'express';
import multer from 'multer';
import { uploadFile, getFilesBySection, deleteFile} from '../controllers/file.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router();

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nombre único para evitar colisiones
    },
});

const upload = multer({ storage });


router.post('/upload', authMiddleware(['admin']), upload.single('file'), uploadFile);
router.get('/:section', getFilesBySection);
router.delete('/delete/:id', authMiddleware(['admin']), deleteFile);

export default router;