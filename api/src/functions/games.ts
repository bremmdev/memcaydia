import { app, HttpResponseInit } from "@azure/functions";

export async function getGames(): Promise<HttpResponseInit> {
  const games = [
    {
      id: 1,
      name: "Number Sequence",
      description:
        "Test your memory and focus in this fast-paced number sequence challenge! A sequence of numbers will briefly appear on the screen, and your goal is to recall and input the sequence correctly. With each correct answer, the length of the sequence increases, making the game progressively more difficult. How long can you keep up as the numbers become harder to remember?",
      category: "memory",
      image: "https://memcaydiastorage.blob.core.windows.net/games/number-sequence.webp"
    },
    {
      id: 2,
      name: "Reaction Time",
      description:
        "Your reflexes are of great importance in this challenge. A series of shapes will appear on the screen, and your goal is to click on them as fast as possible. How fast are your reflexes? Put them to the test in this exciting game!",
      category: "speed",
      image: "https://memcaydiastorage.blob.core.windows.net/games/reaction-time.webp"
    },
    {
      id: 3,
      name: "Color Match",
      description:
        "How well can you differentiate between colors? In this game, you'll be presented with a color and four options to choose from. Your goal is to select the correct color that matches the one displayed. As you progress, the colors become more similar, making it harder to distinguish between them. Test your color perception and see how many levels you can complete!",
      category: "perception",
      image: "https://memcaydiastorage.blob.core.windows.net/games/color-match.webp"
    },
    {
      id: 4,
      name: "Word Scramble",
      description:
        "Unscramble the letters and form words in this challenging word game! You'll be presented with a set of jumbled letters, and your task is to rearrange them to create a valid word. The difficulty increases with each level, as the words become longer and more complex. How many words can you unscramble before time runs out?",
      category: "word",
      image: "https://memcaydiastorage.blob.core.windows.net/games/word-scramble.webp"
    },
  ];

  return {
    status: 200,
    jsonBody: games,
  };
}

app.http("games", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getGames,
});