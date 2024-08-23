import React from "react";
import { motion } from "framer-motion";
import styles from "./Glitter.module.css";

const Glitter = () => {
  const glitterCount = 200;
  const glitterColors = ["#FFFF99", "#FFFF66", "#FFCC00", "#FF9966", "#FF6666"];

  const generateGlitter = () => {
    return Array.from({ length: glitterCount }).map((_, index) => {
      const randomXStart = Math.random() * window.innerWidth;
      const randomYStart = Math.random() * window.innerHeight;
      const randomScale = Math.random() * 0.7 + 0.3;
      const randomRotation = Math.random() * 360;
      const randomDelay = Math.random() * 3;
      const randomDuration = Math.random() * 1.5 + 0.5;

      return (
        <motion.div
          key={index}
          className={styles.glitter}
          style={{
            backgroundColor:
              glitterColors[Math.floor(Math.random() * glitterColors.length)],
          }}
          initial={{
            x: randomXStart,
            y: randomYStart,
            opacity: 0,
            scale: randomScale,
            rotate: randomRotation,
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

  return <div className={styles.glitterContainer}>{generateGlitter()}</div>;
};

export default Glitter;
