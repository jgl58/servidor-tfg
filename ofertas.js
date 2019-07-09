var express = require('express');
var app = express();
var bp = require('body-parser');
var horario = require('./horario')
app.use(bp.urlencoded({
    extended: true
}));
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
      user : 'tfg',
      password: "tfg",
      database : 'tfg'
    }
});

exports.getOfertas = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').select('ofertas.*').
        innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').
        where('ofertas_usuarios.user_id',id)
        .then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
        });
    }
}

exports.getTrabajosProvincia = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').select('ofertas.*').
        innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').
        where('ofertas_usuarios.profesional_id',id).
        where('ofertas.provincia',pet.params.provincia)
        .then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
        });
    }
}

exports.getTrabajos = function(pet,res){

    var id = pet.params.id
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').select('ofertas.*').innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').where('ofertas_usuarios.profesional_id',id).then(function(data){
            
            res.status(200).send({
                "ofertas": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Usuario no existente", devMessage: ""})
        });
    }
}




function actualizarOfertasUsuario(idTrabajo,id,fecha,callback){
    knex('ofertas_usuarios')
    .where('id',idTrabajo)
    .update({
        profesional_id: id
    }).then(function (count) {
       knex('ofertas').where("id",idTrabajo).update({
            estado: true
        }).then(function (count) {
            horario.insertarHorario(id,fecha,idTrabajo,(insertado) => {
                console.log("HOLA")
                if(insertado){
                    callback(true)
                }else{
                    callback(false)
                }
            })
        })                    
    }).catch(function (err) {
        callback(false)
    });
}

exports.aceptarOferta = function(req,res){

    var id = req.params.id
    var idTrabajo = req.params.idTrabajo;
    var token = req.headers.authorization;

    
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').where('id',idTrabajo).first()
        .then(function(data){
            console.log(data)
             horario.comprobarHorario(id,data.fecha,(disponible) => {
                console.log(disponible)
                if(disponible == true){ 
                    actualizarOfertasUsuario(idTrabajo,id,data.fecha,(actualizado)=>{
                        if(actualizado == true){
                            res.sendStatus(204)
                        }else{
                            res.status(404).send({ userMessage: "Problema al aceptar", devMessage: "" })
                        }
                    })
                }else{
                    res.sendStatus(406)
                }
             })
             
        }).catch(function (err) {
            res.status(404).send({ userMessage: "El trabajo no existe", devMessage: "" })
        });
    }
}


exports.getClienteTrabajo = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas_usuarios').first('users.*').innerJoin('users','ofertas_usuarios.user_id','=','users.id').where('ofertas_usuarios.oferta_id',id).then(function(data){
            
            res.status(200).send({
                "cliente": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Cliente no existente", devMessage: ""})
        });
    }
}


exports.getProfesionalOferta = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas_usuarios').first('profesionales.*').innerJoin('profesionales','ofertas_usuarios.profesional_id','=','profesionales.id').where('ofertas_usuarios.oferta_id',id).then(function(data){
            
            res.status(200).send({
                "profesional": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Profesional no existente", devMessage: ""})
        });
    }
}


exports.getOferta = function(pet,res){

    var id = pet.params.idOferta
    var token = pet.headers.authorization;
   //console.log("Token: "+token)
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').where('id',id).first().then(function(data){      
            res.status(200).send({
                "oferta": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
        });
    }
}


exports.createOferta = function (req, res) {
    var token = req.headers.authorization;
    var oferta = req.body
    if(!token){
        res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
    }else{
        knex('ofertas').insert([
            { titulo: oferta.titulo, descripcion: oferta.descripcion, provincia_id: oferta.provincia, estado: false, fecha: oferta.fecha, duracion: oferta.duracion}
        ]).then(function (id) {
            var idOferta = id;
            knex('ofertas_usuarios').insert([
                {id: id, oferta_id:id, user_id: req.params.id, profesional_id: 0}
            ]).then(function (id) {
                res.sendStatus(201);
                autoseleccionar(idOferta)
                //aqui hay que llamar al autoseleccionar
            }).catch(function(error){
                res.sendStatus(401);
            })
        }).catch(function(error){
            
            res.sendStatus(401);
        })
    }
}


function autoseleccionar (id){
    
    knex('ofertas').where('id',id).first().then(function(oferta){      

       knex('profesionales').where('provincia',oferta.provincia_id).then(function(profesionales){   
            console.log(profesionales)
            if(profesionales.length == 1){
                horario.comprobarHorario(profesionales[0].id,oferta.fecha, function(libre){
                    if(libre == true){
                        notificar(profesionales[0].id,id)
                        console.log("Solo hay uno")
                    }
                })           
            }else if(profesionales.length > 1){
                var disponibles = []
                console.log("Filtrando profesionales disponibles")

                for(let j=0; j<profesionales.length;j++){
                    horario.comprobarHorario(profesionales[j].id,oferta.fecha, function(libre){
                        if(libre == true){
                            disponibles.push(profesionales[j])
                        }
                    })
                }
                 
                console.log("Hay mas de uno")
                console.log(disponibles)
            }else{
                console.log("No hay usuarios")
            }
        }).catch((error) => {
            res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
        });

    }).catch((error) => {
    });
    
}

function notificar(idUsuario, idOferta){

}