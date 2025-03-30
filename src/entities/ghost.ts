import { GameObj, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createGhost(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("ghost", { anim: "move" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 10, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("top"),
		kaBoom.scale(0.5),
		{
			direction: "right",
			speed: 20,
			range: 100,
		},
		kaBoom.health(10),
		"ghost",
	];
}

export function setBehavior(kaBoom: Kaboom, ghost: GameObj) {
	ghost.onStateEnter();
}
