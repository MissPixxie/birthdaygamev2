import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import { gameState } from "../stateManager/stateManager";
import { colorizeBackground } from "../utils";

export default function basementRoom2Scene(
	kaBoom: Kaboom,
	basementRoom1MapData: MapData,
	previousSceneData: GameState
) {
	colorizeBackground(kaBoom, "#a2aed5");
	state.changeScene("basementRoom2Scene");
	console.log(state.current());

	const map = kaBoom.add([
		kaBoom.sprite("basementRoom2Map"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = basementRoom1MapData.layers;

	// BOUNDARIES //
	for (const layer of layers) {
		if (layer.name === "boundaries") {
			drawBoundaries(kaBoom, map, layer);
			continue;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				if (
					entity.name === "playerRoom2" &&
					state.current().previousScene === "basementScene"
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

		//// COLLIDERS ////
		entities.player.onCollide("basement", () => {
			gameState.setFreezePlayer(true);
			if (state.current().currentScene === "basementScene") return;
			else {
				kaBoom.go("basementScene", previousSceneData);
			}
		});
	}

	setPlayerMovement(kaBoom, entities.player!);
}
