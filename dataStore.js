const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });

const { o } = require('./components');

// Local DynamoDB

// Configure AWS to use local DynamoDB 

AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000",
    accessKeyId: 'fakeMyKeyId', // Dummy access key id
    secretAccessKey: 'fakeSecretAccessKey'  // Dummy secret access key
  });
  
const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: "mabGame",
    KeySchema: [
        { AttributeName: "gameId", KeyType: "HASH" }, // Partition key
        { AttributeName: "roundNum", KeyType: "RANGE" }  // Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "gameId", AttributeType: "S" },
        { AttributeName: "roundNum", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};


// // Parameters for deleting the table
// const deleteTableParams = {
//     TableName: "mabGame",
// };

// dynamodb.deleteTable(deleteTableParams, function(err, data) {
//     if (err) {
//         console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
//         // Optionally, recreate the table here.
//     }
// });

const createTable = () => { 
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Error JSON.", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table.", JSON.stringify(data, null, 2));
        }
    });
}

createTable(); 
  


// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const MAB_TABLE = 'mabGame';
const saveGameGoal = (submissionData) => {
    const {
        gameId, playerId, version, roundNum, stoppingPointNum, stoppingPoint, importId, config,
        playerResponse, typingTime, numWatches, demographicDetails
    } = submissionData;

    const item = {
        gameId, // Partition key
        roundNum, // Sort key
        playerId, version, stoppingPointNum, stoppingPoint, importId, config,
        playerResponse, typingTime, numWatches, demographicDetails
    };

    const params = {
        TableName: MAB_TABLE,
        Item: item
    };

  
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          reject(err);
        } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
          resolve(data);
        }
      });
    });
  };
  


  
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

const getCurrentBoardState = (moveBeginningBoardState, fromMove, toMove) => {
    moveBeginningBoardState[toMove.y][toMove.x] = moveBeginningBoardState[fromMove.y][fromMove.x]
    moveBeginningBoardState[fromMove.y][fromMove.x] = o()

    return moveBeginningBoardState
}

const getAllFormat1 = async (tableName) => {
    var raw = await getAll(tableName);

    return raw.map(game => {
        const rounds = [...game.rounds.entries()].map(entry => entry[1])
        return rounds.map((round, roundIndex) => {
            return round.moves.map((move) => {
                return (
                    {
                        gameId: game.id,
                        gameStart: game.gameStart,
                        gameComplete: game.gameComplete,
                        importId: round.importId,
                        roundNumber: roundIndex,
                        playerId: move.playerId,
                        playerRole: game.players.find(player => player.id == move.playerId).role,
                        goal: round.goals[0].description,
                        moveTimestamp: move.timestamp,
                        move: `[(${move.from.x},${move.from.y}),(${move.to.x},${move.to.y})]`,
                        dimensions: `${round.initBoard.length}, ${round.initBoard[0].length}`,
                        initBoard: round.initBoard
                    }
                )
            })
        })
    })
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

const getDemographicDetailsFormat1 = async(tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        if (game.demographicDetails) {
            formatted.push({
                playerId: game.player1,
                gameId: game.id,
                additionalInformation: game.demographicDetails.additionalInformation,
                age: game.demographicDetails.age,
                gender: game.demographicDetails.gender,
                handedness: game.demographicDetails.handedness,
                hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin: game.demographicDetails.hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin,
                racialCategories: game.demographicDetails.racialCategories,
                timeOfDayPreference: game.demographicDetails.timeOfDayPreference,
                yearsOfFormalEducation: game.demographicDetails.yearsOfFormalEducation,
            })
        }
    }

    return formatted;

}


const getDemographicDetailsCsv = async(tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        if (game.demographicDetails) {
            formatted.push({
                playerId: game.player1,
                gameId: game.id,
                additionalInformation: game.demographicDetails.additionalInformation,
                age: game.demographicDetails.age,
                gender: game.demographicDetails.gender,
                handedness: game.demographicDetails.handedness,
                hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin: game.demographicDetails.hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin,
                racialCategories: game.demographicDetails.racialCategories.join(', '),
                timeOfDayPreference: game.demographicDetails.timeOfDayPreference,
                yearsOfFormalEducation: game.demographicDetails.yearsOfFormalEducation,
            })
        }
    }

    return convertToCSV(formatted);

}


const getAllCsv = async (tableName) => {
    var raw = await getAll(tableName);

    var formatted = [];

    // loop through each game
    for (game of raw) {
        // loop through each round
        for (let [roundIndex, round] of game.rounds.entries()) {
            round.moves.forEach((move) => {
                var from = coordinatesToInteger(move.from.x, move.from.y, round.initBoard[0].length, round.initBoard.length);
                var to = coordinatesToInteger(move.to.x, move.to.y, round.initBoard[0].length, round.initBoard.length);
                formatted.push({
                    gameId: game.id,
                    gameStart: game.gameStart,
                    gameComplete: game.gameComplete,
                    importId: round.importId,
                    roundNumber: roundIndex,
                    playerId: move.playerId,
                    playerRole: game.players.find(player => player.id == move.playerId).role,
                    goal: round.goals[0].description,
                    moveTimestamp: move.timestamp,
                    move: `(${from},${to})`,
                    dimensions: `${round.initBoard.length}, ${round.initBoard[0].length}`,
                    initBoard: round.initBoard
                });
            })
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
    module.exports = {save, getAll, getAllFormat1, getAllCsv, getDataByUserId, getDemographicDetailsCsv, getDemographicDetailsFormat1, saveGameGoal,};
}