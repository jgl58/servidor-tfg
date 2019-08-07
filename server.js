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
      host : 'localhost',
      user : 'tfg',
      password: "tfg",
      database : 'tfg'
    }
  });

var users = require('./users.js')
var auth = require('./auth.js')
var ofertas = require('./ofertas.js')
var buscador = require('./buscador.js')
var horario = require('./horario')
var notificaciones = require('./notificaciones')

app.get('/profesionales/:id',users.getProfesional)
app.put('/profesionales/:id',users.updateProfesional)
app.get('/profesionales/:id/clientes',users.getHistorialClientes)
app.get('/profesional/:id/trabajos',ofertas.getTrabajos)
app.put('/profesional/:id/trabajos/:idTrabajo',ofertas.aceptarOferta)
app.get('/profesionales/:id/horario',horario.getHorario)
app.get('/profesionales/:id/notificaciones',notificaciones.getNotificacionesProfesional)
app.get('/users/:id',users.getUser)
app.put('/users/:id',users.updateUser)

app.get('/ofertas/:id',ofertas.getOfertaSola)

app.post('/login',auth.login)

app.post('/registro',auth.registrar)

app.get('/users/:id/ofertas',ofertas.getOfertas)
app.get('/users/:id/profesionales',users.getHistorialProfesionales)

app.get('/users/:id/ofertas/:idOferta',ofertas.getOferta)
app.put('/users/:id/ofertas/:idOferta',ofertas.updateOferta)
app.post('/users/:id/ofertas',ofertas.createOferta)
app.get('/users/:id/ofertas/:idOferta/user',ofertas.getClienteTrabajo)
app.get('/users/:id/ofertas/:idOferta/profesional',ofertas.getProfesionalOferta)


app.get('/provincias',users.getProvincias)
app.get('/provincias/:id',users.getProvincia)


app.get('/buscador/:idProvincia',buscador.getOfertasProvincias)

app.listen(3030, function () {
    console.log("El servidor express está en el puerto 3030"); 
});
