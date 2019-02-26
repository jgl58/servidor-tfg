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
      host : '127.0.0.1',
      user : 'root',
      database : 'tfg'
    }
});


exports.login = function(req,res){
    
    var nick = req.body.nick;
    var pass = req.body.pass;
    if(nick != "" && pass != ""){
        knex('users').where('email',nick).where('password',pass).count('id as c').then(function(total){
            if(total[0].c == 1){
                res.status(200).send({
                    "mensaje": "login ok"
                }) 
            }else{
                res.status(401).send({
                    "mensaje": "login bad"
                }) 
    }
        })
    }
}

function existe(email, callback){
    knex('users').count('id as c').where('email',email).then(function(total){
        
        if(total[0].c == 1){
            callback(true)
        }else{
            callback(false)
        }
    })
}

exports.registrar = function(req,res){
    
    var email = req.body.email;
    var pass = req.body.pass;
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    console.log(req.body)
    existe(email, function(exists){
        //console.log(exists)
        if(!exists){
            var data = {
                email: email,
                pass: pass,
                nombre: nombre,
                apellidos: apellidos
            }
            
            knex('users').insert([
                {email: data.email, password: data.pass, nombre: nombre, apellidos: apellidos}
            ]).then(function(f){
                knex('users').where('email',data.email).first().then(function(query){
                    res.setHeader('Location','/users/'+query.id);
                    res.sendStatus(201);
                })
            }) 
        }else{
            res.status(401).send({userMessage: "Usuario existente, prueba con otro nick", devMessage: ""})
        }
}) 
}