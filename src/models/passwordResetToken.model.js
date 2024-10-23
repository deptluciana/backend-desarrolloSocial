import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { User } from './user.model.js'; // Asegúrate de que el modelo User esté correctamente importado

const PasswordResetToken = sequelize.define('PasswordResetToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'PasswordResetToken', // Especifica el nombre de la tabla
    timestamps: false,
});

// Relación entre PasswordResetToken y User
PasswordResetToken.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Sincroniza el modelo con la base de datos
const syncDatabase = async () => {
  try {
      await PasswordResetToken.sync({ force: true }); // Cambiar a { alter: true } después de la creación inicial
      console.log('Tabla PasswordResetToken sincronizada correctamente.');
  } catch (error) {
      console.error('Error sincronizando la tabla PasswordResetToken:', error);
  }
};

export { PasswordResetToken, syncDatabase };
