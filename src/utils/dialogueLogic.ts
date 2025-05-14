import { kaBoom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";
import { getItem } from "./backpack";
import { neighborDialogue } from "./dialogueData";

// DIALOGUE //
export async function displayDialogue(
	text: string,
	onDisplayEnd: CallableFunction
) {
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"textbox-container"
	) as HTMLElement;
	const dialogue = document.getElementById("dialogue") as HTMLElement;

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
	}, 3);

	const closeBtn = document.getElementById("close") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
	}
	kaBoom.onKeyPress("space", () => {
		onCloseBtnClick();
	});
	closeBtn.addEventListener("click", onCloseBtnClick);
}

// RIDDLE //
export function displayRiddleDialogue(
	text: string,
	onDisplayEnd: CallableFunction
): Boolean {
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"chiffer-container"
	) as HTMLElement;
	const dialogue = document.getElementById("chiffer-dialogue") as HTMLElement;

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

	const checkBtn = document.getElementById("check-key") as HTMLElement;
	function onCheckBtnClick(): Boolean {
		state.set("hasEnteredPassPhrase", true);
		// const input1 = document.getElementById("input-1") as HTMLInputElement;
		// input1.value.toLowerCase();
		// const input2 = document.getElementById("input-2") as HTMLInputElement;
		// input2.value.toLowerCase();
		// const input3 = document.getElementById("input-3") as HTMLInputElement;
		// input3.value.toLowerCase();
		// const input4 = document.getElementById("input-4") as HTMLInputElement;
		// input4.value.toLowerCase();
		// checkLetter(input1, "input-1", "l");
		// checkLetter(input2, "input-2", "o");
		// checkLetter(input3, "input-3", "v");
		// checkLetter(input4, "input-4", "e");
		return true;
	}
	checkBtn.addEventListener("click", onCheckBtnClick);

	// function checkLetter(
	// 	elementValue: HTMLInputElement,
	// 	element: string,
	// 	correctValue: string
	// ) {
	// 	if (elementValue.toString() === correctValue) {
	// 		document.getElementById(element)!.style.borderColor = "green";
	// 	} else {
	// 		const dialogue = document.getElementById(
	// 			"chiffer-dialogue"
	// 		) as HTMLElement;
	// 		dialogue.innerText = "Fel svar. Prova igen.";
	// 		document.getElementById(element)!.style.borderColor = "red";
	// 	}
	// }

	const closeBtn = document.getElementById("close-chiffer") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
		closeBtn.removeEventListener("keydown", onCloseBtnClick);
	}

	closeBtn.addEventListener("click", onCloseBtnClick);
	closeBtn.addEventListener("keydown", onCloseBtnClick);
	if (onCheckBtnClick()) {
		return true;
	} else {
		return false;
	}
}

export function startNeighborDialogue(onDisplayEnd: CallableFunction) {
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"textbox-container"
	) as HTMLElement;
	const dialogue = document.getElementById("dialogue") as HTMLElement;

	dialogueUI.style.display = "block";

	function displayNextDialogue(text: string) {
		console.log(text);
		return new Promise<void>((resolve) => {
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
				resolve();
			}, 3);
		});
	}

	let dialogueIndex = 0;

	async function nextDialogueStep(dialogueText: string[]) {
		console.log(dialogueText);
		console.log(dialogueIndex);
		if (dialogueIndex < dialogueText.length) {
			await displayNextDialogue(dialogueText[dialogueIndex]);
			dialogueIndex++;
		} else {
			dialogueUI.style.display = "none";
			dialogue.innerHTML = "";
			dialogueIndex = 0;
			onDisplayEnd();
		}
	}

	async function dialogueToShow() {
		const talkedToNeighbor = state.current().talkedToNeighbor;
		const hasItem = getItem("duck");

		if (state.current().talkedToNeighbor < 1) {
			await nextDialogueStep(neighborDialogue.firstDialogue);
		} else if (hasItem && talkedToNeighbor >= 1) {
			await nextDialogueStep(neighborDialogue.secondDialogueGotDuck);
			state.set("hasSeenSecondDialogue", true);
		} else if (state.current().hasSeenSecondDialogue) {
			await nextDialogueStep(neighborDialogue.thirdDialogue);
		} else {
			await nextDialogueStep(neighborDialogue.secondDialogueNoDuck);
		}
	}

	kaBoom.onKeyPress("space", () => {
		dialogueToShow();
	});

	dialogueToShow();
}
