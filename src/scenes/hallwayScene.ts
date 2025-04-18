import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { Entities, GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";

export default function hallwayScene(
	kaBoom: Kaboom,
	hallwayMapData: MapData,
	previousSceneData: GameState
) {
	state.changeScene("hallwayScene");
	console.log(state.current());

	const map = kaBoom.add([
		kaBoom.sprite("hallwayMap"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = hallwayMapData.layers;

	// BOUNDARIES //
	for (const layer of layers) {
		if (layer.name === "boundaries") {
			drawBoundaries(kaBoom, map, layer);
			continue;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				if (
					entity.name === "playerBasement" &&
					state.current().previousScene === "basementScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "playerHallway" &&
					state.current().previousScene !== "basementScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
			}
		}
	}

	// Scale camera
	kaBoom.camScale(kaBoom.vec2(1.5));
	if (entities.player !== null) {
		// get player position and update camera pos
		kaBoom.camPos(entities.player.worldPos());
		// callback to update camera pos when player moves
		kaBoom.onUpdate(async () => {
			if (entities.player !== null) {
				if (entities.player.pos.dist(kaBoom.camPos())) {
				}
				await kaBoom.tween(
					kaBoom.camPos(),
					entities.player.worldPos(),
					0.15,
					(newPos) => {
						kaBoom.camPos(newPos);
					},
					kaBoom.easings.linear
				);
			}
		});

		entities.player.onCollide("apartment", () => {
			if (state.current().currentScene === "apartmentScene") return;
			else {
				kaBoom.go("apartmentScene", previousSceneData);
			}
		});
		// entities.player.onCollide("stair", () => {
		// 	if (entities.player !== null) {
		// 		entities.player.move(0, 10);
		// 	}
		// });

		entities.player.onCollide("basement", () => {
			if (state.current().currentScene === "basementScene") return;
			else {
				kaBoom.go("basementScene", previousSceneData);
			}
		});
	}
	console.log(entities.player);
	setPlayerMovement(kaBoom, entities.player!);
}
