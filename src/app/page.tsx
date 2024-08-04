"use client";

import { useState } from "react";
import styles from "./page.module.css";

type CellState = "filled" | "crossed" | null;
type GridState = CellState[][];

export default function Home() {
  const [grid, setGrid] = useState<GridState>(
    Array(10).fill(Array(10).fill(null))
  );

  return (
    <div className={styles.grid}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => (
            <div key={colIndex} className={styles.cell}></div>
          ))}
        </div>
      ))}
    </div>
  );
}
