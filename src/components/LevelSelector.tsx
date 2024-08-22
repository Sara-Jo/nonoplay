import styles from "./LevelSelector.module.css";

interface LevelSelectorProps {
  selectedLevel: number;
  // onSelectLevel: (level: number) => void;
}

const levels: { label: string; value: number }[] = [
  { label: "Easy", value: 5 },
  { label: "Medium", value: 10 },
  { label: "Hard", value: 15 },
  { label: "Expert", value: 20 },
];

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  // onSelectLevel,
}) => {
  return (
    <div className={styles.levelSelector}>
      {levels.map(({ label, value }) => (
        <button
          key={value}
          className={`${styles.levelButton} ${
            selectedLevel === value ? styles.selected : ""
          }`}
          // onClick={() => onSelectLevel(value)}
        >
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>{`${value} x ${value}`}</p>
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
