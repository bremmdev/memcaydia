import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { ColorCombination, colorMap, colorMapBg, getRandomColorCombination, TOTAL_TIME } from "./StroopEffect.utils";
import { useState } from "react";
import GameOver from "@/components/shared/GameOver";
import { updateHighscores } from "../game.utils";
import { useRevalidator } from "react-router";

export default function StroopEffect() {
    const [colorCombination, setColorCombination] = useState<ColorCombination>(() => getRandomColorCombination(null));
    const [score, setScore] = useState<number>(0);
    const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const previousInkColorRef = useRef<ColorCombination["inkColor"] | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const revalidator = useRevalidator();

    function handleColorClick(color: keyof typeof colorMap) {
        // Start game on first click
        if (timeRemaining === TOTAL_TIME) {
            setIsRunning(true);
        }

        if (color === colorCombination.inkColor) {
            setScore(score + 1);
        }
        previousInkColorRef.current = colorCombination.inkColor;
        setColorCombination(getRandomColorCombination(previousInkColorRef.current));
    }

    React.useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => (prev <= 1 ? 0 : prev - 1));
            }, 1000);
        }

        if (timeRemaining === 0 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setGameOver(true);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, timeRemaining]);

    React.useEffect(() => {
        if (gameOver) {
            updateHighscores("Stroop Effect", score);
            //revalidate so highscore gets refetched
            revalidator.revalidate();
        }
    }, [gameOver, revalidator, score]);

    function resetGame() {
        setScore(0);
        setTimeRemaining(TOTAL_TIME);
        setColorCombination(getRandomColorCombination(null));
        setGameOver(false);
        setIsRunning(false);
        previousInkColorRef.current = null;
    }

    return (
        <section>
            <div className={cn("flex flex-col items-center gap-12", gameOver ? "opacity-50" : "")}>
                {/** We rely on the key to force a re-render of the span when the ink color changes. We never have the same ink color twice in a row. */}
                <span key={colorCombination.inkColor} className={cn("text-3xl text-primary-teal font-medium animate-fade-in", colorMap[colorCombination.inkColor])}>{colorCombination.wordColor}</span>
                <div className="flex gap-4">
                    {Object.keys(colorMap).map((color) => (
                        <button key={color} className={cn("size-16 sm:size-24 rounded-lg text-white font-medium text-center flex items-center justify-center", colorMapBg[color as ColorCombination["inkColor"]])} disabled={gameOver} onClick={() => handleColorClick(color as ColorCombination["inkColor"])}>
                            {color}
                        </button>
                    ))}
                </div>
                <p className="text-center">Click the color that matches the <span className="text-primary-teal font-bold">ink color</span> of the word, not what the word says.<br />Timer starts when you click the first color.</p>
                <div className="flex justify-between mx-auto w-1/2">
                    <div className="flex flex-col gap-3">
                        <span>Time Remaining:</span>
                        <span className="text-center text-2xl sm:text-3xl text-primary-teal font-medium">
                            {timeRemaining}s
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span>Speed (WPM):</span>
                        <span className="text-center text-2xl sm:text-3xl text-primary-teal font-medium">
                            {score}
                        </span>
                    </div>
                </div>
            </div>
            {gameOver && <GameOver score={score} onRestart={resetGame} />}
        </section>
    );
}
