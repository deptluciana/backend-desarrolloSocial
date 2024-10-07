import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const File = sequelize.define('Files', {
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'Files'
});

const syncDatabase = async () => {
    await File.sync({ alter: true });
};

export { File, syncDatabase };
