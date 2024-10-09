import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Info = sequelize.define('Info', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Título por defecto', 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Descripción por defecto', 
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Info', 
    timestamps: true, 
});

const syncDatabase = async () => {
    await Info.sync({ alter: true });
};

export { Info, syncDatabase };
