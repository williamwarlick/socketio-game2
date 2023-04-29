import {io} from 'socket.io-client';

const socket = io({autoConnect: false});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

(function onLoad() {
  var username = localStorage.getItem('mabUsername');

  if (username) {
      socket.auth = { username };
      socket.connect();
  } else {
    window.location.href = '/';
  }
})();

export default socket;