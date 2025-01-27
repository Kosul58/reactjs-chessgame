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
