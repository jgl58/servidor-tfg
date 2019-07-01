var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
      user : 'tfg',
      password: "tfg",
      database : 'tfg'
    }
});

exports.getOfertas = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
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
}

exports.getTrabajosProvincia = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
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
}

exports.getTrabajos = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').select('ofertas.*').innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').where('ofertas_usuarios.profesional_id',id).then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
        });
    }
}

exports.aceptarOferta = function(req,res){

    var id = req.params.id
    var idTrabajo = req.params.idTrabajo;
    var token = req.headers.authorization;

    console.log("Id: "+id + " idTrabajo:"+idTrabajo)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{


        knex('ofertas_usuarios')
        .where('id',idTrabajo)
        .update({
            profesional_id: id
        }).then(function (count) {
            console.log(count)
           knex('ofertas').where("id",idTrabajo).update({
                estado: true
            }).then(function (count) {

                if(count>0){
                    res.sendStatus(204)
                }else{
                    res.sendStatus(404)
                }
            }).catch(function (err) {
                res.status(404).send({ userMessage: "La oferta no existe", devMessage: "" })
            });
            
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El profesional no existe", devMessage: "" })
        });
        
        
        
    }
}


exports.getClienteTrabajo = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas_usuarios').first('users.*').innerJoin('users','ofertas_usuarios.user_id','=','users.id').where('ofertas_usuarios.oferta_id',id).then(function(data){
            
            res.status(200).send({
                "cliente": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Cliente no existente", devMessage: ""})
        });
    }
}


exports.getProfesionalOferta = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas_usuarios').first('profesionales.*').innerJoin('profesionales','ofertas_usuarios.profesional_id','=','profesionales.id').where('ofertas_usuarios.oferta_id',id).then(function(data){
            
            res.status(200).send({
                "profesional": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    }
}


exports.getOferta = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').where('id',id).first().then(function(data){      
            res.status(200).send({
                "oferta": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
        });
    }
}


exports.createOferta = function (req, res) {
    var token = req.headers.authorization;
    var oferta = req.body
    console.log(oferta)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        
        knex('ofertas').insert([
            { titulo: oferta.titulo, descripcion: oferta.descripcion, provincia_id: oferta.provincia, estado: false}
        ]).then(function (id) {
            knex('ofertas_usuarios').insert([
                {id: id, oferta_id:id, user_id: req.params.id, profesional_id: 0}
            ]).then(function (id) {
                res.sendStatus(201);
            }).catch(function(error){
                res.sendStatus(401);
            })
        }).catch(function(error){
            
            res.sendStatus(401);
        })
    }
}