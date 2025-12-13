import { words } from "./words";
import { generateRandomWords, TOTAL_TIME } from "./SpeedTyping.utils";
import React from "react";

export default function SpeedTyping() {
  const randomWords = React.useMemo(() => generateRandomWords(60, words), []);

  const [timerStarted, setTimerStarted] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(TOTAL_TIME);
  const [typedWords, setTypedWords] = React.useState("");

  function handleTyping(event: React.FormEvent<HTMLTextAreaElement>) {
    if (!timerStarted) {
      setTimerStarted(true);
    }
    setTypedWords(event.currentTarget.value);
  }

  console.log(typedWords);

  React.useEffect(() => {
    if (!timerStarted) return;
    if (timeRemaining === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStarted, timeRemaining]);

  /* STATE DERIVED VALUES */
  const gameFinished = timeRemaining === 0;
  const wordTrackCount = typedWords.trim().split(" ").length;

  return (
    <>
      <section className="font-mono bg-white border-primary-teal border select-none p-4 rounded-xl sm:p-6 md:p-8 text-left">
        {randomWords.map((word, index) => (
          <span
            className={typedWords && index < wordTrackCount ? "font-bold" : ""}
            key={index}
          >{`${word} `}</span>
        ))}
      </section>
      <section className="space-y-8">
        <textarea
          className="outline-none font-mono bg-primary-teal/15 rounded-xl p-4 w-full resize-none h-40 sm:h-56 md:h-52 sm:p-6 md:p-8 text-xs sm:text-base focus-visible:ring-primary-teal focus-visible:ring-2 disabled:opacity-50"
          placeholder="Start typing the words to begin the test..."
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          onInput={handleTyping}
          disabled={gameFinished}
        ></textarea>
        <button
          disabled={timerStarted && !gameFinished}
          className="transition-all w-fit mx-auto duration-300 text-base sm:text-lg block bg-primary-teal/15 text-primary-teal font-bold py-2 px-8 rounded-lg cursor-pointer ring-primary-teal ring-2 border-b-primary-teal border-b-2 hover:bg-primary-teal/30 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
        >
          Play Again
        </button>
        <div className="flex justify-between mx-auto w-3/4">
          <div className="flex flex-col gap-3">
            <span>Time Remaining:</span>
            <span className="text-center text-2xl sm:text-3xl text-primary-teal font-medium">
              {timeRemaining}s
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span>Speed (WPM):</span>
            <span className="text-center text-2xl sm:text-3xl text-primary-teal font-medium">
              0
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
