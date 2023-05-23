const {BLOCK_TYPE, Section, Space, SPACE_STATUS, r, o, g, b} = require('./components');
const rnds = require('./rounds');

const GAME_MODE = {
    ONE_PLAYER: 'ONE_PLAYER',
    TWO_PLAYER: 'TWO_PLAYER',
}

const GAME_STATUS = {
    NEW: 'NEW',
    WAITING: 'waiting',
    JOINED: 'joined',
    STARTED: 'STARTED',
    COMPLETE: 'COMPLETE',
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

class Board {
    constructor(boardDim, sectionNum, subSectionNum) {
        this.boardDim = boardDim;
        this.sectionNum = sectionNum;
        this.subSectionNum = subSectionNum;

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

    // returns the section of the board
    getSectionSubArray(section) {
        
        if (!section) { return this.spaces };

        var sectionSubArray = [];

        var sectionSize = this.boardDim.w/this.sectionNum;
        var subSectionSize = this.boardDim.w/this.sectionNum;

        var sectionStart = section.section * sectionSize;

        if (section.subsection != null) {
            subSectionSize = subSectionSize/this.subSectionNum;
            sectionStart = sectionStart + section.subsection * subSectionSize;
        }

        console.log('Section size ' + sectionSize);
        console.log('Sub section size ' + subSectionSize);
        console.log('Section start ' + sectionStart);

        for(var y = 0; y < this.spaces.length; y++) {
            sectionSubArray.push(this.spaces[y].slice(sectionStart, sectionStart + subSectionSize));
        }
        
        return sectionSubArray;
    }

    // returns the board with the section removed
    getSectionMinusSubArray(section) {
        if (!section) { return this.spaces };

        // clone board
        var spacesCopy = this.spaces.slice();

        var sectionSize = this.boardDim.w/this.sectionNum;
        var subSectionSize = this.boardDim.w/this.sectionNum;

        var sectionStart = section.section * sectionSize;

        if (section.subsection != null) {
            subSectionSize = subSectionSize/this.subSectionNum;
            sectionStart = sectionStart + section.subsection * subSectionSize;
        }

        console.log('Section size ' + sectionSize);
        console.log('Sub section size ' + subSectionSize);
        console.log('Section start ' + sectionStart);

        for(var y = 0; y < spacesCopy.length; y++) {
            spacesCopy[y].splice(sectionStart, subSectionSize);
        }
        
        return spacesCopy;
    }

}

class Game {
    constructor () {
        this.mode = null,
        this.players = [];
        
        this.rounds = [];
        this.currentRound = 0;
        this.status = GAME_STATUS.WAITING;

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

        this.board = new Board(this.settings.BOARD_DIM, this.settings.SECTION_NUM, this.settings.SUB_SECTION_NUM);

        this.initRounds();

        this.board.spaces = this.rounds[this.currentRound].initBoard;

    }

    initRounds() {
        this.rounds = rnds.getDefaultRounds(this.settings.ROUNDS_NUM);
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
            if (this.rounds[this.currentRound].isComplete(this.board)) {
                console.log("Goal is met.")

                // if last round, change game status to complete
                if (this.currentRound === this.rounds.length - 1) {
                    this.status = GAME_STATUS.COMPLETE;
                } else {
                    // increment the round
                    this.currentRound = this.currentRound + 1;
                    // reset board space
                    this.spaces = this.rounds[this.currentRound].initBoard;
                }

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

    printCurrentRoundInstructions() {
        var currRound = this.rounds[this.currentRound];
        console.log(`Round ${this.currentRound} Instructions: `);
        for (var goal of currRound.goals) {
            console.log(goal.description);
        }
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
    module.exports = {Game, Player, Location, GAME_MODE, GAME_STATUS};
}