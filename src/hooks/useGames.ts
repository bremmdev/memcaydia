import { Game } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { slugify } from "@/lib/utils";

export function useGames() {
  return useQuery<Array<Game>>({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("/api/games");
      const data = await response.json();
      return data;
    }
  });
}

export function useGame(slug: string) {
  const { data: games, isLoading, error } = useGames();

  const game = games?.find((game) => slugify(game.name) === slug);

  return {
    data: game,
    isLoading,
    error
  };
}