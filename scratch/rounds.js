const mab = require('./moveablock2');

const GOAL_ACTION = {
    FILL: 'FILL',
    COVER: 'COVER',
    CLEAR: 'CLEAR',
    UNCOVER: 'UNCOVER',
    MOVE: 'MOVE',
}

const SECTION = {
    A: 0,
    B: 1,
    C: 2,
}

class Round {
    constructor(initBoard, goals) {
        this.initBoard = initBoard,
        this.goals = goals;
    }

    isComplete(board) {
        for(var i = 0; i < this.goals.length; i++) {
            if(!this.goals[i].isMet(board)) {
                return false;
            }
        }

        return true;
    }
}

function checkFill(blockType, section, board) {
    var sectionSubArray = board.getSectionSubArray(section);

    // if there is any empty blocks, false
    for (var y = 0; y < sectionSubArray.length; y++) {
        for (var x = 0; x < sectionSubArray[0].length; x++) {
            if (sectionSubArray[y][x].blockType === mab.BLOCK_TYPE.EMPTY) {
                return false;
            }
        }
    }

    return true;
}

function checkClear(blockType, section, board) {
    var sectionSubArray = board.getSectionSubArray(section);

    for (var y = 0; y < sectionSubArray.length; y++) {
        for (var x = 0; x < sectionSubArray[0].length; x++) {
            if (sectionSubArray[y][x].blockType !== mab.BLOCK_TYPE.EMPTY) {
                return false;
            }
        }
    }

    return true;
}

function checkCover(blockType, section, board) {
    // loop through entire board

    // TODO: verify if 'cover' can include blocks of the same type/color

    // if blockType matches and there is not a block above/covering return false
    for (var row = 0; row < board.spaces.length; row++) {
        for (var col = 0; col < board.spaces[0].length; col++) {
            var space = board.spaces[row][col];
            
            if (space.blockType === blockType) {
                // top row and block type matches, return false
                if (row === board.spaces.length - 1) {
                        return false;
                } else {
                    var spaceAbove = board.spaces[row + 1][col];
                    
                    // if block is uncovered, return false
                    if (spaceAbove.blockType === mab.BLOCK_TYPE.EMPTY) {
                        return false;
                    }
                }
            }
        }
    }


    // if all the blocks are covered, return true
    return true;
}

function checkUnCover(blockType, section, board) {
    // loop through entire board

    // TODO: verify if 'cover' can include blocks of the same type/color

    // if blockType matches and there is a block above/covering return false
    // and skip top row
    for (var row = 0; row < board.spaces.length - 1; row++) {
        for (var col = 0; col < board.spaces[0].length; col++) {
            var space = board.spaces[row][col];
            
            if (space.blockType === blockType) {
                var spaceAbove = board.spaces[row + 1][col];
                    
                // if block is covered, return false
                if (spaceAbove.blockType !== mab.BLOCK_TYPE.EMPTY) {
                    return false;
                }
            }
        }
    }

    // if all the blocks are uncovered, return true
    return true;
}

function checkMove(blockType, section, board) {
    var sectionSubArray = board.getSectionMinusSubArray(section);

    console.log(sectionSubArray);
    for (var y = 0; y < sectionSubArray.length; y++) {
        for (var x = 0; x < sectionSubArray[0].length; x++) {
            if (sectionSubArray[y][x].blockType === blockType) {
                return false;
            }
        }
    }

    return true;
}

class Goal {
    constructor(action, blockType, section, description) {
        this.action = action;
        this.blockType = blockType;
        this.section = section;
        this.description = description;
    }

    isMet(board) { // board.spaces is 2D array
        switch(this.action) {
            case GOAL_ACTION.FILL:
                return checkFill(this.blockType, this.section, board);
                break;
            case GOAL_ACTION.CLEAR:
                return checkClear(this.blockType, this.section, board);
                break;
            case GOAL_ACTION.MOVE:
                return checkMove(this.blockType, this.section, board);
                break;
            case GOAL_ACTION.COVER:
                return checkCover(this.blockType, this.section, board);
                break;
            case GOAL_ACTION.UNCOVER:
                return checkUnCover(this.blockType, this.section, board);
                break;   
            default:
                console.log(`Action ${this.action} not implemented.`);
        }

        return false;
    }
}

if (module && module.exports) {
    module.exports = {Round, Goal, GOAL_ACTION, SECTION};
}