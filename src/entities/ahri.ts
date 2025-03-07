import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createAhri(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("ahri", { anim: "idle" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 10, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("top"),
		{
			status: "idle",
		},
		"ahri",
	];
}
