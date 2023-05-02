const joinBtn = document.getElementById('lobbyBtn');

joinBtn.addEventListener('click', (e) => {
    //e.preventDefault();
    var username = document.getElementById('username').value;
    localStorage.setItem('mabUsername', username);
    //window.location.href = '/moveablock.html';
});