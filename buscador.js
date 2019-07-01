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
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').select('ofertas.*').innerJoin('provincias','provincias.id','=','ofertas.provincia_id')
        .where('ofertas.provincia_id',provincia).then(function(data){
            console.log(data)
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
        });
    }
}

