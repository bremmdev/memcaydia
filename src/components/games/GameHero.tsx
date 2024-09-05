import { Game } from "@/lib/types";

export default function GameHero({ game }: { game: Game }) {
  return (
    <section className="text-slate-900 relative bg-primary-teal/5 rounded-md flex items-center flex-col p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl tracking-wide font-bold text-center text-primary-teal">
          {game?.name}
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <p className="max-md:text-center">{game?.description}</p>
          <img
            className="w-1/2 md:w-1/4 lg:w-1/5"
            src={game.image}
            alt={game.name}
          />
        </div>
      </div>
    </section>
  );
}
