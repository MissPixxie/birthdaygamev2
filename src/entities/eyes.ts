import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createEyes(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("eyes"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.6),
		{
			status: "hidden",
		},
		"eyes",
	];
}
