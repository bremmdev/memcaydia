import React from "react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useParams, Link } from "react-router-dom";
import { useGame } from "@/hooks/useGames";
import type { Game, GameComponentType } from "@/lib/types";
import Container from "@/components/layout/Container";
import GameHero from "@/components/games/GameHero";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { MoveLeft } from "lucide-react";

function gameLoader(game?: Game) {
  if (!game) {
    return null;
  }
  /* @vite-ignore */
  //rollup needs file extensions to be specified for dynamic imports
  const unsluggedGameName = game?.name.replace(/ /g, "");
  return import(
    `../components/games/${unsluggedGameName}/${unsluggedGameName}.tsx`
  );
}

export default function Game() {
  useScrollToTop();

  const { slug } = useParams();
  const { data: game, isLoading } = useGame(slug as string);

  const [isPlaying, setIsPlaying] = React.useState(false);

  //contains the dynamically imported game component
  const [GameComponent, setGameComponent] =
    React.useState<React.ComponentType<GameComponentType> | null>(null);

  React.useEffect(() => {
    const loadGameComponent = async () => {
      const component = await gameLoader(game);
      if (component) {
        setGameComponent(React.lazy(async () => component));
      } else {
        setGameComponent(null);
      }
    };

    //dynamically import the game component when data is loaded
    if (!isLoading && game) {
      loadGameComponent();
    }
  }, [slug, game, isLoading]);

  if (isLoading) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  //if the slug does not match any game, return a not found message
  if (!isLoading && !game) {
    return <NotFound />;
  }

  return (
    <div>
      {GameComponent && (
        <Container>
          <Link
            to="/"
            className="flex text-primary-teal justify-center gap-2 items-center border border-primary-teal px-4 py-2 w-fit rounded-md font-medium uppercase hover:bg-primary-teal/10 -mt-6"
          >
            <MoveLeft className="size-5" />
            Back
          </Link>
          <GameHero game={game!} />
          {isPlaying ? (
            <GameComponent isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          ) : (
            <Button
              onClick={() => {
                React.startTransition(() => {
                  setIsPlaying(true);
                });
              }}
            >
              Start
            </Button>
          )}
        </Container>
      )}
    </div>
  );
}
