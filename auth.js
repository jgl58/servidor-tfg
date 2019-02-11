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


exports.login = function(req,res){
    
    var email = req.body.email;
    var pass = req.body.pass;
    
    if(email != "" && pass != ""){
        knex('users').where('email',email).where('password',pass).count('id as c').then(function(total){
            if(total[0].c == 1){
                res.status(200).send({
                    "mensaje": "login ok"
                }) 
            }else{
                res.status(401).send({
                    "mensaje": "login bad"
                }) 
    }
        })
    }
}