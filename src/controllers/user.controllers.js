import { User } from '../models/user.model.js';
import { PasswordResetToken } from '../models/passwordResetToken.model.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Op } from 'sequelize';


// Obtener el perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// Definir el esquema de validación para la actualización del perfil
const updateUserSchema = z.object({
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string()
    .min(1, { message: "Teléfono es requerido" })
    .regex(/^\d+$/, { message: "Teléfono debe ser numérico" }),
  address: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
});

// Actualizar perfil del usuario autenticado
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const validatedData = updateUserSchema.parse(req.body);

    // Encontrar y actualizar al usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario
    if (validatedData.username) user.username = validatedData.username;
    if (validatedData.email) user.email = validatedData.email;
    if (validatedData.first_name) user.first_name = validatedData.first_name;
    if (validatedData.last_name) user.last_name = validatedData.last_name;
    if (validatedData.phone) user.phone = validatedData.phone;
    if (validatedData.address) user.address = validatedData.address;

    await user.save();

    res.status(200).json({ message: 'Perfil actualizado exitosamente', user });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Esquema de validación para el usuario
const userSchema = z.object({
  username: z.string().min(1, { message: "Username es requerido" }).max(30, { message: "Username no puede exceder los 30 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  first_name: z.string().min(1, { message: "Nombre es requerido" }),
  last_name: z.string().min(1, { message: "Apellido es requerido" }),
  phone: z.string()
    .min(1, { message: "Teléfono es requerido" })
    .regex(/^\d+$/, { message: "Teléfono debe ser numérico" }),
  address: z.string().min(1, { message: "Dirección es requerida" }),
  role: z.enum(['user', 'admin']).optional(),
});

export const createUser = async (req, res) => {
  try {
    userSchema.parse(req.body);

    const { username, email, password, first_name, last_name, phone, address, role } = req.body;

    // Verificar si el nombre de usuario ya está en uso
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Verificar si el correo electrónico ya está en uso
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Este correo ya está en uso' });
    }

    // Hashing de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      address,
      role: role || 'user',
    });

    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Editar un usuario existente
export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const validatedData = updateUserSchema.parse(req.body);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (validatedData.username) {
      const existingUser = await User.findOne({
        where: {
          username: validatedData.username,
          id: {
            [Op.ne]: id
          }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya existe' });
      }
      user.username = validatedData.username;
    }

    // Actualizar otros datos del usuario
    if (validatedData.first_name) user.first_name = validatedData.first_name;
    if (validatedData.last_name) user.last_name = validatedData.last_name;
    if (validatedData.phone) user.phone = validatedData.phone;
    if (validatedData.address) user.address = validatedData.address;
    if (validatedData.role) user.role = validatedData.role;

    await user.save();

    res.status(200).json({ message: 'Perfil actualizado exitosamente', user });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario que se intenta eliminar es el primer administrador
    const firstAdmin = await User.findOne({ where: { role: 'admin' }, order: [['createdAt', 'ASC']] });
    if (user.id === firstAdmin.id) {
      return res.status(403).json({ message: 'No puedes eliminar al primer usuario administrador.' });
    }

    // Eliminar cualquier token de restablecimiento de contraseña asociado al usuario
    await PasswordResetToken.destroy({ where: { userId: user.id } });

    // Invalida el JWT del usuario si es que está autenticado
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(403).json({ message: 'Token inválido' });
        }

        if (decodedToken.id === user.id) {
          res.clearCookie('jwt'); // Elimina la cookie del token en el cliente
        }
      });
    }

    // Proceder a eliminar el usuario
    await user.destroy();
    res.status(204).json({ message: 'Usuario eliminado con éxito' });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Consultar un usuario específico
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Consultar todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
