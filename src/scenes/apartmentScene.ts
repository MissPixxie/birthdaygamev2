import { scaleFactor } from "../constants.ts";
import createPlayer from "../entities/player.js";
import createAhri from "../entities/ahri.js";
import createEkko from "../entities/ekko.js";
import createBalloon from "../entities/balloon.js";
import { setPlayerMovement } from "../entities/player.ts";
import { dialogueData } from "../utils/dialogueData.ts";
import { drawBoundaries } from "../utils/boundaries.ts";
import {
	displayAhriDialogue,
	displayChifferDialogue,
	displayDialogue,
} from "../utils/dialogueLogic.ts";

import { colorizeBackground } from "../utils.ts";
import { gameState } from "../stateManager/stateManager.js";
import { Kaboom } from "../kaboomCtx.ts";
import { GameState, MapData, entities } from "../utils/types.ts";
import { state } from "../stateManager/globalStateManager.ts";

// const entities: Entities = {
// 	player: null,
// 	ahri: null,
// 	ekko: null,
// 	balloon: null,
// };

export default function apartmentScene(
	kaBoom: Kaboom,
	apartmentMapData: MapData,
	previousSceneData: GameState
) {
	state.changeScene("apartmentScene");
	//console.log(state.current());

	colorizeBackground(kaBoom, "#a2aed5");

	const map = kaBoom.add([
		kaBoom.sprite("apartmentMap"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = apartmentMapData.layers;
	//const player = map.add(makePlayer(kaBoom));
	// BOUNDARIES //
	for (const layer of layers) {
		if (layer.name === "boundaries") {
			drawBoundaries(kaBoom, map, layer);
			continue;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				if (
					entity.name === "playerHallway" &&
					state.current().previousScene === "hallwayScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "player" &&
					state.current().previousScene !== "hallwayScene"
				) {
					//const player = map.add(makePlayer(kaBoom));
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "balloon") {
					entities.balloon = map.add(
						createBalloon(kaBoom, kaBoom.vec2(entity.x, entity.y))
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

		entities.player.onCollide("ahri", () => {
			if (entities.ahri !== null) {
				if (entities.ahri.curAnim() != "awake") {
					entities.ahri.play("awake");
					entities.ahri.status = "awake";
				}
				displayAhriDialogue(dialogueData["ahri"], () => {
					gameState.setFreezePlayer(false);
					entities.ahri!.play("idle");
					entities.ahri!.status = "idle";
				});
			}
		});

		entities.player.onCollide("livingRoom", () => {
			displayDialogue(dialogueData["livingRoom"], () => {
				gameState.setFreezePlayer(false);
			});
		});

		entities.player.onCollide("chiffer", () => {
			displayChifferDialogue(dialogueData["chiffer"], () => {
				gameState.setFreezePlayer(false);
			});
		});

		entities.player.onCollide("computer", () => {
			displayDialogue(dialogueData["computer"], () => {
				gameState.setFreezePlayer(false);
			});
		});

		entities.player.onCollide("tv", () => {
			displayDialogue(dialogueData["tv"], () => {
				gameState.setFreezePlayer(false);
			});
		});

		entities.player.onCollide("hallway", () => {
			if (state.current().currentScene === "hallwayScene") return;
			else {
				kaBoom.go("hallwayScene", previousSceneData);
			}
		});
	}
	setPlayerMovement(kaBoom, entities.player!);

	// setCamScale(kaBoom);

	// kaBoom.onResize(() => {
	//   setCamScale(kaBoom);
	// });
}
