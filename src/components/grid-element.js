import { EMPTY } from "./keyState";
import "./grid-element.css";

// The NxM grid of letters
export class Grid extends HTMLElement {
    constructor() {
        super();
    }

    get attempts() {
        return this.getAttribute("max-attempts") || 6;
    }
    
    set attempts(newValue) {
        this.setAttribute("max-attempts", newValue);
    }

    set length(len) {
        this.len = len;
        this.build();
    }

    build() {
        const cellDimensions = 288 / this.len;

        this.replaceChildren([]);

        for (let row = 0; row < this.attempts; row++) {
            const div = document.createElement("div");
            for (let cell = 0; cell < this.len; cell++) {
                const letter = document.createElement("div");

                letter.classList.add("cell");

                // scale cells based on word length
                letter.style.width = `${cellDimensions}px`;
                letter.style.height = `${cellDimensions}px`;
                letter.style.fontSize = `${cellDimensions / 2}px`;

                div.appendChild(letter);
            }
            this.appendChild(div);
        }
    }

    setState({ guesses, results }) {
        for (let row = 0; row < guesses.length; row++) {
            for (let letter = 0; letter < this.len; letter++) {
                const cell = this.children.item(row).children.item(letter);
                cell.textContent = guesses[row][letter];
                let mark = EMPTY;
                if (results[row]) {
                    mark = results[row][letter] || mark;
                }
                cell.setAttribute("s", mark);
            }
        }
    }
}

export const gridTagName = "word-game-grid";

window.customElements.define(gridTagName, Grid);
