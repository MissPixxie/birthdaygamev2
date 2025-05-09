import kaboom, { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export default function createNeighborDoor(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("neighborDoor"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(1),
		kaBoom.z(0),
		{
			status: "hidden",
		},
		"neighborDoor",
	];
}
