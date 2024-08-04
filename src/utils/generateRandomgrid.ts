import { GridState } from "@/types";

export const generateRandomGrid = (stage: number): GridState => {
  return Array.from({ length: stage }, () =>
    Array.from({ length: stage }, () =>
      Math.random() > 0.5 ? "filled" : "crossed"
    )
  );
};
