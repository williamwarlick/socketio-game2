const utils = require('./utils');

const grid = [
    [0,1,1,1,0],
    [1,1,1,0,0],
    [1,0,1,1,0],
    [1,0,1,0,1],
];

const pattern1 = 
    [
        [1,1],
        [1,1]
    ];

const pattern2 = [
    [0],
    [1],
    [1],
    [1],
];

const result = utils.findPattern(grid, pattern2);

console.log(result);