import { useHighscores } from "@/hooks/useHighscores";

export default function HighScore({ gameName }: { gameName: string }) {
  
  const { data: highscores } = useHighscores();

  const highscore = (highscores && highscores[gameName]) || "N/A";

  return (
    <div className="text-primary-teal font-bold">
      Your personal highscore: {highscore}
    </div>
  );
}
