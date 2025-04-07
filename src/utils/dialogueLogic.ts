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

// CHIFFER //
export function displayChifferDialogue(
	text: string,
	onDisplayEnd: CallableFunction
) {
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

	const closeBtn = document.getElementById("close-chiffer") as HTMLElement;
	function onCloseBtnClick() {
		// if (
		// 	event.type === "click" ||
		// 	(event.type === "keydown" && event.code === "Space")
		// ) {
		// 	console.log(event.code);

		onDisplayEnd();
		dialogueUI.style.display = "none";
		dialogue.innerHTML = "";
		clearInterval(intervalRef);
		closeBtn.removeEventListener("click", onCloseBtnClick);
		closeBtn.removeEventListener("keydown", onCloseBtnClick);
		//}
	}

	closeBtn.addEventListener("click", onCloseBtnClick);
	closeBtn.addEventListener("keydown", onCloseBtnClick);
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
