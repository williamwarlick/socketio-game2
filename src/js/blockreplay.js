const tableBody = document.getElementById("table-body");
var currentGame;
var currentMove;
var mode = 'visualize'; // default mode
var nMoves = 0; // number of moves for experiment mode
var idSelectInactive;
var typeSelectInactive;
var wasPass;
var topZ;
const animation_time = 0.5;
var isDone;
var isPlaythrough;

function setMode(selectedMode) {
    mode = selectedMode;
    if(mode === 'experiment') {
        nMoves = 4;
        // nMoves = Math.floor(Math.random() * currentGame['total_moves']); // random number of moves
    }
    console.log("Mode is: " + mode)
    ModeSelection = document.getElementById("mode_selection_button");
    ModeSelection.textContent = "Mode: " + mode;
    getGame(); // reload the game
}

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

function recordGameId(gameId_str){
    const parts = gameId_str.split("_"); // Split the string by underscores
    const gameId = parts[parts.length - 1]; // Get the last part of the split string

    gameIdButton = document.getElementById("game_id_button");
    gameIdButton.textContent = gameId;
    console.log("recording : " + gameId)
    getGame()
}

function recordGoalType(goal_type_str){
    const parts = goal_type_str.split("_"); // Split the string by underscores
    const goalType = parts[parts.length - 1]; // Get the last part of the split string

    goalTypeButton = document.getElementById("goal_type_button");
    goalTypeButton.textContent = goalType;
    console.log("recording type: " + goalType)
    getGame()
}

function gameRandom(){
    var id_arr = options["game_ids"]
    const randomIndex = Math.floor(Math.random() * id_arr.length);
    var random_game = id_arr[randomIndex]
    var goal_arr = options['goal_types']
    const randomTypeIndex = Math.floor(Math.random() * goal_arr.length);
    var random_goal = goal_arr[randomTypeIndex]

    goalTypeButton = document.getElementById("goal_type_button");
    goalTypeButton.textContent = random_goal;

    gameIdButton = document.getElementById("game_id_button");
    gameIdButton.textContent = random_game;

    recordGameId(random_game)
    recordGoalType(random_goal)
}


function getGame(){
    //enable button
    var b = document.getElementById("goal_type_button");
    b.classList.remove("disabled");
    //enable button
    b = document.getElementById("game_goal_dropdown-holder");
    b.classList.remove("disabled");

    //load the json for a game after load is pressed
    const id_button = document.getElementById("game_id_button");
    const type_button = document.getElementById("goal_type_button");
    var id = id_button.textContent;
    var type = type_button.textContent;
    // Data is from expX_data_js. Dict with keys as user ids and values as list of games
    // Each game is a dict with keys: config, goal, goal_type, id, move_ids, total_moves
    // cant figure out why but file seems to exp1  data has to be named data_js.js ? 
    // id games relies on options.js 
    id_games = data_exp2[id]
    console.log("data[id] is:", id_games)
    
    for (const g of id_games) {
        if (g.goal_type === type) {
            currentGame = g;
            break; // Exit the loop once a match is found
        }
    }
    //set currentmove to 0
    currentMove = 0;

    //call loadgame
    loadgame()
    //updateInfoPanel();

    var help = document.getElementById("inithelp");
    help.style.display = 'none';

    //show info panel
    updateInfoPanel()
    panel = document.getElementById("infopanel");
    panel.style.display = 'block';


    //disable buttons on move
    var button = document.getElementById("game_id_button");
    button.style.display = 'none';
    button = document.getElementById("goal_type_button");
    button.style.display = 'none';
    button = document.getElementById("random-game-button");
    button.style.display = 'none';

    //show topcard
    updateInfoPanel()
    panel = document.getElementById("topCard");
    panel.style.display = 'flex';
    isDone = false;

    // var controls = document.getElementById("ingamecontrols");
    // controls.style.display = 'block';

    // var t = document.getElementById("gametable");
    // t.style.display = 'block';

}

function loadgame(){
    document.getElementById('next_move_button').classList.remove('disabled')
    //load colors into table
    var cellId = 0;
    colors = currentGame.config
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
    for (var i = 0; i < colors.length; i++) {
        var block = document.getElementById(cellId);
        block.setAttribute('style', 'background-color:white;')
        cellId++
    }
}

