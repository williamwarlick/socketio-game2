import '../style.css';
//socket is not init...
import socket from '../socket';
console.log('Socket initialized:', socket);


var options = {
    "game_ids":
        [
            '13056',
        ],
    "goal_types": ["fill", "move", "cover", "uncover", "clear"]
}

const data_exp2 ={13056:[{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"clear nocolor A2",total_moves:5,goal_type:"clear",move_ids:[[57,55],[75,72],[93,54],[94,38],[95,37]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"clear nocolor B",total_moves:8,goal_type:"clear",move_ids:[[78,76],[96,77],[97,59],[80,58],[98,41],[81,40],[100,39],[99,23]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"cover blue all",total_moves:5,goal_type:"cover",move_ids:[[57,72],[95,76],[97,60],[81,62],[67,69]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"cover red all",total_moves:6,goal_type:"cover",move_ids:[[56,55],[74,39],[78,63],[84,82],[102,49],[106,89]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"fill nocolor A2",total_moves:15,goal_type:"fill",move_ids:[[57,72],[56,76],[74,77],[73,57],[78,59],[72,58],[80,41],[96,40],[97,39],[98,23],[92,22],[91,21],[90,3],[81,4],[99,5]]},{id:"13056",importId:0,config:null,goal_optimal:100,goal:"fill nocolor C1",total_moves:4,goal_type:"fill",move_ids:[[81,32],[83,14],[88,13],[87,12]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"fill nocolor C2",total_moves:14,goal_type:"fill",move_ids:[[67,88],[86,89],[85,69],[84,70],[104,71],[103,53],[102,52],[100,51],[81,33],[99,34],[80,35],[98,17],[97,16],[78,15]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"move green B2",total_moves:13,goal_type:"move",move_ids:[[81,76],[100,58],[56,100],[97,101],[78,62],[96,83],[95,82],[84,81],[67,89],[106,65],[85,63],[86,64],[102,47]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"move red C",total_moves:8,goal_type:"move",move_ids:[[57,68],[75,66],[73,49],[91,50],[100,48],[81,69],[80,79],[98,88]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"uncover green all",total_moves:4,goal_type:"uncover",move_ids:[[78,76],[81,82],[67,89],[84,69]]},{id:"13056",importId:96815,config:["white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","white","green","red","white","white","white","white","white","white","white","white","white","red","white","white","white","white","white","red","blue","red","white","white","blue","white","blue","red","white","white","green","green","green","blue","white","white","blue","red","blue","blue","blue","green","green","green","red","green","red","white","green","blue","red","blue","green","red"],goal_optimal:100,goal:"uncover red all",total_moves:4,goal_type:"uncover",move_ids:[[80,79],[86,66],[73,72],[57,76]]}]};



const tableBody = document.getElementById("table-body");
var currentGame;
var currentMove;
var nMoves = 5; // number of moves for experiment mode
const animation_time = 0.5;
var isDone;



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

// function recordGameId(gameId_str){
//     const parts = gameId_str.split("_"); // Split the string by underscores
//     const gameId = parts[parts.length - 1]; // Get the last part of the split string

//     console.log("recording : " + gameId)
//     getGame()
// }

// function recordGoalType(goal_type_str){
//     const parts = goal_type_str.split("_"); // Split the string by underscores
//     const goalType = parts[parts.length - 1]; // Get the last part of the split string

//     console.log("recording type: " + goalType)
//     getGame()
// }

function gameRandom(){
    // var id_arr = options["game_ids"]
    // const randomIndex = Math.floor(Math.random() * id_arr.length);
    // var random_game = id_arr[randomIndex]
    // var goal_arr = options['goal_types']
    // const randomTypeIndex = Math.floor(Math.random() * goal_arr.length);
    // var random_goal = goal_arr[randomTypeIndex]
    // var h4Element = document.createElement("h4");
    // var box = document.getElementById("current-goal-box");

    var button = document.getElementById("random-game-button");
    button.style.display = 'none';
    // In experiment mode 
    var question = document.getElementById("question");
    question.classList.remove("d-none");

    
    getGame('13056', 'clear')

    // recordGameId(random_game)
    // recordGoalType(random_goal)
}


function getGame(gameId, g_type){
    
    // Data is from expX_data_js. Dict with keys as user ids and values as list of games
    // Each game is a dict with keys: config, goal, goal_type, id, move_ids, total_moves
    // cant figure out why but file seems to exp1  data has to be named data_js.js ? 
    // id games relies on options.js 
    var id_games = data_exp2[gameId]
    console.log("data[id] is:", id_games)
    
    for (const g of id_games) {
        if (g.goal_type === g_type) {
            currentGame = g;
            break; // Exit the loop once a match is found
        }
    }
    //set currentmove to 0
    currentMove = 0;
    //call loadgame
    loadgame()
    isDone = false;
}

function loadgame(){
    //load colors into table
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


function submitGoal(typingDuration) {
    // need to add connection to server functionality
    var guessedGoal = document.getElementById('goalInput').value;
    
    let gameId = '13056'; // static for testing, should be based on whatever curr game is

    fetch('/submitGoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: gameId, goal: guessedGoal, typingTime: typingDuration}),
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

    
}

//play all moves sequentially
function playAll(){
    let playButton = document.getElementById("play-all-button")
    playButton.textContent = "Playing all moves...";
    playButton.classList.add('disabled');

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

 
//on load do this
document.addEventListener('DOMContentLoaded', function () {
    table_setup();
    document.getElementById('random-game-button').addEventListener('click', gameRandom);
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

        submitGoal(typingDuration);

        // Optional: do something with the typingDuration, e.g., display it or send it to a server
    });
});

