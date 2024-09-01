import { useGameContext } from "@/context/GameContext";
import Confetti from "../Confetti/Confetti";
import styles from "./GameEndModal.module.css";

interface GameEndModalProps {
  onNewGame: () => void;
  onGoToMain: () => void;
  restart: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  onNewGame,
  onGoToMain,
  restart,
}) => {
  const { gameStatus } = useGameContext();

  if (gameStatus === "playing") {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      {gameStatus === "won" && <Confetti />}

      <div className={styles.modalContent}>
        {gameStatus === "won" ? (
          <>
            <h2 className={styles.title}>Game Complete!</h2>
            <div className={styles.animation}>
              <div className={styles.emoji}>🎉</div>
            </div>
            <div className={styles.buttonContainer}>
              <div
                className={`${styles.button} ${styles.darkBackground}`}
                onClick={onNewGame}
              >
                New Game
              </div>
              <div className={styles.button} onClick={onGoToMain}>
                Main
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Game Over!</h2>
            <div className={styles.animation}>
              <div className={styles.emoji}>😢</div>
            </div>
            <div className={styles.buttonContainer}>
              <div
                className={`${styles.button} ${styles.darkBackground}`}
                onClick={restart}
              >
                Restart
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameEndModal;
