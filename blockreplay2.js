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

        this.demographicDetails = null
    }

    getState() {
        return {
            status: this.status,
            roundNum: this.currentRound, // assume practice round is 0
            round: this.rounds[this.currentRound],
            rounds: this.rounds,
            status: this.status,
        }
    }

    // call after each round is complete
    getSaveState() {
        return {
            id: this.id,
            roundNum: this.currentRound,
            playerId: this.player.id,
            status: this.status,
            roundNum: this.currentRound + 1,
            demographicDetails: this.demographicDetails,
        }
    }

    
    getPlayerById(playerId) {
        return this.player.find(player => {return player.id === playerId});
    }

    acknowledge(playerId) {
        this.status = GAME_STATUS.GAME_ACK;
        playerId.GAME_ACK = true;
    
    }


}

if (module && module.exports) {
    module.exports = {Game, Player, GAME_STATUS};
}
