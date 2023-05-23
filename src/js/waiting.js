import socket from '../socket';
import {GAME_STATUS} from '../../moveablock2';
import header from './header';

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/moveablock.html';
    }
});