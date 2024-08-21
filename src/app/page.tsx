"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { CellState, GridState, Mode } from "@/types";
import { generateRandomGrid } from "@/utils/generateRandomgrid";
import { calculateNumbers } from "@/utils/calculateNumbers";
import Grid from "@/components/Grid";
import LevelSelector from "@/components/LevelSelector";
import Lives from "@/components/Lives";
import ToggleMode from "@/components/ToggleMode";
import GameEndModal from "@/components/GameEndModal";

const initialLives = 3;

const initializeGrid = (size: number): GridState =>
  Array(size).fill(Array(size).fill(null));

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
  const [grid, setGrid] = useState<GridState>(initializeGrid(level));
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
  const [gameStatus, setGameStatus] = useState<"won" | "lost" | "playing">(
    "playing"
  );
  const touchDeviceRef = useRef<boolean>(false);

  useEffect(() => {
    if (completedRows.length === level && completedColumns.length === level) {
      setGameStatus("won");
    }
  }, [completedRows.length, completedColumns.length, level]);

  const initializeGame = useCallback((level: number) => {
    const newGrid = generateRandomGrid(level);
    setAnswerGrid(newGrid);

    const { rowNumbers, columnNumbers } = calculateNumbers(newGrid);
    setRowNumbers(rowNumbers);
    setColumnNumbers(columnNumbers);

    const { initialGrid, completedRows, completedColumns } =
      getInitialGridState(level, rowNumbers, columnNumbers);

    setGrid(initialGrid);
    setCompletedRows(completedRows);
    setCompletedColumns(completedColumns);
    setLives(initialLives);
    setGameStatus("playing");
  }, []);

  useEffect(() => {
    initializeGame(level);
  }, [level, initializeGame]);

  const getInitialGridState = (
    level: number,
    rowNumbers: number[][],
    columnNumbers: number[][]
  ) => {
    const completedRows: number[] = [];
    const completedColumns: number[] = [];
    let grid = initializeGrid(level);

    grid = grid.map((row, rowIndex) => {
      if (rowNumbers[rowIndex].length === 1 && rowNumbers[rowIndex][0] === 0) {
        completedRows.push(rowIndex);
        return Array(level).fill("crossed");
      }
      return row;
    });

    grid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (
          columnNumbers[colIndex].length === 1 &&
          columnNumbers[colIndex][0] === 0
        ) {
          if (!completedColumns.includes(colIndex)) {
            completedColumns.push(colIndex);
          }
          return "crossed";
        }
        return cell;
      })
    );

    return { initialGrid: grid, completedRows, completedColumns };
  };

  const onSelectLevel = (selectedLevel: number) => {
    if (selectedLevel !== level) {
      setLevel(selectedLevel);
    }
  };

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
          setCompletedRows((prevRows) =>
            prevRows.includes(index) ? prevRows : [...prevRows, index]
          );
        } else {
          setCompletedColumns((prevColumns) =>
            prevColumns.includes(index) ? prevColumns : [...prevColumns, index]
          );
        }
      }
    }, 50);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!answerGrid || grid[rowIndex][colIndex] !== null) return;

    const isCorrect =
      mode === "fill"
        ? answerGrid[rowIndex][colIndex] === "filled"
        : answerGrid[rowIndex][colIndex] === "crossed";

    if (!isCorrect) {
      handleIncorrectSelection(rowIndex, colIndex);
    } else {
      handleCorrectSelection(rowIndex, colIndex);
    }
  };

  const handleIncorrectSelection = (rowIndex: number, colIndex: number) => {
    const value = answerGrid?.[rowIndex]?.[colIndex] ?? "filled";

    setLives((prevLives) => {
      const updatedLives = Math.max(prevLives - 1, 0);

      if (lifeRefs[prevLives - 1]) {
        lifeRefs[prevLives - 1].classList.add(styles.wiggle);
      }

      setErrorCell({ row: rowIndex, col: colIndex });

      setTimeout(() => {
        setErrorCell(null);
        setGrid((prevGrid) => updateCell(prevGrid, rowIndex, colIndex, value));
      }, 500);

      if (updatedLives === 0) {
        setGameStatus("lost");
      }

      return updatedLives;
    });

    setIsDragging(false);
  };

  const handleCorrectSelection = (rowIndex: number, colIndex: number) => {
    const value = answerGrid?.[rowIndex]?.[colIndex] ?? "filled";
    const newGrid = updateCell(grid, rowIndex, colIndex, value);

    setGrid(newGrid);

    const rowCompleted = isRowCompleted(newGrid, rowIndex, answerGrid);
    const columnCompleted = isColumnCompleted(newGrid, colIndex, answerGrid);

    if (rowCompleted) fillRemainingCells(newGrid, rowIndex, true);
    if (columnCompleted) fillRemainingCells(newGrid, colIndex, false);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (touchDeviceRef.current) return; // Don't handle mouse events on touch devices
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = () => {
    if (touchDeviceRef.current) return;
    setIsDragging(false);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (touchDeviceRef.current) return;
    if (isDragging) {
      handleCellClick(rowIndex, colIndex);
    }
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    touchDeviceRef.current = true; // Mark the device as a touch device
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchDeviceRef.current) return;
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

  const handleNewGame = () => {
    initializeGame(level);
  };

  return (
    <div
      className={styles.main}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <LevelSelector selectedLevel={level} onSelectLevel={onSelectLevel} />

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

      {gameStatus !== "playing" && (
        <GameEndModal
          status={gameStatus}
          onNewGame={handleNewGame}
          onGoToMain={() => {}}
        />
      )}
    </div>
  );
}
