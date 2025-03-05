const movemypawn = (row, col, piece, a) => {
  const index = row * 8 + col;
  let move1 = null;
  let move2 = null;
  let move3 = null;
  let move4 = null;
  let side1 = null;
  let side2 = null;
  // Determine the possible moves
  if (piece.includes("wp")) {
    move1 = (row - 1) * 8 + col; // Single forward move for white pawn
    if (row === 6) move2 = (row - 2) * 8 + col; // Double forward move for white pawn

    if (col < 8) side2 = (row - 1) * 8 + (col + 1);
    if (col != 0) {
      side1 = (row - 1) * 8 + (col - 1);
    } else {
      side1 = null;
    }
  } else if (piece.includes("bp")) {
    move1 = (row + 1) * 8 + col; // Single forward move for black pawn
    if (row === 1) move2 = (row + 2) * 8 + col; // Double forward move for black pawn
    if (col > 0) side1 = (row + 1) * 8 + (col - 1);
    if (col != 7) {
      side2 = (row + 1) * 8 + (col + 1);
    } else {
      side2 = null;
    }
  }

  if (board[move2]) {
    move2 = null;
  }
  if (board[move1]) {
    move1 = null;
    move2 = null;
  }

  if (board[side1] && board[side2]) {
    if (piece !== board[side1] && piece !== board[side2]) {
      move2 = side1;
      move3 = side2;
    }
  }
  if (board[side1]) {
    const j = board[side1].includes(turn);
    if (piece !== board[side1] && j === false) {
      move3 = move2;
      move2 = move1;
      move1 = side1;
    }
  }
  if (board[side2]) {
    const j = board[side2].includes(turn);
    if (piece !== board[side2] && j === false) {
      move3 = move2;
      move2 = move1;
      move1 = side2;
    }
  }
  let moves = [move1, move2, move3, move4, side1, side2];
  // Update the board visually by toggling classes
  if (!a) {
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (i === move1 || i === move2 || i === move3 || i == move4) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
  }
  return moves;
};

export default movemypawn;
