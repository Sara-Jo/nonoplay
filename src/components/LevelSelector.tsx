import styles from "./LevelSelector.module.css";

interface LevelSelectorProps {
  onClose: () => void;
  // onSelectLevel: (level: number) => void;
}

const levels: { label: string; value: number; emoji: string }[] = [
  { label: "Easy", value: 5, emoji: "🐣" },
  { label: "Medium", value: 10, emoji: "🦊" },
  { label: "Hard", value: 15, emoji: "🐯" },
  { label: "Expert", value: 20, emoji: "🦁" },
];

const LevelSelector: React.FC<LevelSelectorProps> = ({
  onClose,
  // onSelectLevel,
}) => {
  return (
    <div className={styles.levelSelector}>
      {levels.map(({ label, value, emoji }) => (
        <div
          key={value}
          className={styles.levelButton}
          // onClick={() => onSelectLevel(value)}
        >
          <p className={styles.label}>
            {emoji} {label}
          </p>
          <p className={styles.value}>{`${value} x ${value}`}</p>
        </div>
      ))}
      <div className={styles.cancelButton} onClick={onClose}>
        Cancel
      </div>
    </div>
  );
};

export default LevelSelector;
