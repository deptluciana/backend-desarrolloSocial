import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { PasswordResetToken } from '../models/passwordResetToken.model.js'
import nodemailer from 'nodemailer'; // Requiere configuración
import bcrypt from 'bcryptjs';

// Configurar nodemailer (usar tu propio servicio de email)
const transporter = nodemailer.createTransport({
    service: 'Gmail',

    auth: {
        user: process.env.EMAIL_USER, // Configura esto en tu .env
        pass: process.env.EMAIL_PASS,  // Configura esto en tu .env
    },
});

// Enviar enlace de recuperación de contraseña
const sendPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        console.log("el usuario es ",user.id)
        // Generar token de recuperación
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 3600000); // 1 hora de validez

        await PasswordResetToken.create({
            token,
            userId: user.id,
            expiration,
        });

        // Enviar correo con el token
        const resetLink = `https://www.secretariaarticulacionterritorial.com/pages/reset-password.html?token=${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Recuperación de contraseña</h2>
                <p>Hola,</p>
                <p>Parece que solicitaste restablecer tu contraseña. Haz <a href="${resetLink}" style="color: #4CAF50;">click aquí</a> para continuar.</p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, simplemente ignora este correo.</p>
            </div>
        `,
        });

        res.status(200).json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        console.error('Error en sendPasswordReset:', error); // Loguear el error
        res.status(500).json({ message: 'Error enviando correo', error: error.message }); // Incluir mensaje de error
    }
};


// Restablecer contraseña
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const resetToken = await PasswordResetToken.findOne({ where: { token } });
        if (!resetToken || resetToken.expiration < new Date()) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        // Validar nueva contraseña (por ejemplo, longitud mínima)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const user = await User.findByPk(resetToken.userId);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Eliminar token tras uso
        await PasswordResetToken.destroy({ where: { token } });

        res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error restableciendo la contraseña', error: 'Error interno del servidor' });
    }
};


export { sendPasswordReset, resetPassword };
