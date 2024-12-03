import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { PendingUser } from '../models/pendingUser.model.js'
import { User } from '../models/user.model.js';
import { createAccessToken } from '../libs/jwt.js';

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'soporte.secretariaterritorial@gmail.com',
    pass: 'oqtx frff ilon pdnr',
  },
});

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

export const registerPending = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone, address } = req.body;

    // Verificar si el usuario ya existe en `users` o en `registro_pendiente`
    const userFound = await User.findOne({ where: { email } });
    const pendingUserFound = await PendingUser.findOne({ where: { email } });

    if (userFound || pendingUserFound) {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso o pendiente de aprobación",
      });
    }

    // Crear una nueva entrada en la tabla `registro_pendiente`
    const newPendingUser = await PendingUser.create({
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
    });

    res.status(201).json({
      message: "Solicitud de registro enviada con éxito. Un administrador revisará tu solicitud.",
      id: newPendingUser.id,
      email: newPendingUser.email,
    });
  } catch (error) {
    console.error("Error en el registro pendiente:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Obtener usuarios pendientes
export const getPendingUsers = async (req, res) => {
  try {
    // Consultar todos los registros en la tabla PendingUser
    const pendingUsers = await PendingUser.findAll({
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'address'], // Selecciona solo los campos necesarios
    });

    // Verificar si hay registros
    if (pendingUsers.length === 0) {
      return res.status(200).json([]); // Devolver un array vacío
    }

    // Enviar la lista de usuarios pendientes
    res.json(pendingUsers);
  } catch (error) {
    console.error("Error al obtener usuarios pendientes:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const acceptPendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el usuario pendiente por ID
    const pendingUser = await PendingUser.findByPk(id);
    if (!pendingUser) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Crear un nuevo usuario en la tabla `users`
    const passwordHash = await bcrypt.hash(pendingUser.password, 10); // Encriptar la contraseña
    const newUser = await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: passwordHash,
      first_name: pendingUser.first_name,
      last_name: pendingUser.last_name,
      phone: pendingUser.phone,
      address: pendingUser.address,
      role: 'user', // Asignar el rol de 'user' por defecto
    });

    // Eliminar la solicitud pendiente
    await pendingUser.destroy();

    // Enviar correo electrónico de aceptación
    await transporter.sendMail({
      to: newUser.email,
      subject: 'Solicitud Aceptada',
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2>¡Tu solicitud ha sido aceptada!</h2>
              <p>Hola ${newUser.first_name},</p>
              <p>Te informamos que tu solicitud ha sido aceptada. Ya puedes acceder a nuestra plataforma con tus credenciales registradas.</p>
          </div>
      `,
    });

    res.status(201).json({
      message: "Usuario aceptado y registrado con éxito",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error al aceptar solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const rejectPendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el usuario pendiente por ID
    const pendingUser = await PendingUser.findByPk(id);
    if (!pendingUser) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Enviar correo electrónico de rechazo
    await transporter.sendMail({
      to: pendingUser.email,
      subject: 'Solicitud Rechazada',
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
              <h2>Tu solicitud ha sido rechazada</h2>
              <p>Hola ${pendingUser.first_name},</p>
              <p>Lamentamos informarte que tu solicitud no ha sido aceptada en este momento.</p>
          </div>
      `,
    });

    // Eliminar la solicitud pendiente
    await pendingUser.destroy();

    res.status(200).json({ message: "Solicitud rechazada y eliminada con éxito" });
  } catch (error) {
    console.error("Error al rechazar solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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
      sameSite: "none",
      domain: ".secretariaarticulacionterritorial.com", // Compartir cookies entre subdominios
      path: "/", // Asegúrate de que la ruta esté correctamente definida
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
  res.clearCookie("token-jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".secretariaarticulacionterritorial.com",
    path: "/",
    expires: new Date(0) // Forzar expiración inmediata
  });
  return res.status(200).json({ message: "Logout successful" });
};
