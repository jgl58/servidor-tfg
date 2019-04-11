var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        database: 'tfg'
    }
});

exports.getUser = function (pet, res) {

    var id = pet.params.id
    knex('users').where('id', id).first().then(function (data) {

        res.status(200).send({
            "user": data
        })
    }).catch((error) => {
        res.status(404).send({ userMessage: "Usuario no existente", devMessage: "" })
    });

}

exports.updateUser = function (req, res) {

    var user = req.body
    console.log(user)
    console.log(user.id)
    knex('users')
        .where('id', user.id)
        .update({
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            direccion: user.direccion,
            poblacion: user.poblacion,
            provincia: user.provincia,
            pais: user.pais,
            telefono: user.telefono
        }).then(function (count) {
            //console.log(count)
            res.sendStatus(204)
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El Usuario no existe", devMessage: "" })
        });
}