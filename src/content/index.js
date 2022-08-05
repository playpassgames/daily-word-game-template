import content from "../boilerplate/content";

export default {
    words: content.getDailyContent('elements'),
    gameName: content.getGameContent('name'),
    startDate: () => content.getDailyContent('startDate')() ?? new Date().getTime(),
    emojis: {
        goodGuess: content.getGameContent('goodGuess'),
        badGuess: content.getGameContent('badGuess'),
        skipGuess: content.getGameContent('skipGuess'),
    },
};
