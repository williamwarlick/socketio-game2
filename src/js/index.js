import loginTemplate from '../templates/login.mustache';
import socket from '../socket';
import {GAME_STATUS } from '../../moveablock2';
import header from './header';

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/consent.html';
    } else if (event.status && event.status == GAME_STATUS.WAITING) {
        window.location.href = '/waiting.html';
    }
});

(async function doRender(){
    // Set the rendered HTML as the content of the page
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', loginTemplate());

    const joinBtn = document.getElementById('lobbyBtn');

    joinBtn.addEventListener('click', (e) => {
        var username = document.getElementById('username').value;
        localStorage.setItem('mabUsername', username);
    });
})();