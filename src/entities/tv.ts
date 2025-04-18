import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createTv(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("tv", { anim: "open" }),
		kaBoom.area(),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(1),
		"tv",
	];
}
