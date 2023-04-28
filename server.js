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
const socketIOSession = require('socket.io-session');

const sessionStore = new InMemorySessionStore();
const gameServer = new mab.GameServer();


// configure session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  });
  
// use session middleware for Express app
app.use(sessionMiddleware);

app.use(express.static('dist'));

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
  
      // store user information in session, typically a user id
      req.session.user = req.body.username
      console.log(req.session.user);
  
      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err)
        res.redirect('/')
      })
    })
  })

io.on('connection', async (socket) => {  
    // get the session from the socket
    //const session = socket.request.session;
    let username;

    const session = socket.request.session;

    // Access session data
    console.log(session);
    
    console.log('A user connected ...' + username);
    gameServer.joinMoveABlock(io, socket.id);

    socket.on('lobby', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('moveablock', (msg) => {
        // get the session from the socket
        const session = socket.request.session;
        console.log(session);

        // get the username from the session
        const username = socket.id; //session.username;

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