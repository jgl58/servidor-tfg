var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '0.0.0.0',
      user : 'root',
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
        knex('ofertas').where('ofertas.provincia',provincia).then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Provincia no existente", devMessage: ""})
        });
    }
}

