  const mysql = require('mysql');
  
  const conexion = mysql.createConnection({
    // colocar variables de entorno
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
  
  conexion.connect((error) =>{
      if(error){
          console.error('Error de conexion', error.stack);
          return;
      }
      console.log('Conexion exitosa a la bd');
  });
  
  module.exports = conexion;
  
  