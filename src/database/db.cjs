import {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} from './config.js';

const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ranking'
});

conexion.connect((error) =>{
    if(error){
        console.error('Error de conexion', error.stack);
        return
    }
    console.log('Conexion exitosa a la bd')
});

module.exports = conexion;