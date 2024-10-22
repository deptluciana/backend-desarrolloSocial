import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { User } from '../models/user.model.js';

export const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    // Obtener el token de las cookies
    const token = req.cookies['token-jwt'];

    // Si no hay token, devolver error 401 (No autorizado)
    if (!token) {
      console.error("Token no presente en las cookies");
      return res.status(401).json({ message: "No token, autorización denegada" });
    }

    try {
      // Verificar el token JWT
      const decoded = jwt.verify(token, TOKEN_SECRET);
      req.user = decoded;  // Guardar la información decodificada del usuario

      // Verificar si el usuario aún existe en la base de datos
      const user = await User.findByPk(req.user.id);
      if (!user) {
        // Si el usuario ha sido eliminado, limpiar las cookies y retornar error
        res.clearCookie('token-jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(401).json({ message: "Usuario no encontrado, sesión cerrada" });
      }

      // Si no se pasan roles, cualquier usuario autenticado puede acceder
      if (roles.length === 0) {
        return next();
      }

      // Verificar si el rol del usuario es válido
      if (!roles.includes(user.role)) {
        console.error("Acceso denegado. Usuario no tiene los permisos suficientes.");
        return res.status(403).json({ message: "Acceso denegado: No tienes los permisos suficientes" });
      }

      // Si pasa ambas validaciones (autenticación y rol), continúa
      next();
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return res.status(403).json({ message: "Token no válido o expirado" });
    }
  };
};
