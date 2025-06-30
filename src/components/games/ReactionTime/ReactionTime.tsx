import React from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { updateHighscores } from "../game.utils";
import { useRevalidator } from "react-router";

const Result = ({
  reactionTime,
  onReset,
}: {
  reactionTime: number;
  onReset: () => void;
}) => {
  const revalidator = useRevalidator();

  React.useEffect(() => {
    updateHighscores("Reaction Time", Math.round(reactionTime), true);
    //revalidate so highscore gets refetched
    revalidator.revalidate();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [reactionTime]);

  return (
    <div>
      <p className="flex space-between gap-4">
        Your reaction time:
        <span className="font-bold text-primary-teal ml-auto">
          {Math.round(reactionTime)}ms
        </span>
      </p>
      <Button className="my-6" onClick={onReset}>
        Play again
      </Button>
    </div>
  );
};

export default function ReactionTime() {
  const [showSquare, setShowSquare] = React.useState(false);
  const [reactionTime, setReactionTime] = React.useState<number | undefined>(
    undefined
  );
  const [timeStamp, setTimeStamp] = React.useState<number>(0);

  function handleReactionClick() {
    const reactionTime = Date.now() - timeStamp;
    setReactionTime(reactionTime);
    setShowSquare(false);
  }

  function resetGame() {
    setShowSquare(false);
    setReactionTime(undefined);
    setTimeStamp(0);
  }

  React.useEffect(() => {
    if (showSquare) return;

    //random time between 2 and 5 seconds
    const timeout = setTimeout(() => {
      setShowSquare(true);
      setTimeStamp(Date.now());
    }, Math.floor(Math.random() * 3000) + 2000);

    return () => clearTimeout(timeout);
  }, [showSquare]);

  const showResult = reactionTime !== undefined;

  return (
    <div className="flex items-center flex-col gap-12">
      {showResult ? (
        <Result reactionTime={reactionTime} onReset={resetGame} />
      ) : (
        <>
          <p>
            Click the figure as soon as it becomes{" "}
            <span className="font-bold text-primary-teal">dark green</span>
          </p>
          <button
            className={cn(
              "size-24 inline-block rotate-45 bg-primary-teal opacity-25 rounded-lg my-2",
              {
                "opacity-100 cursor-pointer": showSquare,
              }
            )}
            disabled={!showSquare}
            onClick={handleReactionClick}
          ></button>
        </>
      )}
    </div>
  );
}
