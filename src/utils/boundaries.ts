import { GameObj, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";
import { Layers } from "../scenes/apartmentScnene";

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
		//kaBoom.offscreen(),
		tag,
	];
}

export function drawBoundaries(
	kaBoom: Kaboom,
	map: GameObj,
	layers: Layers[number]
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
