import * as playpass from "playpass";
import { State } from "./boilerplate/state";
import UserModel from "./models/userModel";
import DailyModel from "./models/dailyModel";
import * as dictionary from "../content/dictionary.json";
import { getMarks } from "./components/keyState";

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
        const words = dictionary.words.map(w => w.toUpperCase());

        // allow only a subset of all words in the dictionary to be possible answers
        const choices = (dictionary.choices && dictionary.choices.length > 0)
            ? dictionary.choices.map(w => w.toUpperCase())
            : words;

        // merge both sets just in case there are answers that aren't in the allowed list
        this.words = Array.from(new Set([
            ...words,
            ...choices,
        ]));

        this.correctAnswer = dictionary.lookup[this.store.day.toString()] || choices[this.store.day % choices.length];
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
    // Gets the current day number
    getCurrentDay () {
        return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
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
