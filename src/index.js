import express from 'express';
import {dirname, join} from 'path'; 
import {fileURLToPath} from 'url'; 
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import indexRoutes from './routes/index.js';
import conexion from "./database/db.cjs";

import session from 'express-session';
import flash from 'connect-flash';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { imgDir } from "./helpers/fileManager.cjs";


const app = express(); // referenciar a express

console.log(DOMAIN)



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname,'views')); 
app.set('view engine', 'ejs');

// en pruebas
app.use(session({
  secret: 'mysecretkey1',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // cambiar a true en producción si se utiliza https
      maxAge: 3600000 // tiempo de vida de la sesión en milisegundos (1 hora)
  }
}));



//hola

app.use(flash());

// Rutas de registro y login

app.get('/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

app.post('/register',  [
    check('email', 'El correo electrónico no es válido').isEmail(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = [];
        errors.array().forEach(error => messages.push(error.msg));
        req.flash('message', messages);
        res.redirect('/register');
    } else {
        const {email, password } = req.body;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            // Guardar el usuario en la base de datos
            try {
              // Verificar si el usuario ya existe en la base de datos
              conexion.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
              if (results.length > 0) {
                req.flash('message', 'no se puede registrar');
              }else{
              // Si el usuario no existe, se registra en la base de datos
              const hashedPassword =  bcrypt.hash(password, 10);

              const status = {
                status: 'disabled'
              }

              conexion.query(
                "INSERT INTO users SET ?",
                {
                  email: email,
                  password: password,
                  status: status.status
                },
                (error, results) => {
                  if (error) {
                    console.log(error);
                    req.flash('message', 'no se puede registrar');
                    res.status(400).json({ msg: "error" });
                  } else {
                    res.redirect("/login");
                  }
                });  
              }
            });
            } catch (error) {
              console.error(error);
              res.render('register');
            }
        });
    }
});










    



app.use(express.json());

app.use('/', indexRoutes);
app.use(express.static(join(__dirname,'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server iniciado en puerto 3000');
});