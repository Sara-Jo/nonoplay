"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.container}>
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className={styles.logoWrapper}
      >
        <Image src="/character.png" alt="Loading" width={110} height={80} />
        <p className={styles.text}>Loading...</p>
      </motion.div>
    </div>
  );
};

export default Loading;
