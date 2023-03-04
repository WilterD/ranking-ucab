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



const app = express(); // referenciar a express


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname,'views')); 
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

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
              conexion.query(
                "INSERT INTO users SET ?",
                {
                  email: email,
                  password: password
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

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/home');
    }
  });
});


app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario en la base de datos y comparar la contraseña cifrada
    conexion.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (results.length > 0) {
        conexion.query('SELECT * FROM users WHERE password = ?', [password], (error, results) => {
          if (results.length > 0) {
                const user = results[0];
                console.log(user)
                const validPassword = bcrypt.compare(password, user.password);
                if (validPassword) {
                  req.session.user = user; // almacenar información del usuario en la sesión
                  req.session.userId = user.id;
                  req.session.email = user.email;
                  req.session.password = user.password;
                  req.session.loggedin = true;
                  res.redirect('/dashboard');
        } else {
          req.flash('message', 'La contraseña es incorrecta.');
          res.redirect('/login');
        }
        
      } else {
        req.flash('message', 'La contraseña es incorrecta.');
        res.redirect('/login');
      }
    });
  } else {
    req.flash('message', 'El correo electrónico no está registrado.');
    res.redirect('/login');
    
  }
});
} catch (error) {
  console.error(error);
  res.render('login');
}
});




// Middleware para restringir el acceso a páginas que requieren inicio de sesión
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    // Obtener el usuario de la base de datos
    conexion.query('SELECT * FROM users WHERE id = ?', [req.session.userId], (error, results) => {
      if (results.length > 0) {
        const user = results[0];
        console.log(user)
        if (user.status === 'active') {
          // El usuario está activo, continuar con la lógica de autenticación
          return next();
        } else {
          // El usuario no está activo, redirigir a una página de error o mostrar un mensaje de error
          req.flash('message', 'Tu cuenta no está activa.');
          res.redirect('/login');
        }
      } else {
        // No se encontró el usuario en la base de datos, redirigir a una página de error o mostrar un mensaje de error
        req.flash('Ha ocurrido un error');
      }
    });
  } else {
    // El usuario no ha iniciado sesión, redirigir a la página de inicio de sesión
    res.redirect('/login');
  }
}

    

// Ruta de dashboard protegida
app.get('/dashboard', requireLogin, (req, res) => {
    // Verificar que el usuario haya iniciado sesión
    conexion.query(
    "SELECT COUNT(*) AS cantidadDeportes FROM deporte",
    (error, deportes) => {
      if (error) {
        console.log(error);
      } else {
        conexion.query(
          "SELECT COUNT(*) AS cantidadEquipos FROM equipos",
          (error, resultadosEquipos) => {
            if (error) {
              console.log(error);
            } else {
              conexion.query(
                "SELECT COUNT(*) AS cantidadJugadores FROM jugador",
                (error, resultadosJugadores) => {
                  if (error) {
                    console.log(error);
                  } else {
                    conexion.query(
                      "SELECT COUNT(*) AS cantidadEstadios FROM estadio",
                      (error, resultadosEstadios) => {
                        if (error) {
                          console.log(error);
                        } else {
                          conexion.query(
                            "SELECT COUNT(*) AS cantidadPartidos FROM partido",
                            (error, resultadosPartidos) => {
                              if (error) {
                                console.log(error);
                              } else {
                                conexion.query(
                                  "SELECT COUNT(*) AS cantidadCarreras FROM carreras",
                                  (error, resultadosCarreras) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      res.render("dashboard.ejs", {
                                        cantidadDeportes:
                                          deportes[0].cantidadDeportes,
                                        cantidadEquipos:
                                          resultadosEquipos[0].cantidadEquipos,
                                        cantidadJugadores:
                                          resultadosJugadores[0]
                                            .cantidadJugadores,
                                        cantidadEstadios:
                                          resultadosEstadios[0]
                                            .cantidadEstadios,
                                        cantidadPartidos:
                                          resultadosPartidos[0]
                                            .cantidadPartidos,
                                        cantidadCarreras:
                                          resultadosCarreras[0]
                                            .cantidadCarreras,
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.use(express.json());

app.use('/', indexRoutes);
app.use(express.static(join(__dirname,'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server iniciado en puerto 3000');
});