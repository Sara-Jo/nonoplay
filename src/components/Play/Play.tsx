"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mode } from "@/types";
import Grid from "@/components/Grid/Grid";
import Lives from "@/components/Lives/Lives";
import ToggleMode from "@/components/ToggleMode/ToggleMode";
import GameEndModal from "@/components/GameEndModal/GameEndModal";
import { levels } from "@/components/LevelSelector/LevelSelector";
import { initialLives } from "@/utils/constants";
import styles from "./Play.module.css";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

export default function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<number>(10);
  const [levelLabel, setLevelLabel] = useState<string>("");
  const [mode, setMode] = useState<Mode>("fill");
  const [lives, setLives] = useState<number>(initialLives);
  const [lifeRefs, setLifeRefs] = useState<HTMLDivElement[]>([]);
  const [gameStatus, setGameStatus] = useState<"won" | "lost" | "playing">(
    "playing"
  );

  useEffect(() => {
    const levelParam = searchParams.get("level");
    if (levelParam) {
      const selectedLevel = parseInt(levelParam as string);
      setLevel(selectedLevel);
      const selectedLabel = levels.find(
        (lvl) => lvl.value === selectedLevel
      )?.label;
      setLevelLabel(selectedLabel || "");
    }
  }, [searchParams]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "fill" ? "cross" : "fill"));
  };

  const handleNewGame = () => {
    setLives(initialLives);
    setGameStatus("playing");
  };

  const goToMain = () => {
    router.push("/");
  };

  const addLifeRef = (ref: HTMLDivElement | null) => {
    if (ref && !lifeRefs.includes(ref)) {
      setLifeRefs((prevRefs) => [...prevRefs, ref]);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.backButtonWrapper}>
          <ArrowBackIosRoundedIcon
            className={styles.backButton}
            color="inherit"
            onClick={goToMain}
          />
        </div>
        <div className={styles.level}>{levelLabel}</div>
        <></>
      </div>
      <Lives
        initialLives={initialLives}
        remainingLives={lives}
        addLifeRef={addLifeRef}
      />

      <div className={styles.gridWrapper}>
        <Grid
          level={level}
          mode={mode}
          lives={lives}
          setLives={setLives}
          lifeRefs={lifeRefs}
          setGameStatus={setGameStatus}
        />
      </div>

      <ToggleMode mode={mode} onToggle={toggleMode} />

      {gameStatus !== "playing" && (
        <GameEndModal
          status={gameStatus}
          onNewGame={handleNewGame}
          onGoToMain={goToMain}
        />
      )}
    </div>
  );
}
