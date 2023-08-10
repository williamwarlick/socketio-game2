import header from './header';
import socket from '../socket';
import {GAME_STATUS} from '../../moveablock2';

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/consent.html';
    }
});