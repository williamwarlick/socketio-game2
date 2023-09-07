//const { default: socket } = require("./src/socket");
const mab2 = require('./moveablock2');
const dataStore = require('./dataStore');
const loader = require('./round-loader');
const roundsLib = require('./rounds');
const {EVENTS} = require('./components');

/*const EVENTS = {
    DRAGSTART: 'dragstart',
    DRAGOVER: 'dragover',
    DROP: 'drop',
    NONE: 'none',
};*/

class GameServer {
    constructor() {
        this.inProgress = [];
        this.onDeck = [];
        this.playerGameIndexMap = {};
        this.playerIdSocketMap = {};
        this.singlePlayerRoundPoolIndex = 0;
    }

    getPlayerSocketIds(game) {
        var socketIds = [];

        if(game.players[0] && this.playerIdSocketMap[game.players[0].id]) {
            socketIds.push(this.playerIdSocketMap[game.players[0].id]);
        }

        if(game.players[1] && this.playerIdSocketMap[game.players[1].id]) {
            socketIds.push(this.playerIdSocketMap[game.players[1].id]);
        }

        return socketIds;
    }

    getOtherPlayerSocketId(game, playerId) {
        var socketId = null;

        if (game.players[0].id != playerId) {
            socketId = this.playerIdSocketMap[game.players[0].id];
        } else if (game.players[1]){
            socketId = this.playerIdSocketMap[game.players[1].id];
        }

        return socketId;
    }

    async generateSinglePlayerRounds(numRounds) {
        var theRounds = [];
        var singlePlayerRoundPool = await loader.loadRoundsFromFile('./final_move_df.csv');

        var practiceRound = roundsLib.getDefaultRounds(1)[0];
        practiceRound.isPractice = true;

        theRounds.push(practiceRound);

        for (let i=0; i < numRounds; i++) {
            theRounds.push(singlePlayerRoundPool[Object.keys(singlePlayerRoundPool)[this.singlePlayerRoundPoolIndex]][i]);
        }

        this.singlePlayerRoundPoolIndex = this.singlePlayerRoundPoolIndex + 1;

        if(Object.keys(singlePlayerRoundPool).length <= this.singlePlayerRoundPoolIndex) {
            this.singlePlayerRoundPoolIndex = 0;
        }

        return theRounds;
    }

