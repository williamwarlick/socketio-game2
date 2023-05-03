import socket from '../socket';
import {GAME_STATUS } from '../../moveablock-server';

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/moveablock.html';
    }
});