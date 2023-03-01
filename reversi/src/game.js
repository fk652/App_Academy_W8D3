// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var readline = require("readline");
  var Piece = require("./piece.js");
  var Board = require("./board.js");
}
// DON'T TOUCH THIS CODE

/**
 * Sets up the game with a board and the first player to play a turn.
 */
function Game () {
  this.board = new Board();
  this.turn = "black";
};

/**
 * Flips the current turn to the opposite color.
 */
Game.prototype._flipTurn = function () {
  this.turn = (this.turn == "black") ? "white" : "black";
};

// Dreaded global state!
let rlInterface;

/**
 * Creates a readline interface and starts the run loop.
 */
Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function() {
    rlInterface.close();
    rlInterface = null;
  });
};

/**
 * Gets the next move from the current player and
 * attempts to make the play.
 */
Game.prototype.playTurn = function (callback) {
  this.board.print();
  rlInterface.question(
    `${this.turn}, where do you want to move?`,
    handleResponse.bind(this)
  );

  function handleResponse(answer) {
    if (!Array.isArray(answer)) {
      answer = `[ ${answer.split(' ').join(', ')} ]`;
    }

    let pos = JSON.parse(answer);

    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn);
    this._flipTurn();
    callback();
  }
};

/*
  Counts the total number of pieces for each player
  Prints the final board state and piece counts
*/
Game.prototype.print_final_result = function() {
  let white_count = 0;
  let black_count = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let el = this.board.getPiece([i, j]);
      if (el === undefined) {
        continue;
      } else if (el.color === "white") {
        white_count++;
      } else {
        black_count++;
      }
    }
  }

  this.board.print();
  console.log(`White: ${white_count}`)
  console.log(`Black: ${black_count}`)
}

/**
 * Continues game play, switching turns, until the game is over.
 */
Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    console.log("The game is over!");
    this.print_final_result();
    overCallback();
  } else if (!this.board.hasMove(this.turn)) {
    console.log(`${this.turn} has no move!`);
    this._flipTurn();
    this.runLoop(overCallback);
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = Game;
}
// DON'T TOUCH THIS CODE