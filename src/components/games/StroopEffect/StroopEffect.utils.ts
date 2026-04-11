export const TOTAL_TIME = 30;

export const colorMap = {
    "red": "text-red-600",
    "blue": "text-blue-600",
    "green": "text-green-600",
    "orange": "text-orange-500",
    "black": "text-black",
} as const;

export const colorMapBg = {
    "red": "bg-red-600",
    "blue": "bg-blue-600",
    "green": "bg-green-600",
    "orange": "bg-orange-500",
    "black": "bg-black",
} as const;

export type ColorCombination = {
    inkColor: keyof typeof colorMap;
    wordColor: keyof typeof colorMap;
}

// We need to get a color for the 'ink' and a color for the 'word'
// We want to avoid getting the same color for the 'ink' and the 'word' or the same ink color twice in a row
export const getRandomColorCombination = (previousInkColor: ColorCombination["inkColor"] | null) => {
    let inkColor = Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)];
    while (inkColor === previousInkColor) {
        inkColor = Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)];
    }

    let wordColor = Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)];
    while (inkColor === wordColor || wordColor === previousInkColor) {
        wordColor = Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)];
    }

    return { inkColor: inkColor as ColorCombination["inkColor"], wordColor: wordColor as ColorCombination["wordColor"] };
}