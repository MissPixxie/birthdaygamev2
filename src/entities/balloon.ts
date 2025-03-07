import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createBalloon(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("spritesheet", { anim: "balloonmove" }),
		kaBoom.area(),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("top"),
		kaBoom.scale(0.8),
		"balloon",
	];
}
