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
        knex('users').where('id', id).first().then(function (data) {

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
        knex('profesionales').where('id', id).first().then(function (data) {

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