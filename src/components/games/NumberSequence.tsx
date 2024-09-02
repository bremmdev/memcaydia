import React from "react";
import { generateRandomNumber } from "./game.utils";
import Container from "../layout/Container";
import { useParams } from "react-router-dom";
import { useGame } from "@/hooks/useGames";
import Button from "../ui/Button";

/*
- keep track of level
- generate a random number based on level
- display the number for a few seconds
- hide the number and display a text input
- user enters the number
- if correct, increase level and repeat
- if incorrect, game over, display score and option to play again






*/

const NumberInput = () => {
  return (
    <form className="flex flex-col gap-4 sm:flex-row max-w-2xl mx-auto">
      <div className="space-y-4 flex-1">
        <label htmlFor="number" className="text-primary-teal font-medium block">
          Enter the number
        </label>
        <input
          type="text"
          className="p-2 border-primary-teal border rounded-md flex-1 w-full text-inherit h-10"
          id="number"
        />
      </div>
      <Button className="max-sm:w-full self-end" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default function NumberSequence() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [number, setNumber] = React.useState(generateRandomNumber(1));
  const [level, setLevel] = React.useState(1);

  const { slug } = useParams();

  const { data: game, isLoading, error } = useGame(slug as string);

  if (!isLoading && !game) {
    return (
      <Container>
        <h1>Game not found</h1>
      </Container>
    );
  }

  console.log(game?.description, isLoading, error);

  console.log(generateRandomNumber(10));

  return isPlaying ? (
    <div>
      <NumberInput />
    </div>
  ) : (
    <Button onClick={() => setIsPlaying(true)}>Start</Button>
  );
}
