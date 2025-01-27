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
  const [wkingchecked, setWkingchecked] = useState("");
  const [bkingchecked, setBkingchecked] = useState("");
  const [rookpos, setRookpos] = useState(null);
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
    let moves = [move1, move2, move3, move4, side1, side2];
    // Update the board visually by toggling classes
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (i === move1 || i === move2 || i === move3 || i == move4) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  const moverook = (row, col, piece) => {
    const index = row * 8 + col;
    setPrevpos([row, col]);
    setBoardpiece(piece);
    const directions = [
      { dr: -1, dc: 0 }, // Up
      { dr: 1, dc: 0 }, // Down
      { dr: 0, dc: -1 }, // Left
      { dr: 0, dc: 1 }, // Right
    ];

    let moves = [];

    directions.forEach(({ dr, dc }) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        // Check if the move is out of bounds
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const moveIndex = newRow * 8 + newCol;

        // If the square is occupied
        if (board[moveIndex]) {
          const j = board[moveIndex].split("/").pop().split(".")[0][0];

          // Stop if the piece is the same color as the current turn
          if (j === turn) break;

          // Add the square as a valid move (capture opponent piece)
          moves.push(moveIndex);
          break; // Stop further movement in this direction
        }

        // Add the square as a valid move
        moves.push(moveIndex);
      }
    });

    // Highlight valid moves
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === row * 8 + col) {
        square.classList.add("mover"); // Highlight current piece
      } else if (moves.includes(i)) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  const movebishop = (row, col, piece) => {
    const index = row * 8 + col;
    setPrevpos([row, col]);
    setBoardpiece(piece);

    const directions = [
      { dr: -1, dc: -1 }, // Up-Left
      { dr: -1, dc: 1 }, // Up-Right
      { dr: 1, dc: -1 }, // Down-Left
      { dr: 1, dc: 1 }, // Down-Right
    ];

    let moves = [];

    directions.forEach(({ dr, dc }) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        // Check if the move is out of bounds
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const moveIndex = newRow * 8 + newCol;

        // If the square is occupied
        if (board[moveIndex]) {
          const j = board[moveIndex].split("/").pop().split(".")[0][0];

          // Stop if the piece is the same color as the current turn
          if (j === turn) break;

          // Add the square as a valid move (capture opponent piece)
          moves.push(moveIndex);
          break; // Stop further movement in this direction
        }

        // Add the square as a valid move
        moves.push(moveIndex);
      }
    });

    // Highlight valid moves
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === row * 8 + col) {
        square.classList.add("mover"); // Highlight current piece
      } else if (moves.includes(i)) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  // const moveknight = (row, col, piece) => {
  //   console.log(row, col, piece, "knight");
  //   setPrevpos([row, col]);
  //   setBoardpiece(piece);
  //   const index = row * 8 + col;
  //   let move1 = null;
  //   let move2 = null;
  //   let move3 = null;
  //   let move4 = null;
  //   let move5 = null;
  //   let move6 = null;
  //   let move7 = null;
  //   let move8 = null;

  //   // Determine the possible moves
  //   if (piece.includes("wn")) {
  //     if (row - 1 >= 0 && col - 2 >= 0) move1 = (row - 1) * 8 + (col - 2);
  //     if (row - 2 >= 0 && col - 1 >= 0) move2 = (row - 2) * 8 + (col - 1);
  //     if (row - 2 >= 0 && col + 1 <= 7) move3 = (row - 2) * 8 + (col + 1);
  //     if (row - 1 >= 0 && col + 2 <= 7) move4 = (row - 1) * 8 + (col + 2);
  //     if (row + 1 <= 7 && col + 2 <= 7) move5 = (row + 1) * 8 + (col + 2);
  //     if (row + 2 <= 7 && col + 1 <= 7) move6 = (row + 2) * 8 + (col + 1);
  //     if (row + 2 <= 7 && col - 1 >= 0) move7 = (row + 2) * 8 + (col - 1);
  //     if (row + 1 <= 7 && col - 2 >= 0) move8 = (row + 1) * 8 + (col - 2);
  //   } else if (piece.includes("bn")) {
  //     if (row - 1 >= 0 && col - 2 >= 0) move1 = (row - 1) * 8 + (col - 2);
  //     if (row - 2 >= 0 && col - 1 >= 0) move2 = (row - 2) * 8 + (col - 1);
  //     if (row - 2 >= 0 && col + 1 <= 7) move3 = (row - 2) * 8 + (col + 1);
  //     if (row - 1 >= 0 && col + 2 <= 7) move4 = (row - 1) * 8 + (col + 2);
  //     if (row + 1 <= 7 && col + 2 <= 7) move5 = (row + 1) * 8 + (col + 2);
  //     if (row + 2 <= 7 && col + 1 <= 7) move6 = (row + 2) * 8 + (col + 1);
  //     if (row + 2 <= 7 && col - 1 >= 0) move7 = (row + 2) * 8 + (col - 1);
  //     if (row + 1 <= 7 && col - 2 >= 0) move8 = (row + 1) * 8 + (col - 2);
  //   }
  //   const j = piece.split("/").pop().split(".")[0][0];
  //   if (board[move1]) {
  //     const j1 = board[move1].split("/").pop().split(".")[0][0];
  //     let temp = move1;
  //     move1 = null;
  //     if (j !== j1) move1 = temp;
  //   }
  //   if (board[move2]) {
  //     const j2 = board[move2].split("/").pop().split(".")[0][0];
  //     let temp = move2;
  //     move2 = null;
  //     if (j !== j2) move2 = temp;
  //   }
  //   if (board[move3]) {
  //     const j3 = board[move3].split("/").pop().split(".")[0][0];
  //     let temp = move3;
  //     move3 = null;
  //     if (j !== j3) move3 = temp;
  //   }
  //   if (board[move4]) {
  //     const j4 = board[move4].split("/").pop().split(".")[0][0];
  //     let temp = move4;
  //     move4 = null;
  //     if (j !== j4) move4 = temp;
  //   }
  //   if (board[move5]) {
  //     const j5 = board[move5].split("/").pop().split(".")[0][0];
  //     let temp = move5;
  //     move5 = null;
  //     if (j !== j5) move5 = temp;
  //   }
  //   if (board[move6]) {
  //     const j6 = board[move6].split("/").pop().split(".")[0][0];
  //     let temp = move6;
  //     move6 = null;
  //     if (j !== j6) move6 = temp;
  //   }
  //   if (board[move7]) {
  //     const j7 = board[move7].split("/").pop().split(".")[0][0];
  //     let temp = move7;
  //     move7 = null;
  //     if (j !== j7) move7 = temp;
  //   }
  //   if (board[move8]) {
  //     const j8 = board[move8].split("/").pop().split(".")[0][0];
  //     let temp = move8;
  //     move8 = null;
  //     if (j !== j8) move8 = temp;
  //   }

  //   // Update the board visually by toggling classes
  //   document.querySelectorAll(".square").forEach((square, i) => {
  //     square.classList.remove("selected", "mover");
  //     if (i === index) {
  //       square.classList.add("mover"); // Highlight current piece
  //     } else if (
  //       i === move1 ||
  //       i === move2 ||
  //       i === move3 ||
  //       i == move4 ||
  //       i === move5 ||
  //       i === move6 ||
  //       i === move7 ||
  //       i === move8
  //     ) {
  //       square.classList.add("selected"); // Highlight possible moves
  //     }
  //   });
  // };

  const moveknight = (row, col, piece) => {
    setPrevpos([row, col]);
    setBoardpiece(piece);

    const index = row * 8 + col;
    const knightMoves = [
      { dr: -1, dc: -2 },
      { dr: -2, dc: -1 },
      { dr: -2, dc: 1 },
      { dr: -1, dc: 2 },
      { dr: 1, dc: 2 },
      { dr: 2, dc: 1 },
      { dr: 2, dc: -1 },
      { dr: 1, dc: -2 },
    ];

    const moves = [];

    knightMoves.forEach(({ dr, dc }) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the move is within bounds
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const moveIndex = newRow * 8 + newCol;

        // If the square is occupied
        if (board[moveIndex]) {
          const currentPieceColor = piece.split("/").pop().split(".")[0][0];
          const targetPieceColor = board[moveIndex]
            .split("/")
            .pop()
            .split(".")[0][0];

          // Add move if it's capturing an opponent piece
          if (currentPieceColor !== targetPieceColor) {
            moves.push(moveIndex);
          }
        } else {
          // Add move if the square is empty
          moves.push(moveIndex);
        }
      }
    });

    // Update the board visually by toggling classes
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (moves.includes(i)) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  const movequeen = (row, col, piece) => {
    const index = row * 8 + col;
    setPrevpos([row, col]);
    setBoardpiece(piece);

    // Define all directions for the queen (rook + bishop movements)
    const directions = [
      { dr: -1, dc: 0 }, // Up (rook)
      { dr: 1, dc: 0 }, // Down (rook)
      { dr: 0, dc: -1 }, // Left (rook)
      { dr: 0, dc: 1 }, // Right (rook)
      { dr: -1, dc: -1 }, // Up-Left (bishop)
      { dr: -1, dc: 1 }, // Up-Right (bishop)
      { dr: 1, dc: -1 }, // Down-Left (bishop)
      { dr: 1, dc: 1 }, // Down-Right (bishop)
    ];

    let moves = [];

    // Iterate through each direction
    directions.forEach(({ dr, dc }) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        // Check if the move is out of bounds
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const moveIndex = newRow * 8 + newCol;

        // If the square is occupied
        if (board[moveIndex]) {
          const j = board[moveIndex].split("/").pop().split(".")[0][0];

          // Stop if the piece is the same color as the current turn
          if (j === turn) break;

          // Add the square as a valid move (capture opponent piece)
          moves.push(moveIndex);
          break; // Stop further movement in this direction
        }

        // Add the square as a valid move
        moves.push(moveIndex);
      }
    });

    // Highlight valid moves
    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === row * 8 + col) {
        square.classList.add("mover"); // Highlight current piece
      } else if (moves.includes(i)) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  // const moveking = (row, col, piece) => {
  //   console.log(row, col, piece, "king");
  //   const index = row * 8 + col;
  //   setPrevpos([row, col]);
  //   let move1 = null;
  //   let move2 = null;
  //   let move3 = null;
  //   let move4 = null;
  //   let ul = null;
  //   let ur = null;
  //   let dl = null;
  //   let dr = null;
  //   setBoardpiece(piece);
  //   console.log(index);

  //   // Determine the possible moves
  //   if (piece.includes("wk")) {
  //     move1 = (row - 1) * 8 + col; //up
  //     move2 = row * 8 + (col - 1); //left
  //     move3 = row * 8 + (col + 1); //right
  //     move4 = (row + 1) * 8 + col; //bottom
  //     ul = (row - 1) * 8 + (col - 1); //upleft
  //     ur = (row - 1) * 8 + (col + 1); //upright
  //     dl = (row + 1) * 8 + (col - 1); //downleft
  //     dr = (row + 1) * 8 + (col + 1); //downright
  //   } else if (piece.includes("bk")) {
  //     move1 = (row + 1) * 8 + col;
  //     move2 = row * 8 + (col - 1);
  //     move3 = row * 8 + (col + 1);
  //     move4 = (row - 1) * 8 + col;
  //     ul = (row + 1) * 8 + (col - 1);
  //     ur = (row + 1) * 8 + (col + 1);
  //     dl = (row - 1) * 8 + (col - 1);
  //     dr = (row - 1) * 8 + (col + 1);
  //   }
  //   const j = piece.split("/").pop().split(".")[0][0];

  //   if (board[move1]) {
  //     const j1 = board[move1].split("/").pop().split(".")[0][0];
  //     let temp = move1;
  //     move1 = null;
  //     if (j !== j1) move1 = temp;
  //   }
  //   if (board[move2]) {
  //     const j2 = board[move2].split("/").pop().split(".")[0][0];
  //     let temp = move2;
  //     move2 = null;
  //     if (j !== j2) move2 = temp;
  //   }
  //   if (board[move3]) {
  //     const j3 = board[move3].split("/").pop().split(".")[0][0];
  //     let temp = move3;
  //     move3 = null;
  //     if (j !== j3) move3 = temp;
  //   }
  //   if (board[move4]) {
  //     const j4 = board[move4].split("/").pop().split(".")[0][0];
  //     let temp = move4;
  //     move4 = null;
  //     if (j !== j4) move4 = temp;
  //   }
  //   if (board[ul]) {
  //     const j5 = board[ul].split("/").pop().split(".")[0][0];
  //     let temp = ul;
  //     ul = null;
  //     if (j !== j5) ul = temp;
  //   }
  //   if (board[ur]) {
  //     const j6 = board[ur].split("/").pop().split(".")[0][0];
  //     let temp = ur;
  //     ur = null;
  //     if (j !== j6) ur = temp;
  //   }
  //   if (board[dl]) {
  //     const j7 = board[dl].split("/").pop().split(".")[0][0];
  //     let temp = dl;
  //     dl = null;
  //     if (j !== j7) dl = temp;
  //   }
  //   if (board[dr]) {
  //     const j8 = board[dr].split("/").pop().split(".")[0][0];
  //     let temp = dr;
  //     dr = null;
  //     if (j !== j8) dr = temp;
  //   }

  //   // Update the board visually by toggling classes
  //   document.querySelectorAll(".square").forEach((square, i) => {
  //     square.classList.remove("selected", "mover");
  //     if (i === index) {
  //       square.classList.add("mover"); // Highlight current piece
  //     } else if (
  //       i === move1 ||
  //       i === move2 ||
  //       i === move3 ||
  //       i == move4 ||
  //       i === ul ||
  //       i === ur ||
  //       i === dl ||
  //       i === dr
  //     ) {
  //       square.classList.add("selected"); // Highlight possible moves
  //     }
  //   });
  // };

  const moveking = (row, col, piece) => {
    const index = row * 8 + col;
    setPrevpos([row, col]);
    setBoardpiece(piece);

    const kingMoves = [
      { dr: -1, dc: 0 }, // Up
      { dr: 1, dc: 0 }, // Down
      { dr: 0, dc: -1 }, // Left
      { dr: 0, dc: 1 }, // Right
      { dr: -1, dc: -1 }, // Up-Left
      { dr: -1, dc: 1 }, // Up-Right
      { dr: 1, dc: -1 }, // Down-Left
      { dr: 1, dc: 1 }, // Down-Right
    ];

    const moves = [];
    const currentColor = piece.split("/").pop().split(".")[0][0];

    kingMoves.forEach(({ dr, dc }) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the move is within bounds
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const moveIndex = newRow * 8 + newCol;

        if (board[moveIndex]) {
          const targetColor = board[moveIndex]
            .split("/")
            .pop()
            .split(".")[0][0];
          // Add move if capturing opponent piece
          if (currentColor !== targetColor) {
            moves.push(moveIndex);
          }
        } else {
          // Add move if the square is empty
          moves.push(moveIndex);
        }
      }
    });

    // if (!kingchecked) {
    //   if (row == 0 || row == 7) {
    //     if (piece.includes("bk")) {
    //       let kl1 = row * 8 + (col - 1);
    //       let kl2 = row * 8 + (col - 2);
    //       let kl3 = row * 8 + (col - 3);
    //       let kr1 = row * 8 + (col + 1);
    //       let kr2 = row * 8 + (col + 2);
    //       let kr3 = row * 8 + (col + 3);
    //       if (board[kl1] && board[kl2]) {
    //         move1 = null;
    //       } else {
    //         if (board[kl3] == "/src/assets/br.png") {
    //           move1 = row * 8 + (col - 2);
    //         }
    //       }
    //       if (board[kr1] && board[kr2]) {
    //         move2 = null;
    //       } else {
    //         if (board[kr3] == "/src/assets/br.png") {
    //           move2 = row * 8 + (col + 2);
    //         }
    //       }
    //     } else if (piece.includes("wk")) {
    //       let kl1 = row * 8 + (col - 1);
    //       let kl2 = row * 8 + (col - 2);
    //       let kl3 = row * 8 + (col - 3);
    //       let kr1 = row * 8 + (col + 1);
    //       let kr2 = row * 8 + (col + 2);
    //       let kr3 = row * 8 + (col + 3);
    //       if (!board[kl1] && !board[kl2]) {
    //         if (board[kl3] == "/src/assets/wr.png") {
    //           move1 = row * 8 + (col - 2);
    //         }
    //       } else {
    //         move1 = null;
    //       }
    //       if (!board[kr1] && !board[kr2]) {
    //         if (board[kr3] == "/src/assets/wr.png") {
    //           move2 = row * 8 + (col + 2);
    //         }
    //       } else {
    //         move2 = null;
    //       }
    //     }
    //     moves.push(move1);
    //     moves.push(move2);
    //   }
    // }
    // Update the board visually by toggling classes

    if (!bkingchecked) {
      if (row === 0) {
        const rookPaths = [
          { side: "left", offsets: [-1, -2, -3] },
          { side: "right", offsets: [1, 2, 3] },
        ];
        const rookPiece = "/src/assets/br.png";

        rookPaths.forEach(({ side, offsets }) => {
          const [pos1, pos2, pos3] = offsets.map(
            (offset) => row * 8 + (col + offset)
          );

          if (!board[pos1] && !board[pos2] && board[pos3] === rookPiece) {
            const move = row * 8 + (col + (side === "left" ? -2 : 2));
            moves.push(move);
          }
        });
      }
    }

    if (!wkingchecked) {
      if (row == 7) {
        const rookPaths = [
          { side: "left", offsets: [-1, -2, -3] },
          { side: "right", offsets: [1, 2, 3] },
        ];
        if (piece.includes("wk")) {
          const rookPiece = "/src/assets/wr.png";

          rookPaths.forEach(({ side, offsets }) => {
            const [pos1, pos2, pos3] = offsets.map(
              (offset) => row * 8 + (col + offset)
            );

            if (!board[pos1] && !board[pos2] && board[pos3] === rookPiece) {
              const move = row * 8 + (col + (side === "left" ? -2 : 2));
              moves.push(move);
            }
          });
        }
      }
    }

    document.querySelectorAll(".square").forEach((square, i) => {
      square.classList.remove("selected", "mover");
      if (i === index) {
        square.classList.add("mover"); // Highlight current piece
      } else if (moves.includes(i)) {
        square.classList.add("selected"); // Highlight possible moves
      }
    });
    return moves;
  };

  const checkassure = (row, col, boardpiece) => {
    // for (let i = 0; i <= board.length; i++) {
    //   console.log(board[i]);
    // }

    // Get all possible moves for the queen
    const possibleMoves = movequeen(row, col, boardpiece);
    // Check for white queen attacking the black king
    if (boardpiece === "/src/assets/wq.png") {
      for (let i = 0; i < possibleMoves.length; i++) {
        const targetIndex = possibleMoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    // Check for black queen attacking the white king
    if (boardpiece === "/src/assets/bq.png") {
      for (let i = 0; i < possibleMoves.length; i++) {
        const targetIndex = possibleMoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }

    //check for all rooks
    const rookmoves = moverook(row, col, boardpiece);
    if (boardpiece === "/src/assets/wr.png") {
      for (let i = 0; i < rookmoves.length; i++) {
        const targetIndex = rookmoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    if (boardpiece === "/src/assets/br.png") {
      for (let i = 0; i < rookmoves.length; i++) {
        const targetIndex = rookmoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("white king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }

    //check for all bishops
    const bishopmoves = movebishop(row, col, boardpiece);
    if (boardpiece === "/src/assets/wb.png") {
      for (let i = 0; i < bishopmoves.length; i++) {
        const targetIndex = bishopmoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    if (boardpiece === "/src/assets/bb.png") {
      for (let i = 0; i < bishopmoves.length; i++) {
        const targetIndex = bishopmoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("white king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }

    //check for all knights
    const knightmoves = moveknight(row, col, boardpiece);
    if (boardpiece === "/src/assets/wn.png") {
      for (let i = 0; i < knightmoves.length; i++) {
        const targetIndex = knightmoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    if (boardpiece === "/src/assets/bb.png") {
      for (let i = 0; i < knightmoves.length; i++) {
        const targetIndex = knightmoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("white king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }

    //check for all pawns
    const pawnmoves = movepawn(row, col, boardpiece);
    if (boardpiece === "/src/assets/wp.png") {
      for (let i = 0; i < pawnmoves.length; i++) {
        const targetIndex = pawnmoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    if (boardpiece === "/src/assets/bp.png") {
      for (let i = 0; i < pawnmoves.length; i++) {
        const targetIndex = pawnmoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("white king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }

    //check for the kings
    const kingmoves = moveking(row, col, boardpiece);
    if (boardpiece === "/src/assets/wk.png") {
      for (let i = 0; i < kingmoves.length; i++) {
        const targetIndex = kingmoves[i];
        if (board[targetIndex] === "/src/assets/bk.png") {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
          break;
        }
      }
    }
    if (boardpiece === "/src/assets/bk.png") {
      for (let i = 0; i < kingmoves.length; i++) {
        const targetIndex = kingmoves[i];
        if (board[targetIndex] === "/src/assets/wk.png") {
          console.log("white king is in check at index:", targetIndex);
          setWkingchecked("w");
          break;
        }
      }
    }
  };

  const selectcheck = (row, col) => {
    const index = row * 8 + col;
    const square = document.querySelectorAll(".square")[index]; // Get the specific square
    return square.classList.contains("selected"); // Check if it contains the 'selected' class
  };

  const movepiece = (row, col, piece) => {
    console.log("Attempting to move piece...");
    // Check if the move is valid
    if (!selectcheck(row, col)) {
      console.log("Invalid move: The square is not selected.");
      return;
    }

    console.log("Valid move detected.");
    // Indices for the target and previous squares
    const targetIndex = row * 8 + col;
    const [prevRow, prevCol] = prevpos;
    const prevIndex = prevRow * 8 + prevCol;

    // Create a copy of the board
    const updatedBoard = [...board];

    // Move the piece
    updatedBoard[targetIndex] = boardpiece;
    updatedBoard[prevIndex] = null;

    // Handle castling logic for the king
    const castlingMoves = {
      "/src/assets/wk.png": {
        left: { rookIndex: 56, rookTarget: 58 },
        right: { rookIndex: 63, rookTarget: 61 },
      },
      "/src/assets/bk.png": {
        left: { rookIndex: 0, rookTarget: 2 },
        right: { rookIndex: 7, rookTarget: 5 },
      },
    };

    if (castlingMoves[boardpiece]) {
      const moveDirection =
        prevCol - col > 1 ? "left" : col - prevCol > 1 ? "right" : null;
      if (moveDirection) {
        const { rookIndex, rookTarget } =
          castlingMoves[boardpiece][moveDirection];
        updatedBoard[rookIndex] = null; // Clear the original rook position
        updatedBoard[rookTarget] = boardpiece.includes("w")
          ? "/src/assets/wr.png"
          : "/src/assets/br.png"; // Place the rook in its new position
      }
    }

    // Update the board state
    setBoard(updatedBoard);

    if (boardpiece) {
      checkassure(row, col, boardpiece);
    }
    checkchecker();
    // Clear piececontroller and boardpiece states
    setPiececontroller(false);
    setBoardpiece(null);

    // Remove visual highlights
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("selected", "mover");
    });
    console.log("Piece moved successfully!");
    // Toggle the turn
    setTurn(turn === "w" ? "b" : "w");
  };

  const checkchecker = async () => {
    const movepawn = (row, col, piece) => {
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
      let moves = [move1, move2, move3, move4, side1, side2];

      return moves;
    };
    const moverook = (row, col, piece) => {
      const directions = [
        { dr: -1, dc: 0 }, // Up
        { dr: 1, dc: 0 }, // Down
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 }, // Right
      ];
      let moves = [];
      directions.forEach(({ dr, dc }) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;

          // Check if the move is out of bounds
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

          const moveIndex = newRow * 8 + newCol;

          // If the square is occupied
          if (board[moveIndex]) {
            const j = board[moveIndex].split("/").pop().split(".")[0][0];

            // Stop if the piece is the same color as the current turn
            if (j === turn) break;

            // Add the square as a valid move (capture opponent piece)
            moves.push(moveIndex);
            break; // Stop further movement in this direction
          }
          // Add the square as a valid move
          moves.push(moveIndex);
        }
      });
      return moves;
    };
    const movebishop = (row, col, piece) => {
      const directions = [
        { dr: -1, dc: -1 }, // Up-Left
        { dr: -1, dc: 1 }, // Up-Right
        { dr: 1, dc: -1 }, // Down-Left
        { dr: 1, dc: 1 }, // Down-Right
      ];

      let moves = [];

      directions.forEach(({ dr, dc }) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;

          // Check if the move is out of bounds
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

          const moveIndex = newRow * 8 + newCol;

          // If the square is occupied
          if (board[moveIndex]) {
            const j = board[moveIndex].split("/").pop().split(".")[0][0];

            // Stop if the piece is the same color as the current turn
            if (j === turn) break;

            // Add the square as a valid move (capture opponent piece)
            moves.push(moveIndex);
            break; // Stop further movement in this direction
          }

          // Add the square as a valid move
          moves.push(moveIndex);
        }
      });
      return moves;
    };
    const moveknight = (row, col, piece) => {
      const knightMoves = [
        { dr: -1, dc: -2 },
        { dr: -2, dc: -1 },
        { dr: -2, dc: 1 },
        { dr: -1, dc: 2 },
        { dr: 1, dc: 2 },
        { dr: 2, dc: 1 },
        { dr: 2, dc: -1 },
        { dr: 1, dc: -2 },
      ];

      const moves = [];

      knightMoves.forEach(({ dr, dc }) => {
        const newRow = row + dr;
        const newCol = col + dc;

        // Check if the move is within bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const moveIndex = newRow * 8 + newCol;

          // If the square is occupied
          if (board[moveIndex]) {
            const currentPieceColor = piece.split("/").pop().split(".")[0][0];
            const targetPieceColor = board[moveIndex]
              .split("/")
              .pop()
              .split(".")[0][0];
            // Add move if it's capturing an opponent piece
            if (currentPieceColor !== targetPieceColor) {
              moves.push(moveIndex);
            }
          } else {
            // Add move if the square is empty
            moves.push(moveIndex);
          }
        }
      });

      return moves;
    };
    const movequeen = (row, col, piece) => {
      // Define all directions for the queen (rook + bishop movements)
      const directions = [
        { dr: -1, dc: 0 }, // Up (rook)
        { dr: 1, dc: 0 }, // Down (rook)
        { dr: 0, dc: -1 }, // Left (rook)
        { dr: 0, dc: 1 }, // Right (rook)
        { dr: -1, dc: -1 }, // Up-Left (bishop)
        { dr: -1, dc: 1 }, // Up-Right (bishop)
        { dr: 1, dc: -1 }, // Down-Left (bishop)
        { dr: 1, dc: 1 }, // Down-Right (bishop)
      ];

      let moves = [];

      // Iterate through each direction
      directions.forEach(({ dr, dc }) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;

          // Check if the move is out of bounds
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

          const moveIndex = newRow * 8 + newCol;

          // If the square is occupied
          if (board[moveIndex]) {
            const j = board[moveIndex].split("/").pop().split(".")[0][0];

            // Stop if the piece is the same color as the current turn
            if (j === turn) break;

            // Add the square as a valid move (capture opponent piece)
            moves.push(moveIndex);
            break; // Stop further movement in this direction
          }

          // Add the square as a valid move
          moves.push(moveIndex);
        }
      });

      return moves;
    };
    const moveking = (row, col, piece) => {
      const kingMoves = [
        { dr: -1, dc: 0 }, // Up
        { dr: 1, dc: 0 }, // Down
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 }, // Right
        { dr: -1, dc: -1 }, // Up-Left
        { dr: -1, dc: 1 }, // Up-Right
        { dr: 1, dc: -1 }, // Down-Left
        { dr: 1, dc: 1 }, // Down-Right
      ];

      const moves = [];
      const currentColor = piece.split("/").pop().split(".")[0][0];

      kingMoves.forEach(({ dr, dc }) => {
        const newRow = row + dr;
        const newCol = col + dc;

        // Check if the move is within bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const moveIndex = newRow * 8 + newCol;

          if (board[moveIndex]) {
            const targetColor = board[moveIndex]
              .split("/")
              .pop()
              .split(".")[0][0];
            // Add move if capturing opponent piece
            if (currentColor !== targetColor) {
              moves.push(moveIndex);
            }
          } else {
            // Add move if the square is empty
            moves.push(moveIndex);
          }
        }
      });
      if (!bkingchecked) {
        if (row === 0) {
          const rookPaths = [
            { side: "left", offsets: [-1, -2, -3] },
            { side: "right", offsets: [1, 2, 3] },
          ];
          const rookPiece = "/src/assets/br.png";

          rookPaths.forEach(({ side, offsets }) => {
            const [pos1, pos2, pos3] = offsets.map(
              (offset) => row * 8 + (col + offset)
            );

            if (!board[pos1] && !board[pos2] && board[pos3] === rookPiece) {
              const move = row * 8 + (col + (side === "left" ? -2 : 2));
              moves.push(move);
            }
          });
        }
      }

      if (!wkingchecked) {
        if (row == 7) {
          const rookPaths = [
            { side: "left", offsets: [-1, -2, -3] },
            { side: "right", offsets: [1, 2, 3] },
          ];
          if (piece.includes("wk")) {
            const rookPiece = "/src/assets/wr.png";

            rookPaths.forEach(({ side, offsets }) => {
              const [pos1, pos2, pos3] = offsets.map(
                (offset) => row * 8 + (col + offset)
              );

              if (!board[pos1] && !board[pos2] && board[pos3] === rookPiece) {
                const move = row * 8 + (col + (side === "left" ? -2 : 2));
                moves.push(move);
              }
            });
          }
        }
      }
      return moves;
    };
    const getRowAndColumn = (index) => {
      const row = Math.floor(index / 8); // Determine the row (integer division)
      const col = index % 8; // Determine the column (remainder of division)
      return { row, col }; // Return as an object
    };
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) continue; // Skip empty squares

      const { row, col } = getRowAndColumn(i);
      const piece = board[i];
      let possibleMoves = [];

      // Determine the type of piece and get its possible moves
      if (piece === "/src/assets/wq.png" || piece === "/src/assets/bq.png") {
        possibleMoves = movequeen(row, col, piece);
      } else if (
        piece === "/src/assets/wr.png" ||
        piece === "/src/assets/br.png"
      ) {
        possibleMoves = moverook(row, col, piece);
      } else if (
        piece === "/src/assets/wb.png" ||
        piece === "/src/assets/bb.png"
      ) {
        possibleMoves = movebishop(row, col, piece);
      } else if (
        piece === "/src/assets/wn.png" ||
        piece === "/src/assets/bn.png"
      ) {
        possibleMoves = moveknight(row, col, piece);
      } else if (
        piece === "/src/assets/wp.png" ||
        piece === "/src/assets/bp.png"
      ) {
        possibleMoves = movepawn(row, col, piece);
      } else if (
        piece === "/src/assets/wk.png" ||
        piece === "/src/assets/bk.png"
      ) {
        possibleMoves = moveking(row, col, piece);
      }

      // Check if any of the moves threaten the opposing king
      possibleMoves.forEach((targetIndex) => {
        const targetPiece = board[targetIndex];
        if (
          piece === "/src/assets/wq.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/bq.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        } else if (
          piece === "/src/assets/wr.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/br.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        } else if (
          piece === "/src/assets/wb.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/bb.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        } else if (
          piece === "/src/assets/wn.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/bn.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        } else if (
          piece === "/src/assets/wp.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/bp.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        } else if (
          piece === "/src/assets/wk.png" &&
          targetPiece === "/src/assets/bk.png"
        ) {
          console.log("Black king is in check at index:", targetIndex);
          setBkingchecked("b");
        } else if (
          piece === "/src/assets/bk.png" &&
          targetPiece === "/src/assets/wk.png"
        ) {
          console.log("White king is in check at index:", targetIndex);
          setWkingchecked("w");
        }
      });
    }
  };

  const showpath = async (row, col, piece) => {
    let j;
    await checkchecker();
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
      } else if (piececontroller == true && j !== turn) {
        movepiece(row, col, piece);
      } else {
        if (piece.includes("wp") || piece.includes("bp")) {
          movepawn(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wk") || piece.includes("bk")) {
          moveking(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wr") || piece.includes("br")) {
          moverook(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wb") || piece.includes("bb")) {
          movebishop(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wn") || piece.includes("bn")) {
          moveknight(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wq") || piece.includes("bq")) {
          movequeen(row, col, piece);
          setPiececontroller(true);
        } else if (piece.includes("wk") || piece.includes("bk")) {
          moveking(row, col, piece);
          setPiececontroller(true);
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
