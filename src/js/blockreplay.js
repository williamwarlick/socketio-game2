import '../style.css';
import header from './header'
import socket from '../socket';
console.log('Socket initialized', socket);

import blockreplay, { GAME_STATUS } from '../../blockreplay2';
const { v4: uuidv4 } = require('uuid');


const mab = new blockreplay.Game();


// const nine_games_data_exp2 = {"13108":{"importId":75842,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","white","white","white","white","white","green","white","white","white","blue","white","white","red","green","green","red","white","red","white","blue","green","white","blue","blue","white","white","white","red","white","white","red","green","red","green","red","red","white","blue","red","red","blue","blue","blue","green","blue","green","green","green"],"goal_optimal":100,"goal":"move blue C2","total_moves":10,"goal_type":"move","move_ids":[[59,88],[104,89],[102,70],[82,71],[65,85],[83,51],[101,52],[100,53],[79,33],[97,34]]},"13116":{"importId":92567,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","blue","white","white","white","white","white","white","white","white","red","green","white","blue","red","white","blue","red","green","blue","blue","red","white","blue","white","white","white","green","red","green","green","green","green","white","green","blue","green","red","blue","blue","white","red","red","blue","green","red"],"goal_optimal":100,"goal":"uncover green all","total_moves":7,"goal_type":"uncover","move_ids":[[78,64],[80,95],[76,46],[57,45],[75,61],[89,102],[73,54]]},"905560":{"importId":39277,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","white","white","white","white","red","white","white","white","red","white","white","white","white","white","white","white","blue","green","green","white","white","white","blue","red","white","white","blue","white","white","blue","green","green","green","white","green","red","red","green","blue","blue","red","red","white","blue","red","green","green","blue","red","green","red","blue"],"goal_optimal":100,"goal":"uncover red all","total_moves":10,"goal_type":"uncover","move_ids":[[60,98],[79,76],[78,77],[55,59],[74,41],[73,23],[86,67],[88,89],[64,81],[82,83]]},"13134":{"importId":50905,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","blue","white","white","green","white","red","blue","white","blue","blue","green","blue","white","red","white","red","white","red","blue","red","green","blue","red","red","blue","green","green","green","blue","green","red","red","red","green","green","green"],"goal_optimal":100,"goal":"uncover red all","total_moves":3,"goal_type":"uncover","move_ids":[[77,74],[85,65],[71,64]]},"13121":{"importId":70176,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","green","white","white","white","white","white","white","white","red","green","green","blue","red","red","white","white","white","blue","red","blue","white","blue","white","white","white","red","green","blue","red","blue","blue","red","green","white","white","green","red","green","blue","blue","blue","green","white","red","green"],"goal_optimal":100,"goal":"clear nocolor B2","total_moves":6,"goal_type":"clear","move_ids":[[63,62],[81,97],[82,96],[99,79],[100,78],[101,60]]},"13109":{"importId":68825,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","white","white","white","white","white","white","white","white","green","white","white","white","white","white","white","white","green","blue","blue","blue","white","green","green","white","white","white","red","white","white","blue","blue","red","white","red","blue","green","red","red","red","red","green","green","red","red","green","blue","red","blue","green","blue","green"],"goal_optimal":100,"goal":"move red B1","total_moves":12,"goal_type":"move","move_ids":[[99,80],[100,62],[65,100],[83,61],[95,60],[76,95],[94,42],[75,94],[93,43],[90,44],[103,24],[88,25]]},"13141":{"importId":85609,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","white","red","red","green","white","white","white","white","white","white","white","white","white","green","white","white","white","red","red","blue","blue","blue","white","white","white","green","green","white","white","green","white","green","blue","blue","white","green","green","green","red","red","red","white","white","blue","red","white","blue","green","red","blue","blue","red","white"],"goal_optimal":100,"goal":"uncover red all","total_moves":7,"goal_type":"uncover","move_ids":[[54,96],[58,97],[76,79],[81,100],[88,107],[57,78],[75,61]]},"13152":{"importId":94317,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","blue","white","white","white","red","white","white","green","white","white","white","white","white","white","white","white","blue","white","green","white","green","blue","red","green","green","blue","white","white","red","blue","blue","white","white","green","red","green","green","red","blue","green","red","blue","blue","red","white","red","blue","red","green","white","white","red"],"goal_optimal":100,"goal":"move blue B","total_moves":9,"goal_type":"move","move_ids":[[56,61],[72,62],[77,43],[76,75],[94,44],[85,45],[86,100],[84,85],[102,82]]},"13149":{"importId":27371,"config":["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","red","white","white","red","white","blue","white","blue","white","white","white","white","blue","white","red","white","white","white","blue","white","blue","green","green","green","red","green","white","white","white","white","green","white","red","red","white","blue","green","green","green","red","green","blue","red","blue","green","blue","white","blue","red","red"],"goal_optimal":100,"goal":"move red C2","total_moves":9,"goal_type":"move","move_ids":[[61,87],[82,69],[100,51],[79,60],[97,33],[58,15],[91,52],[72,34],[90,16]]}}


