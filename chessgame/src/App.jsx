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
  const [board, setBoard] = useState(initialBoard); // State to track the board
  const [boardpiece, setBoardpiece] = useState([]);
  let [piececontroller, setPiececontroller] = useState(false);
  const [prevpos, setPrevpos] = useState(null);
  // Define major pieces for black and white
  const blackMajorPieces = [br, bn, bb, bq, bk, bb, bn, br];
  const whiteMajorPieces = [wr, wn, wb, wq, wk, wb, wn, wr];

  // Initialize the board with default positions
  const initialBoard = Array(64).fill(null);

  // Set black and white pieces dynamically
  blackMajorPieces.forEach((piece, i) => {
    initialBoard[i] = piece; // Black pieces (row 0)
    initialBoard[8 + i] = bp; // Black pawns (row 1)
    initialBoard[48 + i] = wp; // White pawns (row 6)
    initialBoard[56 + i] = whiteMajorPieces[i]; // White pieces (row 7)
  });

  const movepawn = (row, col, piece) => {
    console.log(row, col, piece, "pawn");
    setPrevpos([row, col]);
    const index = row * 8 + col;
    let move1 = null;
    let move2 = null;
    setBoardpiece(piece);
    // Determine the possible moves
    if (piece.includes("wp")) {
      move1 = (row - 1) * 8 + col; // Single forward move for white pawn
      if (row === 6) move2 = (row - 2) * 8 + col; // Double forward move for white pawn
    } else if (piece.includes("bp")) {
      move1 = (row + 1) * 8 + col; // Single forward move for black pawn
      if (row === 1) move2 = (row + 2) * 8 + col; // Double forward move for black pawn
    }
    console.log(`Current Index: ${index}, Move1: ${move1}, Move2: ${move2}`);

    // Update the board visually by toggling classes
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (i === move1 || i === move2) {
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
  };

  const movepiece = (row, col, piece) => {
    console.log("ya");
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
  };

  const showpath = async (row, col, piece) => {
    try {
      console.log(row, col);
      if (piece == null && piececontroller == false) return;
      if (piece == null && piececontroller == true) {
        movepiece(row, col, piece);
      } else {
        if (piece.includes("wp") || piece.includes("bp")) {
          movepawn(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wk") || piece.includes("bk")) {
          moveking(row, col, piece);
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
