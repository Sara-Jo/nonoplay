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
            <div className={styles.animation}>
              {/* Firecracker Animation */}
              <div className={styles.firecracker}></div>
              <div className={styles.firecracker}></div>
              <div className={styles.firecracker}></div>
            </div>
            <h2 className={styles.title}>Game Complete!</h2>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={onNewGame}>
                New Game
              </button>
              <button className={styles.button} onClick={onGoToMain}>
                Main
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.animation}>
              {/* Sad Emoji Animation */}
              <div className={styles.sadEmoji}>😢</div>
            </div>
            <h2 className={styles.title}>Game Over</h2>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={onNewGame}>
                Restart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameEndModal;
