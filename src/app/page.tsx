"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";

import Glitter from "@/components/Glitter/Glitter";
import { useState } from "react";
import LevelSelector from "@/components/LevelSelector/LevelSelector";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.main}>
      <Glitter />
      <div className={styles.logoContainer}>
        <Image
          src="/logo.png"
          alt="image"
          width={400}
          height={400}
          className={styles.logo}
        />
      </div>
      <motion.div
        className={styles.startButton}
        onClick={handleOpenModal}
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
      {isModalOpen && <LevelSelector onClose={handleCloseModal} />}
    </div>
  );
}
