const loader = require('../round-loader');

describe("loadFromFile", () => {
    test('Loads rounds csv file', async () => {
        var csvData = await loader.loadFromFile('./final_move_df.csv');

        expect(typeof csvData[0].ID).toBe('string');
        expect(csvData[0].ID).not.toEqual('');
        expect(csvData[0].ID.length).toBeGreaterThan(0);
    });
})


describe("convertBoardConfig", () => {
    test('it creates an array of array of objects', async () => {
        const csvData = await loader.loadFromFile('./final_move_df.csv');
        const csvRow = csvData[0]
        const formattedCsvRow = JSON.parse(csvRow.config.replaceAll("'",'"'))

        const initBoard = loader.convertBoardConfig(formattedCsvRow, 6, 18)

        const rows = initBoard

        rows.forEach(row => {
            row.forEach(cell => {
                expect(typeof cell.blockType).toBe("string")
                expect(typeof cell.status).toBe("string")
            })
        })
    })
    test('it converts the data correctly', async () => {
        const csvData = await loader.loadFromFile('./final_move_df.csv');
        const lineNumber = 262
        const csvRow = csvData[lineNumber]
        const formattedCsvRow = JSON.parse(csvRow.config.replaceAll("'",'"'))
        const rows = loader.convertBoardConfig(formattedCsvRow, 6, 18)
        const data = [
            ['WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE'],
            ['WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE'],
            ['WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE'],
            ['WHITE', 'WHITE', 'BLUE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'GREEN', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE'],
            ['WHITE ', 'GREEN', 'BLUE', 'BLUE',  'BLUE',  'WHITE', 'GREEN', 'GREEN', 'WHITE', 'WHITE', 'WHITE', 'RED', 'WHITE', 'WHITE', 'BLUE', 'BLUE', 'RED', 'WHITE'],
            ['RED', 'BLUE', 'GREEN', 'RED', 'RED', 'RED', 'RED', 'GREEN', 'GREEN', 'RED', 'RED', 'GREEN', 'BLUE', 'RED', 'BLUE', 'GREEN', 'BLUE', 'GREEN']
        ]

        expect(rows.length).toBe(6)
        expect(formattedCsvRow).toEqual(data.flat(1).map(string => string.toLowerCase()))


        const reversedData = data.reverse()

        rows.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                expect(cell.blockType).toBe(reversedData[rowIndex][cellIndex])
            })
        })


    })
})