require('dotenv').config()
const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const session = require('express-session');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { InMemorySessionStore } = require("./sessionStore");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
// const mab = require('./moveablock-server');
const mab = require('./blockreplay-server');
const cookieParser = require('cookie-parser');
const socketIOSession = require('socket.io-session');
const dataStore = require('./dataStore');
const cron = require('node-cron');
const { Console } = require('console');


app.use(express.json())

const sessionStore = new InMemorySessionStore();

const MAB_TABLE = 'mabGame';

var gameServer = new mab.GameServer();

cron.schedule('*/1 * * * *', () => {
    console.log('Running game cleanup task ...');

    for (var i = gameServer.inProgress.length - 1; i >= 0; i--) {
        var game = gameServer.inProgress[i];
        // clean game up a few minutes after completion time, enough time to display
        // game complete results to the front end
        if (game.demographicDetails && game.status === 'COMPLETE' && Date.now() < (game.gameCompleteTime + 60000)) {
            console.log('Cleaning up game ' + game.id);
            gameServer.cleanUpGame(i, game);
        }
    }
});

// configure session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  });

app.use('/admin', basicAuth({
    users: { 'admin': 'password' },
    challenge: true,
}));

app.use('/admin.html', basicAuth({
    users: { 'admin': process.env.ADMIN_PWD },
    challenge: true,
}));

// use session middleware for Express app
app.use(sessionMiddleware);

app.use(express.static('dist'));

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

const doLogin = (req, username, sonaId, callback) => {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
        if (err) next(err)

        // store user information in session, typically a user id
        req.session.user = username;
        req.session.sonaId = sonaId ? sonaId : null;
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

const ackGame = (req, callback) => {
    var user = req.session.user;

    if (user) {
        gameServer.gameAck(io, user);

        if (callback) {
            callback();
        }
    }
};

const doPostDemographicDetails = async (req, demographicDetails, callback) => {
	const userName = req.session.user
	const game = gameServer.getGameByPlayerId(userName)
    if(game) {
        game.demographicDetails = demographicDetails

        await dataStore.save(game.getSaveState())
    }
	callback()
}


app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
    doLogin(req, req.body.username, req.body.sona, function() {
        // goes to waiting by default after login 
        // res.redirect('/waiting.html');
        res.redirect('/consent.html');
    });
  })

app.post(
	'/demographic-details',
	express.urlencoded({ extended: false }),
	function (req, res) {
		doPostDemographicDetails(req, req.body, function () {
			res.json({message: "Data received successfully", data: req.body})
		})
	}
)

  app.post('/logout', express.urlencoded({ extended: false }), function (req, res) {
    console.log('Destroying user session: ' + req.session.user);
    req.session.destroy();
  })

app.post('/admin/reset', express.urlencoded({ extended: false }), function (req, res) {
    gameServer = new mab.GameServer();
    console.log("Reset game server ...");
    res.redirect('/index.html');
})

app.post('/gameack', express.urlencoded({ extended: false }), function (req, res) {
    ackGame(req, function() {
        // res.redirect('/round-starting.html');
        res.redirect('/blockreplay.html');
    });
})

app.post('/submitGoal', (req, res) => {
    const submissionData = req.body;
  
    dataStore.saveGameGoal(submissionData )
      .then(data => res.send("Game data saved successfully"))
      .catch(err => {
        console.error("Error saving the game data:", err);
        res.status(500).send("Error saving the game data");
      });
  });

app.get('/user', (req, res) => {
    var username = req.session.user;
    var sonaId = req.session.sonaId;
    res.json({user: username, sonaId: sonaId});
})

app.get('/gamestate', (req, res) => {
    var username = req.session.user;
    var sonaId = req.session.sonaId;

    if (username) {
        var game = gameServer.getGameByPlayerId(username);

        if (game) {
            var gameState = game.getState();
            gameState.user = {user: username, sonaId: sonaId};
            res.json(gameState);
        } else {
            res.status(404).send("Not found.");
        }
    } else {
        res.status(404).send("Not found.");
    }
})

app.get('/admin/gameinfo', (req, res) => {
    res.json({onDeck: gameServer.onDeck, inProgress: gameServer.inProgress});
})

app.get('/admin/gamedata', async (req, res) => {
    var data = await dataStore.getAll(MAB_TABLE);

    res.json(data);
})

app.get('/admin/usergamedata', async (req, res) => {
    var userId = req.query.id;
    var data = await dataStore.getDataByUserId(userId, MAB_TABLE);

    res.json(data);
})

app.get('/admin/gamedataf1', async (req, res) => {
    var data = await dataStore.getAllFormat1(MAB_TABLE);

    res.json(data);
})

app.get('/admin/gamedatacsv', async (req, res) => {
    var data = await dataStore.getAllCsv(MAB_TABLE);
    res.type('text/csv')
    res.send(data);
})

app.get('/admin/demographicDetailsf1', async (req, res) => {
    var data = await dataStore.getDemographicDetailsFormat1(MAB_TABLE);

    res.json(data);
})

app.get('/admin/demographicDetailscsv', async (req, res) => {
    var data = await dataStore.getDemographicDetailsCsv(MAB_TABLE);
    res.type('text/csv')
    res.send(data);
})

io.on('connection', async (socket) => {
    const session = socket.request.session;

    let username = session.user;
    let sonaId = session.sonaId;

    // Access session data
    console.log(session);

    console.log('A user connected ...' + username);

    if (username) {
        // check if already completed a game
        userGameData = await dataStore.getDataByUserId(username, MAB_TABLE);

        if (userGameData && userGameData.length > 0) {
            console.log('User already completed a game: ' + username);
            socket.emit('MESSAGE', 'COMPLETE');
        } else {
            // await gameServer.joinMoveABlock(io, socket, username, sonaId);
            await gameServer.joinBlockReplay(io, socket, username, sonaId);

        }
    }

    socket.on('lobby', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('blockreplay', (msg) => {
        console.log('blockreplay: ' + JSON.stringify(msg));
        console.log('blockreplay connected on server: ');
        const session = socket.request.session;
        console.log(session);
        const username = session.user;
        console.log('Username: '+ username);
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

    });

    socket.on('moveablock', (msg) => {
        // get the session from the socket
        const session = socket.request.session;
        //console.log(session);

        // get the username from the session
        const username = session.user;

        //console.log('moveablock: ' + JSON.stringify(msg));

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