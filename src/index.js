import socket from './socket';

const joinBtn = document.getElementById('lobbyBtn');

joinRoom1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('joinRoom1', 'Let me join!');
});