const tableBody = document.getElementById("table-body");
var currentGame;
var currentMove;
var nMoves = 5; // number of moves for experiment mode
const animation_time = 0.5;
var isDone;
// const gameOrder = generate_game_order();
let currentGameIndex = 0;
// const gameIds = Object.keys(nine_games_data_exp2); // Extract game IDs to iterate through
let numRewatch = 0;



function table_setup(){
    // Generate table rows and cells
    var cellId = 0;
    for (let row = 1; row <= 6; row++) {
        const newRow = document.createElement("tr");
        for (let col = 1; col <= 18; col++) {
            const newCell = document.createElement("td");
            var color = "white"
            newCell.innerHTML = '<div id='+cellId+' class="color-block" style="left:0px; top:0px; background-color:' + color + ';"></div>';
            newRow.appendChild(newCell);
            cellId++
        }
        tableBody.appendChild(newRow);
    }
}


// function getGame(gameId){
//     currentGame = nine_games_data_exp2[gameId];
//     console.log("Current game is:", currentGame);
//     currentMove = 0;
//     //call loadgame
//     loadgame()
//     currentMove = 0;
//     isDone = false;
// }

function loadgame(rounds){
    currentGame = rounds
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
    console.log("Nmoves: " + nMoves)
    console.log("Current Move: " + currentMove)
    
    if (currentMove + 1 <= currentGame['total_moves']){
        let move = currentMove;
        let orig_id = currentGame['move_ids'][move][0];
        if (orig_id != '999'){
           
            let orig_element = document.getElementById(orig_id);
            let bg_color = orig_element.style.backgroundColor;
            var orig_color = bg_color.replace("background-color:", "").trim();

            let new_id = currentGame['move_ids'][move][1];
            let new_element = document.getElementById(new_id);
            console.log("new_id", new_id)

            animate_move(orig_id, new_id, bg_color);
            // orig_element.style.backgroundColor = "white";
            // new_element.style.backgroundColor = orig_color;
        }
        currentMove++;
        
        if (currentMove >= currentGame['total_moves']){
            // GAME IS OVER 
            isDone = true;
            let box = document.getElementById("game-complete");
            box.classList.remove("invisible");

            
            box.classList.add('show');
            box.style.visibility = 'visible';



            document.getElementById("play-all-button").textContent = "Show again";
            
        }
    } 
}

