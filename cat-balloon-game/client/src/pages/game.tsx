import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Balloon from "@/components/game/balloon";
import GameOver from "@/components/game/game-over";
import DifficultySelect from "@/components/game/difficulty-select";
import { DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY, type DifficultySettings } from "@/lib/constants";
import { initializeAudio } from "@/lib/sounds";

export default function Game() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [difficulty, setDifficulty] = useState<string>(DEFAULT_DIFFICULTY);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_LEVELS[DEFAULT_DIFFICULTY].duration);
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; color: string }>>([]);
  const [nextBalloonId, setNextBalloonId] = useState(1);

  const settings = DIFFICULTY_LEVELS[difficulty];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    if (isPlaying) {
      spawnTimer = setInterval(() => {
        const x = Math.random() * (window.innerWidth - 100);
        const colors = ["#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setBalloons((prev) => [...prev, { id: nextBalloonId, x, color }]);
        setNextBalloonId((prev) => prev + 1);
      }, settings.spawnInterval);
    }
    return () => clearInterval(spawnTimer);
  }, [isPlaying, nextBalloonId, settings.spawnInterval]);

  const startGame = async () => {
    await initializeAudio();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(settings.duration);
    setBalloons([]);
    setNextBalloonId(1);
    setShowDifficulty(false);
  };

  const handlePop = (id: number) => {
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id));
    setScore((prev) => prev + settings.scoreMultiplier);
  };

  const handleRestart = () => {
    setShowDifficulty(true);
    setIsPlaying(false);
  };

  const handleDifficultySelect = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    startGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 relative overflow-hidden">
      {/* HUD */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
          Score: {score}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 font-bold text-lg">
          Time: {timeLeft}s
        </div>
      </div>

      {/* Game Area */}
      <div className="w-full h-screen">
        {balloons.map((balloon) => (
          <Balloon
            key={balloon.id}
            id={balloon.id}
            x={balloon.x}
            color={balloon.color}
            onPop={handlePop}
            speedMultiplier={settings.speedMultiplier}
          />
        ))}
      </div>

      {/* Start/Game Over/Difficulty Select */}
      {!isPlaying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          {showDifficulty ? (
            <DifficultySelect onSelect={handleDifficultySelect} />
          ) : (
            <GameOver 
              score={score} 
              onRestart={handleRestart}
              difficulty={difficulty}
            />
          )}
        </div>
      )}
    </div>
  );
}