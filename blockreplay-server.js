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
        
        this.playerGameIndexMap = {};
        this.playerSocketId = null;

        this.singlePlayerRoundPoolIndex = 0;
        this.currentVersion = 0;
    }

    getPlayerSocketIds(game) {
        var socketIds = [];

        if (game.player) {
            socketIds.push(this.playerSocketId);
        }

        return socketIds;
    }

    async generateSinglePlayerRounds() {
        const nine_games_data_exp2 = { "13108": { "importId": 75842, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "white", "green", "white", "white", "white", "blue", "white", "white", "red", "green", "green", "red", "white", "red", "white", "blue", "green", "white", "blue", "blue", "white", "white", "white", "red", "white", "white", "red", "green", "red", "green", "red", "red", "white", "blue", "red", "red", "blue", "blue", "blue", "green", "blue", "green", "green", "green"], "goal_optimal": 100, "goal": "move blue C2", "total_moves": 10, "goal_type": "move", "move_ids": [[59, 88], [104, 89], [102, 70], [82, 71], [65, 85], [83, 51], [101, 52], [100, 53], [79, 33], [97, 34]] } }
        // let order = this.generate_game_order();
        // need to pick connect these 9 games to one of each type w/ label 
        // do game order stuff here 
        // var replaygames3a = await loader.loadE2Games('3a_games_to_replay.js');
        // return replaygames3a;
        return nine_games_data_exp2[13108];
    }

    async generate_game_order(){
        // let versionNumber = this.currentVersion;
        let versionNumber = 0;
    
        const versions = [[(0, 'Move-Beginning'), (1, 'Fill-Middle'), (2, 'Cover-End'), (3, 'Move-Middle'), (4, 'Fill-End'), (5, 'Cover-Beginning'), (6, 'Move-End'), (7, 'Fill-Beginning'), (8, 'Cover-Middle')],
        [(3, 'Move-Beginning'), (4, 'Fill-Middle'), (5, 'Cover-End'), (6, 'Move-Middle'), (7, 'Fill-End'), (8, 'Cover-Beginning'), (0, 'Move-End'), (1, 'Fill-Beginning'), (2, 'Cover-Middle')],
        [(6, 'Move-Beginning'), (7, 'Fill-Middle'), (8, 'Cover-End'), (0, 'Move-Middle'), (1, 'Fill-End'), (2, 'Cover-Beginning'), (3, 'Move-End'), (4, 'Fill-Beginning'), (5, 'Cover-Middle')]]
        
        return shuffleArray(versions[versionNumber]);
    
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    // handles someone joing block replay
    // once they have joined assigned them all the 9 games they are going to play 
    async joinBlockReplay(io, socket, playerId, sonaId) {
    this.currentVersion = (this.currentVersion + 1) % 3; 

        // keep track of player's socket id
        this.playerSocketId = socket.id;

        console.log("Socketid:" + socket.id)

        
        let newGame = new mab2.Game();
        console.log('Player joined single player game, starting game ...' + playerId);

        newGame.player = new mab2.Player(playerId, sonaId);

        newGame.status = mab2.GAME_STATUS.JOINED;

        newGame.rounds =  await this.generateSinglePlayerRounds();
        console.log("Rounds: " + newGame.rounds);
    
        var gameIndex = this.inProgress.push(newGame) - 1;
        console.log("In progress: " + this.inProgress);
        this.playerGameIndexMap[newGame.player.id] = gameIndex;
        console.log("Game index: " + gameIndex);

        newGame.gameStartTime = Date.now();


        if (newGame && newGame.player) {
            io.to(this.playerSocketId).emit('blockreplay', {setup: true, playerId: playerId, round: newGame.rounds});
            console.log('Sent set up rounds to player: ' + playerId + "rounds" + newGame.rounds);
            // io.to(this.getPlayerSocketIds(newGame)).emit('blockreplay', newGame.getState());
        } else {
            console.log('Error: Game or player is not correctly initialized.');
        }
    
    }

    playerInGame(playerId) {
        return this.getGameByPlayerId(playerId) !== null;
    }

    getGameByPlayerId(playerId) {
        var gameIndex = this.playerGameIndexMap[playerId];
        console.log('Game index: ' + gameIndex);

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