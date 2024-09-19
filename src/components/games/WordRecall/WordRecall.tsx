import React from "react";
import { getRandomWord, words } from "./WordRecall.utils";
import Button from "../../ui/Button";

const GameOver = ({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) => {
  return (
    <div className="text-center mx-auto space-y-6">
      <h2 className="text-2xl sm:text-3xl font-mediun text-primary-teal font-medium">
        Game Over
      </h2>
      <p className="text-lg">
        Your final score is <span className="font-medium">{score}</span>
      </p>
      <Button onClick={onRestart}>Play again</Button>
    </div>
  );
};

export default function WordRecall() {
  const [score, setScore] = React.useState<number>(0);
  const [wordsSeen, setWordsSeen] = React.useState<Array<string>>([]);
  const [currentWord, setCurrentWord] = React.useState<string>(
    getRandomWord(words, wordsSeen)
  );
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  function resetGame() {
    setScore(0);
    setWordsSeen([]);
    setCurrentWord(getRandomWord(words, wordsSeen));
    setGameOver(false);
  }

  function handlePositiveAnswer() {
    if (!wordsSeen.includes(currentWord)) {
      setGameOver(true);
      return;
    }

    setScore((score) => score + 1);
    setCurrentWord(getRandomWord(words, wordsSeen));
  }

  function handleNegativeAnswer() {
    if (wordsSeen.includes(currentWord)) {
      setGameOver(true);
      return;
    }

    setScore((score) => score + 1);
    setCurrentWord(getRandomWord(words, wordsSeen));
    setWordsSeen((wordsSeen) => [...wordsSeen, currentWord]);
  }

  return (
    <div className="text-center mx-auto space-y-6">
      {gameOver ? (
        <GameOver score={score} onRestart={resetGame} />
      ) : (
        <>
          <span className="text-3xl text-primary-teal font-medium">
            Current score: {score}
          </span>

          <p>Have you seen this word before?</p>
          <span className="text-2xl sm:text-3xl text-primary-teal font-medium block my-4">
            {currentWord}
          </span>
          <span className="flex justify-center gap-8 w-fit mx-auto my-8">
            <Button onClick={handlePositiveAnswer}>Yes</Button>
            <Button
              className="text-primary-teal bg-white hover:bg-primary-teal/10 border border-primary-teal"
              onClick={handleNegativeAnswer}
            >
              No
            </Button>
          </span>
        </>
      )}
    </div>
  );
}
