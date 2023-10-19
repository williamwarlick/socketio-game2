const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });

// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const MAB_TABLE = 'mabGame';

const updateItem = async (item, tableName) => {
    var result = await docClient
        .put({
            Item: item
            ,
            TableName: tableName
        })
        .promise();

    return result;
};

async function scanTable(tableName) {

    // Scan the DynamoDB table to retrieve all items
    const data = await docClient.scan({
        TableName: tableName
      }).promise();

    return data.Items;
}

const save = async (data) => {
    console.log('Saving game data id: ' + data.id + ', round num: ' + data.roundNum);

    await updateItem(data, MAB_TABLE);
}

const getAll = async (tableName) => {
    return await scanTable(tableName);
}

const getDataByUserId = async (userId, tableName) => {
    const params = {
        TableName : tableName,
        FilterExpression : 'player1 = :player1 and #stat = :stat',
        ExpressionAttributeNames: {
            '#stat': 'status'
        },
        ExpressionAttributeValues : {':player1' : userId, ':stat': 'COMPLETE'}
      };

    const data = await docClient.scan(params).promise();

    return data.Items;
}

const getAllFormat1 = async (tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        // loop through each round
        for (let [index, round] of game.rounds.entries()) {

            for (move of round.moves) {
                formatted.push({
                    gameId: game.id,
                    gameStart: game.gameStart,
                    gameComplete: game.gameComplete,
                    importId: round.importId,
                    roundNum: index,
                    playerId: move.playerId,
                    playerRole: game.players.find(player => player.id == move.playerId).role,
                    config: round.initBoard.map((row) => {
                        return row.map((block) => {
                            return block.blockType;
                        });
                    }),
                    goal: round.goals[0].description,
                    //"goal_optimal": null,
                    //"goal_type": round.goals[0].action,
                    //"total_moves": round.moves.length,
                    moveTimestamp: move.timestamp,
                    move: `[(${move.from.x},${move.from.y}),(${move.to.x},${move.to.y})]`,
                    dimensions: `${round.initBoard.length}, ${round.initBoard[0].length}`,
                    demographicDetails: game.demographicDetails
                });
            }
        }
    }

    return formatted;

}

const convertToCSV = (arr) => {
    const arrayKeys = Object.keys(arr[0]);
    const csvHeader = arrayKeys.join(',');
    const csvRows = arr.map(row => {
        const values = arrayKeys.map(key => {
            const cellValue = row[key] === null || row[key] === undefined ? '' : row[key];
            return JSON.stringify(cellValue);
        });
        return values.join(',');
    });
    return [csvHeader, ...csvRows].join('\n');
}

const combine2DArray = (arr2d) => {
    return arr2d.reduce((reduced, currentVal) => {
        return reduced + currentVal.join(',');
    }, "[") + "]";
}


const getAllCsv = async (tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        // loop through each round
        for (let [index, round] of game.rounds.entries()) {


            for (move of round.moves) {
                var from = coordinatesToInteger(move.from.x, move.from.y, round.initBoard[0].length, round.initBoard.length);
                var to = coordinatesToInteger(move.to.x, move.to.y, round.initBoard[0].length, round.initBoard.length);
                formatted.push({
                    gameId: game.id,
                    gameStart: game.gameStart,
                    gameComplete: game.gameComplete,
                    importId: round.importId,
                    roundNum: index,
                    playerId: move.playerId,
                    playerRole: game.players.find(player => player.id == move.playerId).role,
                    goal: round.goals[0].description,
                    moveTimestamp: move.timestamp,
                    //moveC: `[(${move.from.x},${move.from.y}),(${move.to.x},${move.to.y})]`,
                    move: `(${from},${to})`,
                    dimensions: `${round.initBoard.length}, ${round.initBoard[0].length}`,
                    demographicDetails: game.demographicDetails ? `{${Object.keys(game.demographicDetails).map(key => `${key}: ${game.demographicDetails[key]}`).join(', ')}}` : null,
                    config: combine2DArray(round.initBoard.map((row) => {
                        return row.map((block) => {
                            return block.blockType;
                        });
                    }).reverse()),
                });
            }
        }
    }

    return convertToCSV(formatted);

}

function coordinatesToInteger(x, y, width, height) {
    var num;

    num = ((height-1) - y)*width + x;

    return num;
}

if (module && module.exports) {
    module.exports = {save, getAll, getAllFormat1, getAllCsv, getDataByUserId};
}