import { Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

export default function createGhost(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("ghost"),
		kaBoom.area(),
		kaBoom.pos(pos),
		kaBoom.body(),
		kaBoom.anchor("top"),
		kaBoom.scale(0.5),
		{
			speed: 100,
			floatOffset: 0,
		},
		"ghost",
	];
}
