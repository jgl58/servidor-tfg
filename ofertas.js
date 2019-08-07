var express = require('express');
var app = express();
var bp = require('body-parser');
var horario = require('./horario')
var nodemailer = require('nodemailer');
var notificacion = require('./notificaciones')
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

exports.getOfertaSola = function(pet,res){

  var id = pet.params.id
 // var token = pet.headers.authorization;
 //console.log("Token: "+token)
  /*if(!token){
      res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
  }else{*/
      knex('ofertas').select('ofertas.*').
      where('id',id).first()
      .then(function(data){
          
          res.status(200).send({
              "oferta": data
          }) 
      }).catch((error) => {
          res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
      });
  //}
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
      /*  knex('ofertas').where('id',id).first().then(function(data){      
            res.status(200).send({
                "oferta": data
            }) 
        }).catch((error) => {
            res.status(404).send({userMessage: "Oferta no existente", devMessage: ""})
        });*/
        knex('ofertas').first('ofertas.*','ofertas_usuarios.user_id').
        innerJoin('ofertas_usuarios','ofertas_usuarios.oferta_id','=','ofertas.id').
        where('ofertas.id',id)
        .then(function(data){
            
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

exports.updateOferta = function (req, res) {

  var token = req.headers.authorization;
 //console.log("Token: "+token)
  if(!token){
      res.status(401).send({userMessage: "Se necesita token", devMessage: ""})
  }else{
      var id = req.params.idOferta
      var oferta = req.body;
      console.log(oferta)
      knex('ofertas').where({id}).update({ 
        titulo: oferta.titulo, 
        descripcion: oferta.descripcion, 
        provincia_id: oferta.provincia
      }).then(function (count) {
          console.log(count)
          res.sendStatus(204)
      }).catch(function (err) {
          res.status(404).send({ userMessage: "La oferta no existe", devMessage: "" })
      });
      
      
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
    

    


    knex('profesionales','provincias.provincia').innerJoin('provincias','provincias.id','=','profesionales.provincia').where('profesionales.id', idUsuario).first("profesionales.*").then(function (profesional) {
        console.log(profesional)
        knex('ofertas').where('id',idOferta).first().then(function(oferta){  
            var html = `<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Simple Transactional Email</title>
        <style>
          img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
          }
          body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
          }
          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top; 
          }
          .body {
            background-color: #f6f6f6;
            width: 100%; 
          }
          .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
          }
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
          }
          .main {
            background: #ffffff;
            border-radius: 3px;
            width: 100%; 
          }
          .wrapper {
            box-sizing: border-box;
            padding: 20px; 
          }
          .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
          }
          .footer {
            clear: both;
            margin-top: 10px;
            text-align: center;
            width: 100%; 
          }
            .footer td,
            .footer p,
            .footer span,
            .footer a {
              color: #999999;
              font-size: 12px;
              text-align: center; 
          }
          h1,
          h2,
          h3,
          h4 {
            color: #000000;
            font-family: sans-serif;
            font-weight: 400;
            line-height: 1.4;
            margin: 0;
            margin-bottom: 30px; 
          }
          h1 {
            font-size: 35px;
            font-weight: 300;
            text-align: center;
            text-transform: capitalize; 
          }
          p,
          ul,
          ol {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: normal;
            margin: 0;
            margin-bottom: 15px; 
          }
            p li,
            ul li,
            ol li {
              list-style-position: inside;
              margin-left: 5px; 
          }
          a {
            color: #3498db;
            text-decoration: underline; 
          }
          .btn {
            box-sizing: border-box;
            width: 100%; }
            .btn > tbody > tr > td {
              padding-bottom: 15px; }
            .btn table {
              width: auto; 
          }
            .btn table td {
              background-color: #ffffff;
              border-radius: 5px;
              text-align: center; 
          }
            .btn a {
              background-color: #ffffff;
              border: solid 1px #3498db;
              border-radius: 5px;
              box-sizing: border-box;
              color: #3498db;
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              margin: 0;
              padding: 12px 25px;
              text-decoration: none;
              text-transform: capitalize; 
          }
          .btn-primary table td {
            background-color: #3498db; 
          }
          .btn-primary a {
            background-color: #3498db;
            border-color: #3498db;
            color: #ffffff; 
          }
          .last {
            margin-bottom: 0; 
          }
          .first {
            margin-top: 0; 
          }
          .align-center {
            text-align: center; 
          }
          .align-right {
            text-align: right; 
          }
          .align-left {
            text-align: left; 
          }
          .clear {
            clear: both; 
          }
          .mt0 {
            margin-top: 0; 
          }
          .mb0 {
            margin-bottom: 0; 
          }
          .preheader {
            color: transparent;
            display: none;
            height: 0;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            mso-hide: all;
            visibility: hidden;
            width: 0; 
          }
          .powered-by a {
            text-decoration: none; 
          }
          hr {
            border: 0;
            border-bottom: 1px solid #f6f6f6;
            margin: 20px 0; 
          }
          @media only screen and (max-width: 620px) {
            table[class=body] h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important; 
            }
            table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
              font-size: 16px !important; 
            }
            table[class=body] .wrapper,
            table[class=body] .article {
              padding: 10px !important; 
            }
            table[class=body] .content {
              padding: 0 !important; 
            }
            table[class=body] .container {
              padding: 0 !important;
              width: 100% !important; 
            }
            table[class=body] .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important; 
            }
            table[class=body] .btn table {
              width: 100% !important; 
            }
            table[class=body] .btn a {
              width: 100% !important; 
            }
            table[class=body] .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important; 
            }
          }
          @media all {
            .ExternalClass {
              width: 100%; 
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%; 
            }
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important; 
            }
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
            .btn-primary table td:hover {
              background-color: #34495e !important; 
            }
            .btn-primary a:hover {
              background-color: #34495e !important;
              border-color: #34495e !important; 
            } 
          }
        </style>
      </head>
      <body class="">
        <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">

                <table role="presentation" class="main">

                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>`+"Hola "+profesional.nombre+`</p>
                            <p>Te hemos seleccionado esta oferta de trabajo. Por favor PULSA EN EL BOTÓN PARA ACEPTAR LA OFERTA</p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                              <tbody>
                                <tr>
                                  <td align="left">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                      <tbody>
                                        <tr>
                                          <td> <a href="http://localhost:3000/aceptar?id=`+profesional.id+`&of=`+oferta.id+`" target="_blank">Call To Action</a> </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p>`+oferta.titulo+`</p>
                            <p>`+oferta.descripcion+`</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
    
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>
                        <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                      </td>
                    </tr>
                    <tr>
                      <td class="content-block powered-by">
                        Powered by <a href="http://htmlemail.io">HTMLemail</a>.
                      </td>
                    </tr>
                  </table>
                </div>
    
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    
    `
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'jonaygilabert@gmail.com',
                    pass: 'jonay2015'
                }
            });
            var mailOptions = {
                from: 'jonaygilabert@gmail.com',
                to: profesional.email,
                subject: 'Notificiación de oferta asignada',
                html: html
            };
            notificacion.notificar(profesional.id,"oferta",oferta.id)

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
                });
            
        }).catch((error) => {});
    
    }).catch((error) => {});

    

    

}