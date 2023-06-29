import socket from '../socket';
//import { EVENTS } from '../../moveablock-server';
import moveablock, {GAME_STATUS, PLAYER_ROLE} from '../../moveablock2';
import { BLOCK_TYPE, SPACE_STATUS, Space, Section, EVENTS } from '../../components';
import '../moveablock.css';
import getUser from './header';

const mab = new moveablock.Game();

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
        let row = board.insertRow(y);
        for(let x = 0; x < mab.settings.BOARD_DIM.w; x++) {
            let section = Math.floor(x/mab.getSectionWidth() + 1);
            let subsection = Math.floor((x - (section-1) * mab.getSectionWidth())/mab.getSubSectionWidth() + 1);

            let cell = buildCell(x,y, section, subsection, prevSection, prevSubsection);
            row.appendChild(cell);

            // add block
            addBlock(cell, x, flipY(y, mab.settings.BOARD_DIM.h));
            addDragListeners(cell);

            prevSection = section;
            prevSubsection = subsection;
        }
    };

    // add label row
    var subSectionLabelRow = board.insertRow(-1);
    var sectionLabelRow = board.insertRow(-1);

    for(let section = 0; section < mab.settings.SECTION_NUM; section++) {
        for(let subsection = 1; subsection < (mab.settings.SUB_SECTION_NUM + 1); subsection++) {
            subSectionLabelRow.appendChild(buildSubSectionCell(section, subsection));
        }
        sectionLabelRow.appendChild(buildSectionCell(section));
    }
    
};

const buildSubSectionCell = (section, subsection) => {
    var cell = document.createElement("td");
    var sectionLetter = (section+10).toString(36).toUpperCase();

    cell.setAttribute('id', 'subsection-label-' + sectionLetter + subsection.toString());
    cell.classList.add('subsection-label');
    cell.setAttribute('colspan', mab.getSubSectionWidth());
    cell.textContent = sectionLetter + subsection;

    return cell;
}

const buildSectionCell = (section) => {
    var cell = document.createElement("td");
    var sectionLetter = (section+10).toString(36).toUpperCase();

    cell.setAttribute('id', 'section-label-' + sectionLetter);
    cell.classList.add('section-label');
    cell.setAttribute('colspan', mab.getSectionWidth());
    cell.textContent = sectionLetter;

    return cell;
}

const syncBoard = () => {
    for(let y = 0; y < mab.settings.BOARD_DIM.h; y++) {
        for(let x = 0; x < mab.settings.BOARD_DIM.w; x++) {
            var cell = getCellByPos({x: x, y: y});

            // clear cell
            cell.innerHTML = "";

            // add block
            addBlock(cell, x, y);
        }
    };
}

const buildCell = (x,y, section, subsection, prevSection, prevSubsection) => {
    var cell = document.createElement("td");

    cell.setAttribute('id', 'cell-' + x.toString() + (flipY(y, mab.settings.BOARD_DIM.h)).toString());
    cell.setAttribute('data-x', x.toString());
    cell.setAttribute('data-y', (flipY(y, mab.settings.BOARD_DIM.h)).toString());
    
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

    return cell;
}

const addBlock = (cell, x, y) => {
    var blockState = mab.board.spaces[y][x].blockType;

    if (blockState !== BLOCK_TYPE.EMPTY) {
        var block = document.createElement('div');
        block.classList.add('block', 'group-' + blockState);
        block.setAttribute('draggable', 'true');
        block.setAttribute('id', generatePieceId());
        block.setAttribute('data-x', x.toString());
        block.setAttribute('data-y', y.toString());

        cell.appendChild(block);
    }
};

const updateBoardState = (playerId, newPos, currentPos) => {
    /*mab.state.board[newPos.y][newPos.x].block = mab.state.board[currentPos.y][currentPos.x].block;
    mab.state.board[newPos.y][newPos.x].state = moveablock.EVENTS.DROP;
    mab.state.board[currentPos.y][currentPos.x].block = -1;
    mab.state.board[currentPos.y][currentPos.x].state = moveablock.EVENTS.NONE;*/
    mab.moveBlock(playerId, currentPos, newPos);
};

const getBlockByPos = (pos) => {
    var block = document.querySelector(`.block[data-x="${pos.x}"][data-y="${pos.y}"]`);

    return block;
}

const getCellByPos = (pos) => {
    var block = document.querySelector(`td[data-x="${pos.x}"][data-y="${pos.y}"]`);

    return block;
}

const updateBlockAttributes = (block, pos) => {
    block.setAttribute('data-x', pos.x.toString());
    block.setAttribute('data-y', pos.y.toString());
}

const clearCellClasses = () => {
    Array.from(document.querySelectorAll('.movefrom')).forEach((el) => el.classList.remove('movefrom'));
    Array.from(document.querySelectorAll('.moveto')).forEach((el) => el.classList.remove('moveto'));
};

