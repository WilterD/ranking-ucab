import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import indexRoutes from "./routes/index.js";
import conexion from "./database/db.cjs";

import session from "express-session";
import flash from "connect-flash";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

import { imgDir } from "./helpers/fileManager.cjs";

const app = express(); // referenciar a express

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

const secret = crypto.randomBytes(32).toString("hex");

// en pruebas
app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 60 * 60 * 1000, // Duración de 3 horas en milisegundos
    },
  })
);

app.use(flash());

app.use(express.json());

app.use("/", indexRoutes);
app.use(express.static(join(__dirname, "public")));

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log("Server iniciado en puerto 3000");
});
