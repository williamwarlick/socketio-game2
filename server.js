const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const mab = require('./moveablock-server');

const sessionStore = new InMemorySessionStore();
const gameServer = new mab.GameServer();

app.use(express.static('dist'));

io.on('connection', async (socket) => {  
    console.log('A user connected ...' + socket.id);
    gameServer.joinMoveABlock(io, socket.id);

    socket.on('lobby', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('joinRoom1', (msg) => {
        console.log('Join room1: ' + msg);
        socket.join('room1');
    });

    socket.on('pingRoom1', (msg) => {
        console.log('ping: ' + msg);
        io.to('room1').emit('Pong!');
    });

    socket.on('moveablock', (msg) => {
        console.log('moveablock: ' + JSON.stringify(msg));

        if (msg.event === mab.EVENTS.DROP) {
            gameServer.move(socket, socket.id, msg);
        } else if (msg.event === mab.EVENTS.DRAGOVER) {
            socket.broadcast.emit('moveablock', msg);
        } else {
            console.log('Message event does not match.');
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});