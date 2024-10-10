import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { createAccessToken } from '../libs/jwt.js';

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone, address } = req.body;

    // Verificar si el usuario ya existe
    const userFound = await User.findOne({ where: { email } });
    if (userFound) {
      return res.status(400).json({
        message: ["El correo electrónico ya está en uso"],
      });
    }

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con el rol por defecto 'user'
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      first_name,
      last_name,
      phone,
      address,
      role: 'user', // Asignar el rol de 'user' por defecto
    });

    // Generar un token de acceso
    const token = await createAccessToken({ id: newUser.id });

    // Enviar el token en una cookie
    res.cookie("token-jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });


    // Enviar la respuesta con los datos del nuevo usuario
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role, // Incluir el rol en la respuesta
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      message: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor"
    });
  }
};

// Inicio de sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo electrónico
    const userFound = await User.findOne({
      where: { email },
    });

    if (!userFound) {
      return res.status(404).json({ message: 'El correo electrónico no existe' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña es incorrecta' });
    }

    // Generar un token de acceso
    const token = await createAccessToken({
      id: userFound.id,
      username: userFound.username,
      role: userFound.role, // Incluir el rol en el token
    });

    // Enviar el token en una cookie
    res.cookie("token-jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Cambiar según las necesidades de seguridad
    });

    // Enviar la respuesta con los datos del usuario
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role, // Incluir el rol en la respuesta
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Logout
export const logout = async (req, res) => {
  // Limpiar la cookie del token
  res.clearCookie("token-jwt", {
    httpOnly: true,
    secure: true, // Cambiar a true si estás en producción
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logout successful" });
};
