import { kaBoom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export default function displayLetter(onDisplayEnd: CallableFunction) {
	state.set("freezePlayer", true);
	const dialogueUI = document.getElementById(
		"letter-textbox-container"
	) as HTMLElement;
	dialogueUI.style.display = "block";

	const closeBtn = document.getElementById("close-letter") as HTMLElement;
	function onCloseBtnClick() {
		onDisplayEnd();
		dialogueUI.style.display = "none";
		closeBtn.removeEventListener("click", onCloseBtnClick);
	}

	kaBoom.onKeyPress("space", () => {
		onCloseBtnClick();
	});

	closeBtn.addEventListener("click", onCloseBtnClick);
}
