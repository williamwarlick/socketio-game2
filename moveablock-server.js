//const { default: socket } = require("./src/socket");

const EVENTS = {
    DRAGSTART: 'dragstart',
    DRAGOVER: 'dragover',
    DROP: 'drop',
    NONE: 'none',
};

const GAME_STATUS = {
    WAITING: 'waiting',
    JOINED: 'joined',
};

const o = () => { return {state: EVENTS.NONE, block: -1} };
const r = () => { return {state: EVENTS.NONE, block: 0} };
const b = () => { return {state: EVENTS.NONE, block: 2} };
const g = () => { return {state: EVENTS.NONE, block: 1} };

class MoveABlock {
    
    constructor(player1, socketId1, player2, socketId2) {
        this.player1 = {playerId: player1, socketId: socketId1};
        this.player2 = {playerId: player2, socketId: socketId2};
        this.settings = {
            BOARD_DIM: {w: 18, h: 6},
            SECTION_NUM: 3,
            SUB_SECTION_NUM: 2,
            BLOCK_GROUPS: [
                {
                    name: 'red-block',
                    count: 10,
                },
                {
                    name: 'blue-block',
                    count: 10,
                },
                {
                    name: 'green-block',
                    count: 10,
                },
            ]
        };

        this.status = GAME_STATUS.WAITING;

        //this.state.board = [...Array(this.settings.BOARD_DIM.h)].map(_=>Array(this.settings.BOARD_DIM.w).fill(0));
        this.state = {};

        // this will be inverted on the game view, easier to think of (0,0) as the bottom left of screen view
        this.state.board = [
            [r(),r(),g(),g(),r(),b(),r(),r(),g(),g(),r(),b(),b(),o(),g(),g(),r(),b()],
            [b(),b(),g(),g(),r(),b(),b(),r(),o(),b(),o(),b(),o(),o(),g(),g(),r(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
        ]
    }

    updateSocketId(playerId, socketId) {
        if (this.player1.playerId == playerId) {
            this.player1.socketId = socketId;
        } else if (this.player2 && this.player2.playerId == playerId) {
            this.player2.socketId = socketId;
        }
    }

    getPlayerSocketIds() {
        var players = [];

        players.push(this.player1.socketId);

        if(this.player2) {
            players.push(this.player2.socketId);
        }

        return players;
    }

    getPlayerSocketId(playerId) {
        var socketId = null;

        if (this.player1.playerId == playerId) {
            socketId = this.player1.socketId;
        } else if (this.player2.playerId == playerId){
            socketId = this.player2.socketId;
        }

        return socketId;
    }

    getOtherPlayerSocketId(playerId) {
        var socketId = null;

        if (this.player1.playerId != playerId) {
            socketId = this.player1.socketId;
        } else if (this.player2){
            socketId = this.player2.socketId;
        }

        return socketId;
    }

    getSectionWidth() { return this.settings.BOARD_DIM.w/this.settings.SECTION_NUM; };

    getSubSectionWidth() { return this.getSectionWidth()/this.settings.SUB_SECTION_NUM; };

    validDrop(from, to) {
        var spaceIsEmpty = this.state.board[to.y][to.x].block == -1;
        var spaceHasBlockBelowOrFloor = to.y == 0 || this.state.board[to.y - 1][to.x].block > -1;
        var spaceBelowIsNotCurrentPos = !(from.x == to.x && to.y - 1 == from.y);
        var noBlockAboveOrCeiling = from.y == (this.settings.BOARD_DIM.h - 1) ||
            this.state.board[from.y + 1][from.x].block == -1;

        return (spaceIsEmpty && spaceHasBlockBelowOrFloor && spaceBelowIsNotCurrentPos && noBlockAboveOrCeiling);
    };

    dropBlock(from, to) {
        if(this.validDrop(from, to)) {
            this.state.board[to.y][to.x] = this.state.board[from.y][from.x];
            this.state.board[from.y][from.x] = o();

            return true; // accepted move
        }

        return false; // rejected move
    };

    dragBlock(from) {};

    dragOverBlock(from, over) {};
}

class GameServer {
    constructor() {
        this.inProgress = [];
        this.onDeck = [];
        this.playerGameIndexMap = {};
    }

    joinMoveABlock(io, socket, playerId) {

        if (this.playerInGame(playerId)) {
            console.log('Player already in game ' + playerId);

            let game = this.getGameByPlayerId(playerId);
            game.updateSocketId(playerId, socket.id);

            io.to(game.getPlayerSocketIds()).emit('moveablock', {playerId: playerId, status: game.status, state: game.state});
        } else {

            console.log('Player joining game: ' + playerId);

            if (this.onDeck.length > 0) {
                console.log('2nd player joined, starting game ...');
                var game = this.onDeck.pop();
                game.status = GAME_STATUS.JOINED;
                game.player2 = {playerId: playerId, socketId: socket.id};
                var gameIndex = this.inProgress.push(game) - 1;
                this.playerGameIndexMap[game.player1.playerId] = gameIndex;
                this.playerGameIndexMap[game.player2.playerId] = gameIndex;
                
                io.to(game.getPlayerSocketIds()).emit('moveablock', {playerId: playerId, status: game.status, state: game.state});
            } else {
                console.log('Creating new game on-deck ...');
                let newGame = new MoveABlock(playerId, socket.id);
                this.onDeck.push(newGame);
                io.to(newGame.getPlayerSocketIds()).emit('moveablock', {playerId: playerId, status: newGame.status, state: newGame.state});
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
        } else if ((this.onDeck[0] && this.onDeck[0].player1.playerId == playerId)
            || (this.onDeck[0] && this.onDeck[0].player2.playerId == playerId)) {
            return this.onDeck[0];
        } else {
            console.log('Game not found for player id: ' + playerId);
            return null;
        }
    }

    move(io, playerId, aMove) {
        console.log('Processing move ' + playerId + ', ' + JSON.stringify(aMove));
        var gameIndex = this.playerGameIndexMap[playerId];

        console.log('Game index: ' + gameIndex);

        if (gameIndex !== null && gameIndex >= 0) {
            if (aMove.event === EVENTS.DROP) {
                var game = this.inProgress[gameIndex];
                var accepted = game.dropBlock(aMove.from.pos, aMove.to.pos);

                if (accepted) {
                    console.log('Move accepted ...');

                    var otherPlayerSocketId = game.getOtherPlayerSocketId(playerId);

                    if(otherPlayerSocketId) {
                        io.to(otherPlayerSocketId).emit('moveablock', {event: aMove.event, playerId: playerId, 
                            from: aMove.from, to: aMove.to, state: game.state});
                    }
                }
                    
                // whether rejected or not, send game state back to socket to help
                // keep the state synced properly
                io.to(game.getPlayerSocketIds()).emit('moveablock', {playerId: playerId, status: game.status, state: game.state});
                
            }
        } else {
            console.log('Game not found for player id: ' + playerId);
            console.log(JSON.stringify(this.playerGameIndexMap));
        }
    }

    drag(io, playerId, msg) {
        var game = this.getGameByPlayerId(playerId);

        var otherPlayerSocketId = game.getOtherPlayerSocketId(playerId);

        if (otherPlayerSocketId) {
            io.to(otherPlayerSocketId).emit('moveablock', msg);
        }
    }
}

if (module && module.exports) {
    module.exports = {MoveABlock, GameServer, EVENTS, GAME_STATUS};
}