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

const doLogin = (req, username, callback) => {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
        if (err) next(err)
    
        // store user information in session, typically a user id
        req.session.user = username;
        console.log(req.session.user);
    
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)
          
          if (callback) {
            callback();
          }
        })
      })
};

app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
    doLogin(req, req.body.username, function() {
        res.redirect('/waiting.html');
    });
  })

app.get('/user', (req, res) => {
    var username = req.session.user;
    res.json({user: username});
})

io.on('connection', async (socket) => {  
    const session = socket.request.session;

    let username = session.user;

    // Access session data
    console.log(session);
    
    console.log('A user connected ...' + username);

    if (username) {
        gameServer.joinMoveABlock(io, socket, username);
    }

    socket.on('lobby', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('moveablock', (msg) => {
        // get the session from the socket
        const session = socket.request.session;
        console.log(session);

        // get the username from the session
        const username = session.user;

        console.log('moveablock: ' + JSON.stringify(msg));

        var game = gameServer.getGameByPlayerId(username);

        if (game) {
            if (msg.event === mab.EVENTS.DROP) {
                gameServer.move(io, username, msg);
            } else if (msg.event === mab.EVENTS.DRAGOVER || msg.event === mab.EVENTS.DRAGSTART) {
                msg.state = null;
                //socket.broadcast.emit('moveablock', msg);
                gameServer.drag(io, username, msg);

            } else {
                console.log('Message event does not match.');
            }
        } else {
            console.log("Could not find game for player id: " + username);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});