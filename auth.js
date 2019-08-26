var express = require('express');
var cors = require('cors')
var jwt = require('jwt-simple');
var secret = '123456'
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
        host: '0.0.0.0',
        user: 'tfg',
        password: "tfg",
        database: 'tfg'
    }
});


exports.middleware = function(pet,res,next){
    var token = pet.headers.authorization;
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        var token = jwt.decode(token,secret)
        comprobarToken(token.profesional,token.nick,token.pass,(result)=>{
            if(result){
                next()
            }else{
                res.status(401).send({userMessage: "Token no valido", devMessage: ""})
            }
        })
        
    }
}

function comprobarToken(isProfesional, email,pass, callback) {

    if(isProfesional){
        knex('profesionales').count('id as c').where('email', email).where('password',pass).then(function (total) {

            if (total[0].c == 1) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }else{
        knex('users').count('id as c').where('email', email).where('password',pass).then(function (total) {

            if (total[0].c == 1) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }
}

function loginToken(token,res){
    console.log("Login con token")
    var t = jwt.decode(token,secret)
    console.log(t)
    completarLogin(t.profesional,t.nick,t.pass,res)
}

function completarLogin(isProfesional,email,pass,res){
    if (isProfesional) {
        knex('profesionales').where('email', email).where('password',pass).count('email as c').then(function (total) {
            if (total[0].c == 1) {
               
                knex('profesionales').where('email', email).first().then(function (query) {
                    var payload = {
                        idUser: query.id,
                        nick: query.email, 
                        pass: query.password,
                        provincia: query.provincia,
                        profesional: true
                    } 
                    var token = jwt.encode(payload,secret);
                    res.setHeader('Authorization','Bearer',token);
                    res.status(200).send({
                        "token": token,
                        "idUser": query.id,
                        "nombre": query.nombre,
                        "provincia": query.provincia,
                        "mensaje": "login ok"
                    })
                })
                
            } else {
                
                res.status(401).send({
                    "mensaje": "login bad"
                })
            }
        })
    } else {
        knex('users').where('email', email).where('password', pass).count('email as c').then(function (total) {
            if (total[0].c == 1) {
                knex('users').where('email', email).first().then(function (query) {
                    var payload = {
                        idUser: query.id,
                        nick: query.email,
                        pass: query.password,
                        provincia: query.provincia,
                        profesional: false
                    } 
                    var token = jwt.encode(payload,secret);
                    res.setHeader('Authorization','Bearer',token);
                    res.status(200).send({
                        "token": token,
                        "idUser": query.id,
                        "nombre": query.nombre,
                        "provincia": query.provincia,
                        "mensaje": "login ok"
                    })
                })
            } else {
                res.status(401).send({
                    "mensaje": "login bad"
                })
            }
        })
    }
}


exports.login = function (req, res) {

    var token = req.body.token
    var isProfesional = req.body.profesional
    var email = req.body.email;
    var pass = req.body.pass;

    if(token != undefined){
        loginToken(token,res)
    }else if(email != "" && pass != ""){
        completarLogin(isProfesional,email,pass,res)  
    }
}

function existe(isProfesional, email, callback) {

    if(isProfesional){
        knex('profesionales').count('id as c').where('email', email).then(function (total) {

            if (total[0].c == 1) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }else{
        knex('users').count('id as c').where('email', email).then(function (total) {

            if (total[0].c == 1) {
                callback(true)
            } else {
                callback(false)
            }
        })
    }

    
}

exports.registrar = function (req, res) {

    var isProfesional = req.body.isProfesional;
    var email = req.body.email;
    var pass = req.body.pass;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var poblacion = req.body.poblacion;
    var provincia = req.body.provincia;
    var direccion = req.body.direccion;
    var pais = req.body.pais;
    existe(isProfesional, email, function (exists) {
        if (!exists) {
            var data = {
                email: email,
                pass: pass,
                nombre: nombre,
                apellidos: apellidos,
                poblacion: poblacion,
                provincia: provincia,
                direccion: direccion,
                pais: pais
            }

            if(isProfesional){
                knex('profesionales').insert([
                    { email: data.email, password: data.pass, nombre: data.nombre, apellidos: data.apellidos, poblacion: data.poblacion, provincia: data.provincia,
                        direccion: data.direccion, pais: data.pais }
                ]).then(function (f) {
                    knex('profesionales').where('email', data.email).first().then(function (query) {
                        res.sendStatus(201);
                    })
                })
            }
            else{
                knex('users').insert([
                    { email: data.email, password: data.pass, nombre: data.nombre, apellidos: data.apellidos, poblacion: data.poblacion, provincia: data.provincia,
                        direccion: data.direccion, pais: data.pais }
                ]).then(function (f) {
                    knex('users').where('email', data.email).first().then(function (query) {
                        res.sendStatus(201);
                    })
                })
            }
            
        } else {
            res.status(401).send({ userMessage: "Usuario existente, prueba con otro email", devMessage: "" })
        }
    })
}