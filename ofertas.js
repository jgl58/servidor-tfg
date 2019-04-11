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



exports.getOfertas = function(pet,res){

    var id = pet.params.id
    knex('ofertas').innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').where('ofertas_usuarios.user_id',id).then(function(data){
        
        res.status(200).send({
            "ofertas": data
        }) 
    }).catch((error) => {
        res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
    });
}

exports.createOferta = function (req, res) {

    var oferta = req.body
    knex('ofertas').insert([
        { titulo: oferta.titulo, descripcion: oferta.descripcion}
    ]).then(function (id) {
        knex('ofertas_usuarios').insert([
            { oferta_id:id, user_id: req.params.id}
        ]).then(function (id) {
            res.sendStatus(201);
        }).catch(function(error){
            res.sendStatus(401);
        })
    }).catch(function(error){
        res.sendStatus(401);
    })
}