export const EMPTY = "_";
export const NONE = "n";
export const COW = "c";
export const BULL = "b";
export const GuessSymbols = EMPTY + NONE + COW + BULL;

export function getMarks(_guess, _word) {
    const word = Array.from(_word);
    const guess = Array.from(_guess);
    const len = word.length;
    const marks = Array.from(Array(len), () => NONE);

    // Bulls
    for (let i = 0; i < len; i++) {
        if (guess[i] === word[i]) {
            marks[i] = BULL;
            word[i] = "_";
            guess[i] = "_";
        }
    }
    // Cows
    for (let i = 0; i < len; i++) {
        if (guess[i] !== "_") {
            const it = word.indexOf(guess[i]);

            if (it >= 0) {
                marks[i] = COW;
                guess[i] = "_";
                word[it] = "_";
            }
        }
    }

    return marks.join("");
}