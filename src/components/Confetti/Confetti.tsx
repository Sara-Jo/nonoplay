import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Confetti.module.css";

const Confetti = () => {
  const confettiCount = 200;
  const confettiColors = [
    "#FF5733",
    "#FFC300",
    "#DAF7A6",
    "#FF33FF",
    "#33FF57",
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures that the component is rendered on the client-side
  }, []);

  const generateConfetti = () => {
    if (!isClient) return null;

    return Array.from({ length: confettiCount }).map((_, index) => {
      const randomXStart = Math.random() * window.innerWidth;
      const randomXEnd = Math.random() * window.innerWidth;
      const randomRotation = Math.random() * 360;
      const randomDelay = Math.random() * 2;
      const randomDuration = Math.random() * 2 + 2;
      const randomScale = Math.random() * 0.5 + 0.5;

      return (
        <motion.div
          key={index}
          className={styles.confetti}
          style={{
            backgroundColor:
              confettiColors[Math.floor(Math.random() * confettiColors.length)],
          }}
          initial={{ x: randomXStart, y: -100, opacity: 0, scale: randomScale }}
          animate={{
            x: randomXEnd,
            y: window.innerHeight + 100,
            rotate: randomRotation,
            opacity: 1,
          }}
          transition={{
            delay: randomDelay,
            duration: randomDuration,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      );
    });
  };

  return <div className={styles.confettiContainer}>{generateConfetti()}</div>;
};

export default Confetti;
