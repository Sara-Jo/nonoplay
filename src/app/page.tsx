"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { GridState } from "@/types";
import { generateRandomGrid } from "@/utils/generateRandomgrid";
import { calculateNumbers } from "@/utils/calculateNumbers";

const stage = 10;
const initialLives = 3;

export default function Home() {
  const [answerGrid, setAnswerGrid] = useState<GridState | null>(null);
  const [grid, setGrid] = useState<GridState>(
    Array(10).fill(Array(10).fill(null))
  );
  const [mode, setMode] = useState<"fill" | "cross">("fill");
  const [rowNumbers, setRowNumbers] = useState<number[][]>([]);
  const [columnNumbers, setColumnNumbers] = useState<number[][]>([]);
  const [lives, setLives] = useState(initialLives);

  useEffect(() => {
    const newGrid = generateRandomGrid(stage);
    setAnswerGrid(newGrid);
    const { rowNumbers, columnNumbers } = calculateNumbers(newGrid);
    setRowNumbers(rowNumbers);
    setColumnNumbers(columnNumbers);
  }, []);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (answerGrid && grid[rowIndex][colIndex] === null) {
      const isCorrect =
        mode === "fill"
          ? answerGrid[rowIndex][colIndex] === "filled"
          : answerGrid[rowIndex][colIndex] === "crossed";

      if (!isCorrect) {
        setLives((prevLives) => Math.max(prevLives - 1, 0));
      }

      setGrid((prevGrid) =>
        prevGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (rIdx === rowIndex && cIdx === colIndex) {
              return answerGrid[rowIndex][colIndex];
            }
            return cell;
          })
        )
      );
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "fill" ? "cross" : "fill"));
  };

  return (
    <div className={styles.main}>
      <div className={styles.lives}>
        {Array.from({ length: initialLives }).map((_, index) => (
          <div key={index} className={styles.life}>
            {index < lives ? (
              <FavoriteIcon fontSize="large" sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon fontSize="large" sx={{ color: "red" }} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.header}>
        <div className={styles.emptyCorner}></div>
        {columnNumbers.map((numbers, colIndex) => (
          <div key={colIndex} className={styles.columnNumbers}>
            {numbers.map((num, idx) => (
              <div key={idx} className={styles.number}>
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {grid?.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            <div className={styles.rowNumbers}>
              {rowNumbers[rowIndex]?.map((num, idx) => (
                <div key={idx} className={styles.number}>
                  {num}
                </div>
              ))}
            </div>
            {row.map((cell, colIndex) => {
              const isBoldLeft = colIndex % 5 === 0 || colIndex === 0;
              const isBoldTop = rowIndex % 5 === 0 || rowIndex === 0;
              const isBoldRight = colIndex === grid[0].length - 1;
              const isBoldBottom = rowIndex === grid.length - 1;

              return (
                <div
                  key={colIndex}
                  className={`${styles.cell} ${
                    cell === "filled"
                      ? styles.filled
                      : cell === "crossed"
                      ? styles.crossed
                      : ""
                  } ${isBoldLeft ? styles.boldLeft : ""} ${
                    isBoldTop ? styles.boldTop : ""
                  } ${isBoldRight ? styles.boldRight : ""} ${
                    isBoldBottom ? styles.boldBottom : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.toggleButton} onClick={toggleMode}>
        <div
          className={`${styles.toggleSwitch} ${
            mode === "fill" ? styles.fill : styles.cross
          }`}
        >
          {mode === "fill" ? <SquareRoundedIcon /> : <CloseRoundedIcon />}
        </div>
        <div className={styles.toggleIcon}>
          <CloseRoundedIcon sx={{ color: "black" }} />
        </div>
        <div className={styles.toggleIcon}>
          <SquareRoundedIcon sx={{ color: "black" }} />
        </div>
      </div>
    </div>
  );
}
