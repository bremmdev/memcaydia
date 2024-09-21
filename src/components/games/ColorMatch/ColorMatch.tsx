import React from "react";
import { cn } from "@/lib/utils";
import { generateRandomColors } from "./ColorMatch.utils";
import Button from "@/components/ui/Button";
import { updateHighscores } from "../game.utils";
import { useQueryClient } from "@tanstack/react-query";

type baseProps = {
  color: string;
  clickable?: boolean;
  onChoice?: (color: string) => void;
};

type ColorProps =
  | (React.ComponentPropsWithoutRef<"div"> & baseProps)
  | (React.ComponentPropsWithoutRef<"button"> & baseProps);

type ColorMatchColors = {
  colorToMatch: string;
  colors: Array<string>;
};

const Color = ({ color, clickable = false, onChoice }: ColorProps) => {
  const Component = clickable ? "button" : "div";
  return (
    <Component
      className={cn("size-16 sm:size-24 inline-block rounded-lg", {
        "cursor-pointer": clickable,
      })}
      onClick={() => clickable && onChoice && onChoice(color)}
      style={{ backgroundColor: color }}
    ></Component>
  );
};

const GameOver = ({
  level,
  onRestart,
}: {
  level: number;
  onRestart: () => void;
}) => {
  return (
    <div className="text-center mx-auto space-y-6">
      <h2 className="text-2xl sm:text-3xl font-mediun text-primary-teal font-medium">
        Game Over
      </h2>
      <p className="text-lg">
        Your final score is <span className="font-medium">{level - 1}</span>
      </p>
      <Button onClick={onRestart}>Play again</Button>
    </div>
  );
};

export default function ColorMatch() {
  const [colors, setColors] = React.useState<ColorMatchColors>(() =>
    generateRandomColors(1)
  );
  const [level, setLevel] = React.useState<number>(1);
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  const queryClient = useQueryClient();

  function resetGame() {
    setLevel(1);
    setColors(generateRandomColors(1));
    setGameOver(false);
  }

  function handleChoice(color: string) {
    if (color !== colors.colorToMatch) {
      setGameOver(true);
      return;
    }
    const newLevel = level + 1;
    setLevel(newLevel);
    setColors(generateRandomColors(newLevel));
    updateHighscores("Color Match", level);
    queryClient.invalidateQueries({ queryKey: ['highscores'] })
  }

  return (
    <section className="flex items-center flex-col gap-8">
      {gameOver ? (
        <GameOver onRestart={resetGame} level={level} />
      ) : (
        <>
          <span className="text-3xl text-primary-teal font-medium">
            Level: {level}
          </span>
          <p>Color to guess:</p>
          <Color color={colors.colorToMatch} />
          <p>Choose the correct color from these options.</p>
          <div className="flex gap-4">
            {colors.colors.map((color, index) => (
              <Color
                key={index}
                color={color}
                clickable={true}
                onChoice={handleChoice}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
