import mysql from 'mysql2/promise';
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} from '../config.js';

const connection = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT
});

console.log('Conexion exitosa a la bd');

export default connection;
