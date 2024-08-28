import { Game } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

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
