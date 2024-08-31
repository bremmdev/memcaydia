import React from "react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useParams } from "react-router-dom";
import { useGames } from "@/hooks/useGames";
import type { Game } from "@/lib/types";
import { slugify } from "@/lib/utils";

function gameLoader(games?: Array<Game>, slug?: string) {
  const game = games?.find((game) => slugify(game.name) === slug);
  if(!game) {
    return null;
  }
  /* @vite-ignore */
  return import(`../components/games/${game?.name.replace(/ /g, "")}`);
}

export default function Game() {
  useScrollToTop();

  const { slug } = useParams();
  const { data: games, isLoading } = useGames();

  //contains the dynamically imported game component
  const [GameComponent, setGameComponent] =
    React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    const loadGameComponent = async () => {
      const component = await gameLoader(games, slug);
      if (component) {
        setGameComponent(React.lazy(async () => component));
      } else {
        setGameComponent(null);
      }
    };

    //dynamically import the game component when data is loaded
    if (!isLoading && games) {
      loadGameComponent();
    }
  }, [slug, games, isLoading]);

  const game = games?.find((game) => slugify(game.name) === slug);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //if the slug does not match any game, return a not found message
  if(!isLoading && !game) {
    return <div>Game not found</div>;
  }

  return (
    <div>
     {GameComponent && <GameComponent />}
    </div>
  );
}
