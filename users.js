var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      database : 'tfg'
    }
});

exports.getUser = function(pet,res){

    var id = pet.params.id
    knex('users').where('id',id).first().then(function(data){
        
        res.status(200).send({
            "user": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
    });
    
}