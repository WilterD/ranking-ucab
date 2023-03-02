const conexion = require("../database/db.cjs");
const bodyParser = require("body-parser");

function login(req, res){
    res.render('login/index')
}

function register(req, res){
    res.render('login/register')

}

module.exports = {
    login: login,
    register: register,
}