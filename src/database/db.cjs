  const mysql = require('mysql');
  
  const conexion = mysql.createConnection({
    // colocar variables de entorno
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});
  
  conexion.connect((error) =>{
      if(error){
          console.error('Error de conexion', error.stack);
          return;
      }
      console.log('Conexion exitosa a la bd');
  });
  
  module.exports = conexion;
  
  