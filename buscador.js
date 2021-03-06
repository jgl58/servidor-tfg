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
    if(pet.query.title != undefined){
        knex('ofertas').select('ofertas.*')
        .innerJoin('provincias','provincias.id','=','ofertas.provincia_id')
        .where('ofertas.provincia_id',provincia)
        .where('ofertas.estado',0)
        .where('ofertas.titulo','like','%'+pet.query.title+'%')
        .orderBy('ofertas.created_at','desc').then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
        });
    }else
    {
        knex('ofertas').select('ofertas.*').innerJoin('provincias','provincias.id','=','ofertas.provincia_id')
        .where('ofertas.provincia_id',provincia)
        .where('ofertas.estado',0)
        .orderBy('ofertas.created_at','desc').then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
        });
    }

    
}