function animate_move(id1, id2, bg_color){

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
    setTimeout(function() {
        square.style.left = xfinal + "px";
        square.style.top = yfinal + "px";
    }, 5);
    
    //turn id2 orig_color
    setTimeout(function() {
        document.getElementById(id2).style.backgroundColor = orig_color;
      }, 510);

    //remove the tempsquare
    setTimeout(function() {
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
function playAll(){
    let playButton = document.getElementById("play-all-button")
    playButton.textContent = "Playing all moves...";
    playButton.classList.add('disabled');

    numRewatch++;

    if (isDone) {
        cleargame();
        loadgame();
        isDone = false;
        currentMove = 0;
        // when restarting, pause on inital set up for .8
        setTimeout(function() {
            doLoop();
        }, 800);

    } else {
        doLoop();
    }

    function doLoop() {         
        setTimeout(function() {   
            nextMove();
            if (!isDone) {      
                doLoop();
            } else {
                // Re-enable the button only when isDone becomes true
                playButton.textContent = "Replay Moves"; 
                playButton.classList.remove('disabled');
            }
        }, 800);
    }
    
    
}


function submitGoal(gameId, typingDuration) {
    // need to add connection to server functionality
    var guessedGoal = document.getElementById('goalInput').value;
    const helperId = 'Steven';
    const startTime = new Date();
    // socket.emit('blockreplay', { guessedGoal: guessedGoal, typingDuration: typingDuration });
    const newId = uuidv4(); // Generates a unique UUID


    const submissionData = {
        // game viewing related
        id: newId,
        gameId,
        importId: currentGame.importId,
        config: currentGame.config,
        roundNum: currentGameIndex,
        // helper related 
        helperId: helperId,
        helperResponse: guessedGoal,
        typingTime: typingDuration,
        stoppingPoint: 'Middle', // need to add stopping point
        timesRewatched: numRewatch, // need to add times rewatched
        demographicDetails: null,
        // gameStart, startTime,
       
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

    document.getElementById('game-complete').classList.add('invisible');
    document.getElementById('goalInput').value = "";
    let playButton = document.getElementById("play-all-button")
    playButton.textContent = "Play All Moves⇥";

    numRewatch = 0;

    moveToNextGame();
}

 
//on load do this
document.addEventListener('DOMContentLoaded', function () {
    // setupGame();

    attachEventListeners();

});


function setupGame(rounds) {
    if (currentGameIndex === 0) {
    table_setup();
    
    } else {
        cleargame();
        loadgame();
       
    }
    loadgame(rounds);
    // getGame(

    //     // gameIds[currentGameIndex]
    //     );
}

function attachEventListeners() {
    document.getElementById('play-all-button').addEventListener('click', playAll);
    document.getElementById('submit-goal-button').addEventListener('click', submitGoal);

    let startTime = null; 
    let endTime = null; 

    const inputBox = document.getElementById('goalInput');
    const submitButton = document.getElementById('submit-goal-button');

    // Event listener for when user starts typing
    inputBox.addEventListener('input', function(event) {
        // If typing starts, record the start time
        if (startTime === null) {
            startTime = new Date();
        }
    });

    // Event listener for the submit button
    submitButton.addEventListener('click', function(event) {
        // Prevent form from submitting if you're using a form
        event.preventDefault();

        // Record the end time when submit is clicked
        endTime = new Date();

        // Calculate the difference in milliseconds
        const typingDuration = endTime - startTime;

        submitGoal(gameIds[currentGameIndex], typingDuration);

    });
}



function moveToNextGame() {
    currentGameIndex++; // Move to the next game in the list
    if(currentGameIndex < 1) {
        setupGame(gameIds[currentGameIndex]); // Setup the next game
    } else {
        console.log("All games completed!");
        window.location.href = '/demographic-details.html';
    }
}


socket.on('blockreplay', async (event) => {
    console.log('blockreplay event recieved on blockreplay.js', );

    if (event.state) {
        if (event.status == GAME_STATUS.COMPLETE) {
            console.log('Game status: complete');
            window.location.href = '/demographic-details.html';
            return;
        } else if (event.status == GAME_STATUS.NEW_ROUND) {
            console.log('Game status: new round');
            window.location.href = '/round-acknowledge.html';
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


    if (event.setup && event.round) {
        console.log('Received setup for round:', event.round);
        setupGame(event.round); 
    }
});



