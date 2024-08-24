import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CellState, GridState, Mode } from "@/types";
import { initializeGrid } from "@/utils/initializeGrid";
import { generateRandomGrid } from "@/utils/generateRandomgrid";
import { calculateNumbers } from "@/utils/calculateNumbers";
import { initialLives } from "@/utils/constants";
import styles from "./Grid.module.css";
import Sparkle from "../Sparkle/Sparkle";

interface GridProps {
  level: number;
  mode: Mode;
  lives: number;
  setLives: (lives: number) => void;
  lifeRefs: HTMLDivElement[];
  setGameStatus: (status: "won" | "lost" | "playing") => void;
}

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

const Grid: React.FC<GridProps> = ({
  level,
  mode,
  lives,
  setLives,
  lifeRefs,
  setGameStatus,
}) => {
  const [answerGrid, setAnswerGrid] = useState<GridState | null>(null);
  const [grid, setGrid] = useState<GridState>(initializeGrid(level));
  const [rowNumbers, setRowNumbers] = useState<number[][]>([]);
  const [columnNumbers, setColumnNumbers] = useState<number[][]>([]);
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedColumns, setCompletedColumns] = useState<number[]>([]);
  const [errorCell, setErrorCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const touchDeviceRef = useRef<boolean>(false);

  const initializeGame = useCallback(
    (level: number) => {
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
    },
    [setLives, setGameStatus]
  );

  // Initialize game logic, set up grid
  useEffect(() => {
    const newGrid = generateRandomGrid(level);
    setAnswerGrid(newGrid);
    const { rowNumbers, columnNumbers } = calculateNumbers(newGrid);
    const { initialGrid, completedRows, completedColumns } =
      getInitialGridState(level, rowNumbers, columnNumbers);
    setGrid(initialGrid);
    setCompletedRows(completedRows);
    setCompletedColumns(completedColumns);
    initializeGame(level);
  }, [level, initializeGame]);

  // Check if the game is won
  useEffect(() => {
    if (completedRows.length === level && completedColumns.length === level) {
      setIsGameWon(true);
      setTimeout(() => setGameStatus("won"), level * level * 100);
    }
  }, [completedRows.length, completedColumns.length, level, setGameStatus]);

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

  const fillRemainingCells = (index: number, isRow: boolean) => {
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

  const isRowCompleted = (newGrid: GridState, rowIndex: number): boolean => {
    if (!answerGrid) return false;

    return newGrid[rowIndex].every(
      (cell, colIndex) =>
        answerGrid[rowIndex][colIndex] === "crossed" ||
        (cell === "filled" && answerGrid[rowIndex][colIndex] === "filled")
    );
  };

  const isColumnCompleted = (newGrid: GridState, colIndex: number): boolean => {
    if (!answerGrid) return false;

    return newGrid.every(
      (row, rowIndex) =>
        answerGrid[rowIndex][colIndex] === "crossed" ||
        (row[colIndex] === "filled" &&
          answerGrid[rowIndex][colIndex] === "filled")
    );
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

    setTimeout(() => {
      const updatedLives = Math.max(lives - 1, 0);
      setLives(updatedLives);

      if (lifeRefs[updatedLives]) {
        lifeRefs[updatedLives].classList.add(styles.wiggle);
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

    // Check for completed rows/columns here and tzrigger updates as necessary
    if (isRowCompleted(newGrid, rowIndex)) fillRemainingCells(rowIndex, true);
    if (isColumnCompleted(newGrid, colIndex))
      fillRemainingCells(colIndex, false);
  };

  const handleMouseDown = (e: React.MouseEvent, row: number, col: number) => {
    if (touchDeviceRef.current) return; // Don't handle mouse events on touch devices
    setIsDragging(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (e: React.MouseEvent, row: number, col: number) => {
    if (!isDragging) return;
    handleCellClick(row, col);
  };

  const handleMouseUp = () => {
    if (touchDeviceRef.current) return;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    touchDeviceRef.current = true;
    setIsDragging(true);
    handleCellClick(row, col);
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

  return (
    <div className={styles.gridContainer}>
      <div className={styles.header}>
        {columnNumbers.map((numbers, colIndex) => (
          <div
            key={colIndex}
            className={`${styles.columnNumbers} ${
              styles[`columnNumbers-${level}`]
            }`}
          >
            <div
              className={`${styles.numsWrapper} ${styles.colNumsWrapper} ${
                completedColumns.includes(colIndex) ? styles.completed : ""
              }`}
            >
              {numbers.map((num, idx) => (
                <div
                  key={idx}
                  className={`${styles.number} ${styles[`number-${level}`]}`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.gridWrapper}>
        <div>
          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${styles.rowNumbers} ${
                styles[`rowNumbers-${level}`]
              }`}
            >
              <div
                className={`${styles.numsWrapper} ${styles.rowNumsWrapper} ${
                  completedRows.includes(rowIndex) ? styles.completed : ""
                }`}
              >
                {rowNumbers[rowIndex]?.map((num, idx) => (
                  <div
                    key={idx}
                    className={`${styles.number} ${styles[`number-${level}`]}`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${styles.grid} ${errorCell ? styles.error : ""}`}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
        >
          {grid?.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((cell, colIndex) => {
                const isBoldLeft = colIndex % 5 === 0 || colIndex === 0;
                const isBoldTop = rowIndex % 5 === 0 || rowIndex === 0;
                const isBoldRight = colIndex === grid[0].length - 1;
                const isBoldBottom = rowIndex === grid.length - 1;
                const isError =
                  errorCell?.row === rowIndex && errorCell?.col === colIndex;

                return (
                  // <div
                  //   key={colIndex}
                  //   data-row={rowIndex}
                  //   data-col={colIndex}
                  //   className={`cell row-${rowIndex} col-${colIndex} ${
                  //     styles[`cell-${level}`]
                  //   } ${styles.cell} ${
                  //     cell === "filled"
                  //       ? styles.filled
                  //       : cell === "crossed"
                  //       ? styles.crossed
                  //       : ""
                  //   } ${isError ? styles.cellError : ""} ${
                  //     isBoldLeft ? styles.boldLeft : ""
                  //   } ${isBoldTop ? styles.boldTop : ""} ${
                  //     isBoldRight ? styles.boldRight : ""
                  //   } ${isBoldBottom ? styles.boldBottom : ""}`}
                  //   onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  //   onMouseEnter={(e) =>
                  //     handleMouseEnter(e, rowIndex, colIndex)
                  //   }
                  //   onTouchStart={(e) =>
                  //     handleTouchStart(e, rowIndex, colIndex)
                  //   }
                  //   onTouchMove={(e) => handleTouchMove(e)}
                  // ></div>
                  <motion.div
                    key={colIndex}
                    data-row={rowIndex}
                    data-col={colIndex}
                    className={`cell row-${rowIndex} col-${colIndex} ${
                      styles[`cell-${level}`]
                    } ${styles.cell} ${
                      cell === "filled"
                        ? styles.filled
                        : cell === "crossed"
                        ? styles.crossed
                        : ""
                    } ${isError ? styles.cellError : ""} ${
                      isBoldLeft ? styles.boldLeft : ""
                    } ${isBoldTop ? styles.boldTop : ""} ${
                      isBoldRight ? styles.boldRight : ""
                    } ${isBoldBottom ? styles.boldBottom : ""}
                    ${isGameWon ? styles.gameWon : ""}`}
                    onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, rowIndex, colIndex)
                    }
                    onTouchStart={(e) =>
                      handleTouchStart(e, rowIndex, colIndex)
                    }
                    onTouchMove={(e) => handleTouchMove(e)}
                    animate={{
                      backgroundColor: isGameWon
                        ? cell === "filled"
                          ? "#f29b80"
                          : "#d8c6d2"
                        : undefined,
                      scale: isGameWon ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      delay: (rowIndex + colIndex) * 0.1,
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {isGameWon && <Sparkle />}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
