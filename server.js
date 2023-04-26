const express = require('express');
const app = express();
const session = require('express-session');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const mab = require('./moveablock-server');
const cookieParser = require('cookie-parser');

const sessionStore = new InMemorySessionStore();
const gameServer = new mab.GameServer();

const sessionMiddleware = session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
});

io.engine.use(sessionMiddleware);

app.use(express.static('dist'));

io.on('connection', async (socket) => {  
    // get the session from the socket
    const session = socket.request.session;
    let username;

    if (!session.username) {
        // get the username from the query string
        username = randomId(); //socket.handshake.query.username;

        // store the username in the session
        session.username = username;

        session.save();
    }
    
    console.log('A user connected ...' + username);
    gameServer.joinMoveABlock(io, username);

    socket.on('lobby', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('moveablock', (msg) => {
        // get the session from the socket
        const session = socket.request.session;

        // get the username from the session
        const username = session.username;

        console.log('moveablock: ' + JSON.stringify(msg));

        var game = gameServer.getGameByPlayerId(username);

        if (game) {
            if (msg.event === mab.EVENTS.DROP) {
                gameServer.move(socket, username, msg);
            } else if (msg.event === mab.EVENTS.DRAGOVER || msg.event === mab.EVENTS.DRAGSTART) {
                msg.state = null;
                socket.broadcast.emit('moveablock', msg);
            } else {
                console.log('Message event does not match.');
            }
        } else {
            console.log("Could not find game for player id: " + username);
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});