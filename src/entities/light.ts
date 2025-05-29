import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createLight(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("light"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 17, 20) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.2),
		"light",
	];
}
