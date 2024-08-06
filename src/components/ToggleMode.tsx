import React from "react";
import styles from "./ToggleMode.module.css";
import { Mode } from "@/types";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface ToggleModeProps {
  mode: Mode;
  onToggle: () => void;
}

const ToggleMode: React.FC<ToggleModeProps> = ({ mode, onToggle }) => {
  return (
    <div className={styles.toggleButton} onClick={onToggle}>
      <div
        className={`${styles.toggleSwitch} ${
          mode === "fill" ? styles.fill : styles.cross
        }`}
      >
        {mode === "fill" ? <SquareRoundedIcon /> : <CloseRoundedIcon />}
      </div>
      <div className={styles.toggleIcon}>
        <CloseRoundedIcon sx={{ color: "black" }} />
      </div>
      <div className={styles.toggleIcon}>
        <SquareRoundedIcon sx={{ color: "black" }} />
      </div>
    </div>
  );
};

export default ToggleMode;