function nextMove(){
    console.log("Nmoves: " + nMoves)
    console.log("Current Move: " + currentMove)
    if (isPlaythrough){
        document.getElementById('next_move_button').classList.add('disabled');
        document.getElementById('undo_move_button').classList.add('disabled');
        document.getElementById('reset_button').classList.add('disabled');
    }
    if (currentMove + 1 <= currentGame['total_moves']){
        move = currentMove;
        orig_id = currentGame['move_ids'][move][0];
        if (orig_id != '999'){
            wasPass = false;
            orig_element = document.getElementById(orig_id);
            bg_color = orig_element.style.backgroundColor;
            var orig_color = bg_color.replace("background-color:", "").trim();

            new_id = currentGame['move_ids'][move][1];
            new_element = document.getElementById(new_id);
            console.log("new_id", new_id)

            animate_move(orig_id, new_id);
            // orig_element.style.backgroundColor = "white";
            // new_element.style.backgroundColor = orig_color;
        } else {
            wasPass = true;
        }

        // //enable game change button
        // var b = document.getElementById('change-game-button');
        // b.style.display = '';

        button = document.getElementById("infopanel");
        button.style.display = 'none';

        currentMove++;
        updateInfoPanel();
        if (currentMove >= currentGame['total_moves']){
            //in case game is over
            //add game completed badge
            var box = document.getElementById("current-player-box");
            box.innerHTML = box.innerHTML + ' <span class="badge bg-success">Game Completed</span>';
            //grey out next_move button
            document.getElementById('next_move_button').classList.add('disabled');
            isDone = true;
            //re-enable buttons
            document.getElementById('undo_move_button').classList.remove('disabled');
            document.getElementById('reset_button').classList.remove('disabled');
            isPlaythrough = false;
            document.getElementById("play-all-button").textContent = "Play All Moves⇥";
        }
    } else {
        //in case game is over
        //add game completed badge
        var box = document.getElementById("current-player-box");
        box.innerHTML = box.innerHTML + ' <span class="badge bg-success">Game Completed</span>';
        //grey out next_move button
        document.getElementById('next_move_button').classList.add('disabled');
        isDone = true;
        //re-enable buttons
        document.getElementById('undo_move_button').classList.remove('disabled');
        document.getElementById('reset_button').classList.remove('disabled');
        isPlaythrough = false;
        document.getElementById("play-all-button").textContent = "Play All Moves⇥";
    }
    document.getElementById('next_move_button').addEventListener('click', nextMove);
}

