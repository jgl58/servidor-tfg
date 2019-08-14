var express = require('express');
var app = express();
var io = require('socket.io-client');
var socket = io.connect('http://localhost:4001', {reconnect: true});

var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      password: "tfg",
      user : 'tfg',
      database : 'tfg'
    }
});


exports.notificar = function(idProfesional,tipo,mensaje){

 
    knex('notificaciones').insert([
        { profesional_id: idProfesional,
            tipo: tipo,
            mensaje: mensaje
        }
    ]).then(function (f) {
        socket.emit("notificaciones",{
            profesional_id: idProfesional,
            tipo: tipo,
            mensaje: mensaje
        })
    })
    
}

exports.getNotificacionesProfesional = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('notificaciones').where('profesional_id',id).then(function(data){
            res.status(200).send({
                "notificaciones": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    }
}