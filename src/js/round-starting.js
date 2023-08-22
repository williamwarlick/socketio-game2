//import userInfo from './header';

import socket from '../socket';
import {GAME_STATUS} from '../../moveablock2';

socket.on('moveablock', (event) => {
    if (event.status) {
        switch (event.status) {
            case GAME_STATUS.GAME_ACK:
                window.location.href = '/moveablock.html';
                break;
        }
    }
});