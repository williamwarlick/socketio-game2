import {io} from 'socket.io-client';

const socket = io({autoConnect: false});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

(async function onLoad() {
  const response = await fetch('/user');
  const data = await response.json();
  
  if (data.user) {
      socket.connect();
  } else if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
})();

export default socket;