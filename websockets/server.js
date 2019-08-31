var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      password: "tfg",
      user : 'tfg',
      database : 'tfg'
    }
});

io.on('connect', function (client) {
    
    client.on('room', function(room) {
        console.log("Conectandose a room: "+room)
        client.join(room);
    });

    
    client.on('mensaje', function(data){
        var d = JSON.parse(data)
        console.log(d)
        //io.sockets.in(d.room).emit('mensajeRecibir',d)
        client.broadcast.to(d.room).emit('mensaje',d);
        guardarMensajes(d)
    })

    client.on('notificaciones',function(d){
        
        client.broadcast.to("profesional"+d.profesional_id).emit('n',d);
    })

    client.on('disconnect', function(){})
});


function guardarMensajes(data){
    var ids = data.room.split("-")
    knex('mensajes').insert([
        { 
            user_id: ids[0],
            profesional_id: ids[1],
            mensaje: data.msg,
            autor: data.autor
        }
    ]).then(function (id) {
    }).catch(function(error){})
}
server.listen(4001);
//server.listen(3000);
//app.listen(8080);

/*In the top of your script somewhere, setup an object to hold your users' information.

var connectedUsers = {};

In your .on('connection') function, add that socket to your new object. 
connectedUsers[USER_NAME_HERE] = socket; Then you can easily retrieve it later. 
connectedUsers[USER_NAME_HERE].emit('something', 'something');*/