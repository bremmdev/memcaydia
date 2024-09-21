import { useQuery } from "@tanstack/react-query";

export function useHighscores() {
  return useQuery<Record<string, number>>({
    queryKey: ["highscores"],
    queryFn: () => {
      const highscoresFromLocalStorage = JSON.parse(
        localStorage.getItem("memcaydia_highscores") || "{}"
      ) as Record<string, number>;
      return highscoresFromLocalStorage
    },
  });
}
