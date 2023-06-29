const loader = require('./round-loader');

test('Loads rounds csv file', async () => {
    var csvData = await loader.loadFromFile('./final_move_df.csv');

    console.log(csvData[0]);
    expect(typeof csvData[0].ID).toBe('string');
    expect(csvData[0].ID).not.toEqual('');
    expect(csvData[0].ID.length).toBeGreaterThan(0);
});

test('Loads rounds csv file to rounds array', async () => {
    var rounds = await loader.loadRoundsFromFile('./final_move_df.csv');

    console.log(rounds[0].initBoard);

    expect(typeof rounds[0].importId).toBe('string');
    expect(rounds[0].importId).not.toEqual('');
    expect(rounds[0].importId.length).toBeGreaterThan(0);
});