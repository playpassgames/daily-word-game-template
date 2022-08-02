import * as playpass from "playpass";
import { showScreen } from "../../boilerplate/screens";

function back() {
    showScreen("#game-screen");
}

const template = document.querySelector("#about-screen");

template.querySelector("button[name=back]").onclick = back;
template.addEventListener("active", () => {
    playpass.storage.set("sawTutorial", true);
});
