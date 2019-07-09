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
        if(data.length == 0){
            callback(true)
        }else{
            var disponible = true
            for(let i=0;i<data.length;i++){
                if(compararFechas(data[i].dia,fecha)){ 
                    disponible =false
                    break
                }
            }

            callback(disponible)
        }      
        
    })
}

function compararFechas(fecha1,fecha2){
    var d1 = new Date(fecha1)
    var d2 = new Date(fecha2)
    if(d1.getHours() == d2.getHours() && d1.getMinutes() == d2.getMinutes()){
        console.log("Ya existe una fecha en el horario")
        return true
    }else{
        return false
    }
}