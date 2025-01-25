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

function App() {
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
