const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const sessionStore = new InMemorySessionStore();

app.use(express.static('dist'));

io.on('connection', async (socket) => {  
    console.log('A user connected ...');

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

    socket.on('checkers', (msg) => {
        console.log('checkers: ' + msg);
        io.emit('checkers', msg);
    });

    socket.on('moveablock', (msg) => {
        console.log('moveablock: ' + msg);
        io.emit('moveablock', msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});