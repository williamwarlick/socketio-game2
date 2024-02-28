import '../style.css';
import header from './header'
import socket from '../socket';
console.log('Socket initialized', socket);
import blockreplay, { GAME_STATUS } from '../../blockreplay2';
import getUser from './header';

let uniqueGameId = null;
let version = null;
const tableBody = document.getElementById("table-body");
var currentGame;
var currentMove;
var isDone;
let currentGameIndex = 0;
let numWatches = 0;
let allRounds = null;


// Generate table rows and cells
function table_setup() {
    var cellId = 0;
    for (let row = 1; row <= 6; row++) {
        const newRow = document.createElement("tr");
        for (let col = 1; col <= 18; col++) {
            const newCell = document.createElement("td");
            var color = "white"
            newCell.innerHTML = '<div id=' + cellId + ' class="color-block" style="left:0px; top:0px; background-color:' + color + ';"></div>';
            newRow.appendChild(newCell);
            cellId++
        }
        tableBody.appendChild(newRow);
    }
}


function loadgame(round){
    currentGame = round;
    //load colors into table
    currentMove = 0;
    isDone = false;
    var cellId = 0;
    let colors = currentGame.config
    for (var i = 0; i < colors.length; i++) {
        var color = colors[cellId];
        var block = document.getElementById(cellId);
        block.setAttribute('style', 'background-color:' + color + ';')
        cellId++
    }
    // make table and controls visible
    var tRow = document.getElementById("gamerow")
    tRow.style.display = 'flex';

    var cRow = document.getElementById("controlrow")
    cRow.style.display = 'flex';
    cRow.style.display = 'center';

}

 //load white cells
function cleargame(){
    var cellId = 0;
    let colors = currentGame.config;
    for (var i = 0; i < colors.length; i++) {
        var block = document.getElementById(cellId);
        block.setAttribute('style', 'background-color:white;')
        cellId++
    }
}

function nextMove(){    
    if (currentMove + 1 <= currentGame.stoppingPointNum){
        let move = currentMove;
        let orig_id = currentGame['move_ids'][move][0];
        if (orig_id != '999') {

            let orig_element = document.getElementById(orig_id);
            let bg_color = orig_element.style.backgroundColor;
            let new_id = currentGame['move_ids'][move][1];
            let new_element = document.getElementById(new_id);


            animate_move(orig_id, new_id, bg_color);
        }
        currentMove++;
        
        if (currentMove >= currentGame.stoppingPointNum){
            isDone = true;

            let box = document.getElementById("game-complete");
            document.getElementById("game-text").textContent = "Verbally Describe what you think the goal of the game is.";
            box.classList.remove("invisible");
            box.classList.add('show');
            box.style.visibility = 'visible';

            document.getElementById("play-all-button").textContent = "Show again";
        }
    }
}

function animate_move(id1, id2, bg_color) {
    var orig_color = bg_color.replace("background-color:", "").trim();

    //init locations
    var yinit = document.getElementById(id1).offsetTop;
    var xinit = document.getElementById(id1).offsetLeft;

    //final locations
    var yfinal = document.getElementById(id2).offsetTop;
    var xfinal = document.getElementById(id2).offsetLeft;

    //create a square of orig_color in location of id1
    let square = createSquare(xinit, yinit, orig_color);

    //turn id1 white
    document.getElementById(id1).style.backgroundColor = "white";

    //animate to location of id2
    setTimeout(function () {
        square.style.left = xfinal + "px";
        square.style.top = yfinal + "px";
    }, 5);

    //turn id2 orig_color
    setTimeout(function () {
        document.getElementById(id2).style.backgroundColor = orig_color;
    }, 510);

    //remove the tempsquare
    setTimeout(function () {
        document.body.removeChild(square)
    }, 515);
}

function createSquare(x, y, color) {
    var square = document.createElement("div");
    square.id = "tempSquare";
    square.style.width = "30px";
    square.style.height = "30px";
    square.style.position = "absolute";
    square.style.left = x + "px";
    square.style.top = y + "px";
    square.style.zIndex = '999';
    square.style.backgroundColor = color;
    document.body.appendChild(square);
    return square;
}

