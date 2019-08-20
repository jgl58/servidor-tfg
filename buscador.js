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


exports.getOfertasProvincias = function(pet,res){

    var provincia = pet.params.idProvincia
    var title = pet.query.title
    console.log(title)

    if(title == undefined){
        knex('ofertas').select('ofertas.*').innerJoin('provincias','provincias.id','=','ofertas.provincia_id')
        .where('ofertas.provincia_id',provincia).then(function(data){
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
        });
    }else{
        getOfertasProvinciasTitulo(pet,res)
    }
        
    
}


function getOfertasProvinciasTitulo(pet,res){

    var provincia = pet.params.idProvincia
    var title = pet.query.title
    knex('ofertas').select('ofertas.*').innerJoin('provincias','provincias.id','=','ofertas.provincia_id')
    .where('ofertas.titulo','like','%'+title+'%')
    .where('ofertas.provincia_id',provincia).then(function(data){
        res.status(200).send({
            "ofertas": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
    });
    
}



