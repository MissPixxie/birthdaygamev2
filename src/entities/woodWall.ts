import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createWoodWall(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("woodWall"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 17, 20) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.5),
		kaBoom.z(5),
		{
			range: 25,
		},
		"woodWall",
	];
}
