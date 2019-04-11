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
      host : '127.0.0.1',
      user : 'root',
      database : 'tfg'
    }
  });

var users = require('./users.js')
var auth = require('./auth.js')
var ofertas = require('./ofertas.js')

app.get('/users/:id',users.getUser)
app.put('/users/:id',users.updateUser)
app.post('/login',auth.login)

app.post('/registro',auth.registrar)

app.get('/users/:id/ofertas',ofertas.getOfertas)
app.get('/users/:id/ofertas/:idOferta',ofertas.getOferta)
app.post('/users/:id/ofertas',ofertas.createOferta)
app.get('/users/:id/ofertas/:idOferta/user',ofertas.getProfesionalOferta)
app.listen(process.env.PORT || 3030, function () {
    console.log("El servidor express está en el puerto 3030");
});