function animate_move(id1, id2){
    var orig_color = bg_color.replace("background-color:", "").trim();

    //init locations
    var yinit = document.getElementById(id1).offsetTop;
    var xinit = document.getElementById(id1).offsetLeft;

    //final locations
    var yfinal = document.getElementById(id2).offsetTop;
    var xfinal = document.getElementById(id2).offsetLeft;

    //create a square of orig_color in location of id1
    square = createSquare(xinit, yinit, orig_color);

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

function updateInfoPanel(){
    if (currentMove > 0){
        // Current player
        if (currentMove % 2 == 1){
            content ='Last move by: <span class="badge bg-success">Architect</span>';
        } else {
            content = 'Last move by:  <span class="badge bg-danger">Helper</span>';
        }
        if (wasPass){
            content = content + ' <span class="badge bg-info">PASS</span>'
        }
        var h4Element = document.createElement("h4");
        h4Element.innerHTML = content;
        var box = document.getElementById("current-player-box");
        // Append to the div and empty previous 
        box.innerHTML = "";
        box.appendChild(h4Element);


        //Current move
        var h4Element = document.createElement("h4");
        h4Element.textContent = 'Move # ' + currentMove;
        
        var box = document.getElementById("current-move-box");
        // Append to the div and empty previous 
        box.innerHTML = "";
        box.appendChild(h4Element);
    } else {
        document.getElementById("current-move-box").innerHTML = '';
        document.getElementById("current-player-box").innerHTML = '';
    }

    // Current goal
    var h4Element = document.createElement("h4");
    var box = document.getElementById("current-goal-box");

    if (mode === 'visualize'){
        h4Element.textContent = "Current goal: " + niceNames(currentGame['goal']);
        box.innerHTML = ""; // Clear existing content
        box.appendChild(h4Element);
    } else {
        // In experiment mode 
        h4Element.textContent = "Watch the blocks and consider what the Goal is?";

        if (currentMove >= nMoves) {
            var b = document.getElementById('next_move_button');
            b.disabled = true;
            console.log("Disabled!");

          

        // Create the input group container
        var inputGroup = document.createElement("div");
        inputGroup.className = "input-group mb-3"; // Bootstrap class for input groups

        // Create and append the input element
        var inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "goalInput";
        inputBox.placeholder = "Explain the goal";
        inputBox.className = "form-control"; // Bootstrap class for form control
        inputGroup.appendChild(inputBox);

        // Create and append the submit button
        var submitButton = document.createElement("button");
        submitButton.id = "submitGoal";
        submitButton.textContent = "Submit";
        submitButton.onclick = submitGoal;
        submitButton.className = "btn btn-primary"; // Bootstrap class for buttons
        inputGroup.appendChild(submitButton);

        box.innerHTML = ""; // Clear existing content
        box.appendChild(h4Element); // Append the current goal text
        box.appendChild(inputGroup); // Append the input group with input box and submit button



        } else {
            var b = document.getElementById('next_move_button');
            b.disabled = false;
            box.innerHTML = ""; // Clear existing content
            box.appendChild(h4Element); // Append the current goal text
        }
    }

    // Current game
    var newh4Element = document.createElement("h4");
    newh4Element.textContent = "Current ID: " + (currentGame['id']);
    var newbox = document.getElementById("current-game-box");

    newbox.innerHTML = ""; // Clear existing content
    newbox.appendChild(newh4Element); // Append the current game text

    // Show info panel
    panel = document.getElementById("infopanel");
    panel.style.display = 'block';
}

function submitGoal() {
    var guessedGoal = document.getElementById('goalInput').value;
    // Placeholder for the response to be send to DB 
    console.log("Submitting guessed goal: " + guessedGoal);
    // Display confirmation message
    var confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
    
    // Set a timeout for the modal to hide
    setTimeout(function() {
        confirmationModal.hide();
        window.location.href = 'index.html';
    }, 1500);
    // Redirect to the index page
    
   
}



// make the goal names more readable
function niceNames(str){
    if (str.includes("cover")){
        str = str.replace("all", "")
        return str.replace("cover", "cover all")
    } else if (str.includes("fill")) {
        return str.replace("nocolor", '')
    } else if (str.includes("move")){
        str = str.replace("A", "to A")
        str = str.replace("B", "to B")
        str = str.replace("C", "to C")
        return str
    } else {return str.replace("nocolor","")}
}

function previousMove(){
    if (currentMove  > 0 ){
        document.getElementById('next_move_button').classList.remove('disabled')
        currentMove--;
        move = currentMove;
        orig_id = currentGame['move_ids'][move][1];
        if (orig_id != '999'){
            orig_element = document.getElementById(orig_id);
            bg_color = orig_element.style.backgroundColor;
            var orig_color = bg_color.replace("background-color:", "").trim();
    
            new_id = currentGame['move_ids'][move][0];
            new_element = document.getElementById(new_id);
            console.log("new_id", new_id)
            new_element.style.backgroundColor = orig_color;
            orig_element.style.backgroundColor = "white";
            
        }
        updateInfoPanel();
    }
}

//play all moves sequentially
function playAll(){
    //check if function is already running and stop it if so
    if (isPlaythrough){
        isDone = true;
        setTimeout(function() {
            document.getElementById('undo_move_button').classList.remove('disabled');
            document.getElementById('reset_button').classList.remove('disabled');
            document.getElementById('next_move_button').classList.remove('disabled');
            isPlaythrough = false;
            isDone = false;
            //change button to play
            document.getElementById("play-all-button").textContent = "Play All Moves⇥";
          }, 810);
        return
    }
    // change button to stop
    document.getElementById("play-all-button").textContent = "STOP ◼";

    isPlaythrough = true;
    function doLoop() {         
        setTimeout(function() {   
            isPlaythrough = true;
            nextMove()
            if (!isDone) {      
            doLoop();             
            }
            
        }, 800)
    }
    doLoop();   
}

// function gameChange(){
//     //enable game option select buttons
//    var button = document.getElementById("game_id_button");
//    button.style.display = '';
//    button = document.getElementById("goal_type_button");
//    button.style.display = '';
//    button = document.getElementById("random-game-button");
//    button.style.display = '';
//    //diable game change button
//    button = document.getElementById("change-game-button");
//    button.style.display = 'none';
//    //empty info panels
//    var box = document.getElementById("current-player-box");
//    box.innerHTML = "";
//    var box = document.getElementById("current-move-box");
//    box.innerHTML = "";
//    var box = document.getElementById("current-goal-box");
//    box.innerHTML = "";

//     // reset selection buttons
//    var box = document.getElementById("goal_type_button");
//    box.innerHTML = "Selet Goal Type ⏷";
//    var box = document.getElementById("game_id_button");
//    box.innerHTML = "Select Player ID ⏷";

//     //hide info panel
//     panel = document.getElementById("infopanel");
//     panel.style.display = 'none';

//     //clear game
//     cleargame();


// }

function load_options(){
    var id_dropdown = document.getElementById("game_id_dropdown");
    var goal_dropdown = document.getElementById("game_goal_dropdown");
    var ids = options.game_ids
    var goals = options.goal_types

    for (var i = 0; i < ids.length; i++) {
        var optionText = ids[i];
        // Create a new <a> element
        var anchor = document.createElement("a");
        // Set the id attribute
        anchor.setAttribute("id", "option_id_" + optionText);
        anchor.setAttribute("href", "#");
        anchor.setAttribute("class", "option_id_item");
        // Set the text content
        anchor.textContent = optionText;
        // Append the <a> element to the dropdown
        id_dropdown.appendChild(anchor);
        // anchor.addEventListener("click", function() {
        //     const argument = optionText
        //     recordGameId(argument);
        // });    
    }
    for (var i = 0; i < goals.length; i++) {
        var optionText2 = goals[i];
        // Create a new <a> element
        var anchor2 = document.createElement("a");
        // Set the id attribute
        anchor2.setAttribute("id", "option_goal_" + optionText2);
        anchor2.setAttribute("href", "#");
        anchor2.setAttribute("class", "option_goal_item");
        // Set the text content
        anchor2.textContent = optionText2;
        // Append the <a> element to the dropdown
        goal_dropdown.appendChild(anchor2);
        // anchor2.addEventListener("click", function() {
        //     const argument = optionText2
        //     recordGoalType(argument);
        // });
    }
}

// for locally developing
function setChangeGameButtonUrl() {
    var changeGameButton = document.getElementById('change-game-button');
    var hostname = window.location.hostname;
    console.log(hostname)

    if(hostname === 'localhost') {
        changeGameButton.href = 'http://localhost:3000/blockreplay.html';
    } else {
        changeGameButton.href = 'production_url_here';
    }
}
 
//on load do this
document.addEventListener('DOMContentLoaded', function () {
    setChangeGameButtonUrl();
    //load table and options
    table_setup();
    load_options();
    coolDown = false;

    //hide table
    // var t = document.getElementById("gametable");
    // t.style.display = 'none';

    //hide info panel
    // panel = document.getElementById("infopanel");
    // panel.style.display = 'none';

    //hide controls
    // var controls = document.getElementById("ingamecontrols");
    // controls.style.display = 'block';
   

    document.getElementById('visualize_mode').addEventListener('click', () => setMode('visualize'));
    document.getElementById('experiment_mode').addEventListener('click', () => setMode('experiment'));

    document.getElementById('reset_button').addEventListener('click', getGame);
    document.getElementById('next_move_button').addEventListener('click', nextMove);
    document.getElementById('undo_move_button').addEventListener('click', previousMove);
    document.getElementById('random-game-button').addEventListener('click', gameRandom);
    document.getElementById('play-all-button').addEventListener('click', playAll);


    const optionIdElements = document.querySelectorAll(".option_id_item");

    // Loop through each element and add a click event listener
    optionIdElements.forEach(function(element) {
        element.addEventListener("click", function() {
            recordGameId(element.id);
        });
    });

    const optionGoalElements = document.querySelectorAll(".option_goal_item");

    // Loop through each element and add a click event listener
    optionGoalElements.forEach(function(element) {
        element.addEventListener("click", function() {
            recordGoalType(element.id)
        });
    });
});


// function animateMove(id1, id2) {
//     var source_element = document.getElementById(id1);
//     var destination_element = document.getElementById(id2);

//     // store the x,y coordinates of the target
//     var xT = destination_element.offsetLeft;
//     var yT = destination_element.offsetTop;
//     //destination_element.style.display = 'block';

//     // store the elements coordinate
//     var xE = source_element.offsetLeft;
//     var yE = source_element.offsetTop;

//     source_element.style.left = 0 + 'px';
//     source_element.style.top = 0 + 'px';

//     source_element.style.zIndex = "999";
//     console.log('x, y: ' + xT + ' ' + yT)

//     setTimeout(function() {
//         //set to destination position
//         source_element.style.left = xT - xE + 'px';
//         source_element.style.top = yT - yE + 'px';
//     }, 20);
//     setTimeout(function () {
//         //source_element.style.display = 'none';
        
//         setTimeout(function() {
//             //destination_element.style.display = 'block';
//             coolDown = false;
//         }, 100);
//       }, 750);
    
// }

// function undo_animation(id1){
//     var source_element = document.getElementById(id1);
//     source_element.style.display = 'none'
//     source_element.style.left = 0 + 'px';
//     source_element.style.top = 0 + 'px';
//     setTimeout(function () {
//         source_element.style.display = 'block';
//         source_element.style.zIndex = "100";
//       }, 1000);
// }


