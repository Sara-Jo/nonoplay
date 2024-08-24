import React from "react";
import { motion } from "framer-motion";
import styles from "./Sparkle.module.css";

const Sparkle = () => {
  const sparkleCount = 15; // Number of sparkle particles

  const generateSparkles = () => {
    return Array.from({ length: sparkleCount }).map((_, index) => {
      const randomX = Math.random() * 100; // Random position within container
      const randomY = Math.random() * 100;
      const randomScale = Math.random() * 0.5 + 0.5; // Scale between 0.5 and 1
      const randomDelay = Math.random() * 2;
      const randomDuration = Math.random() * 1.5 + 0.5;

      return (
        <motion.div
          key={index}
          className={styles.sparkle}
          style={{
            left: `${randomX}%`,
            top: `${randomY}%`,
          }}
          initial={{
            opacity: 0,
            scale: randomScale,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [randomScale, randomScale * 1.5, randomScale],
          }}
          transition={{
            delay: randomDelay,
            duration: randomDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      );
    });
  };

  return <div className={styles.sparkleContainer}>{generateSparkles()}</div>;
};

export default Sparkle;
