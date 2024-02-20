const {BLOCK_TYPE, Section, Space, SPACE_STATUS, r, o, g, b} = require('./components');
const rnds = require('./rounds');
const {v4: uuid} = require('uuid');


const GAME_STATUS = {
    NEW: 'NEW',
    JOINED: 'JOINED',
    GAME_ACK: 'GAME_ACK',
    ROUND_ACK: 'ROUND_ACK',
    COMPLETE: 'COMPLETE',
    NEW_ROUND: 'NEW_ROUND',
}



class Player {
    constructor(id, sonaId) {
        this.id = id;
        this.gameAck = false;
        this.roundAck = false;
        this.sonaId = sonaId;
    }
}


class Game {
    constructor () {
        this.id = uuid(),
        this.player = null;

        this.rounds = [];
        this.currentRound = 0;
        this.status = GAME_STATUS.NEW;
        this.gameStartTime = null;
        this.gameCompleteTime = null;

        this.board = null; // this becomes one of 9 games with 3 sections, server decides?
        this.demographicDetails = null
    }

    getState() {
        return {
            status: this.status,
            roundNum: this.currentRound, // assume practice round is 0
            round: this.rounds[this.currentRound],
            previousRound: this.currentRound > 0 ? this.rounds[this.currentRound - 1] : null,
            rounds: this.rounds
        }
    }

    
    getPlayerById(playerId) {
        return this.player.find(player => {return player.id === playerId});
    }

    acknowledge(playerId) {
        this.status = GAME_STATUS.GAME_ACK;
        playerId.GAME_ACK = true;
    
    }

   

    // printCurrentRoundInstructions() {
    //     var currRound = this.rounds[this.currentRound];
    //     console.log(`Round ${this.currentRound} Instructions: `);
    //     for (var goal of currRound.goals) {
    //         console.log(goal.description);
    //     }
    // };


}

if (module && module.exports) {
    module.exports = {Game, Player, GAME_STATUS};
}
