import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Capacitacion = sequelize.define('Capacitaciones', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horarios: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Capacitaciones',
    timestamps: true, // Esto creará las columnas 'createdAt' y 'updatedAt'
});

const syncDatabase = async () => {
    await Capacitaciones.sync({ alter: true });
};

export { Capacitacion, syncDatabase };
