import { useState } from "react";
import "./App.css";
import bk from "./assets/bk.png";
import bb from "./assets/bb.png";
import bn from "./assets/bn.png";
import br from "./assets/br.png";
import bq from "./assets/bq.png";
import bp from "./assets/bp.png";
import wk from "./assets/wk.png";
import wb from "./assets/wb.png";
import wn from "./assets/wn.png";
import wr from "./assets/wr.png";
import wq from "./assets/wq.png";
import wp from "./assets/wp.png";
import { use } from "react";

function App() {
  const [boardpiece, setBoardpiece] = useState([]);
  const [turn, setTurn] = useState("w"); //white turn first
  let [piececontroller, setPiececontroller] = useState(false);
  const [prevpos, setPrevpos] = useState(null);
  const [kingchecked, setKingchecked] = useState(null);
  // Define major pieces for black and white
  const blackMajorPieces = [br, bn, bb, bq, bk, bb, bn, br];
  const whiteMajorPieces = [wr, wn, wb, wq, wk, wb, wn, wr];

  // Initialize the board with default positions
  const initialBoard = Array(64).fill(null);

  // Set black and white pieces dynamically
  blackMajorPieces.forEach((piece, i) => {
    initialBoard[i] = piece; // Black pieces (row 0)
    // initialBoard[8 + i] = bp; // Black pawns (row 1)
    // initialBoard[48 + i] = wp; // White pawns (row 6)
    initialBoard[56 + i] = whiteMajorPieces[i]; // White pieces (row 7)
  });

  // const friendcheck = async (a, b) => {
  //   const x = a.split("/").pop().split(".")[0];
  //   const y = b.split("/").pop().split(".")[0];
  //   if (x == y) return true;
  // };

  const movepawn = (row, col, piece) => {
    console.log(row, col, piece, "pawn");
    setPrevpos([row, col]);
    const index = row * 8 + col;
    let move1 = null;
    let move2 = null;
    let move3 = null;
    let move4 = null;
    let side1 = null;
    let side2 = null;
    setBoardpiece(piece);

    // Determine the possible moves
    if (piece.includes("wp")) {
      move1 = (row - 1) * 8 + col; // Single forward move for white pawn
      if (row === 6) move2 = (row - 2) * 8 + col; // Double forward move for white pawn

      if (col < 7) side2 = (row - 1) * 8 + (col + 1);
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
        move3 = move1;
        move1 = side1;
        move4 = move2;
        move2 = side2;
      }
    }
    if (board[side1]) {
      const j = board[side1].includes(turn);
      if (piece !== board[side1] && j === false) {
        move2 = move1;
        move1 = side1;
      }
    }
    if (board[side2]) {
      const j = board[side2].includes(turn);
      if (piece !== board[side2] && j === false) {
        move2 = move1;
        move1 = side2;
      }
    }

    // Update the board visually by toggling classes
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (i === move1 || i === move2 || i === move3 || i == move4) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
  };

  const moverook = (row, col, piece) => {
    console.log(row, col, piece, "rook");
    const index = row * 8 + col;
  };

  const movebishop = (row, col, piece) => {
    console.log(row, col, piece, "bishop");
    const index = row * 8 + col;
  };

  const moveknight = (row, col, piece) => {
    console.log(row, col, piece, "knight");
    const index = row * 8 + col;
  };

  const movequeen = (row, col, piece) => {
    console.log(row, col, piece, "queen");
    const index = row * 8 + col;
  };

  const moveking = (row, col, piece) => {
    console.log(row, col, piece, "king");
    const index = row * 8 + col;
    setPrevpos([row, col]);
    let move1 = null;
    let move2 = null;
    let move3 = null;
    let move4 = null;
    let ul = null;
    let ur = null;
    let dl = null;
    let dr = null;
    setBoardpiece(piece);
    console.log(index);

    // Determine the possible moves
    if (piece.includes("wk")) {
      move1 = (row - 1) * 8 + col; //up
      move2 = row * 8 + (col - 1); //left
      move3 = row * 8 + (col + 1); //right
      move4 = (row + 1) * 8 + col; //bottom
      ul = (row - 1) * 8 + (col - 1); //upleft
      ur = (row - 1) * 8 + (col + 1); //upright
      dl = (row + 1) * 8 + (col - 1); //downleft
      dr = (row + 1) * 8 + (col + 1); //downright
    } else if (piece.includes("bk")) {
      move1 = (row + 1) * 8 + col;
      move2 = row * 8 + (col - 1);
      move3 = row * 8 + (col + 1);
      move4 = (row - 1) * 8 + col;
      ul = (row + 1) * 8 + (col - 1);
      ur = (row + 1) * 8 + (col + 1);
      dl = (row - 1) * 8 + (col - 1);
      dr = (row - 1) * 8 + (col + 1);
    }
    const j = piece.split("/").pop().split(".")[0][0];
    // const movecheck = (a) => {
    //   if (board[a]) {
    //     const jx = board[a].split("/").pop().split(".")[0][0];
    //     let temp = a;
    //     a = null;
    //     if (j !== jx) a = temp;
    //     return a;
    //   } else {
    //     return null;
    //   }
    // };
    // move1 = movecheck(move1);
    // move2 = movecheck(move2);
    // move3 = movecheck(move3);
    // move4 = movecheck(move4);
    // ul = movecheck(ul);
    // ur = movecheck(ur);
    // dl = movecheck(dl);
    // dr = movecheck(dr);

    if (board[move1]) {
      const j1 = board[move1].split("/").pop().split(".")[0][0];
      let temp = move1;
      move1 = null;
      if (j !== j1) move1 = temp;
    }
    if (board[move2]) {
      const j2 = board[move2].split("/").pop().split(".")[0][0];
      let temp = move2;
      move2 = null;
      if (j !== j2) move2 = temp;
    }
    if (board[move3]) {
      const j3 = board[move3].split("/").pop().split(".")[0][0];
      let temp = move3;
      move3 = null;
      if (j !== j3) move3 = temp;
    }
    if (board[move4]) {
      const j4 = board[move4].split("/").pop().split(".")[0][0];
      let temp = move4;
      move4 = null;
      if (j !== j4) move4 = temp;
    }
    if (board[ul]) {
      const j5 = board[ul].split("/").pop().split(".")[0][0];
      let temp = ul;
      ul = null;
      if (j !== j5) ul = temp;
    }
    if (board[ur]) {
      const j6 = board[ur].split("/").pop().split(".")[0][0];
      let temp = ur;
      ur = null;
      if (j !== j6) ur = temp;
    }
    if (board[dl]) {
      const j7 = board[dl].split("/").pop().split(".")[0][0];
      let temp = dl;
      dl = null;
      if (j !== j7) dl = temp;
    }
    if (board[dr]) {
      const j8 = board[dr].split("/").pop().split(".")[0][0];
      let temp = dr;
      dr = null;
      if (j !== j8) dr = temp;
    }

    // Update the board visually by toggling classes
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (
        i === move1 ||
        i === move2 ||
        i === move3 ||
        i == move4 ||
        i === ul ||
        i === ur ||
        i === dl ||
        i === dr
      ) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
  };

  const selectcheck = (row, col) => {
    const index = row * 8 + col;
    const square = document.querySelectorAll(".square")[index]; // Get the specific square
    return square.classList.contains("selected"); // Check if it contains the 'selected' class
  };

  const movepiece = (row, col, piece) => {
    console.log("Attempting to move piece...");
    const isValidMove = selectcheck(row, col); // Check if the move is valid
    if (!isValidMove) {
      console.log("Invalid move: The square is not selected.");
      return; // Exit if the move is invalid
    }
    console.log("Valid move detected.");
    const targetIndex = row * 8 + col; // Target square index
    const [prevRow, prevCol] = prevpos; // Previous position
    const prevIndex = prevRow * 8 + prevCol; // Previous square index
    // Create a copy of the board to update
    const updatedBoard = [...board];

    // Move the piece
    updatedBoard[targetIndex] = boardpiece; // Place the piece on the target square
    updatedBoard[prevIndex] = null; // Clear the previous square
    // Update the board state
    setBoard(updatedBoard);
    // Clear the piececontroller and boardpiece states
    setPiececontroller(false);
    setBoardpiece(null);
    // Remove visual highlights
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("selected", "mover");
    });
    console.log("Piece moved successfully!");
    if (turn == "w") {
      setTurn("b");
    } else {
      setTurn("w");
    }
  };

  const showpath = async (row, col, piece) => {
    let j;
    try {
      if (piece) {
        j = piece.split("/").pop().split(".")[0][0];
        if (j !== turn && piececontroller == false) {
          return;
        }
      }
      if (piece == null && piececontroller == false) return;
      if (piece == null && piececontroller == true) {
        movepiece(row, col, piece);
        console.log("11");
      } else if (piececontroller == true && j !== turn) {
        movepiece(row, col, piece);
        console.log("22");
      } else {
        if (piece.includes("wp") || piece.includes("bp")) {
          movepawn(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wk") || piece.includes("bk")) {
          moveking(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wr") || piece.includes("br")) {
          moverook(row, col, piece);
        } else if (piece.includes("wb") || piece.includes("bb")) {
          movebishop(row, col, piece);
        } else if (piece.includes("wn") || piece.includes("bn")) {
          moveknight(row, col, piece);
        } else if (piece.includes("wq") || piece.includes("bq")) {
          movequeen(row, col, piece);
        } else if (piece.includes("wk") || piece.includes("bk")) {
          moveking(row, col, piece);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  const [board, setBoard] = useState(initialBoard); // State to track the board
  return (
    <div className="chessgame">
      <div className="gameplay">
        {[...Array(8)].map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {[...Array(8)].map((_, colIndex) => {
              const index = rowIndex * 8 + colIndex; // Calculate the index
              return (
                <div
                  key={colIndex}
                  className="square"
                  style={{
                    backgroundColor:
                      (rowIndex + colIndex) % 2 === 0 ? "white" : "black",
                    backgroundImage: board[index]
                      ? `url(${board[index]})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    showpath(rowIndex, colIndex, board[index]);
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="gamecontrol"></div>
    </div>
  );
}

export default App;
