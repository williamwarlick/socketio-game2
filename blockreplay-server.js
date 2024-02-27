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

        this.currentVersion = 0;
    }

    getPlayerSocketIds(game) {
        var socketIds = [];

        if(game.players[0] && this.playerIdSocketMap[game.players[0].id]) {
            socketIds.push(this.playerIdSocketMap[game.players[0].id]);
        }

        return socketIds;
    }

    async generateSinglePlayerRounds() {
        const nine_games_data_exp2 = { "13108": { "importId": 75842, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "white", "green", "white", "white", "white", "blue", "white", "white", "red", "green", "green", "red", "white", "red", "white", "blue", "green", "white", "blue", "blue", "white", "white", "white", "red", "white", "white", "red", "green", "red", "green", "red", "red", "white", "blue", "red", "red", "blue", "blue", "blue", "green", "blue", "green", "green", "green"], "goal_optimal": 100, "goal": "move blue C2", "total_moves": 10, "goal_type": "move", "move_ids": [[59, 88], [104, 89], [102, 70], [82, 71], [65, 85], [83, 51], [101, 52], [100, 53], [79, 33], [97, 34]] }, "13116": { "importId": 92567, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "red", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "red", "green", "white", "blue", "red", "white", "blue", "red", "green", "blue", "blue", "red", "white", "blue", "white", "white", "white", "green", "red", "green", "green", "green", "green", "white", "green", "blue", "green", "red", "blue", "blue", "white", "red", "red", "blue", "green", "red"], "goal_optimal": 100, "goal": "uncover green all", "total_moves": 7, "goal_type": "uncover", "move_ids": [[78, 64], [80, 95], [76, 46], [57, 45], [75, 61], [89, 102], [73, 54]] }, "905560": { "importId": 39277, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "red", "white", "white", "white", "red", "white", "white", "white", "white", "white", "white", "white", "blue", "green", "green", "white", "white", "white", "blue", "red", "white", "white", "blue", "white", "white", "blue", "green", "green", "green", "white", "green", "red", "red", "green", "blue", "blue", "red", "red", "white", "blue", "red", "green", "green", "blue", "red", "green", "red", "blue"], "goal_optimal": 100, "goal": "uncover red all", "total_moves": 10, "goal_type": "uncover", "move_ids": [[60, 98], [79, 76], [78, 77], [55, 59], [74, 41], [73, 23], [86, 67], [88, 89], [64, 81], [82, 83]] }, "13134": { "importId": 50905, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "blue", "white", "white", "green", "white", "red", "blue", "white", "blue", "blue", "green", "blue", "white", "red", "white", "red", "white", "red", "blue", "red", "green", "blue", "red", "red", "blue", "green", "green", "green", "blue", "green", "red", "red", "red", "green", "green", "green"], "goal_optimal": 100, "goal": "uncover red all", "total_moves": 3, "goal_type": "uncover", "move_ids": [[77, 74], [85, 65], [71, 64]] }, "13121": { "importId": 70176, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "green", "red", "white", "white", "white", "white", "green", "white", "white", "white", "white", "white", "white", "white", "red", "green", "green", "blue", "red", "red", "white", "white", "white", "blue", "red", "blue", "white", "blue", "white", "white", "white", "red", "green", "blue", "red", "blue", "blue", "red", "green", "white", "white", "green", "red", "green", "blue", "blue", "blue", "green", "white", "red", "green"], "goal_optimal": 100, "goal": "clear nocolor B2", "total_moves": 6, "goal_type": "clear", "move_ids": [[63, 62], [81, 97], [82, 96], [99, 79], [100, 78], [101, 60]] }, "13109": { "importId": 68825, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "green", "white", "white", "white", "white", "white", "white", "white", "green", "blue", "blue", "blue", "white", "green", "green", "white", "white", "white", "red", "white", "white", "blue", "blue", "red", "white", "red", "blue", "green", "red", "red", "red", "red", "green", "green", "red", "red", "green", "blue", "red", "blue", "green", "blue", "green"], "goal_optimal": 100, "goal": "move red B1", "total_moves": 12, "goal_type": "move", "move_ids": [[99, 80], [100, 62], [65, 100], [83, 61], [95, 60], [76, 95], [94, 42], [75, 94], [93, 43], [90, 44], [103, 24], [88, 25]] }, "13141": { "importId": 85609, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "red", "red", "green", "white", "white", "white", "white", "white", "white", "white", "white", "white", "green", "white", "white", "white", "red", "red", "blue", "blue", "blue", "white", "white", "white", "green", "green", "white", "white", "green", "white", "green", "blue", "blue", "white", "green", "green", "green", "red", "red", "red", "white", "white", "blue", "red", "white", "blue", "green", "red", "blue", "blue", "red", "white"], "goal_optimal": 100, "goal": "uncover red all", "total_moves": 7, "goal_type": "uncover", "move_ids": [[54, 96], [58, 97], [76, 79], [81, 100], [88, 107], [57, 78], [75, 61]] }, "13152": { "importId": 94317, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "red", "white", "white", "green", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "green", "white", "green", "blue", "red", "green", "green", "blue", "white", "white", "red", "blue", "blue", "white", "white", "green", "red", "green", "green", "red", "blue", "green", "red", "blue", "blue", "red", "white", "red", "blue", "red", "green", "white", "white", "red"], "goal_optimal": 100, "goal": "move blue B", "total_moves": 9, "goal_type": "move", "move_ids": [[56, 61], [72, 62], [77, 43], [76, 75], [94, 44], [85, 45], [86, 100], [84, 85], [102, 82]] }, "13149": { "importId": 27371, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "red", "white", "white", "red", "white", "blue", "white", "blue", "white", "white", "white", "white", "blue", "white", "red", "white", "white", "white", "blue", "white", "blue", "green", "green", "green", "red", "green", "white", "white", "white", "white", "green", "white", "red", "red", "white", "blue", "green", "green", "green", "red", "green", "blue", "red", "blue", "green", "blue", "white", "blue", "red", "red"], "goal_optimal": 100, "goal": "move red C2", "total_moves": 9, "goal_type": "move", "move_ids": [[61, 87], [82, 69], [100, 51], [79, 60], [97, 33], [58, 15], [91, 52], [72, 34], [90, 16]] } }
        // let order = this.generateGameOrder();
        // need to pick connect these 9 games to one of each type w/ label 
        // do game order stuff here 
        // var replaygames3a = await loader.loadE2Games('./3a_games_to_replay.js');
        // console.log("Replay games: " + replaygames3a);
        // return replaygames3a;
        let rounds = [];
        let ids = [13108, 905560, 13134];
        let stoppingPointsNum = [10, 20, 30]; 
        let stoppingPoints = ['beginning', 'middle', 'end'];

        for (let i = 0; i < ids.length; i++) {
            let round = nine_games_data_exp2[ids[i]];
            round.stoppingPoint = stoppingPoints[i];
            round.stoppingPointNum = stoppingPointsNum[i]; 
            rounds.push(round);
        }

        return rounds;
    }

    async generateGameOrder(){
        const versions = [
        [(0, 'Move-Beginning'), (1, 'Fill-Middle'), (2, 'Cover-End'), (3, 'Move-Middle'), (4, 'Fill-End'), (5, 'Cover-Beginning'), (6, 'Move-End'), (7, 'Fill-Beginning'), (8, 'Cover-Middle')],
        [(3, 'Move-Beginning'), (4, 'Fill-Middle'), (5, 'Cover-End'), (6, 'Move-Middle'), (7, 'Fill-End'), (8, 'Cover-Beginning'), (0, 'Move-End'), (1, 'Fill-Beginning'), (2, 'Cover-Middle')],
        [(6, 'Move-Beginning'), (7, 'Fill-Middle'), (8, 'Cover-End'), (0, 'Move-Middle'), (1, 'Fill-End'), (2, 'Cover-Beginning'), (3, 'Move-End'), (4, 'Fill-Beginning'), (5, 'Cover-Middle')]]
        
        return shuffleArray(versions[this.currentVersion]);
    
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    async joinBlockReplay(io, socket, playerId, sonaId) {
        // keep track of player's socket id
        this.playerIdSocketMap[playerId] = socket.id;
        console.log('Creating new game on-deck ...');
        let newGame = new mab2.Game(this.currentVersion);
        newGame.players[0] = new mab2.Player(playerId, sonaId);

        console.log('Player joined single player game, starting game ...' + playerId);
        newGame.status = mab2.GAME_STATUS.JOINED;

        newGame.rounds =  await this.generateSinglePlayerRounds();
        
        this.currentVersion = (this.currentVersion + 1) % 3; 

    
        var gameIndex = this.inProgress.push(newGame) - 1;
        console.log("In progress: " + this.inProgress);
        this.playerGameIndexMap[newGame.players[0].id] = gameIndex;
        console.log("Game index: " + gameIndex);    
        // add to rounds when each one is supposed to stop, perhaps a function
        // newGame.rounds['stoppingPoint'] = 'beginning';
        
        io.to(this.getPlayerSocketIds(newGame)).emit('blockreplay', {
            setup: true, 
            playerId: playerId, 
            round: newGame.rounds  
        });
    
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

    async submit(io, playerId, aSubmission) {
        console.log('Processing submission ' + playerId + ', ' + JSON.stringify(aSubmission));
        var gameIndex = this.playerGameIndexMap[playerId];

        console.log('Game index: ' + gameIndex);

        if (gameIndex !== null && gameIndex >= 0) {
            var game = this.inProgress[gameIndex];

            await dataStore.save(game.getSaveState());
            console.log('Syncing game state with clients ...');
            // below send somethign istead of state? 
            io.to(this.getPlayerSocketIds(game)).emit('blockreplay', game.getState());
                
            if (game.status === mab2.GAME_STATUS.COMPLETE) {
                console.log(`Game complete ${gameIndex}`);
                //this.cleanUpGame(gameIndex, game);
                await dataStore.save(game.getSaveState());
            }
             
        } else {
            console.log('Game not found for player id: ' + playerId);
            console.log(JSON.stringify(this.playerGameIndexMap));
        }
    }


    gameAck(io, playerId) {
        var game = this.getGameByPlayerId(playerId);
        game.acknowledge(playerId);
        // again handle sneding something else than state
        io.to(this.getPlayerSocketIds(game)).emit('blockreplay', game.getState());
    }


}

if (module && module.exports) {
    module.exports = { GameServer, EVENTS };
}


// //const { default: socket } = require("./src/socket");
// // this is where I handle distributing the 3 sections of 9 names 
// const mab2 = require('./blockreplay2');
// const dataStore = require('./dataStore');
// const loader = require('./round-loader');
// const roundsLib = require('./rounds');
// const { EVENTS } = require('./components');



// class GameServer {
//     constructor() {
//         this.inProgress = [];
        
//         this.playerGameIndexMap = {};
//         this.playerIdSocketMap = {};
        
//         this.singlePlayerRoundPoolIndex = 0;
//         this.currentVersion = 0;
//     }

//     getPlayerSocketIds(game) {
//         var socketIds = [];

//         if (game.player) {
//             socketIds.push(this.playerSocketId);
//         }

//         return socketIds;
//     }

//     async generateSinglePlayerRounds() {
//         const nine_games_data_exp2 = { "13108": { "importId": 75842, "config": ["white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "blue", "white", "white", "white", "white", "white", "green", "white", "white", "white", "blue", "white", "white", "red", "green", "green", "red", "white", "red", "white", "blue", "green", "white", "blue", "blue", "white", "white", "white", "red", "white", "white", "red", "green", "red", "green", "red", "red", "white", "blue", "red", "red", "blue", "blue", "blue", "green", "blue", "green", "green", "green"], "goal_optimal": 100, "goal": "move blue C2", "total_moves": 10, "goal_type": "move", "move_ids": [[59, 88], [104, 89], [102, 70], [82, 71], [65, 85], [83, 51], [101, 52], [100, 53], [79, 33], [97, 34]] } }
//         // let order = this.generate_game_order();
//         // need to pick connect these 9 games to one of each type w/ label 
//         // do game order stuff here 
//         // var replaygames3a = await loader.loadE2Games('3a_games_to_replay.js');
//         // return replaygames3a;
//         return nine_games_data_exp2[13108];
//     }

//     async generate_game_order(){
//         // let versionNumber = this.currentVersion;
//         let versionNumber = 0;
    
//         const versions = [[(0, 'Move-Beginning'), (1, 'Fill-Middle'), (2, 'Cover-End'), (3, 'Move-Middle'), (4, 'Fill-End'), (5, 'Cover-Beginning'), (6, 'Move-End'), (7, 'Fill-Beginning'), (8, 'Cover-Middle')],
//         [(3, 'Move-Beginning'), (4, 'Fill-Middle'), (5, 'Cover-End'), (6, 'Move-Middle'), (7, 'Fill-End'), (8, 'Cover-Beginning'), (0, 'Move-End'), (1, 'Fill-Beginning'), (2, 'Cover-Middle')],
//         [(6, 'Move-Beginning'), (7, 'Fill-Middle'), (8, 'Cover-End'), (0, 'Move-Middle'), (1, 'Fill-End'), (2, 'Cover-Beginning'), (3, 'Move-End'), (4, 'Fill-Beginning'), (5, 'Cover-Middle')]]
        
//         return shuffleArray(versions[versionNumber]);
    
//         function shuffleArray(array) {
//             for (let i = array.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [array[i], array[j]] = [array[j], array[i]];
//             }
//             return array;
//         }
//     }

//     // handles someone joing block replay
//     // once they have joined assigned them all the 9 games they are going to play 
//     async joinBlockReplay(io, socket, playerId, sonaId) {
//     this.currentVersion = (this.currentVersion + 1) % 3; 

//         // keep track of player's socket id
//         this.playerSocketId = socket.id;

//         console.log("Socketid:" + socket.id)

        
//         let newGame = new mab2.Game();
//         console.log('Player joined single player game, starting game ...' + playerId);

//         newGame.player = new mab2.Player(playerId, sonaId);

//         newGame.status = mab2.GAME_STATUS.JOINED;

//         newGame.rounds =  await this.generateSinglePlayerRounds();
//         console.log("Rounds: " + newGame.rounds);
    
//         var gameIndex = this.inProgress.push(newGame) - 1;
//         console.log("In progress: " + this.inProgress);
//         this.playerGameIndexMap[newGame.player.id] = gameIndex;
//         console.log("Game index: " + gameIndex);

//         newGame.gameStartTime = Date.now();


//         if (newGame && newGame.player) {
//             io.to(this.playerSocketId).emit('blockreplay', {setup: true, playerId: playerId, round: newGame.rounds});
//             console.log('Sent set up rounds to player: ' + playerId + "rounds" + newGame.rounds);
//             // io.to(this.getPlayerSocketIds(newGame)).emit('blockreplay', newGame.getState());
//         } else {
//             console.log('Error: Game or player is not correctly initialized.');
//         }
    
//     }

//     playerInGame(playerId) {
//         return this.getGameByPlayerId(playerId) !== null;
//     }

//     getGameByPlayerId(playerId) {
//         var gameIndex = this.playerGameIndexMap[playerId];
//         console.log('Game index: ' + gameIndex);

//         if (gameIndex !== null) {
//             return this.inProgress[gameIndex];
//         } else {
//             console.log('Game not found for player id: ' + playerId);
//             return null;
//         }
//     }

//     cleanUpGame(gameIndex, game) {
//         // clean up player game index map
//         console.log(`Clearing player game index for ${game.player.id}`);
//         this.playerGameIndexMap[game.player.id] = null;


//         // remove from in progress array
//         // setting to null for now so it doesn't mess up the playerGameIndexMap,
//         // need to re-think how we keep track of the games so we don't fill
//         // memory up
//         console.log(`Setting inProcess game to null ${gameIndex}`);
//         this.inProgress[gameIndex] = null;
//     }


//     gameAck(io, playerId) {
//         var game = this.getGameByPlayerId(playerId);
//         if (game) { // Check if game is not null
//             game.acknowledge(playerId);
//             io.to(this.getPlayerSocketIds(game)).emit('blockreplay', game.getState());
//         } else {
//             console.log(`No game found for player ID: ${playerId}, cannot acknowledge.`);
//             // Handle the case where no game is found, e.g., inform the client or take other actions.
//         }
//     }


// }

// if (module && module.exports) {
//     module.exports = { GameServer, EVENTS };
// }