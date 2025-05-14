import { Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export default function createBedTable(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("bedTable", { anim: "closed" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 17, 22) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		{
			status: "closed",
		},
		"bedTable",
	];
}
