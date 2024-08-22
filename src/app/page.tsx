"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import LevelSelector from "@/components/LevelSelector";
import Glitter from "@/components/Glitter";

export default function Home() {
  return (
    <div className={styles.main}>
      <Glitter />
      <div className={styles.logoContainer}>
        <Image
          src="/logo.png"
          alt="image"
          width={800}
          height={800}
          className={styles.logo}
        />
      </div>
      <motion.div
        className={styles.startButton}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        Game Start
      </motion.div>
      {/* <LevelSelector selectedLevel={10} /> */}
    </div>
  );
}
