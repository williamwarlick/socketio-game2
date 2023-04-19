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
    
    constructor() {
        this.player1 = null;
        this.player2 = null;
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
        if(this.validDrop()) {
            this.state.board[to.y][to.x] = this.state.board[from.y][from.x];
            this.state.board[from.y][from.x] = o;
        }
    };

    dragBlock(from) {};

    dragOverBlock(from, over) {};
}

class GameServer {
    constructor() {
        this.inProgress = [];
        this.onDeck = [];
    }
}

if (module && module.exports) {
    module.exports = {MoveABlock, GameServer, EVENTS};
}