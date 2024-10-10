// config.js
import { config } from "dotenv";
config();

const requiredEnv = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'TOKEN_SECRET',
  'FRONTEND_URL',
  'EMAIL_USER', 
  'EMAIL_PASS'
];

requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Falta la variable de entorno: ${envVar}`);
    process.exit(1);
  }
});

export const PORT = process.env.PORT || 5000; 
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT || 3306; // Asegura un puerto por defecto
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const NODE_ENV = process.env.NODE_ENV || 'development';
