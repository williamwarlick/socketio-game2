const rounds = require('./rounds');
const components = require('./components');
const fs = require('fs');
const csv = require('csv-parser');

const cachedCsvData = null;


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const loadFromFile = async (filePath) => {
    // Create an empty array to store the parsed CSV data
    const csvData = [];

    if (!cachedCsvData) {
        try {
            const stream = fs.createReadStream(filePath)
            .pipe(csv());
        
            for await (const row of stream) {
            // Process each row of the CSV file
            csvData.push(row);
            }

            //shuffleArray(csvData);
        
            //console.log(csvData[0]);
        } catch (error) {
            console.error('Error parsing CSV:', error);
        }
    } else {
        csvData = cachedCsvData;
    }

    return csvData;
};

function convertColorToSpace(color) {
    var space = components.o(); // empty

    if (color !== 'white') {
        space = new components.Space(color.trim().toUpperCase());
    }

    return space;
}

function convertBoardConfig(array, rows, columns) {
    const result = [];
  
    for (let i = rows - 1; i >= 0; i--) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        const index = i * columns + j;
        if (index < array.length) {
          row.push(convertColorToSpace(array[index]));
        } else {
          throw new Error(`Board config is not the correct size for row/col: ${rows}, ${columns}`);
        }
      }

      if (row.length != columns) {
        console.log(array);
        console.log(row);
        console.log(`array length: ${array.length} should be ${columns}`);
        throw new Error(`Single Player file round config size does not match settings: cols ${columns}`);
        }

      result.push(row);
    }
  
    return result;
}

const loadRoundsFromFile = async (filePath) => {
    const csvData = await loadFromFile(filePath);
    const roundIdMap = {};
    //const theRounds = [];

    for (csvRow of csvData) {
        let round = new rounds.Round();
        let goal = new rounds.Goal();

        if (!roundIdMap[csvRow.ID]) {
            roundIdMap[csvRow.ID] = [];
        }

        round.importId = csvRow.ID;
        round.initBoard = convertBoardConfig(JSON.parse(csvRow.config.replaceAll("'",'"')), 6, 18);

        var parseGoal = csvRow.goal.trim().split(' ');
        goal.action = parseGoal[0].toUpperCase();

        if (goal.action !== rounds.GOAL_ACTION.FILL) {
            goal.blockType = parseGoal[1].trim().toUpperCase();
        }

        var sectionString = parseGoal[2];
        var theSection = sectionString[0].toUpperCase();
        var theSubSection = null;
        
        if (sectionString.toUpperCase() !== 'ALL' && sectionString.length > 1) {

            if(Number.isNaN(Number(sectionString[1]))) {
                console.log('Warning, section string not a number: ' + sectionString[1] + ' from ' + sectionString);
            } else {
                theSubSection = parseInt(sectionString[1]) - 1;
            }
        }

        goal.section = new components.Section(rounds.SECTION[theSection], 
            theSubSection);
        goal.minMoves = csvRow['goal_optimal'];

        goal.description = csvRow.goal;

        round.goals = [goal];
        roundIdMap[csvRow.ID].push(round);
    }

    return roundIdMap;

};

const loadMapRoundsFromFile = async (filePath) => {
    const csvData = await loadFromFile(filePath);
    const roundIdMap = new Map();
    //const theRounds = [];

    for (csvRow of csvData) {
        let round = new rounds.Round();
        let goal = new rounds.Goal();

        if (!roundIdMap.get(csvRow.ID)) {
            roundIdMap.set(csvRow.ID, []);
        }

        round.importId = csvRow.ID;
        round.initBoard = convertBoardConfig(JSON.parse(csvRow.config.replaceAll("'",'"')), 6, 18);

        var parseGoal = csvRow.goal.trim().split(' ');
        goal.action = parseGoal[0].toUpperCase();

        if (goal.action !== rounds.GOAL_ACTION.FILL) {
            goal.blockType = parseGoal[1].trim().toUpperCase();
        }

        var sectionString = parseGoal[2];
        var theSection = sectionString[0].toUpperCase();
        var theSubSection = null;
        
        if (sectionString.toUpperCase() !== 'ALL' && sectionString.length > 1) {

            if(Number.isNaN(Number(sectionString[1]))) {
                console.log('Warning, section string not a number: ' + sectionString[1] + ' from ' + sectionString);
            } else {
                theSubSection = parseInt(sectionString[1]) - 1;
            }
        }

        goal.section = new components.Section(rounds.SECTION[theSection], 
            theSubSection);
        goal.minMoves = csvRow['goal_optimal'];

        goal.description = csvRow.goal;

        round.goals = [goal];
        roundIdMap.get(csvRow.ID).push(round);
    }

    return roundIdMap;

};

if (module && module.exports) {
    module.exports = {loadFromFile, loadRoundsFromFile, loadMapRoundsFromFile};
}