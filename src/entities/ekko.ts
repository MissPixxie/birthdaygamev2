import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createEkko(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("spritesheet", { anim: "ekkomove" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 10, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("top"),
		kaBoom.scale(0.7),
		"ekko",
	];
}
