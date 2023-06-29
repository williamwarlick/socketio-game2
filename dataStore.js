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

const save = (data) => {
    console.log('Saving game data id: ' + data.id + ', round num: ' + data.roundNum);
    
    //updateItem(data, MAB_TABLE);
}

const getAll = async (tableName) => {
    return await scanTable(tableName);
}

const getAllFormat1 = async (tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        // loop through each round
        for (round of game.rounds) {

            for (move of round.moves) {
                formatted.push({
                    gameId: game.id,
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
                    move: `[(${move.from.x},${move.from.y}),(${move.to.x},${move.to.y})]`,
                    dimensions: `${round.initBoard.length}, ${round.initBoard[0].length}`
                });
            }
        }
    }

    return formatted;

}

if (module && module.exports) {
    module.exports = {save, getAll, getAllFormat1};
}