const rounds = require('./rounds');
const mab = require('./moveablock2');

const o = mab.o;
const r = mab.r;
const b = mab.b;
const g = mab.g;

var defaultTestBoard = [
    [o(),o(),o(),o(),o(),o(),r(),r(),g(),g(),r(),b(),g(),r(),g(),g(),r(),r()],
    [o(),o(),o(),o(),o(),o(),b(),r(),o(),b(),o(),b(),r(),g(),g(),g(),r(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),r(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),r(),r(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),r(),g(),r(),o(),o(),o()],
];

var coverTestBoard = [
    [o(),o(),o(),o(),o(),o(),r(),r(),g(),g(),r(),b(),g(),r(),g(),g(),r(),r()],
    [o(),o(),o(),o(),o(),o(),b(),r(),o(),b(),o(),b(),r(),g(),g(),g(),r(),o()],
    [o(),o(),o(),o(),o(),o(),r(),o(),o(),r(),o(),r(),r(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),r(),r(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),r(),g(),r(),o(),o(),o()],
];

var uncoverTestBoard = [
    [o(),o(),o(),o(),o(),o(),r(),r(),g(),g(),r(),b(),g(),r(),g(),g(),r(),r()],
    [o(),o(),o(),o(),o(),o(),b(),r(),o(),b(),o(),o(),r(),g(),g(),g(),r(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),r(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),g(),g(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),g(),r(),r(),o(),o(),o()],
    [o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),o(),r(),g(),r(),o(),o(),o()],
];

const game = new mab.Game();
game.board.spaces = uncoverTestBoard;

//const goal = new rounds.Goal(rounds.GOAL_ACTION.FILL, null, new mab.Section(rounds.SECTION.C, 0));

//const goal = new rounds.Goal(rounds.GOAL_ACTION.CLEAR, null, new mab.Section(rounds.SECTION.A, null));

//const goal = new rounds.Goal(rounds.GOAL_ACTION.MOVE, mab.BLOCK_TYPE.BLUE, new mab.Section(rounds.SECTION.B, null));

const goal = new rounds.Goal(rounds.GOAL_ACTION.UNCOVER, mab.BLOCK_TYPE.BLUE, null);

const round = new rounds.Round(game.board, [goal]);

console.log(round.isComplete(game.board));