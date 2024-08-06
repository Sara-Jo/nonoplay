"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { CellState, GridState, Mode } from "@/types";
import { generateRandomGrid } from "@/utils/generateRandomgrid";
import { calculateNumbers } from "@/utils/calculateNumbers";
import Grid from "@/components/Grid";

const initialLives = 3;

const updateCell = (
  grid: GridState,
  rowIndex: number,
  colIndex: number,
  value: CellState | null
): GridState =>
  grid.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === rowIndex && cIdx === colIndex ? value : cell
    )
  );

export default function Home() {
  const [level, setLevel] = useState<number>(10);
  const [answerGrid, setAnswerGrid] = useState<GridState | null>(null);
  const [grid, setGrid] = useState<GridState>(
    Array(level).fill(Array(level).fill(null))
  );
  const [mode, setMode] = useState<Mode>("fill");
  const [rowNumbers, setRowNumbers] = useState<number[][]>([]);
  const [columnNumbers, setColumnNumbers] = useState<number[][]>([]);
  const [lives, setLives] = useState(initialLives);
  const [isDragging, setIsDragging] = useState(false);
  const [lifeRefs, setLifeRefs] = useState<HTMLDivElement[]>([]);
  const [errorCell, setErrorCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedColumns, setCompletedColumns] = useState<number[]>([]);

  useEffect(() => {
    const newGrid = generateRandomGrid(level);
    setAnswerGrid(newGrid);
    const { rowNumbers, columnNumbers } = calculateNumbers(newGrid);
    setRowNumbers(rowNumbers);
    setColumnNumbers(columnNumbers);
  }, [level]);

  const isRowCompleted = (
    grid: GridState,
    rowIndex: number,
    answerGrid: GridState | null
  ): boolean => {
    if (!answerGrid) return false;

    return grid[rowIndex].every(
      (cell, colIndex) =>
        answerGrid[rowIndex][colIndex] === "crossed" ||
        (cell === "filled" && answerGrid[rowIndex][colIndex] === "filled")
    );
  };

  const isColumnCompleted = (
    grid: GridState,
    colIndex: number,
    answerGrid: GridState | null
  ): boolean => {
    if (!answerGrid) return false;

    return grid.every(
      (row, rowIndex) =>
        answerGrid[rowIndex][colIndex] === "crossed" ||
        (row[colIndex] === "filled" &&
          answerGrid[rowIndex][colIndex] === "filled")
    );
  };

  const fillRemainingCells = (
    grid: GridState,
    index: number,
    isRow: boolean
  ) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < grid.length) {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (isRow && rowIndex === index && cell === null) {
                return colIndex <= i ? "crossed" : cell;
              }
              if (!isRow && colIndex === index && cell === null) {
                return rowIndex <= i ? "crossed" : cell;
              }
              return cell;
            })
          );

          const cells = isRow
            ? document.querySelectorAll(`.row-${index}`)
            : document.querySelectorAll(`.col-${index}`);

          cells.forEach((cell, cellIndex) => {
            if (cellIndex <= i) {
              cell.classList.add(styles.flash);
              setTimeout(() => {
                cell.classList.remove(styles.flash);
              }, 500);
            }
          });

          return newGrid;
        });
        i++;
      } else {
        clearInterval(interval);
        if (isRow) {
          setCompletedRows((prevRows) => [...prevRows, index]);
        } else {
          setCompletedColumns((prevColumns) => [...prevColumns, index]);
        }
      }
    }, 50);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (answerGrid && grid[rowIndex][colIndex] === null) {
      const isCorrect =
        mode === "fill"
          ? answerGrid[rowIndex][colIndex] === "filled"
          : answerGrid[rowIndex][colIndex] === "crossed";

      if (!isCorrect) {
        setLives((prevLives) => {
          const updatedLives = Math.max(prevLives - 1, 0);

          if (lifeRefs[prevLives - 1]) {
            lifeRefs[prevLives - 1].classList.add(styles.wiggle);
          }

          setErrorCell({ row: rowIndex, col: colIndex });

          setTimeout(() => {
            setErrorCell(null);
            setGrid((prevGrid) =>
              updateCell(
                prevGrid,
                rowIndex,
                colIndex,
                answerGrid[rowIndex][colIndex]
              )
            );
          }, 500);

          return updatedLives;
        });

        setIsDragging(false);
      } else {
        const newGrid = updateCell(
          grid,
          rowIndex,
          colIndex,
          answerGrid[rowIndex][colIndex]
        );

        const rowCompleted = isRowCompleted(newGrid, rowIndex, answerGrid);
        const columnCompleted = isColumnCompleted(
          newGrid,
          colIndex,
          answerGrid
        );

        setGrid(newGrid);

        if (rowCompleted) fillRemainingCells(newGrid, rowIndex, true);
        if (columnCompleted) fillRemainingCells(newGrid, colIndex, false);
      }
    }
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDragging) {
      handleCellClick(rowIndex, colIndex);
    }
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    event.preventDefault();
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element) {
        const cell = element.closest(`.${styles.cell}`);
        if (cell) {
          const row = cell.getAttribute("data-row");
          const col = cell.getAttribute("data-col");
          if (row && col) {
            handleCellClick(parseInt(row), parseInt(col));
          }
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const addLifeRef = (ref: HTMLDivElement | null) => {
    if (ref && !lifeRefs.includes(ref)) {
      setLifeRefs((prevRefs) => [...prevRefs, ref]);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "fill" ? "cross" : "fill"));
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = parseInt(event.target.value);
    setLevel(newLevel);
    setGrid(Array(newLevel).fill(Array(newLevel).fill(null)));
    setLives(3);
  };

  return (
    <div
      className={styles.main}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <div className={styles.levelSelector}>
        <label htmlFor="level">Select level: </label>
        <select id="level" onChange={handleLevelChange} value={level}>
          <option value={5}>Easy (5x5)</option>
          <option value={10}>Medium (10x10)</option>
          <option value={15}>Hard (15x15)</option>
          <option value={20}>Expert (20x20)</option>
        </select>
      </div>

      <div className={styles.lives}>
        {Array.from({ length: initialLives }).map((_, index) => (
          <div
            key={index}
            className={`${styles.life} ${index >= lives ? styles.wiggle : ""}`}
            ref={addLifeRef}
          >
            {index < lives ? (
              <FavoriteIcon fontSize="large" sx={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon fontSize="large" sx={{ color: "gray" }} />
            )}
          </div>
        ))}
      </div>

      <Grid
        grid={grid}
        level={level}
        errorCell={errorCell}
        completedRows={completedRows}
        completedColumns={completedColumns}
        columnNumbers={columnNumbers}
        rowNumbers={rowNumbers}
        isDragging={isDragging}
        handleMouseDown={handleMouseDown}
        handleMouseEnter={handleMouseEnter}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

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
