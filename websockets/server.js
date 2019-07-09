var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

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
    })
    client.on('disconnect', function(){})
});

server.listen(4001);
//server.listen(3000);
//app.listen(8080);

/*In the top of your script somewhere, setup an object to hold your users' information.

var connectedUsers = {};

In your .on('connection') function, add that socket to your new object. 
connectedUsers[USER_NAME_HERE] = socket; Then you can easily retrieve it later. 
connectedUsers[USER_NAME_HERE].emit('something', 'something');*/