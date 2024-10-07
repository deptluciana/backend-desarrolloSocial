import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; // Tu conexión a la base de datos

const User = sequelize.define('Users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  first_name: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  last_name: { 
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  phone: { 
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^\d+$/, 
      notEmpty: false, 
    },
  },
  address: { 
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false, 
    },
  },
  role: {  // Nuevo atributo role
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',  // Valor por defecto 'user'
    validate: {
      isIn: [['user', 'admin']], // Validación para aceptar solo ciertos roles
    },
  },
}, {
  timestamps: true, 
  underscored: true,
});

const syncDatabase = async () => {
    await User.sync({ alter: true });
};

export { User, syncDatabase };
