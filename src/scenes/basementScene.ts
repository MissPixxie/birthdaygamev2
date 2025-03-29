import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { Entities, GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import { gameState } from "../stateManager/stateManager";
import createGhost from "../entities/ghost";

export default function basementScene(
	kaBoom: Kaboom,
	basementMapData: MapData,
	previousSceneData: GameState
) {
	state.changeScene("basementScene");
	console.log(state.current());

	const map = kaBoom.add([
		kaBoom.sprite("basementMap"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = basementMapData.layers;

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
					state.current().previousScene === "hallwayScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "ghost") {
					entities.ghost = map.add(
						createGhost(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
			}
		}
	}

	kaBoom.onUpdate(() => {
		if (entities.ghost) {
			entities.ghost.move(entities.ghost.speed, 0);

			entities.ghost.floatOffset += dt() * 3;
			entities.ghost.pos.y =
				100 + Math.sin(entities.ghost.floatOffset) * 10;
		}
	});

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

		entities.player.onCollide("hallway", () => {
			gameState.setFreezePlayer(true);
			if (state.current().currentScene === "hallwayScene") return;
			else {
				kaBoom.go("hallwayScene", previousSceneData);
			}
		});
	}
	console.log(entities.player);
	setPlayerMovement(kaBoom, entities.player!);
}
