import { Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export default function createTv(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("tv", { anim: "closed" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(1),
		{
			status: "closed",
			range: 25,
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
		state.set("freezePlayer", false);
		state.set("isFirstTimeInteracting", false);
		onDisplayEnd();
	});
}
