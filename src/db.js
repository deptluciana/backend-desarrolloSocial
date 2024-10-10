import { Sequelize } from 'sequelize';
import { MYSQL_PUBLIC_URL } from './config.js';

const sequelize = new Sequelize(MYSQL_PUBLIC_URL, {
  dialect: 'mysql',
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
