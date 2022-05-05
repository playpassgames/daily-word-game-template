import * as playpass from "playpass";
import { asyncHandler, showScreen } from "../../boilerplate/screens";
import { gridTagName } from "../../components/grid-element";
import { keyboardTagName } from "../../components/keyboard-element";
import state from "../../state";

const template = document.querySelector("#game-screen");
template.addEventListener(
    "active",
    asyncHandler(async () => {
        // Take new users to help screen first
        const sawTutorial = await playpass.storage.get("sawTutorial");
        if (!sawTutorial) {
            showScreen("#help-screen");
            return;
        }

        if (state.isDone()) {
            // The player has already played today, show results
            showScreen("#results-screen");
            return;
        }


        // format title prompt based on real content
        template.querySelector("#prompt").textContent = `Try to guess today's ${state.getCurrentWord().length} letter word`;

        if (state.correctAnswer !== "string" && state.correctAnswer.hint) {
            template.querySelector("#hint").textContent = `hint: ${state.correctAnswer.hint}`;
        }

        grid.attempts = state.attempts;
        grid.length = state.getCurrentWord().length;

        const viewState = {
            guesses: state.store.guesses,
            results: state.store.results,
        };
    
        grid.setState(viewState);
        keyboard.setState(viewState);
    }),
);

const grid = template.querySelector(gridTagName);

const keyboard = template.querySelector(keyboardTagName);
keyboard.addEventListener("key", event => {
    if (state.isDone()) {
        return;
    }

    const key = event.detail;
    const word = state.currentGuess;
    const correctAnswer = state.getCurrentWord();

    if (key == "Enter") {
        if (word.length !== correctAnswer.length) {
            alert("Not enough letters");
        } else if (state.words.includes(word)) {
            state.submit();

            if (state.isDone()) {
                showScreen("#results-screen");
            }
        } else {
            alert(`Invalid word: ${word}. Try another one!`);
        }

    } else if (key == "Delete") {
        if (word.length) {
            state.currentGuess = word.substring(0, word.length - 1);
        }
    } else if (word.length < correctAnswer.length) {
        state.currentGuess = word + key;
    }

    const viewState = {
        guesses: [...state.store.guesses, state.currentGuess],
        results: state.store.results,
    };

    grid.setState(viewState);
    keyboard.setState(viewState);
});
