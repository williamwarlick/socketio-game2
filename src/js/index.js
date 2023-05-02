import loginTemplate from '../templates/login.mustache';
import headerTemplate from '../templates/header.mustache';
import socket from '../socket';
import {GAME_STATUS } from '../../moveablock-server';

socket.on('moveablock', (event) => {
    if (event.status && event.status == GAME_STATUS.JOINED) {
        window.location.href = '/moveablock.html';
    } else if (event.status && event.status == GAME_STATUS.WAITING) {
        window.location.href = '/waiting.html';
    }
});

(async function doRender(){
    const response = await fetch('/user');
    const data = await response.json();

    // Set the rendered HTML as the content of the page
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', headerTemplate(data));
    app.insertAdjacentHTML('beforeend', loginTemplate());

    const joinBtn = document.getElementById('lobbyBtn');

    joinBtn.addEventListener('click', (e) => {
        //e.preventDefault();
        var username = document.getElementById('username').value;
        localStorage.setItem('mabUsername', username);
        //window.location.href = '/moveablock.html';
    });
})();