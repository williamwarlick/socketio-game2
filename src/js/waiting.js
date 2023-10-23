//import header from './header';
import socket from '../socket';
import {GAME_STATUS} from '../../moveablock2';

socket.on('MESSAGE', async (event) => {

    if (event === 'COMPLETE') {
        console.log('User already completed a game.');
        window.location.href = '/completed.html';
    }
});

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/consent.html';
    } else if (event.status && event.status == GAME_STATUS.GAME_ACK) {
        window.location.href = '/moveablock.html';
    }
});