"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import { CellState, GridState, Mode } from "@/types";
import { generateRandomGrid } from "@/utils/generateRandomgrid";
import { calculateNumbers } from "@/utils/calculateNumbers";
import Grid from "@/components/Grid";
import LevelSelector from "@/components/LevelSelector";
import Lives from "@/components/Lives";
import ToggleMode from "@/components/ToggleMode";

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
    setGrid(Array(level).fill(Array(level).fill(null)));
    const { rowNumbers, columnNumbers } = calculateNumbers(newGrid);
    setRowNumbers(rowNumbers);
    setColumnNumbers(columnNumbers);
    setLives(3);
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
    console.log("touch start");
    event.preventDefault();
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (element) {
        const cell = element.closest(`.cell`);
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
    console.log("touch end");
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

  return (
    <div
      className={styles.main}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <LevelSelector selectedLevel={level} onSelectLevel={setLevel} />

      <Lives
        initialLives={initialLives}
        remainingLives={lives}
        addLifeRef={addLifeRef}
      />

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
      />

      <ToggleMode mode={mode} onToggle={toggleMode} />
    </div>
  );
}