    async joinMoveABlock(io, socket, playerId, sonaId) {
        // keep track of player's socket id
        this.playerIdSocketMap[playerId] = socket.id;

        if (this.playerInGame(playerId)) {
            console.log('Player already in game ' + playerId);

            let game = this.getGameByPlayerId(playerId);

            io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());
        } else {

            console.log('Player joining game: ' + playerId);

            if (this.onDeck.length > 0) {
                console.log('2nd player joined, starting game ...');
                var game = this.onDeck.pop();
                game.status = mab2.GAME_STATUS.JOINED;
                game.players[1] = new mab2.Player(playerId, mab2.PLAYER_ROLE.HELPER, sonaId);
                var gameIndex = this.inProgress.push(game) - 1;
                this.playerGameIndexMap[game.players[0].id] = gameIndex;
                this.playerGameIndexMap[game.players[1].id] = gameIndex;
                game.gameStartTime = Date.now();
                
                io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());
            } else {
                console.log('Creating new game on-deck ...');
                
                let newGame = new mab2.Game();
                newGame.players[0] = new mab2.Player(playerId, mab2.PLAYER_ROLE.ARCHITECT, sonaId);
                
                if (newGame.mode == mab2.GAME_MODE.ONE_PLAYER) {
                    console.log('Player joined single player game, starting game ...');
                    newGame.status = mab2.GAME_STATUS.JOINED;
                    newGame.rounds = await this.generateSinglePlayerRounds(newGame.settings.ROUNDS_NUM);
                    newGame.board.spaces = newGame.rounds[newGame.currentRound].initBoard;
                    
                    var gameIndex = this.inProgress.push(newGame) - 1;
                    this.playerGameIndexMap[newGame.players[0].id] = gameIndex;
                    newGame.gameStartTime = Date.now();
                } else {
                    this.onDeck.push(newGame);
                }
                
                io.to(this.getPlayerSocketIds(newGame)).emit('moveablock', newGame.getState());
            }
        }
    }

    playerInGame(playerId) {
        return this.getGameByPlayerId(playerId) !== null;
    }

    getGameByPlayerId(playerId) {
        var gameIndex = this.playerGameIndexMap[playerId];

        if (gameIndex !== null && gameIndex >= 0) {
            return this.inProgress[gameIndex];
        } else if ((this.onDeck[0] && this.onDeck[0].players[0].id == playerId)
            || (this.onDeck[0] && this.onDeck[0].players[1] 
                && this.onDeck[0].players[1].id == playerId)) {
            return this.onDeck[0];
        } else {
            console.log('Game not found for player id: ' + playerId);
            return null;
        }
    }

    cleanUpGame(gameIndex, game) {
        // clean up player game index map
        for (let player of game.players) {
            console.log(`Clearing player game index for ${player.id}`);
            this.playerGameIndexMap[player.id] = null;
        }

        // remove from in progress array
        // setting to null for now so it doesn't mess up the playerGameIndexMap,
        // need to re-think how we keep track of the games so we don't fill
        // memory up
        console.log(`Setting inProcess game to null ${gameIndex}`);
        this.inProgress[gameIndex] = null;
    }

    move(io, playerId, aMove) {
        console.log('Processing move ' + playerId + ', ' + JSON.stringify(aMove));
        var gameIndex = this.playerGameIndexMap[playerId];

        console.log('Game index: ' + gameIndex);

        if (gameIndex !== null && gameIndex >= 0) {
            if (aMove.event === EVENTS.DROP) {
                var game = this.inProgress[gameIndex];
                var accepted = game.moveBlock(playerId, aMove.from.pos, aMove.to.pos);

                if (accepted) {
                    console.log('Move accepted ...');
                    
                    dataStore.save(game.getSaveState());

                    var otherPlayerSocketId = this.getOtherPlayerSocketId(game, playerId);

                    if(otherPlayerSocketId) {
                        io.to(otherPlayerSocketId).emit('moveablock', {event: aMove.event, playerId: playerId, 
                            from: aMove.from, to: aMove.to, state: game.board.spaces});
                    }
                } else {
                    console.log('Syncing game state with clients ...');
                    io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());
                }
                
                if (game.status === mab2.GAME_STATUS.NEW_ROUND) {
                    // if new round sync game
                    console.log('Syncing game state with clients ...');
                    io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());
                } 
                
                else if (game.status === mab2.GAME_STATUS.COMPLETE) {
                    console.log(`Game complete ${gameIndex}`);
                    //this.cleanUpGame(gameIndex, game);

                    game.gameCompleteTime = Date.now();
                    dataStore.save(game.getSaveState());

                    console.log('Syncing game state with clients ...');
                    io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());
                }
                
            }
        } else {
            console.log('Game not found for player id: ' + playerId);
            console.log(JSON.stringify(this.playerGameIndexMap));
        }
    }

    gameAck(io, playerId) {
        var game = this.getGameByPlayerId(playerId);
        game.acknowledge(playerId);

        io.to(this.getPlayerSocketIds(game)).emit('moveablock', game.getState());

    }

    drag(io, playerId, msg) {
        var game = this.getGameByPlayerId(playerId);

        var otherPlayerSocketId = this.getOtherPlayerSocketId(game, playerId);

        if (otherPlayerSocketId) {
            io.to(otherPlayerSocketId).emit('moveablock', msg);
        }
    }
}

if (module && module.exports) {
    module.exports = {GameServer, EVENTS};
}