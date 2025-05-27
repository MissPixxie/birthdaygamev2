import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createBedTable(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("bedTable", { anim: "closed" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 17, 20) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		{
			status: "closed",
			range: 25,
		},
		"bedTable",
	];
}
