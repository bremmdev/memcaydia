import React from "react";
import type { Game } from "@/lib/types";

export default function GamesList() {
  const [games, setGames] = React.useState<Array<Game>>([]);

  React.useEffect(() => {
    async function fetchGames() {
      const response = await fetch("/api/games");
      const data = await response.json();
      setGames(data);
    }
    fetchGames();
  }, []);

  if (!games) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-slate-900 my-16">
      {games.map((game) => (
        <div>{game.name}</div>
      ))}
    </div>
  );
}
