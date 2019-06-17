var express = require('express');
var app = express();
var bp = require('body-parser');
var jwt = require('jwt-simple');
var secret = '123456'
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
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
        var user = req.body
        console.log(user)
        console.log(user.id)
        knex('users')
            .where('id', user.id)
            .update({
                email: user.email,
                nombre: user.nombre,
                apellidos: user.apellidos,
                direccion: user.direccion,
                poblacion: user.poblacion,
                provincia: user.provincia,
                pais: user.pais,
                telefono: user.telefono
            }).then(function (count) {
                //console.log(count)
                res.sendStatus(204)
            }).catch(function (err) {
                res.status(404).send({ userMessage: "El Usuario no existe", devMessage: "" })
            });
    }
}

exports.updateProfesional = function (req, res) {

    var user = req.body
    console.log(user)
    console.log(user.id)
    var token = req.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('profesionales')
            .where('id', user.id)
            .update({
                email: user.email,
                nombre: user.nombre,
                apellidos: user.apellidos,
                direccion: user.direccion,
                poblacion: user.poblacion,
                provincia: user.provincia,
                pais: user.pais,
                telefono: user.telefono
            }).then(function (count) {
                //console.log(count)
                res.sendStatus(204)
            }).catch(function (err) {
                res.status(404).send({ userMessage: "El Usuario no existe", devMessage: "" })
            });
    }
}

exports.getProvincias = function (pet, res) {

    var token = pet.headers.authorization;
   
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('provincias').select('provincias.*').then(function (data) {
            res.status(200).send({
                "provincias": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Provincias no existentes", devMessage: "" })
        });
    }

}