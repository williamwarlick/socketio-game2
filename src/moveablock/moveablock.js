import socket from '../socket';
import moveablock from '../../moveablock-server';
import './moveablock.css';

const mab = new moveablock.MoveABlock();

let pieceIdCounter = 0;

const generatePieceId = () => {
    pieceIdCounter = pieceIdCounter + 1;

    return 'piece' + pieceIdCounter.toString();
};

const flipY = (y, h) => {
    return Math.abs(y - (h-1));
}

const buildBoard = () => {

    const board = document.getElementById('board');

    board.innerHTML = '';

    var prevSection = 1;
    var prevSubsection = 1;

    for(let y = 0; y < mab.settings.BOARD_DIM.h; y++) {
        var row = board.insertRow(y);
        for(let x = 0; x < mab.settings.BOARD_DIM.w; x++) {
            var cell = row.insertCell(x);

            cell.setAttribute('id', 'cell-' + x.toString() + (flipY(y, mab.settings.BOARD_DIM.h)).toString());
            cell.setAttribute('data-x', x.toString());
            cell.setAttribute('data-y', (flipY(y, mab.settings.BOARD_DIM.h)).toString());

            var section = Math.floor(x/mab.getSectionWidth() + 1);
            var subsection = Math.floor((x - (section-1) * mab.getSectionWidth())/mab.getSubSectionWidth() + 1);
            var isSectionLeftEdge = section - prevSection > 0;
            var isSubSectionLeftEdge = subsection - prevSubsection > 0;

            cell.setAttribute('data-section', section.toString());
            cell.setAttribute('data-subsection', subsection.toString());
            
            if (isSectionLeftEdge) {
                cell.classList.add('section-left-edge');
            }

            if (isSubSectionLeftEdge) {
                cell.classList.add('subsection-left-edge');
            }

            // add block
            addBlock(cell, x, flipY(y, mab.settings.BOARD_DIM.h));
            addDragListeners(cell);

            prevSection = section;
            prevSubsection = subsection;
        }
    };
};

const addBlock = (cell, x, y) => {
    var blockState = mab.state.board[y][x].block;

    if (blockState > -1) {
        var block = document.createElement('div');
        block.classList.add('block', 'group-' + blockState);
        block.setAttribute('draggable', 'true');
        block.setAttribute('id', generatePieceId());
        block.setAttribute('data-x', x.toString());
        block.setAttribute('data-y', y.toString());

        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        cell.appendChild(block);
    }
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
        var block = document.getElementById(data);
        var newPos = getElementPosition(e.target);
        var currentPos = getElementPosition(block);

        if (mab.validDrop(currentPos, newPos)) {
            e.target.appendChild(block);
            block.setAttribute('data-x', newPos.x.toString());
            block.setAttribute('data-y', newPos.y.toString());

            mab.state.board[newPos.y][newPos.x].block = mab.state.board[currentPos.y][currentPos.x].block;
            mab.state.board[newPos.y][newPos.x].state = moveablock.EVENTS.DROP;
            mab.state.board[currentPos.y][currentPos.x].block = -1;
            mab.state.board[currentPos.y][currentPos.x].state = moveablock.EVENTS.NONE;

            socket.emit('moveablock', mab.state);
        }
        
    });
};

// Build the board
buildBoard();

socket.on('moveablock', (event) => {
    mab.state = event;
    buildBoard();
});
