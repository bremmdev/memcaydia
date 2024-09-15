export type Game = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
};

export type GameComponentType = {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}