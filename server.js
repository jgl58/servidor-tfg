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

app.get('/profesionales/:id',auth.middleware,users.getProfesional)
app.put('/profesionales/:id',auth.middleware,users.updateProfesional)
app.get('/profesionales/:id/clientes',auth.middleware,users.getHistorialClientes)
app.get('/profesional/:id/trabajos',auth.middleware,ofertas.getTrabajos)
app.put('/profesional/:id/trabajos/:idTrabajo',auth.middleware,ofertas.aceptarOferta)
app.get('/profesionales/:id/horario',auth.middleware,horario.getHorario)
app.get('/profesionales/:id/notificaciones',auth.middleware,notificaciones.getNotificacionesProfesional)
app.get('/users/:id',auth.middleware,users.getUser)
app.put('/users/:id',auth.middleware,users.updateUser)

app.post('/profesionales/:id',auth.middleware,users.valorar)

app.get('/profesionales/:id/valoracion',auth.middleware,users.getValoracion)

app.get('/ofertas/:id',ofertas.getOfertaSola)

app.post('/login',auth.login)
app.post('/registro',auth.registrar)

app.get('/users/:id/ofertas',auth.middleware,ofertas.getOfertas)
app.get('/users/:id/profesionales',auth.middleware,users.getHistorialProfesionales)

app.get('/users/:id/ofertas/:idOferta',auth.middleware,ofertas.getOferta)
app.put('/users/:id/ofertas/:idOferta',auth.middleware,ofertas.updateOferta)
app.delete('/users/:id/ofertas/:idOferta',auth.middleware,ofertas.borrarOferta)

app.post('/users/:id/ofertas',auth.middleware,ofertas.createOferta)
app.get('/users/:id/ofertas/:idOferta/user',auth.middleware,ofertas.getClienteTrabajo)
app.get('/users/:id/ofertas/:idOferta/profesional',auth.middleware,ofertas.getProfesionalOferta)


app.get('/provincias',users.getProvincias)
app.get('/provincias/:id',users.getProvincia)


app.get('/buscador/:idProvincia',auth.middleware,buscador.getOfertasProvincias)

app.listen(3030, function () {
    console.log("El servidor express está en el puerto 3030"); 
});
