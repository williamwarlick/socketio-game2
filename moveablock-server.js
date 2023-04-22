const EVENTS = {
    DRAGSTART: 'dragstart',
    DRAGOVER: 'dragover',
    DROP: 'drop',
    NONE: 'none',
};

const o = () => { return {state: EVENTS.NONE, block: -1} };
const r = () => { return {state: EVENTS.NONE, block: 0} };
const b = () => { return {state: EVENTS.NONE, block: 2} };
const g = () => { return {state: EVENTS.NONE, block: 1} };

class MoveABlock {
    
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
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

    joinMoveABlock(io, playerId) {
        console.log('Player joining game: ' + playerId);

        if (this.onDeck.length > 0) {
            console.log('2nd player joined, starting game ...');
            var game = this.onDeck.pop();
            game.player2 = playerId;
            var gameIndex = this.inProgress.push(game) - 1;
            this.playerGameIndexMap[game.player1] = gameIndex;
            this.playerGameIndexMap[game.player2] = gameIndex;
            //this.onStateChange(playerId, null, game.state);
            io.emit('moveablock', {playerId: playerId, move: null, state: game.state});
        } else {
            console.log('Creating new game on-deck ...');
            this.onDeck.push(new MoveABlock(playerId));
        }
    }

    move(socket, playerId, aMove) {
        console.log('Processing move ' + playerId + ', ' + JSON.stringify(aMove));
        var gameIndex = this.playerGameIndexMap[playerId];

        console.log('Game index: ' + gameIndex);

        if (gameIndex !== null && gameIndex >= 0) {
            if (aMove.event === EVENTS.DROP) {
                var game = this.inProgress[gameIndex];
                var accepted = game.dropBlock(aMove.from.pos, aMove.to.pos);

                if (accepted) {
                    console.log('Move accepted ...');
                    socket.broadcast.emit('moveablock', {playerId: playerId, move: aMove, state: game.state});
                }
            }
        } else {
            console.log('Game not found for player id: ' + playerId);
            console.log(JSON.stringify(this.playerGameIndexMap));
        }
    }
}

if (module && module.exports) {
    module.exports = {MoveABlock, GameServer, EVENTS};
}