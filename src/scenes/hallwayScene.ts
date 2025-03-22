import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { gameState } from "../stateManager/stateManager";
import { Kaboom } from "../kaboomCtx";
import { Entities, GameState, MapData } from "../utils/types";

const entities: Entities = {
	player: null,
	ahri: null,
	ekko: null,
	balloon: null,
};

export default async function hallwayScene(
	kaBoom: Kaboom,
	hallwayMapData: MapData,
	previousSceneData: GameState
) {
	const previousScene = gameState.getPreviousScene();
	gameState.setCurrentScene("hallwayScene");
	const currentScene = gameState.getCurrentScene();

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
			break;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				// 		if (
				// 			entity.name === "playerHallway" &&
				// 			previousScene === "apartmentScene"
				// 		) {
				entities.player = map.add(
					createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
				);
				// 			continue;
				// 		}
				// 		if (
				// 			entity.name === "player" &&
				// 			previousScene !== "puzzleScene"
				// 		) {
				// 			entities.player = map.add(
				// 				createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
				// 			);
				// 			continue;
				// 		}
			}
		}
	}
	kaBoom.camScale(kaBoom.vec2(1.5));
	if (entities.player !== null) {
		kaBoom.camPos(entities.player.worldPos());
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

		// 	entities.player.onCollide("apartment", () => {
		// 		if (currentScene === "apartmentScene") return;
		// 		else {
		// 			kaBoom.go("apartmentScene");
		// 		}
		// 	});
	}
	setPlayerMovement(kaBoom, entities.player!);
}
