import { useGames } from "@/hooks/useGames";
import image from "@/assets/number-sequence.webp";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import Spinner from "./ui/Spinner";
import { slugify } from "@/lib/utils";

export default function GamesList() {
  const { data: games, isLoading } = useGames();

  const showSpinner = isLoading || !games;

  return (
    <section className="my-16 space-y-12 md:space-y-16">
      <h2 className="text-2xl sm:text-4xl text-primary-teal tracking-wide font-bold text-center leading-tight max-w-2xl mx-auto">
        Enhance your brain health through fun and engaging memory games
      </h2>

      {showSpinner ? (
        <Spinner />
      ) : (
        <div className="text-slate-900 grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {games.slice(0, 4).map((game) => (
            <Link
              to={`/games/${slugify(game.name)}`}
              className="group"
              key={game.id}
              aria-label={`${game.name} game`}
            >
              <div
                key={game.id}
                className="group-hover:-translate-y-1 transition-all"
              >
                <img src={image} alt={game.name} className="max-h-56 w-full" />
                <div className="p-6 border border-teal-500 border-t-0 rounded-b-md space-y-3 group-hover:border-primary-teal">
                  <h3 className="text-primary-teal text-lg font-medium uppercase">
                    {game.name}
                  </h3>
                  <p className="line-clamp-4">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Link
        to="/games"
        className="text-white bg-primary-teal px-4 py-2 w-fit rounded-md font-medium uppercase hover:bg-opacity-90 flex gap-2 items-center justify-center mx-auto"
      >
        View all games <MoveRight className="size-5" />
      </Link>
    </section>
  );
}
