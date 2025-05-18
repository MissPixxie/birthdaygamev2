import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export function createParticle(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("particle"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.2),
		"particle",
	];
}