//play all moves sequentially
function playAll() {
    let playButton = document.getElementById("play-all-button")
    playButton.textContent = "Playing all moves...";
    playButton.classList.add('disabled');

    numWatches++;

    if (isDone) {
        cleargame();
        loadgame(allRounds[currentGameIndex]);
        isDone = false;
        currentMove = 0;
        // when restarting, pause on inital set up for .8
        setTimeout(function () {
            doLoop();
        }, 800);

    } else {
        doLoop();
    }

    function doLoop() {
        setTimeout(function () {
            nextMove();
            if (!isDone) {
                doLoop();
            } else {
                playButton.textContent = "Replay Moves";
                playButton.classList.remove('disabled');
            }
        }, 800);
    }
}



async function submitGoal(typingDuration) {
    var guessedGoal = document.getElementById('goalInput').value;
    var player = await getUser();
    
    const submissionData = {
        // game related
        gameId: uniqueGameId, 
        playerId: player.user, 
        version: version, // need to add by passing thorught 
        // round related 
        roundNum: currentGameIndex,
        stoppingPointNum: currentGame.stoppingPointNum,
        stoppingPoint: currentGame.stoppingPoint,
        id: currentGame.id,
        importId: currentGame.importId,
        config: currentGame.config,
        goal: currentGame.goal,
        moveIds: currentGame.move_ids,
        playerResponse: guessedGoal,
        typingTime: typingDuration,
        numWatches: numWatches,
        demographicDetails: null,
    }

    fetch('/submitGoal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
    })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            console.log("Success Submitting guessed goal: " + guessedGoal);
        })
        .catch((error) => {
            console.error('Error:', error);
            console.log("Failure Submitting guessed goal: " + guessedGoal);
        });

    
    socket.emit('blockreplay', {state: GAME_STATUS.COMPLETE});

    document.getElementById('game-complete').classList.add('invisible');
    document.getElementById('goalInput').value = "";
    let playButton = document.getElementById("play-all-button")
    playButton.textContent = "Play All Moves⇥";

    numWatches = 0;

    moveToNextGame();
}


//on load do this
document.addEventListener('DOMContentLoaded', function () {
   

    attachEventListeners();
});


function setupGame(rounds) {
    rounds = rounds || 0;
    if (currentGameIndex === 0) {
        table_setup();
        allRounds = rounds;
        loadgame(allRounds[currentGameIndex]);
    } else {
        cleargame();
        loadgame(allRounds[currentGameIndex]);
    }
}

function attachEventListeners() {
    document.getElementById('play-all-button').addEventListener('click', playAll);
    const inputBox = document.getElementById('goalInput');
    const submitButton = document.getElementById('submit-goal-button');
    let startTime = null; 
    // Event listener for when user starts typing
    inputBox.addEventListener('input', function (event) {
        // If typing starts, record the start time
        if (startTime === null) {
            startTime = new Date();
        }
    });
    // Event listener for the submit button
    submitButton.addEventListener('click',  async () => {
        // Calculate typing duration and submit
        let endTime = new Date();
        const typingDuration = endTime - startTime;
        await submitGoal(typingDuration); 
    });
}



function moveToNextGame() {
    currentGameIndex++; // Move to the next game in the list
    document.getElementById("game-text").textContent = "Please click Play-all-Moves button to watch game and then...";
    if(currentGameIndex < 1) { // should be 8 in prod
        setupGame();
    } else {
        console.log("All games completed!");
        // need to not distonct here, so can connect demographic details 
        window.location.href = '/demographic-details.html';
    }
}

socket.on('blockreplay', async (event) => {
    console.log('blockreplay event recieved on blockreplay.js', );
    if (event.setup) {
        console.log('Received setup for round:', event.round);
        uniqueGameId = event.gameId;
        version = event.version;
        setupGame(event.round); 
    }
    if (event.state) {
        if (event.status == GAME_STATUS.COMPLETE) {
            console.log('Game status: complete');
            window.location.href = '/demographic-details.html';
            return;
        } else if (event.status == GAME_STATUS.JOINED) {
            console.log('Game status: joined');
            window.location.href = '/consent.html';
            return;
        } } else if (event.status == GAME_STATUS.COMPLETE) {
            console.log('Game status: complete');
            window.location.href = '/demographic-details.html';
            return;
    }


    
});



