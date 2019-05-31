//Cargamos el módulo express
var express = require('express');
var cors = require('cors')
var app = express();

var bp = require('body-parser');
app.use(cors());
app.use(bp.urlencoded({
    extended: true
}));
app.use(bp.json());
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '0.0.0.0',
      user : 'root',
      database : 'tfg'
    }
  });

var users = require('./users.js')
var auth = require('./auth.js')
var ofertas = require('./ofertas.js')

app.get('/profesionales/:id',users.getProfesional)
app.put('/profesionales/:id',users.updateProfesional)
app.get('/profesional/:id/trabajos',ofertas.getTrabajos)
app.get('/users/:id',users.getUser)
app.put('/users/:id',users.updateUser)
app.post('/login',auth.login)

app.post('/registro',auth.registrar)

app.get('/users/:id/ofertas',ofertas.getOfertas)
app.get('/users/:id/profesionales',users.getHistorialProfesionales)
app.get('/users/:id/ofertas/:idOferta',ofertas.getOferta)
app.post('/users/:id/ofertas',ofertas.createOferta)
app.get('/users/:id/ofertas/:idOferta/user',ofertas.getProfesionalOferta)
app.listen(3030, function () {
    console.log("El servidor express está en el puerto 3030");
});
