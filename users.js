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
        knex('users','provincias.provincia').select("users.*").innerJoin('provincias','provincias.id','=','users.provincia').where('users.id', id).first().then(function (data) {

            res.status(200).send({
                "user": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Usuario no existente", devMessage: "" })
        });
    
}

exports.getProfesional = function (pet, res) {

    var id = pet.params.id
        knex('profesionales','provincias.provincia').select("profesionales.*").innerJoin('provincias','provincias.id','=','profesionales.provincia').where('profesionales.id', id).first().then(function (data) {

            res.status(200).send({
                "user": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Usuario no existente", devMessage: "" })
        });
    

}

exports.getHistorialProfesionales = function(pet,res){

    var id = pet.params.id
        knex('profesionales').distinct('profesionales.*').innerJoin('ofertas_usuarios','ofertas_usuarios.profesional_id','=','profesionales.id').where('ofertas_usuarios.user_id',id).then(function(data){
            
            res.status(200).send({
                "profesionales": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Cliente no existente", devMessage: ""})
        });
    
}

exports.getHistorialClientes = function(pet,res){

    var id = pet.params.id
        knex('users').distinct('users.*').innerJoin('ofertas_usuarios','ofertas_usuarios.user_id','=','users.id').where('ofertas_usuarios.profesional_id',id).then(function(data){
            
            res.status(200).send({
                "clientes": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    
}

exports.updateUser = function (req, res) {

        var id = req.params.id
        var user = req.body;
        console.log("Actualizando user")
        knex('users').where({id}).update({
            email: user.email,
            nombre: user.nombre,
            password: user.password,
            apellidos: user.apellidos,
            direccion: user.direccion,
            poblacion: user.poblacion,
            provincia: parseInt(user.provincia),
            pais: user.pais,
            telefono: user.telefono
        }).then(function (count) {

            var payload = {
                idUser: user.id,
                nick: user.email, 
                pass: user.password,
                provincia: user.provincia,
                profesional: false
            } 
            var token = jwt.encode(payload,secret);
            res.setHeader('Authorization','Bearer',token);
            res.status(200).send({"token": token})
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El usuario no existe", devMessage: "" })
        });

}

exports.updateProfesional = function (req, res) {

        var user = req.body;
        var id = req.params.id
        console.log("Actualizando profesional")
        knex('profesionales')
        .where({id})
        .update({email: user.email,
            nombre: user.nombre,
            password: user.password,
            apellidos: user.apellidos,
            direccion: user.direccion,
            poblacion: user.poblacion,
            provincia: parseInt(user.provincia),
            pais: user.pais,
            telefono: user.telefono
        })
        .then(function (count) {
            var payload = {
                idUser: user.id,
                nick: user.email, 
                pass: user.password,
                provincia: user.provincia,
                profesional: true
            } 
            var token = jwt.encode(payload,secret);
            res.setHeader('Authorization','Bearer',token);
            res.status(200).send({"token": token})
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El profesional no existe", devMessage: "" })
        });

    
}

exports.getProvincias = function (pet, res) {

        knex('provincias').select('provincias.*').orderBy('provincia').then(function (data) {
            res.status(200).send({
                "provincias": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Provincias no existentes", devMessage: "" })
        });
    

}

exports.getProvincia = function (pet, res) {

    var id = pet.params.id;

        knex('provincias').select('provincias.*').where('id',id).first().then(function (data) {
            res.status(200).send({
                "provincia": data
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Provincia no existente", devMessage: "" })
        });
    

}


exports.valorar = function (req, res) {
    var valoracion = req.body
        knex('valoraciones').insert([
            { profesional_id: valoracion.id,
                valoracion: valoracion.valoracion
            }
        ]).then(function (id) {
            res.sendStatus(201);
        }).catch(function(error){
            
            res.sendStatus(401);
        })
    
}

exports.getValoracion = function (req, res) {
    var id = req.params.id
        knex('valoraciones').where('profesional_id',id).then(function (data) {
            let sum = 0
            for(let i=0;i<data.length;i++){
                sum += data[i].valoracion
            }
            let media = sum / data.length
            res.status(200).send({
                "valoracion": media
            })
        }).catch((error) => {
            res.status(404).send({ userMessage: "Profesional no existente", devMessage: "" })
        });
    
}