//Cargamos el módulo express
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

var users = require('./users.js')
var auth = require('./auth.js')
var ofertas = require('./ofertas.js')

app.get('/',function(pet,res){

    knex.select('*').from('users').then(function(data){
        res.status(200).send({
            "mensaje": data
        }) 
    })
    
})

app.get('/users/:id',users.getUser)

app.post('/login',auth.login)

app.get('/users/:id/ofertas',ofertas.getOfertas)

app.listen(process.env.PORT || 3000, function () {
    console.log("El servidor express está en el puerto 3000");
});
