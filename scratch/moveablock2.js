const utils = require('./utils');

const GAME_MODE = {
    ONE_PLAYER: 'ONE_PLAYER',
    TWO_PLAYER: 'TWO_PLAYER',
}

const BLOCK_TYPE = {
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
    EMPTY: 'EMPTY',
}

const GOAL_STATUS = {
    INCOMPLETE: 'INCOMPLETE',
    COMPLETE: 'COMPLETE',
}

const SPACE_STATUS = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
}

const PLAYER_ROLE = {
    ARCHITECT: 'ARCHITECT',
    HELPER: 'HELPER',
}

class Location {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '{' + this.x + ', ' + this.y + '}';
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.location = new Location(0,0); // start at 0,0
        this.blockType = BLOCK_TYPE.EMPTY;
        this.blockLocation = null;
        this.role = null;
    }

    // sets a copy
    setLocation(location) {
        this.location.x = location.x;
        this.location.y = location.y;
    }
}

class Move {
    constructor(playerId, from, to) {
        this.playerId = playerId;
        this.from = from;
        this.to = to;
    }

    toString() {
        return `playerId: ${this.playerId}, from: ${this.from}, to: ${this.to}`;
    }
}

const o = () => { return new Space(BLOCK_TYPE.EMPTY)};
const r = () => { return new Space(BLOCK_TYPE.RED)};
const b = () => { return new Space(BLOCK_TYPE.BLUE)};
const g = () => { return new Space(BLOCK_TYPE.GREEN)};

class Board {
    constructor() {
        this.spaces = [];

        this.moves = [];

        this.init();
    }

    init() {
        this.spaces = [
            [r(),r(),g(),g(),r(),b(),r(),r(),g(),g(),r(),b(),b(),o(),g(),g(),r(),b()],
            [b(),b(),g(),g(),r(),b(),b(),r(),o(),b(),o(),b(),o(),o(),g(),g(),r(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
            [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o()],
        ];
    }

}

class Goal {
    constructor(assignedTo) {
        this.assignedTo = assignedTo;
        this.status = GOAL_STATUS.INCOMPLETE;
        this.goal = null; // TODO: figure this out
    }
}

class Round {
    constructor(instructions, isGoalMet) {
        this.isGoalMet = isGoalMet;
        this.instructions = instructions;
    }
}

/*class Block {
    constructor(type) {
        this.type = type;
    }
}*/

/*class Cursor {
    constructor(player, status) {
        this.player = player;
        this.status = status;
    }
}*/

class Space {
    constructor(blockType) {
        this.blockType = blockType;
        this.status = SPACE_STATUS.OPEN;
    }

    equals(space) {
        return this.blockType === space.blockType;
    }
}

class Game {
    constructor () {
        this.mode = null,
        this.players = [];
        this.board = new Board();
        this.rounds = [];
        this.currentRound = 0;

        this.settings = {
            BOARD_DIM: {w: 18, h: 6},
            SECTION_NUM: 3,
            SUB_SECTION_NUM: 2,
            ROUNDS_NUM: 1,
            BLOCK_GROUPS: [
                {
                    type: BLOCK_TYPE.RED,
                    count: 10,
                },
                {
                    type: BLOCK_TYPE.BLUE,
                    count: 10,
                },
                {
                    type: BLOCK_TYPE.GREEN,
                    count: 10,
                },
            ]
        };

        this.initRounds();

    }

    initRounds() {
        for(var i=0; i < this.settings.ROUNDS_NUM; i++) {
            let newRound = new Round("Stack 5 blue block on top of each other.", () => {
                var pattern = [
                    [b()],
                    [b()],
                    [b()],
                    [b()],
                    [b()],
                ];

                return utils.findPattern(this.board.spaces, pattern);
            });

            this.rounds.push(newRound);
        }
    }

    getSectionWidth() { return this.settings.BOARD_DIM.w/this.settings.SECTION_NUM; };

    getSubSectionWidth() { return this.getSectionWidth()/this.settings.SUB_SECTION_NUM; };

    validDrop(from, to) {
        var fromNotEmpty = this.board.spaces[from.y][from.x].blockType != BLOCK_TYPE.EMPTY;
        var spaceIsEmpty = this.board.spaces[to.y][to.x].blockType == BLOCK_TYPE.EMPTY;
        var spaceHasBlockBelowOrFloor = to.y == 0 || this.board.spaces[to.y - 1][to.x].blockType != BLOCK_TYPE.EMPTY;
        var spaceBelowIsNotCurrentPos = !(from.x == to.x && to.y - 1 == from.y);
        var noBlockAboveOrCeiling = from.y == (this.settings.BOARD_DIM.h - 1) ||
        this.board.spaces[from.y + 1][from.x].blockType == BLOCK_TYPE.EMPTY;

        return (fromNotEmpty && spaceIsEmpty && spaceHasBlockBelowOrFloor && spaceBelowIsNotCurrentPos && noBlockAboveOrCeiling);
    };

    moveBlock(playerId, from, to) {
        if(this.validDrop(from, to)) {
            this.board.spaces[to.y][to.x] = this.board.spaces[from.y][from.x];
            this.board.spaces[from.y][from.x] = o();

            this.board.moves.push(new Move(playerId, from, to));

            // check for Round goal met
            if (this.rounds[this.currentRound].isGoalMet()) {
                console.log("Goal is met.")
            } else {
                console.log("Goal not met.");
            }

            return true; // accepted move
        }

        return false; // rejected move
    };

    getPlayerById(playerId) {
        return this.players.find(player => {return player.id === playerId});
    }

    updateCursor(playerId, location) {
        var player = this.getPlayerById(playerId);

        if  (player) {
            player.setLocation(location);
        } else {
            console.log('Player ID ' + playerId + ' not found.');
        }
    };

    printMoves() {
        for (var i = 0; i < this.board.moves.length; i++) {
            console.log(`${i}: ${this.board.moves[i]}`);
        }
        console.log('');
    }

    printBoard() {
        for (var i=this.board.spaces.length-1; i > -1; i--) {
            var row = '';

            for (var j=0; j < this.board.spaces[i].length; j++) {
                var space = '';
                switch (this.board.spaces[i][j].blockType) {
                    case BLOCK_TYPE.RED:
                        space = 'R';
                        break;
                    case BLOCK_TYPE.BLUE:
                        space = 'B';
                        break;
                    case BLOCK_TYPE.GREEN:
                        space = 'G';
                        break;
                    default:
                        space = 'O';
                }

                if (this.players[0].location.x == j && this.players[0].location.y == i) {
                    space = '[' + space + ']';
                } else {
                    space = ' ' + space + ' ';
                }

                row = row + space;
            }

            console.log(row);
        }

        console.log('');
    }
    
}

if (module && module.exports) {
    module.exports = {Game, Player, Location, GAME_MODE};
}