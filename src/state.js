import * as playpass from "playpass";
import {State} from "./boilerplate/state";
import UserModel from "./models/userModel";
import DailyModel from "./models/dailyModel";
import * as dictionary from "../content/dictionary.json";
import {getMarks} from "./components/keyState";
import {getDaysSince} from "./boilerplate/timer";

const MAX_ATTEMPTS = 6;

const state = new State(
    "daily",
    new UserModel(MAX_ATTEMPTS),
    new DailyModel(Date.parse("2022-04-21T12:00:00")),
);

// The dice the player rolled today
export default {
    store: null,
    currentGuess: "",
    words: [],
    correctAnswer: null,

    async init() {
        this.store = await state.loadObject();

        // correct case sensitivity
        const result = await fetch('playpass-content.json');
        const playpassContent = await result.json();
        const playpassChoices = playpassContent.elements.map((entry) => entry.word) || [];
        const day = getDaysSince(playpassContent.startDate ?? new Date().getTime());

        const words = dictionary.words;

        // allow only a subset of all words in the dictionary to be possible answers
        const choices = (dictionary.choices && dictionary.choices.length > 0)
            ? dictionary.choices
            : words;

        // merge both sets just in case there are answers that aren't in the allowed list
        this.words = Array.from(new Set([
            ...words.map(c => typeof c === "string" ? c : c.word),
            ...choices.map(c => typeof c === "string" ? c : c.word),
            ...playpassChoices.map(c => typeof c === "string" ? c : c.word)
        ])).map(s => s.toUpperCase());

        this.correctAnswer = playpassChoices[day] || dictionary.lookup[this.store.day.toString()] || choices[this.store.day % choices.length];
    },
    get attempts() {
        return MAX_ATTEMPTS;
    },
    isSolved() {
        return this.store.guesses[this.store.guesses.length - 1] === this.getCurrentWord();
    },
    isDone() {
        return this.store.results.length === this.attempts || this.isSolved();
    },
    getCurrentWord() {
        let word;
        if (typeof this.correctAnswer === "string") {
            word = this.correctAnswer;
        } else {
            word = this.correctAnswer.word;
        }
        return word.toUpperCase();
    },
    submit() {
        const result = getMarks(this.currentGuess, this.getCurrentWord());
        this.store.guesses.push(this.currentGuess);
        this.store.results.push(result);

        if (!this.isDone()) {
            this.currentGuess = "";
        }

        if (this.isSolved()) {
            this.store.wins[this.store.guesses.length - 1] += 1;
        }

        this.save();

        return result;
    },
    async login() {
        if (await playpass.account.login()) {
            document.body.classList.add("isLoggedIn");
        }
    },
    async logout() {
        playpass.account.logout();
        document.body.classList.remove("isLoggedIn");
        this.rolledDice = [];
    },
    save() {
        state.saveObject(this.store);
    }
}
