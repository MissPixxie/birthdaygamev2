import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createDuck(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("duck"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 25, 50) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.3),
		{
			status: "hidden",
		},
		"duck",
	];
}
