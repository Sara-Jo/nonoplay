"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import LevelSelector from "@/components/LevelSelector";
import Glitter from "@/components/Glitter";

export default function Home() {
  return (
    <div className={styles.main}>
      {/* <motion.div
        className={styles.shinyContainer}
        initial={{ opacity: 0.8 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(255, 255, 255, 0.8)", // Bright white
            "0 0 30px rgba(255, 255, 0, 1)", // Bright yellow
            "0 0 40px rgba(255, 255, 255, 0.9)", // Brighter white
            "0 0 50px rgba(255, 255, 0, 0.9)", // Brighter yellow
            "0 0 20px rgba(255, 255, 255, 0.8)", // Back to bright white
          ],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      /> */}
      <Glitter />
      <div className={styles.logoContainer}>
        <Image
          src="/logo.png"
          alt="image"
          layout="responsive"
          width={700}
          height={700}
          className={styles.logo}
        />
      </div>
      <div className={styles.startButton}>Game Start</div>
      {/* <LevelSelector selectedLevel={10} /> */}
    </div>
  );
}
