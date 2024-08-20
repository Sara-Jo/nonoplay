import styles from "./GameEndModal.module.css";

interface GameEndModalProps {
  status: "won" | "lost";
  onNewGame: () => void;
  onGoToMain: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  status,
  onNewGame,
  onGoToMain,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {status === "won" ? (
          <>
            <h2 className={styles.title}>Game Complete!</h2>
            <div className={styles.animation}>
              {/* Firecracker Animation */}
              <div className={styles.firecracker}></div>
              <div className={styles.firecracker}></div>
              <div className={styles.firecracker}></div>
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
              {/* Sad Emoji Animation */}
              <div className={styles.sadEmoji}>😢</div>
            </div>
            <div className={styles.buttonContainer}>
              <div
                className={`${styles.button} ${styles.darkBackground}`}
                onClick={onNewGame}
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
