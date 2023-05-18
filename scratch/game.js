const prompts = require('prompts');
const mab = require('./moveablock2');

const game = new mab.Game();

const questions = [
    {
      type: 'select',
      name: 'mode',
      message: 'Mode?',
      choices: [
        {title: '1 Player', value: mab.GAME_MODE.ONE_PLAYER},
        {title: '2 Player', value: mab.GAME_MODE.TWO_PLAYER},
      ]
    },
    {
      type: 'text',
      name: 'player1Id',
      message: 'What is the player 1s ID?',
      initial: 'paul'
    },
    {
      type: 'text',
      name: 'player2Id',
      message: 'What is the player 2s ID?',
      initial: 'sue'
    },
  ];
  
  (async () => {
    const response = await prompts(questions);

    game.mode = response.mode;
    game.players[0] = new mab.Player(response.player1Id);
    game.players[1] = new mab.Player(response.player2Id);
  
    game.printBoard();
    game.updateCursor(game.players[0].id, new mab.Location(0,1));
    game.printBoard();
    var success = game.moveBlock(game.players[0].id, new mab.Location(0,1),new mab.Location(1,2));

    if (!success) {
        console.log('Move failed.');
    }

    game.printBoard();
    game.printMoves();

    game.moveBlock(game.players[0].id, new mab.Location(1,2),new mab.Location(5,2));
    game.moveBlock(game.players[0].id, new mab.Location(1,1),new mab.Location(5,3));
    game.moveBlock(game.players[0].id, new mab.Location(6,1),new mab.Location(5,4));

    game.printMoves();
    game.printBoard();
  })();