import { GameObj, Tag, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";
import { Layers } from "./types";

export function generateColliders(
	kaBoom: Kaboom,
	width: number,
	height: number,
	pos: Vec2,
	tag: string
) {
	return [
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(0), width, height) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		tag,
	];
}

export function drawBoundaries(
	kaBoom: Kaboom,
	map: GameObj,
	layers: Layers[number] | Layers[any]
) {
	for (const boundary of layers.objects ?? []) {
		map.add(
			generateColliders(
				kaBoom,
				boundary.width,
				boundary.height,
				kaBoom.vec2(boundary.x, boundary.y),
				boundary.name
			)
		);
	}
}

export function removeCollider(tag: GameObj) {
	return [destroy(tag)];
}
