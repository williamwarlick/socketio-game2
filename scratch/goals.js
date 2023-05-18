const mab = require('./moveablock2');

const GOAL_ACTION = {
    FILL: 'FILL',
    COVER: 'COVER',
    CLEAR: 'CLEAR',
    UNCOVER: 'UNCOVER',
    MOVE: 'MOVE',
}

class Goal {
    constructor(action, blockType, section) {
        this.action = action;
        this.blockType = blockType;
        this.section = section;
    }

    isMet(board) { // board.spaces is 2D array

    }
}

if (module && module.exports) {
    module.exports = {Goal};
}