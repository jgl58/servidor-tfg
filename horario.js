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
        knex('horario').where('profesional',id).then(function(data){
            
            res.status(200).send({
                "horario": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    
}

exports.insertarHorario = function(profesional,dia,trabajo,callback){

    knex('horario').insert([
        {profesional: profesional, dia: dia, trabajo:trabajo}
    ]).then(function (id) {
        callback(true)
    })
    
}

exports.comprobarHorario = function(id,fecha,duracion,callback){
    knex('horario').where('profesional',id).then(function(data){
        
        if(data.length == 0){
            callback(true)
        }else{
            var disponible = true
            for(let i=0;i<data.length;i++){
                let f1 = new Date(data[i].dia)
                f1.setHours(f1.getHours() + duracion)
                console.log(compararFechas(fecha,f1))
                if(!compararFechas(fecha,f1)){ 
                    disponible =false
                }
            }
            
            callback(disponible)
        }      
        
    })
}

function compararFechas(fechaInueva,fechaFantigua){
    var d1 = new Date(fechaInueva)
    var d2 = new Date(fechaFantigua)
    console.log(d1)
    console.log(d2)
    if(d1 > d2){
        console.log("lhjasdgf")
        return true
    }else{
        console.log("Fechas solapadas")
        return false
    }
}