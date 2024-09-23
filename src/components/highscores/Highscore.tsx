import { useHighscores } from "@/hooks/useHighscores";
import HighscoreTooltip from "./HighscoreTooltip";

export default function HighScore({ gameName }: { gameName: string }) {
  
  const { data: highscores } = useHighscores();

  const highscore = (highscores && highscores[gameName]) || "N/A";

  return (
    <div className="text-primary-teal font-bold flex gap-2">
      <span>Your personal highscore: {highscore}</span>
      <HighscoreTooltip />
    </div>
  );
}