const updateCellClasses = (moveEvent, fromCell, toCell) => {
    
    if (moveEvent === EVENTS.DROP) {
        clearCellClasses();
        fromCell.classList.add("movefrom");
        toCell.classList.add("moveto");
    } else if (moveEvent === EVENTS.DRAGOVER) {
        Array.from(document.querySelectorAll('.moveto')).forEach((el) => el.classList.remove('moveto'));
        toCell.classList.add("moveto");
    } else if (moveEvent === EVENTS.DRAGSTART) {
        Array.from(document.querySelectorAll('.movefrom')).forEach((el) => el.classList.remove('movefrom'));
        toCell.classList.add("movefrom");
    }
}

const updateBoard = (move) => {

    if (move.event === EVENTS.DROP) {
        // update board state
        updateBoardState(move.playerId, move.to.pos, move.from.pos);
        // get from block
        var block = getBlockByPos(move.from.pos);
        
        // get from cell
        var fromCell = getCellByPos(move.from.pos);

        // get to cell
        var toCell = getCellByPos(move.to.pos);

        // update cell classes
        updateCellClasses(move.event, fromCell, toCell);

        // update block attributes
        updateBlockAttributes(block, move.to.pos);
        // add block to new cell
        toCell.appendChild(block);
    } else if (move.event === EVENTS.DRAGOVER) {
        // get from cell
        //var fromCell = getCellByPos(move.from.pos);

        // get to cell
        var toCell = getCellByPos(move.to.pos);

        // update cell classes
        updateCellClasses(move.event, null, toCell);
    } else if (move.event === EVENTS.DRAGSTART) {
        var cell = getCellByPos(move.from.pos);

        // update cell classes
        updateCellClasses(move.event, null, cell);
    }
};

async function updateRoundInfo(gameState) {
    var userInfo = await getUser();
    var player = gameState.players.find((player) => player.id === userInfo.user);

    var roleEl = document.getElementById("role");
    var roundEl = document.getElementById("round-num");
    var goalEl = document.getElementById("goal-description");

    roleEl.innerText = player.role;
    roundEl.innerText = gameState.roundNum + '/' + mab.settings.ROUNDS_NUM;

    if (player.role === PLAYER_ROLE.ARCHITECT) {
        //TODO: this assumes a single goal
        goalEl.innerText = gameState.round.goals[0].description;
    } else {
        goalEl.innerText = "The Architect has been assigned their secret goal!";
    }

    
}

const getElementPosition = (element) => {
    var posX = parseInt(element.dataset.x);
    var posY = parseInt(element.dataset.y);

    return {x: posX, y: posY};
};

const addDragListeners = (element) => {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();

        if (e.target.tagName === 'TD') {
            //var data = e.dataTransfer.getData('text/plain');
           // var block = document.getElementById(data);
            var newPos = getElementPosition(e.target);
            //var currentPos = getElementPosition(block);

            socket.emit('moveablock', {
                event: EVENTS.DRAGOVER, 
                //from: {pos: currentPos, state: mab.state.board[newPos.y][newPos.x]}, 
                to: {pos: newPos, state: null}
            });
        }
    });

    element.addEventListener('dragstart', (e) => {
        //e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.id);
        var pos = getElementPosition(e.target);

        socket.emit('moveablock', {
            event: EVENTS.DRAGSTART, 
            from: {pos: pos, state: null}
        });
        
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
    
        var data = e.dataTransfer.getData('text/plain');
        var block = document.getElementById(data);
        var newPos = getElementPosition(e.target);
        var currentPos = getElementPosition(block);

        if (mab.validDrop(currentPos, newPos)) {
            e.target.appendChild(block);
            updateBlockAttributes(block, newPos);

            // getUser comes from header.js
            var player = await getUser();
            updateBoardState(player.user, newPos, currentPos);

            //socket.emit('moveablock', mab.state);
            socket.emit('moveablock', {
                event: EVENTS.DROP, 
                from: {pos: currentPos, state: mab.board.spaces[currentPos.y][currentPos.x]}, 
                to: {pos: newPos, state: mab.board.spaces[newPos.y][newPos.x]}
            });
        }
        
    });
};

// Build the board
buildBoard();

socket.on('moveablock', async (event) => {

    if (event.state) {
        if (event.status == GAME_STATUS.WAITING) {
            console.log('Game status: waiting');
            window.location.href = '/waiting.html';
        } else if (event.status == GAME_STATUS.COMPLETE) {
            console.log('Game status: complete');
            window.location.href = '/game-complete.html';
        } else if (event.status == GAME_STATUS.NEW_ROUND) {
            console.log('Game status: new round');
            window.location.href = '/round-acknowledge.html';
        } else if (event.status == GAME_STATUS.JOINED) {
            console.log('Game status: joined');
            window.location.href = '/consent.html';
        }

        console.log('updating board ...');
        mab.board.spaces = event.state;
    }

    if (event.event === EVENTS.DROP || event.event === EVENTS.DRAGOVER
        || event.event === EVENTS.DRAGSTART) {
        updateBoard(event);
    } else {
        await updateRoundInfo(event);
        syncBoard();
    }
});
