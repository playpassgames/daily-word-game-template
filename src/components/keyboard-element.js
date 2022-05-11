import { EMPTY, GuessSymbols } from "./keyState";
import "./keyboard-element.css";

/**
 * Default Keyboard layout
 */
const template = `
<div class="row">
    <div class="key">Q</div>
    <div class="key">W</div>
    <div class="key">E</div>
    <div class="key">R</div>
    <div class="key">T</div>
    <div class="key">Y</div>
    <div class="key">U</div>
    <div class="key">I</div>
    <div class="key">O</div>
    <div class="key">P</div>
</div>
<div class="row">
    <div class="key">A</div>
    <div class="key">S</div>
    <div class="key">D</div>
    <div class="key">F</div>
    <div class="key">G</div>
    <div class="key">H</div>
    <div class="key">J</div>
    <div class="key">K</div>
    <div class="key">L</div>
</div>
<div class="row">
    <div class="key" style="width: 65px">Enter</div>
    <div class="key">Z</div>
    <div class="key">X</div>
    <div class="key">C</div>
    <div class="key">V</div>
    <div class="key">B</div>
    <div class="key">N</div>
    <div class="key">M</div>
    <div class="key" style="width: 65px">Delete</div>
</div>
`;

// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
export class Keyboard extends HTMLElement {
    constructor () {
        super();

        this.addEventListener("click", event => {
            if (event.target.childElementCount == 0) {
                const key = event.target.textContent;
                this.dispatchEvent(new CustomEvent("key", { detail: key }));
            }
        });

        window.addEventListener("keydown", event => {
            let key;
            switch (event.key) {
            case "Enter":
                key = "Enter";
                break;
            case "Backspace": case "Delete":
                key = "Delete";
                break;
            default:
                if (event.key.length == 1) {
                    const charCode = event.key.toUpperCase().charCodeAt(0);
                    if (charCode >= 65 && charCode <= 90) {
                        key = String.fromCharCode(charCode);
                    }
                }
            }
            if (key) {
                this.dispatchEvent(new CustomEvent("key", { detail: key }));
            }
        });

        
        this.innerHTML = template;
    }

    setState({ guesses, results }) {
        const charStates = Array.from(Array(26), () => EMPTY);
        const ccA = "A".charCodeAt(0);

        for (let w = 0; w < results.length; w++) {
            for (let i = 0; i < guesses[w].length; i++) {
                const c = guesses[w].charCodeAt(i) - ccA;
                const newMarkPriority = GuessSymbols.indexOf(results[w][i]);

                if (newMarkPriority > GuessSymbols.indexOf(charStates[c])) {
                    charStates[c] = results[w][i];
                }
            }
        }

        for (let row = 0; row < this.children.length; row++) {
            for (let btn = 0; btn < this.children.item(row).children.length; btn++) {
                const key = this.children.item(row).children.item(btn);
                if (key.textContent.length === 1) {
                    const ccId = key.textContent.charCodeAt(0) - ccA;
                    key.setAttribute("s", charStates[ccId]);
                }
            }
        }

        this.children.item(guesses.length - 1).focus();
    }
}

export const keyboardTagName = "word-game-keyboard";

window.customElements.define(keyboardTagName, Keyboard);
