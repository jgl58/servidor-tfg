var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      database : 'tfg'
    }
});

exports.getOfertas = function(pet,res){

    var id = pet.params.id
    knex('ofertas').select('ofertas.*').
    innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').
    where('ofertas_usuarios.user_id',id)
    .then(function(data){
        
        res.status(200).send({
            "ofertas": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
    });
}

exports.getTrabajosProvincia = function(pet,res){

    var id = pet.params.id
    knex('ofertas').select('ofertas.*').
    innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').
    where('ofertas_usuarios.profesional_id',id).
    where('ofertas.provincia',pet.params.provincia)
    .then(function(data){
        
        res.status(200).send({
            "ofertas": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
    });
}

exports.getTrabajos = function(pet,res){

    var id = pet.params.id
    knex('ofertas').select('ofertas.*').innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').where('ofertas_usuarios.profesional_id',id).then(function(data){
        
        res.status(200).send({
            "ofertas": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
    });
}




exports.getProfesionalOferta = function(pet,res){

    var id = pet.params.idOferta
    knex('ofertas_usuarios').first('profesionales.*').innerJoin('profesionales','ofertas_usuarios.profesional_id','=','profesionales.id').where('ofertas_usuarios.oferta_id',id).then(function(data){
        
        res.status(200).send({
            "profesional": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
    });
}


exports.getOferta = function(pet,res){

    var id = pet.params.idOferta
    knex('ofertas').where('id',id).first().then(function(data){      
        res.status(200).send({
            "oferta": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
    });
}


exports.createOferta = function (req, res) {

    var oferta = req.body
    console.log(oferta)
    knex('ofertas').insert([
        { titulo: oferta.titulo, user_id:req.params.id, descripcion: oferta.descripcion, provincia: oferta.provincia, estado: false}
    ]).then(function (id) {
        knex('ofertas_usuarios').insert([
            { oferta_id:id, user_id: req.params.id}
        ]).then(function (id) {
            res.sendStatus(201);
        }).catch(function(error){
            
            res.sendStatus(401);
        })
    }).catch(function(error){
        
        res.sendStatus(401);
    })
}