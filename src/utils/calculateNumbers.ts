import { GridState } from "@/types";

export const calculateNumbers = (grid: GridState) => {
  const rowNumbers = grid.map((row) => {
    const numbers = [];
    let count = 0;
    row.forEach((cell) => {
      if (cell === "filled") count++;
      else if (count > 0) {
        numbers.push(count);
        count = 0;
      }
    });
    if (count > 0) numbers.push(count);

    return numbers.length ? numbers : [0];
  });

  const columnNumbers = Array.from({ length: grid.length }, (_, colIndex) => {
    const numbers = [];
    let count = 0;
    grid.forEach((row) => {
      if (row[colIndex] === "filled") count++;
      else if (count > 0) {
        numbers.push(count);
        count = 0;
      }
    });
    if (count > 0) numbers.push(count);

    return numbers.length ? numbers : [0];
  });

  return { rowNumbers, columnNumbers };
};
