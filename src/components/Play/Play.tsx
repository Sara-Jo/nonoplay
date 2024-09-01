"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mode } from "@/types";
import Grid from "@/components/Grid/Grid";
import Lives from "@/components/Lives/Lives";
import ToggleMode from "@/components/ToggleMode/ToggleMode";
import GameEndModal from "@/components/GameEndModal/GameEndModal";
import LevelSelector, {
  levels,
} from "@/components/LevelSelector/LevelSelector";
import styles from "./Play.module.css";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { GameProvider } from "@/context/GameContext";

export default function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<number>(10);
  const [levelLabel, setLevelLabel] = useState<string>("");
  const [mode, setMode] = useState<Mode>("fill");
  const [lifeRefs, setLifeRefs] = useState<HTMLDivElement[]>([]);
  const [newGameKey, setNewGameKey] = useState<number>(0);
  const [isLevelSeletorOpen, setIsLevelSelectorOpen] = useState(false);

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
    setIsLevelSelectorOpen(true);
  };

  const restartGame = () => {
    setNewGameKey((prevKey) => prevKey + 1);
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
    <GameProvider>
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
        <Lives addLifeRef={addLifeRef} />

        <div className={styles.gridWrapper}>
          <Grid
            level={level}
            mode={mode}
            lifeRefs={lifeRefs}
            newGameKey={newGameKey}
          />
        </div>

        <ToggleMode mode={mode} onToggle={toggleMode} />

        <GameEndModal
          onNewGame={handleNewGame}
          onGoToMain={goToMain}
          restart={restartGame}
        />

        {isLevelSeletorOpen && (
          <LevelSelector
            onClose={() => setIsLevelSelectorOpen(false)}
            currentLevel={level}
            restart={restartGame}
          />
        )}
      </div>
    </GameProvider>
  );
}
