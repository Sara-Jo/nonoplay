import { GridState } from "@/types";
import styles from "./Grid.module.css";

interface GridProps {
  grid: GridState;
  level: number;
  errorCell: { row: number; col: number } | null;
  completedRows: number[];
  completedColumns: number[];
  columnNumbers: number[][];
  rowNumbers: number[][];
  isDragging: boolean;
  handleMouseDown: (rowIndex: number, colIndex: number) => void;
  handleMouseEnter: (rowIndex: number, colIndex: number) => void;
  handleTouchStart: (
    event: React.TouchEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) => void;
  handleTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
}

const Grid: React.FC<GridProps> = ({
  grid,
  level,
  errorCell,
  completedRows,
  completedColumns,
  columnNumbers,
  rowNumbers,
  isDragging,
  handleMouseDown,
  handleMouseEnter,
  handleTouchStart,
  handleTouchMove,
}) => {
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
        <div className={styles.grid}>
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
                  <div
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
                    } ${isBoldBottom ? styles.boldBottom : ""}`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onTouchStart={(e) =>
                      handleTouchStart(e, rowIndex, colIndex)
                    }
                    onTouchMove={handleTouchMove}
                  ></div>
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
