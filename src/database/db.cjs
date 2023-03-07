const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
  } = require('../config.cjs');
  
  const mysql = require('mysql');
  
  const conexion = mysql.createConnection({
      host: 'rankingucab.mysql.database.azure.com',
      user: 'wilterd',
      password: 'Hugo1234$',
      database: 'rankingucab',
      port: 3306
  });
  
  conexion.connect((error) =>{
      if(error){
          console.error('Error de conexion', error.stack);
          return;
      }
      console.log('Conexion exitosa a la bd');
  });
  
  module.exports = conexion;
  