import './game2.css'

const doDragStart = (e) => {
    console.log("Dragging started ...");
    e.dataTransfer.setData('text/plain', e.target.id);
};

var blocks = document.getElementsByClassName('block');
var game = document.getElementById('game');

Array.from(blocks).forEach(function(block) {
    block.addEventListener('dragstart', doDragStart);
});

game.addEventListener('dragover', (e) => {
    e.preventDefault();
});

game.addEventListener('drop', (e) => {
    e.preventDefault();

    var data = e.dataTransfer.getData('text/plain');

    e.target.appendChild(document.getElementById(data));
});