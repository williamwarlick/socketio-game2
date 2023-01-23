import socket from './socket';

socket.emit('lobby', "I'm here!");

const joinRoom1Btn = document.getElementById('joinRoom1Btn');
const pingRoom1Btn = document.getElementById('pingRoom1Btn');

joinRoom1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('joinRoom1', 'Let me join!');
});

pingRoom1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('pingRoom1', 'Ping!');
});