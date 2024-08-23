import React from "react";
import styles from "./Lives.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface LivesProps {
  initialLives: number;
  remainingLives: number;
  addLifeRef: (ref: HTMLDivElement | null) => void;
}

const Lives: React.FC<LivesProps> = ({
  initialLives,
  remainingLives,
  addLifeRef,
}) => {
  return (
    <div className={styles.lives}>
      {Array.from({ length: initialLives }).map((_, index) => (
        <div
          key={index}
          className={`${styles.life} ${
            index >= remainingLives ? styles.wiggle : ""
          }`}
          ref={addLifeRef}
        >
          {index < remainingLives ? (
            <FavoriteIcon fontSize="large" sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon fontSize="large" sx={{ color: "gray" }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Lives;
