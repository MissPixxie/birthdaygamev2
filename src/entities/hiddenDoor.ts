import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createHiddenDoor(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 25, 50) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.z(2),
		"hiddenDoor",
	];
}
