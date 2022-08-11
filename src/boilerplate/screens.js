import {share} from "../screens/resultsScreen/results-screen";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        ::slotted(*) {
            display: none;
            box-sizing: border-box;
            flex: 1;
            max-width: 100%;
        }

        :host {
            display: flex;
            flex: 1;
        }

        :host(:not([loading])) ::slotted(*[active]) {
            display: block;
        }

        :host([loading]) ::slotted([slot="load-spinner"]) {
            display: block;
        }
    </style>
    <slot name="load-spinner"></slot>
    <slot name="screen"></slot>
`;

const routerTagName = "screen-router";

window.customElements.define(
    routerTagName,
    class extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        static get observedAttributes() {
            return ["open"];
        }

        async attributeChangedCallback(name, oldValue, newValue) {
            if (name === "open") {
                const prev = this.querySelector(oldValue);
                if (prev) {
                    prev.removeAttribute("active");
                    prev.dispatchEvent(new CustomEvent("inactive"));
                }

                const next = this.querySelector(newValue);
                next.setAttribute("active", "");

                next.dispatchEvent(new CustomEvent("active"));
            }
        }
    }
);

export function asyncHandler(fn){
    return async (e) => {
        document.querySelector(routerTagName).setAttribute("loading", "");
        await fn(e);
        document.querySelector(routerTagName).removeAttribute("loading");
    };
}

export function showScreen(name) {
    document.querySelector(routerTagName).setAttribute("open", name);
}

export function setScreenVisibility(name, state) {
    document.querySelector(routerTagName).setAttribute(state, name);
}

export function onHelpClick () {
    showScreen("#about-screen");
}

export function onStatsClick () {
    hideShare();
    showScreen("#stats-screen");
}

export function onSettingsClick () {
    hideShare();
    showScreen("#settings-screen");
}

export function showGameScreen() {
    hideShare();
    showScreen("#game-screen");
}

function hideShare() {
    let elements = document.getElementsByTagName("playpass-share");
    if (elements && elements.length > 0) {
        elements.item(0).remove();
    }
}

function showShare() {
    hideShare();
    share();
}

function hideAll() {
    hideShare();
    showGameScreen();
}

export const screenHandlers = {
    share: {
        show: showShare,
        hide: hideAll
    },
    home: {
        show: showGameScreen,
        hide: hideAll
    },
    help: {
        show: onHelpClick,
        hide: hideAll
    }
}