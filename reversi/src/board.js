// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = new Array(8);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(8);
  }

  grid[3][3] = new Piece("white");
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let [x, y] = pos

  if (x < 0 || x > 7 || y < 0 || y > 7) {
    return false
  } else {
    return true
  }

};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error('Not valid pos!')
  } else {
    return this.grid[pos[0]][pos[1]]
  }
};
// will return undefined if pos is empty

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos)
  if (piece === undefined) return false

  return piece.color === color
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== undefined;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  // debugger;
  piecesToFlip ||= [];

  let [x, y] = pos;
  let [dx, dy] = dir;
  let nextPos = [x + dx, y + dy]

  // if (!((this.validMove(nextPos) && !this.isMine(nextPos, color)))) {
  if (this.isValidPos(nextPos) && this.isMine(nextPos, color)) {
    return piecesToFlip;
  } else if (!this.isValidPos(nextPos) || !this.isOccupied(nextPos)) {
    piecesToFlip = [];
    return piecesToFlip;
  }

  piecesToFlip.push(nextPos);
  return this._positionsToFlip(nextPos, color, dir, piecesToFlip);
}

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) return false
  
  for (let i = 0; i < Board.DIRS.length; i++) {
    if (this._positionsToFlip(pos, color, Board.DIRS[i]).length > 0) return true
  }
  return false
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error('Invalid move!')
  }
  let pos_to_flip = []

  for (let i = 0; i < Board.DIRS.length; i++) {
    pos_to_flip = pos_to_flip.concat(this._positionsToFlip(pos, color, Board.DIRS[i]))
  }

  for (let i = 0; i < pos_to_flip.length; i++) {
    let flip_pos = pos_to_flip[i]
    this.getPiece(flip_pos).flip()
  }

  this.grid[pos[0]][pos[1]] = new Piece(color)
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validPos = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color)) validPos.push([i,j]);
    }
  }
  return validPos;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove("white") && !this.hasMove("black");
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("   0  1  2  3  4  5  6  7")
  for (let i = 0; i < 8; i++) {
    let new_row = [];
    for (let j = 0; j < 8; j++) {
      let el = this.grid[i][j];
      if (el === undefined) {
        new_row.push("__");
      } else if (el.color === "white") {
        new_row.push("🍑");
      } else {
        new_row.push("🍆");
      }
    }
    console.log(i, new_row.join(' '));
  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE