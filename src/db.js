// db.js
import { Sequelize } from 'sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './config.js';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT, // Asegúrate de incluir el puerto
  dialect: 'mysql',
  dialectOptions: {
    // Opcional: puedes agregar opciones adicionales si es necesario
    // ssl: { rejectUnauthorized: false }
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
