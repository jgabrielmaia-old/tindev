const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const httpServer = express();
const server = require('http').Server(httpServer);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    console.log('Nova conexão', socket.id);

    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;

    console.log("User: " + user, "Socket: " + socket.id);
 
});

mongoose.connect('mongodb+srv://jgabrielmaia:omnistack32@cluster0-hxvow.mongodb.net/omnistack?retryWrites=true&w=majority', {
    useNewUrlParser: true 
});

httpServer.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);
server.listen(3333);