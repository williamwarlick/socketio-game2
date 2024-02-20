//const { default: socket } = require("./src/socket");
// this is where I handle distributing the 3 sections of 9 names 
const mab2 = require('./blockreplay2');
const dataStore = require('./dataStore');
const loader = require('./round-loader');
const roundsLib = require('./rounds');
const { EVENTS } = require('./components');


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

        if (game.player && this.playerIdSocketMap[game.player.id]) {
            socketIds.push(this.playerIdSocketMap[game.player.id]);
        }

        return socketIds;
    }

    async generateSinglePlayerRounds() {
        // FIXME change this to load from randomized 9 games with 3 sections 
        var replaygames3a = await loader.loadE2Games('3a_games_to_replay.js');

        return replaygames3a;
    }

    async joinBlockReplay(io, socket, playerId, sonaId) {
        // keep track of player's socket id
        this.playerIdSocketMap[playerId] = socket.id;

        
        let newGame = new mab2.Game();
        console.log('Player joined single player game, starting game ...' + playerId);

        newGame.player = new mab2.Player(playerId, sonaId);



        newGame.status = mab2.GAME_STATUS.JOINED;
        newGame.rounds = await this.generateSinglePlayerRounds();


        // var gameIndex = this.inProgress.push(newGame) - 1;
        // this.playerGameIndexMap[newGame.player.id] = gameIndex;
        newGame.gameStartTime = Date.now();


        if (newGame && newGame.player) {
            io.to(this.getPlayerSocketIds(newGame)).emit('blockreplay', newGame.getState());
        } else {
            console.log('Error: Game or player is not correctly initialized.');
        }
    
    }

    playerInGame(playerId) {
        return this.getGameByPlayerId(playerId) !== null;
    }

    getGameByPlayerId(playerId) {
        var gameIndex = this.playerGameIndexMap[playerId];

        if (gameIndex !== null) {
            return this.inProgress[gameIndex];
        } else {
            console.log('Game not found for player id: ' + playerId);
            return null;
        }
    }

    cleanUpGame(gameIndex, game) {
        // clean up player game index map
        console.log(`Clearing player game index for ${game.player.id}`);
        this.playerGameIndexMap[game.player.id] = null;


        // remove from in progress array
        // setting to null for now so it doesn't mess up the playerGameIndexMap,
        // need to re-think how we keep track of the games so we don't fill
        // memory up
        console.log(`Setting inProcess game to null ${gameIndex}`);
        this.inProgress[gameIndex] = null;
    }


    gameAck(io, playerId) {
        var game = this.getGameByPlayerId(playerId);
        if (game) { // Check if game is not null
            game.acknowledge(playerId);
            io.to(this.getPlayerSocketIds(game)).emit('blockreplay', game.getState());
        } else {
            console.log(`No game found for player ID: ${playerId}, cannot acknowledge.`);
            // Handle the case where no game is found, e.g., inform the client or take other actions.
        }
    }


}

if (module && module.exports) {
    module.exports = { GameServer, EVENTS };
}