import React from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const Result = ({
  reactionTimes,
  onReset,
}: {
  reactionTimes: number[];
  onReset: () => void;
}) => {
  const averageTime =
    reactionTimes.reduce((acc, time) => acc + time, 0) / reactionTimes.length;
  return (
    <div className="space-y-4">
      <p className="flex space-between gap-4">
        Average reaction time:
        <span className="font-bold text-primary-teal ml-auto">
          {Math.round(averageTime)}ms
        </span>
      </p>
      <p className="flex space-between gap-4">
        Fastest reaction time:
        <span className="font-bold text-primary-teal ml-auto">
          {Math.min(...reactionTimes)}ms
        </span>
      </p>
      <p className="flex space-between gap-4">
        Slowest reaction time:
        <span className="font-bold text-primary-teal ml-auto">
          {Math.max(...reactionTimes)}ms
        </span>
      </p>
      <Button className="my-16" onClick={onReset}>
        Play again
      </Button>
    </div>
  );
};

export default function ReactionTime() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showSquare, setShowSquare] = React.useState(false);
  const [reactionTimes, setReactionTimes] = React.useState<number[]>([]);
  const [timeStamp, setTimeStamp] = React.useState<number>(0);

  function handleReactionClick() {
    const reactionTime = Date.now() - timeStamp;
    setReactionTimes((prev) => [...prev, reactionTime]);
    setShowSquare(false);
  }

  function resetGame() {
    setShowSquare(false);
    setReactionTimes([]);
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

  if (!isPlaying) {
    return <Button onClick={() => setIsPlaying(true)}>Start</Button>;
  }

  const showResult = reactionTimes.length === 5;

  return (
    <div className="flex items-center flex-col gap-12">
      {showResult ? (
        <Result reactionTimes={reactionTimes} onReset={resetGame} />
      ) : (
        <>
          <p>
            Click the figure as soon as it becomes{" "}
            <span className="font-bold text-primary-teal">dark green</span>
          </p>
          <button
            className={cn(
              "size-24 inline-block rotate-45 bg-primary-teal opacity-25 rounded-lg",
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
