var express = require('express');
var app = express();
var cors = require('cors')
var bp = require('body-parser');
var jwt = require('jwt-simple');
var secret = '123456'
app.use(cors());
app.use(bp.urlencoded({
    extended: true
}));
app.use(bp.json());
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'tfg',
        password: "tfg",
        database: 'tfg'
    }
});

exports.getUser = function (pet, res) {

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('users','provincias.provincia').innerJoin('provincias','provincias.id','=','users.provincia').where('users.id', id).first().then(function (data) {

            res.status(200).send({
                "user": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Usuario no existente", devMessage: "" })
        });
    }
}

exports.getProfesional = function (pet, res) {

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('profesionales','provincias.provincia').innerJoin('provincias','provincias.id','=','profesionales.provincia').where('profesionales.id', id).first().then(function (data) {

            res.status(200).send({
                "user": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Usuario no existente", devMessage: "" })
        });
    }

}

exports.getHistorialProfesionales = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('profesionales').distinct('profesionales.*').innerJoin('ofertas_usuarios','ofertas_usuarios.profesional_id','=','profesionales.id').where('ofertas_usuarios.user_id',id).then(function(data){
            
            res.status(200).send({
                "profesionales": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Cliente no existente", devMessage: ""})
        });
    }
}

exports.getHistorialClientes = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('users').distinct('users.*').innerJoin('ofertas_usuarios','ofertas_usuarios.user_id','=','users.id').where('ofertas_usuarios.profesional_id',id).then(function(data){
            
            res.status(200).send({
                "clientes": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    }
}

exports.updateUser = function (req, res) {

    var token = req.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        var id = req.params.id
        var user = req.body;
        knex('users').where({id}).update({
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            direccion: user.direccion,
            poblacion: user.poblacion,
            provincia: parseInt(user.provincia),
            pais: user.pais,
            telefono: user.telefono
        }).then(function (count) {
            console.log(count)
            res.sendStatus(204)
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El usuario no existe", devMessage: "" })
        });
        
        
    }
}

exports.updateProfesional = function (req, res) {

  
    var token = req.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        var user = req.body;
        var id = req.params.id
        knex('profesionales')
        .where({id})
        .update({email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            direccion: user.direccion,
            poblacion: user.poblacion,
            provincia: parseInt(user.provincia),
            pais: user.pais,
            telefono: user.telefono
        })
        .then(function (count) {
            //console.log(count)

            res.sendStatus(204)
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El profesional no existe", devMessage: "" })
        });

    }
}

exports.getProvincias = function (pet, res) {

    var token = pet.headers.authorization;
   
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('provincias').select('provincias.*').orderBy('provincia').then(function (data) {
            res.status(200).send({
                "provincias": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Provincias no existentes", devMessage: "" })
        });
    }

}

exports.getProvincia = function (pet, res) {

    var token = pet.headers.authorization;
    var id = pet.params.id;

   
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('provincias').select('provincias.*').where('id',id).first().then(function (data) {
            res.status(200).send({
                "provincia": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Provincia no existente", devMessage: "" })
        });
    }

}