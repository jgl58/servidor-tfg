var express = require('express');
var app = express();
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


exports.getHorario = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('horario').where('profesional',id).then(function(data){
            console.log(data)
            res.status(200).send({
                "horario": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    }
}

exports.insertarHorario = function(profesional,dia,trabajo,callback){

    knex('horario').insert([
        {profesional: profesional, dia: dia, trabajo:trabajo}
    ]).then(function (id) {
        callback(true)
    })
    
}

exports.comprobarHorario = function(id,fecha,callback){
    console.log(id+" "+fecha)
    knex('horario').where('profesional',id).then(function(data){
        console.log(data)
        if(data.length == 0){
            callback(true)
        }else{
            data.forEach(element => {
                if(element.dia == fecha){ 
                    callback(false)
                }
            });
        }        
        callback(true)
    })
}