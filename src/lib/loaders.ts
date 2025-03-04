import type { Game } from "@/lib/types";
import { slugify } from "@/lib/utils";
import React from "react";

async function getGames() {
  try {
    const response = await fetch("/api/games");

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const games = await response.json();
    return games;
  } catch {
    throw new Error("Failed to fetch games");
  }
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
  try {
    const games = (await getGames()) as Array<Game> | undefined;
    const game = games?.find((game) => slugify(game.name) === slug);
    const highscoresFromLocalStorage = getHighscores();
    const unsluggedGameName = game?.name.replace(/ /g, "");
    const gameComponent = React.lazy(
      () =>
        import(
          `../components/games/${unsluggedGameName}/${unsluggedGameName}.tsx`
        )
    );
    return { game, highscores: highscoresFromLocalStorage, gameComponent };
  } catch {
    throw new Error("Could not load game");
  }
}

export async function highscoreRouteLoader() {
  try {
    const games = (await getGames()) as Array<Game> | undefined;
    const highscoresFromLocalStorage = getHighscores();
    return { games, highscores: highscoresFromLocalStorage };
  } catch {
    throw new Error("Could not load data");
  }
}
