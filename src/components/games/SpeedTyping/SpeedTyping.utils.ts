export const TOTAL_TIME = 60;

export function generateRandomWords(count: number, wordList: string[]) {
  const randomWords: string[] = [];
  for (let i = 0; i < count; i++) {
    let randomIndex = Math.floor(Math.random() * wordList.length);

    while (randomWords.includes(wordList[randomIndex])) {
      // Regenerate random index if word is already included
      const newIndex = Math.floor(Math.random() * wordList.length);
      randomIndex = newIndex;
    }

    randomWords.push(wordList[randomIndex]);
  }
  return randomWords;
}
