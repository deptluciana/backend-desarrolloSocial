import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Evento = sequelize.define('Evento', {
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
    tableName: 'Eventos',
    timestamps: true, // Esto creará las columnas 'createdAt' y 'updatedAt'
});

const syncDatabase = async () => {
    await Evento.sync({ alter: true });
};

export { Evento, syncDatabase };
