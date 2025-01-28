import { useEffect, useState } from "react";
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

function App() {
  const [boardpiece, setBoardpiece] = useState([]);
  const [turn, setTurn] = useState("w"); //white turn first
  let [piececontroller, setPiececontroller] = useState(false);
  const [prespos, setPrespos] = useState([]);
  const [prevpos, setPrevpos] = useState(null);
  const [wkingchecked, setWkingchecked] = useState("");
  const [bkingchecked, setBkingchecked] = useState("");
  let [backupdata, setBackupdata] = useState([]);

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

  const movepawn = (row, col, piece, a) => {
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }
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

  const moverook = (row, col, piece, a) => {
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }
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
    if (!a) {
      // Highlight valid moves
      document.querySelectorAll(".square").forEach((square, i) => {
        square.classList.remove("selected", "mover");
        if (i === row * 8 + col) {
          square.classList.add("mover"); // Highlight current piece
        } else if (moves.includes(i)) {
          square.classList.add("selected"); // Highlight possible moves
        }
      });
    }
    return moves;
  };

  const movebishop = (row, col, piece, a) => {
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }

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

    if (!a) {
      // Highlight valid moves
      document.querySelectorAll(".square").forEach((square, i) => {
        square.classList.remove("selected", "mover");
        if (i === row * 8 + col) {
          square.classList.add("mover"); // Highlight current piece
        } else if (moves.includes(i)) {
          square.classList.add("selected"); // Highlight possible moves
        }
      });
    }
    return moves;
  };

  const moveknight = (row, col, piece, a) => {
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }
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
    if (!a) {
      // Update the board visually by toggling classes
      document.querySelectorAll(".square").forEach((square, i) => {
        square.classList.remove("selected", "mover");
        if (i === index) {
          square.classList.add("mover"); // Highlight current piece
        } else if (moves.includes(i)) {
          square.classList.add("selected"); // Highlight possible moves
        }
      });
    }
    return moves;
  };

  const movequeen = (row, col, piece, a) => {
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }
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

    if (!a) {
      // Highlight valid moves
      document.querySelectorAll(".square").forEach((square, i) => {
        square.classList.remove("selected", "mover");
        if (i === row * 8 + col) {
          square.classList.add("mover"); // Highlight current piece
        } else if (moves.includes(i)) {
          square.classList.add("selected"); // Highlight possible moves
        }
      });
    }
    return moves;
  };

  const moveking = async (row, col, piece, a) => {
    const index = row * 8 + col;
    if (!a) {
      setPrevpos([row, col]);
      setBoardpiece(piece);
    }

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

    let moves = [];
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

    if (!a) {
      const { movesw, movesb } = await checkassure2();
      console.log(movesw, movesb);
      if (turn === "w") {
        moves = moves.filter((k) => !movesb.has(k)); // Remove moves that are in movesb
      } else if (turn === "b") {
        moves = moves.filter((k) => !movesw.has(k)); // Remove moves that are in movesw
      }
    }

    if (!a) {
      document.querySelectorAll(".square").forEach((square, i) => {
        square.classList.remove("selected", "mover");
        if (i === index) {
          square.classList.add("mover"); // Highlight current piece
        } else if (moves.includes(i)) {
          square.classList.add("selected"); // Highlight possible moves
        }
      });
    }
    return moves;
  };

  const selectcheck = (row, col) => {
    const index = row * 8 + col;
    const square = document.querySelectorAll(".square")[index]; // Get the specific square
    return square.classList.contains("selected"); // Check if it contains the 'selected' class
  };

  const checkassurex = (row, col, boardpiece) => {
    console.log("101");
    // Map board pieces to their respective move functions
    const moveFunctions = {
      "/src/assets/wq.png": movequeen,
      "/src/assets/bq.png": movequeen,
      "/src/assets/wr.png": moverook,
      "/src/assets/br.png": moverook,
      "/src/assets/wb.png": movebishop,
      "/src/assets/bb.png": movebishop,
      "/src/assets/wn.png": moveknight,
      "/src/assets/bn.png": moveknight,
      "/src/assets/wp.png": movepawn,
      "/src/assets/bp.png": movepawn,
      "/src/assets/wk.png": moveking,
      "/src/assets/bk.png": moveking,
    };

    // Map board pieces to the respective kings they might check
    const targetKings = {
      "/src/assets/wq.png": "/src/assets/bk.png",
      "/src/assets/wr.png": "/src/assets/bk.png",
      "/src/assets/wb.png": "/src/assets/bk.png",
      "/src/assets/wn.png": "/src/assets/bk.png",
      "/src/assets/wp.png": "/src/assets/bk.png",
      "/src/assets/wk.png": "/src/assets/bk.png",

      "/src/assets/bq.png": "/src/assets/wk.png",
      "/src/assets/br.png": "/src/assets/wk.png",
      "/src/assets/bb.png": "/src/assets/wk.png",
      "/src/assets/bn.png": "/src/assets/wk.png",
      "/src/assets/bp.png": "/src/assets/wk.png",
      "/src/assets/bk.png": "/src/assets/wk.png",
    };

    // Determine the appropriate move function and target king
    const moveFunction = moveFunctions[boardpiece];
    const targetKing = targetKings[boardpiece];
    if (!moveFunction || !targetKing) {
      console.warn("Invalid boardpiece or unsupported move function");
      return;
    }
    let a = 10;
    // Get possible moves for the current piece
    const possibleMoves = moveFunction(row, col, boardpiece, a);

    // Check if any of the moves threaten the target king
    for (let i = 0; i < possibleMoves.length; i++) {
      const targetIndex = possibleMoves[i];
      if (board[targetIndex] === targetKing) {
        // document.querySelectorAll(".square").forEach((square, i) => {
        //   square.classList.remove("check");
        //   if (i == targetIndex) {
        //     square.classList.add("check");
        //   }
        // });
        console.log(
          `${
            targetKing === "/src/assets/bk.png" ? "Black" : "White"
          } king is in check at index:`,
          targetIndex
        );
        // Set the appropriate state for the king in check
        if (targetKing === "/src/assets/bk.png") {
          setBkingchecked("b");
        } else {
          setWkingchecked("w");
        }
        break;
      }
    }
  };

  const checkassure2 = async () => {
    console.log("202");
    // Map board pieces to their respective move functions
    const moveFunctions = {
      "/src/assets/wq.png": movequeen,
      "/src/assets/bq.png": movequeen,
      "/src/assets/wr.png": moverook,
      "/src/assets/br.png": moverook,
      "/src/assets/wb.png": movebishop,
      "/src/assets/bb.png": movebishop,
      "/src/assets/wn.png": moveknight,
      "/src/assets/bn.png": moveknight,
      "/src/assets/wp.png": movepawn,
      "/src/assets/bp.png": movepawn,
      "/src/assets/wk.png": moveking,
      "/src/assets/bk.png": moveking,
    };
    const movesw = new Set();
    const movesb = new Set();
    // Map board pieces to the respective kings they might check
    const targetKings = {
      "/src/assets/wq.png": "/src/assets/bk.png",
      "/src/assets/wr.png": "/src/assets/bk.png",
      "/src/assets/wb.png": "/src/assets/bk.png",
      "/src/assets/wn.png": "/src/assets/bk.png",
      "/src/assets/wp.png": "/src/assets/bk.png",
      "/src/assets/wk.png": "/src/assets/bk.png",

      "/src/assets/bq.png": "/src/assets/wk.png",
      "/src/assets/br.png": "/src/assets/wk.png",
      "/src/assets/bb.png": "/src/assets/wk.png",
      "/src/assets/bn.png": "/src/assets/wk.png",
      "/src/assets/bp.png": "/src/assets/wk.png",
      "/src/assets/bk.png": "/src/assets/wk.png",
    };
    let wkingpos, bkingpos;
    let totalmoves = [];
    for (let i = 0; i < board.length; i++) {
      const boardpiece = board[i];
      if (boardpiece) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        if (board[i] == "/src/assets/bk.png") {
          bkingpos = i;
        } else if (board[i] == "/src/assets/wk.png") {
          wkingpos = i;
        }
        const moveFunction = moveFunctions[boardpiece];
        const targetKing = targetKings[boardpiece];
        // Get possible moves for the current piece
        const possibleMoves = moveFunction(row, col, boardpiece, 10) || [];
        if (Array.isArray(possibleMoves)) {
          totalmoves.push(...possibleMoves);
        }
        // Check if any of the moves threaten the target king
        for (let i = 0; i < possibleMoves.length; i++) {
          const targetIndex = possibleMoves[i];
          if (targetKing == "/src/assets/bk.png") {
            movesw.add(targetIndex);
          } else if (targetKing == "/src/assets/wk.png") {
            movesb.add(targetIndex);
          }
          if (board[targetIndex] === targetKing) {
            // document.querySelectorAll(".square").forEach((square, i) => {
            //   square.classList.remove("check");
            //   if (i == targetIndex) {
            //     square.classList.add("check");
            //   }
            // });
            console.log(
              `The ${targetKing} is being targeted at ${targetIndex} by ${boardpiece} at ${row} ,${col}`
            );
            // Set the appropriate state for the king in check
            if (targetKing === "/src/assets/bk.png") {
              if (!bkingchecked) {
                setBkingchecked("b");
              }
            } else if (targetKing === "/src/assets/wk.png") {
              if (!wkingchecked) {
                setWkingchecked("w");
              }
            }
          }
        }
      }
    }
    // console.log(bkingpos, wkingpos, movesb, movesw);
    // if (movesb.has(wkingpos)) {
    //   console.log("save wking");
    // } else if (movesw.has(bkingpos)) {
    //   console.log("save bking");
    // }
    return { movesw, movesb };
  };

  const movepiece = async (row, col) => {
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
    const targetpiece = board[targetIndex];
    setPrespos((prevdata) => [...prevdata, [row, col, targetpiece]]);
    // Create a copy of the board
    const updatedBoard = [...board];
    let pawnchange;

    if (row == 0 && boardpiece == "/src/assets/wp.png") {
      const j = prompt("Which one do you want? Queen, Rook, Knight, Bishop");
      switch (j.toLowerCase()) {
        case "queen":
          pawnchange = "/src/assets/wq.png";
          break;
        case "rook":
          pawnchange = "/src/assets/wr.png";
          break;
        case "knight":
          pawnchange = "/src/assets/wn.png";
          break;
        case "bishop":
          pawnchange = "/src/assets/wb.png";
          break;
        default:
          alert("Invalid choice! Defaulting to Queen.");
          pawnchange = "/src/assets/wq.png";
      }
    } else if (row == 7 && boardpiece == "/src/assets/bp.png") {
      const j = prompt("Which one do you want? Queen, Rook, Knight, Bishop");
      switch (j.toLowerCase()) {
        case "queen":
          pawnchange = "/src/assets/bq.png";
          break;
        case "rook":
          pawnchange = "/src/assets/br.png";
          break;
        case "knight":
          pawnchange = "/src/assets/bn.png";
          break;
        case "bishop":
          pawnchange = "/src/assets/bb.png";
          break;
        default:
          alert("Invalid choice! Defaulting to Queen.");
          pawnchange = "/src/assets/bq.png";
      }
    }

    setBackupdata((prevData) => [...prevData, [prevRow, prevCol, boardpiece]]);

    // Move the piece
    const movedpiece = pawnchange || boardpiece;
    updatedBoard[targetIndex] = movedpiece;
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
      checkassurex(row, col, movedpiece);
    }
    // Clear piececontroller and boardpiece states
    setPiececontroller(false);
    setBoardpiece(null);
    // Remove visual highlights
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("selected", "mover");
    });
    console.log("Piece moved successfully!");
    setTurn(turn === "w" ? "b" : "w");
  };

  const showpath = async (row, col, piece) => {
    let j;
    checkassure2();
    try {
      if (piece) {
        j = piece.split("/").pop().split(".")[0][0];
        console.log("xx");
        if (j !== turn && piececontroller == false) {
          return;
        }
      }
      if (piece == null && piececontroller == false) return;
      if (piece == null && piececontroller == true) {
        movepiece(row, col, piece);
        console.log("x1");
      } else if (piececontroller == true && j !== turn) {
        console.log("x2");
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

  const undo = () => {
    console.log(backupdata);
    if (backupdata.length === 0) {
      alert("No moves to undo!");
      return;
    }

    // Pop the last move from backupdata

    const updatedBoard = [...board];
    const present = prespos.pop();
    const [presr, presc, presp] = present;
    const pres = presr * 8 + presc;
    updatedBoard[pres] = presp;
    const lastMove = backupdata.pop();
    const [row, col, movedPiece] = lastMove;
    const target = row * 8 + col;
    updatedBoard[target] = movedPiece;
    setBoard(updatedBoard);
    setTurn(turn === "w" ? "b" : "w");
  };

  const [board, setBoard] = useState(initialBoard); // State to track the board

  useEffect(() => {
    checkassure2();
  }, [board]);

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
      <div className="gamecontrol">
        <button
          onClick={() => {
            undo();
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
}

export default App;
