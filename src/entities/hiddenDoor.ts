import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createHiddenDoor(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("hiddenDoor"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 45, 50) }),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		kaBoom.z(2),
		"hiddenDoor",
	];
}

export function createHiddenDoor2(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("hiddenDoor2"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 45, 50) }),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		kaBoom.z(2),
		"hiddenDoor2",
	];
}
