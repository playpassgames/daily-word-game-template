import * as playpass from "playpass";
import { showScreen } from "../../boilerplate/screens";
import * as timer from "../../boilerplate/timer";
import { gridTagName } from "../../components/grid-element";
import { keyboardTagName } from "../../components/keyboard-element";
import state from "../../state";
import { playpass_game_name_ } from "../../constants";

import "./results-screen.css";

function share() {
    // Create a link to our game
    const link = playpass.createLink();

    // Share some text along with our link
    const text = `${playpass_game_name_} #` + (state.store.day + 1) + " " + (!state.isSolved() ? "X" : state.store.results.length.toString()) +
    "/6\n\n" + state.store.results.map(
    str => str.replace(/n/g, "⬜").replace(/b/g, "🟩").replace(/c/g, "🟨"))
    .join("\n") + "\n\n" + link;

    // Share some text along with our link
    playpass.share({ text });
}

let timerUpdate;

const template = document.querySelector("#results-screen");
const grid = template.querySelector(gridTagName);
const keyboard = template.querySelector(keyboardTagName);

template.querySelector("button[name=share]").onclick = share;
template.addEventListener("active", () => {
    if (!state.isDone()) {
        showScreen("#game-screen");
        return;
    }

    // Set the first results line
    template.querySelector("#resultLine1").textContent = state.isSolved() ?
        "You guessed today's word!" : ("You couldn't guess today's word: " + state.getCurrentWord());

    const nextGameAt = timer.getNextGameTime();
    timerUpdate = setInterval(() => {
        const until = timer.getUntil(nextGameAt);
        template.querySelector("#timeLeft").textContent = `${until.hours}h ${until.minutes}m ${until.seconds}s`;
    }, 1000);

    grid.attempts = state.attempts;
    grid.length = state.getCurrentWord().length;

    const viewState = {
        guesses: state.store.guesses,
        results: state.store.results,
    };

    grid.setState(viewState);
    keyboard.setState(viewState);
});

template.addEventListener("inactive", () => {
    if (timerUpdate) {
        clearInterval(timerUpdate);
    }
});
