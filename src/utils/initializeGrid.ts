import { GridState } from "@/types";

export const initializeGrid = (size: number): GridState =>
  Array(size).fill(Array(size).fill(null));
