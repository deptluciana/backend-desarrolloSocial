import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; // Tu conexión a la base de datos

const PendingUser = sequelize.define('RegistroPendiente', {
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
}, {
  timestamps: true, // Agregar createdAt y updatedAt
  underscored: true, // Convierte las propiedades camelCase a snake_case
});

const syncDatabase = async () => {
  await PendingUser.sync({ alter: true });
};

export { PendingUser, syncDatabase };
