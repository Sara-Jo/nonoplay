import { motion } from "framer-motion";
import styles from "./LevelSelector.module.css";

interface LevelSelectorProps {
  onClose: () => void;
  // onSelectLevel: (level: number) => void;
}

const levels: {
  label: string;
  value: number;
  emoji?: string;
  isCancel?: boolean;
}[] = [
  { label: "Easy", value: 5, emoji: "🐣" },
  { label: "Medium", value: 10, emoji: "🦊" },
  { label: "Hard", value: 15, emoji: "🐯" },
  { label: "Expert", value: 20, emoji: "🦁" },
  { label: "Cancel", value: -1, isCancel: true },
];

const LevelSelector: React.FC<LevelSelectorProps> = ({
  onClose,
  // onSelectLevel,
}) => {
  return (
    <div className={styles.levelSelector}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {levels.map(({ label, value, emoji, isCancel }, index) => (
          <motion.div
            key={value}
            className={`${styles.levelButton} ${
              isCancel ? styles.cancelButton : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: index * 0.05,
            }}
            onClick={isCancel ? onClose : undefined}
          >
            <p className={styles.label}>
              {emoji ? `${emoji} ${label}` : label}
            </p>
            {!isCancel && (
              <p className={styles.value}>{`${value} x ${value}`}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LevelSelector;
