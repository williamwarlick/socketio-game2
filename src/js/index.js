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

    var usernameInput = document.getElementById('username');
    var sonaIdInput = document.getElementById('sona');

    joinBtn.addEventListener('click', (e) => {
        var username = usernameInput.value;
        localStorage.setItem('mabUsername', username);
    });

    var urlString = window.location.href;
    var url = new URL(urlString);
    var sonaId = url.searchParams.get("sona_id");

    if (sonaId) {
        usernameInput.value = sonaId;
        sonaIdInput.value = sonaId;
        joinBtn.click();
    }
})();