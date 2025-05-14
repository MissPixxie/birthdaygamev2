import { kaBoom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";
import { dialogueData } from "./dialogueData";
import { setCurrentActivePanel } from "./uiManager";

window.addEventListener("DOMContentLoaded", () => {
	const helpIcon = document.getElementById("helpIcon") as HTMLElement;
	const backpackIcon = document.getElementById("backpackIcon") as HTMLElement;

	helpIcon.addEventListener("click", () => {
		displayHelpPanel(dialogueData["help"], () => {
			state.set("freezePlayer", false);
		});
	});

	// helpIcon.addEventListener("keypress", (event) => {
	// 	console.log(event.code);
	// 	if (event.code === "space") {
	// 		console.log("Space-tangenten trycktes ned!");
	// 	}
	// });

	backpackIcon.addEventListener("click", () => {
		displayBackpack(() => {
			state.set("freezePlayer", false);
		});
	});
});

export function displayHelpPanel(text: string, onDisplayEnd: CallableFunction) {
	setCurrentActivePanel("help");
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"help-textbox-container"
	) as HTMLElement;
	const dialogue = document.getElementById("help-dialogue") as HTMLElement;
	dialogueUI.style.display = "block";

	let index = 0;
	let currentText = "";
	const intervalRef = setInterval(() => {
		if (index < text.length) {
			currentText += text[index];
			dialogue.innerHTML = currentText;
			index++;
			return;
		}
		clearInterval(intervalRef);
	}, 5);

	const closeBtn = document.getElementById("close-help") as HTMLElement;
	function onCloseBtnClick() {
		console.log("onclosebtnclick");
		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
		setCurrentActivePanel(null);
	}

	kaBoom.onKeyPress("space", () => {
		onCloseBtnClick();
	});

	closeBtn.addEventListener("click", onCloseBtnClick);
}

export function displayBackpack(onDisplayEnd: CallableFunction) {
	setCurrentActivePanel("backpack");
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"backpack-textbox-container"
	) as HTMLElement;
	dialogueUI.style.display = "block";

	const closeBtn = document.getElementById("close-backpack") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		closeBtn.removeEventListener("click", onCloseBtnClick);
		setCurrentActivePanel(null);
	}

	kaBoom.onKeyPress("space", () => {
		onCloseBtnClick();
	});
	closeBtn.addEventListener("click", onCloseBtnClick);
}
