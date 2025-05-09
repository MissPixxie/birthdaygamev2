import { state } from "../stateManager/globalStateManager";

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
	}, 5);

	const closeBtn = document.getElementById("close") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
	}
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

	function checkLetter(
		elementValue: HTMLInputElement,
		element: string,
		correctValue: string
	) {
		if (elementValue.toString() === correctValue) {
			document.getElementById(element)!.style.borderColor = "green";
		} else {
			const dialogue = document.getElementById(
				"chiffer-dialogue"
			) as HTMLElement;
			dialogue.innerText = "Fel svar. Prova igen.";
			document.getElementById(element)!.style.borderColor = "red";
		}
	}

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

// AHRI //
export function displayAhriDialogue(
	text: string,
	onDisplayEnd: CallableFunction
) {
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"ahri-textbox-container"
	) as HTMLElement;
	const dialogue = document.getElementById("ahri-dialogue") as HTMLElement;

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

	document
		.getElementById("pokemonGo")!
		.addEventListener("click", returnChoiceText);
	document
		.getElementById("wobble")!
		.addEventListener("click", returnChoiceText);
	document
		.getElementById("swimming")!
		.addEventListener("click", returnChoiceText);

	function returnChoiceText(event: Event) {
		const target = event.target as HTMLElement;
		const choice = target.id;

		let text = "";
		switch (choice) {
			case "pokemonGo":
				text = "Pokemon Go är roligt, då går vi och utforskar mycket!";
				break;
			case "wobble":
				text = "Wobble skål är min favorit också!!";
				break;
			case "swimming":
				text =
					"Bada i havet kan vara roligt, men jag vågar inte simma...";
				break;
		}
		return removeButtonsShowAnswer(text);
	}

	function removeButtonsShowAnswer(text: string) {
		console.log(text);
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
	}

	const closeBtn = document.getElementById("ahri-close") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
	}
	closeBtn.addEventListener("click", onCloseBtnClick);
}
