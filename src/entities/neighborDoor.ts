import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";

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
			status: "closed",
			range: 30,
		},
		"neighborDoor",
	];
}

export function closeDoor(door: GameObj | null, eyes: GameObj | null) {
	const player = kaBoom.get("player", { recursive: true })[0]; // Hämta spelaren
	if (!door || !player) {
		console.error("Can't find door or player");
		return;
	}

	kaBoom.onUpdate(() => {
		const distance = door.pos.dist(player.pos);
		if (distance > door.range && door.status !== "closed") {
			door.status = "closed";
			door.play("closed");
			eyes!.play("hide");
		}
	});
}
