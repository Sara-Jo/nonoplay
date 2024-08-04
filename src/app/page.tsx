"use client";

import { useState } from "react";
import styles from "./page.module.css";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type CellState = "filled" | "crossed" | null;
type GridState = CellState[][];

export default function Home() {
  const [grid, setGrid] = useState<GridState>(
    Array(10).fill(Array(10).fill(null))
  );
  const [mode, setMode] = useState<"fill" | "exclude">("fill");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "fill" ? "exclude" : "fill"));
  };

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div key={colIndex} className={styles.cell}></div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.toggleButton} onClick={toggleMode}>
        <div
          className={`${styles.toggleSwitch} ${
            mode === "fill" ? styles.fill : styles.exclude
          }`}
        >
          {mode === "fill" ? <CloseRoundedIcon /> : <SquareRoundedIcon />}
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
