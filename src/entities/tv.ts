import kaboom, { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export default function createTv(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("tv", { anim: "closed" }),
		kaBoom.area(),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(1),
		{
			status: "closed",
		},
		"tv",
	];
}

export function displayHint(onDisplayEnd: CallableFunction) {
	state.set("freezePlayer", true);
	if (!state.current().isFirstTimeInteracting) {
		return;
	}
	const dialogueUI = document.getElementById("hint") as HTMLElement;
	dialogueUI.style.display = "block";

	kaBoom.onKeyPress("e", () => {
		dialogueUI.style.display = "none";
		onDisplayEnd();
		state.set("freezePlayer", false);
	});
}
