import socket from '../socket';
import './checkers.css';

const initialGameState = {
    board: [
        [0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [2,0,2,0,2,0,2,0],
        [0,2,0,2,0,2,0,2],
        [2,0,2,0,2,0,2,0]
    ]
};

let gameState = {
    board: [...initialGameState.board] // copy initial state
}

const buildBoard = () => {

    var pieceIdCounter = 0;

    const generatePieceId = () => {
        pieceIdCounter = pieceIdCounter + 1;

        return 'piece' + pieceIdCounter.toString();
    };

    const addPiece = (cell, teamClass, x, y, playerID) => {
        var piece = document.createElement('div');
        piece.classList.add(teamClass, 'piece');
        piece.setAttribute('draggable', 'true');
        piece.setAttribute('id', generatePieceId());

        piece.setAttribute('data-x', x.toString());
        piece.setAttribute('data-y', y.toString());
        piece.setAttribute('data-playerid', playerID.toString());

        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        cell.appendChild(piece);
    };

    const getElementPosition = (element) => {
        var posX = parseInt(element.getAttribute('data-x'));
        var posY = parseInt(element.getAttribute('data-y'));

        return {x: posX, y: posY};
    };

    const addDragListeners = (element) => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
        
            var data = e.dataTransfer.getData('text/plain');
            var piece = document.getElementById(data);
            var currentPos = getElementPosition(piece);
            var newPos = getElementPosition(e.target);
            var playerID = parseInt(piece.getAttribute('data-playerid'));
        
            e.target.appendChild(piece);

            piece.setAttribute('data-x', newPos.x);
            piece.setAttribute('data-y', newPos.y);

            gameState.board[currentPos.y][currentPos.x] = 0;
            gameState.board[newPos.y][newPos.x] = playerID; // player piece

            socket.emit('checkers', gameState);
        });
    };

    const board = document.getElementById('board');

    board.innerHTML = '';

    for(let y=0; y < gameState.board.length; y++) {
        var row = board.insertRow(y);
        for(let x=0; x < gameState.board[y].length; x++) {
            var cell = row.insertCell(x);

            cell.setAttribute('id', 'cell-' + x.toString() + y.toString());
            cell.setAttribute('data-x', x.toString());
            cell.setAttribute('data-y', y.toString());
    
            if (y%2 == 0) { // even row
                if (x%2 == 0) { // even column
                    cell.classList.add('red');
                } else { // odd column

                    cell.classList.add('black');
                    addDragListeners(cell);
    
                    if (gameState.board[y][x] == 1) { // player 1
                        addPiece(cell, 'team-white', x, y, 1);
                    } else if (gameState.board[y][x] == 2) { // player 2
                        addPiece(cell, 'team-red', x, y, 2);
                    }
                }
            } else { // odd row
                if (x%2 == 0) { // even column
                    cell.classList.add('black');
                    addDragListeners(cell);
                    if (gameState.board[y][x] == 1) { // player 1
                        addPiece(cell, 'team-white', x, y, 1);
                    } else if (gameState.board[y][x] == 2) { // player 2
                        addPiece(cell, 'team-red', x, y, 2);
                    }
                } else { // odd column
                    cell.classList.add('red');
                }
            }     
        }
    };
};

// Build the board
buildBoard();

socket.on('checkers', (event) => {
    gameState = event;
    buildBoard();
});
