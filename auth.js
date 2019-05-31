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
        host: '127.0.0.1',
        user: 'root',
        database: 'tfg'
    }
});


exports.login = function (req, res) {

    var isProfesional = req.body.profesional
    var email = req.body.email;
    var pass = req.body.pass;
    if (email != "" && pass != "") {

        if (isProfesional) {
            knex('profesionales').where('email', email).where('password', pass).count('email as c').then(function (total) {
                if (total[0].c == 1) {
                    knex('profesionales').where('email', email).first().then(function (query) {
                        res.status(200).send({
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
                        res.status(200).send({
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
    console.log(req.body)
    existe(isProfesional, email, function (exists) {
        //console.log(exists)
        if (!exists) {
            var data = {
                email: email,
                pass: pass,
                nombre: nombre,
                apellidos: apellidos
            }

            if(isProfesional){
                console.log("Registrando profesional")
                knex('profesionales').insert([
                    { email: data.email, password: data.pass, nombre: nombre, apellidos: apellidos }
                ]).then(function (f) {
                    knex('profesionales').where('email', data.email).first().then(function (query) {
                        res.sendStatus(201);
                    })
                })
            }
            else{
                console.log("Registrando cliente")
                knex('users').insert([
                    { email: data.email, password: data.pass, nombre: nombre, apellidos: apellidos }
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