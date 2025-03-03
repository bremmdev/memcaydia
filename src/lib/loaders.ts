import type { Game } from "@/lib/types";
import { slugify } from "@/lib/utils";
import React from "react";

async function getGames() {
  const response = await fetch("/api/games");
  const games = await response.json();
  return games;
}

function getHighscores() {
  return JSON.parse(
    localStorage.getItem("memcaydia_highscores") || "{}"
  ) as Record<string, number>;
}

export async function indexRouteLoader() {
  return await getGames();
}

export async function gameRouteLoader(slug?: string) {
  const games = (await getGames()) as Array<Game> | undefined;
  const game = games?.find((game) => slugify(game.name) === slug);
  const highscoresFromLocalStorage = getHighscores();
  const unsluggedGameName = game?.name.replace(/ /g, "");
  const gameComponent = React.lazy(() => 
    import(
      `../components/games/${unsluggedGameName}/${unsluggedGameName}.tsx`
    )
  );

  return { game, highscores: highscoresFromLocalStorage, gameComponent };
}

export async function highscoreRouteLoader() {
  const games = (await getGames()) as Array<Game> | undefined;
  const highscoresFromLocalStorage = getHighscores();
  return { games, highscores: highscoresFromLocalStorage };
}
