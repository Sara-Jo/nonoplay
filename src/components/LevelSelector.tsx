import styles from "./LevelSelector.module.css";

interface LevelSelectorProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  return (
    <div className={styles.levelSelector}>
      {[5, 10, 15, 20].map((level) => (
        <button
          key={level}
          className={`${styles.levelButton} ${
            selectedLevel === level ? styles.selected : ""
          }`}
          onClick={() => onSelectLevel(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
