import { initialLives } from "@/utils/constants";
import React, { createContext } from "react";

interface GameContextProps {
  lives: number;
  setLives: (lives: number) => void;
  gameStatus: "won" | "lost" | "playing";
  setGameStatus: (status: "won" | "lost" | "playing") => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lives, setLives] = React.useState<number>(initialLives);
  const [gameStatus, setGameStatus] = React.useState<
    "won" | "lost" | "playing"
  >("playing");

  return (
    <GameContext.Provider
      value={{ lives, setLives, gameStatus, setGameStatus }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
