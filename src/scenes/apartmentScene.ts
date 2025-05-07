import { scaleFactor } from "../constants.ts";
import createPlayer from "../entities/player.js";
import createAhri from "../entities/ahri.js";
import createEkko from "../entities/ekko.js";
import createBalloon from "../entities/balloon.js";
import { setPlayerMovement } from "../entities/player.ts";
import { dialogueData } from "../utils/dialogueData.ts";
import { drawBoundaries, removeCollider } from "../utils/boundaries.ts";
import {
	displayAhriDialogue,
	displayChifferDialogue,
	displayDialogue,
} from "../utils/dialogueLogic.ts";

import { colorizeBackground } from "../utils.ts";
import { Kaboom } from "../kaboomCtx.ts";
import { GameState, MapData, entities } from "../utils/types.ts";
import { state } from "../stateManager/globalStateManager.ts";
import { GameObj } from "kaboom";
import createTv, { displayHint } from "../entities/tv.ts";
import createKey from "../entities/key.ts";
import { addToBackpack, getItem } from "../utils/backpack.ts";

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

	// BOUNDARIES //

	// loop through the layers of the json file to create boundaries, colliders and add objects
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
				if (entity.name === "tv") {
					entities.tv = map.add(
						createTv(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "key") {
					entities.key = map.add(
						createKey(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					entities.key.play("hide");
					entities.key.status = "hidden";
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
					state.set("freezePlayer", false);
					entities.ahri!.play("idle");
					entities.ahri!.status = "idle";
				});
			}
		});

		entities.player.onCollide("livingRoom", async (livingRoom: GameObj) => {
			if (state.current().hasEnteredLivingRoom) {
				destroy(livingRoom);
				return;
			}
			await displayDialogue(dialogueData["livingRoom"], () => {
				state.set("freezePlayer", false);
			});
			destroy(livingRoom);
			state.set("hasEnteredLivingRoom", true);
		});

		entities.player.onCollide("chiffer", () => {
			displayChifferDialogue(dialogueData["chiffer"], () => {
				state.set("freezePlayer", false);
			});
		});

		entities.player.onCollide("computer", () => {
			displayDialogue(dialogueData["computer"], () => {
				state.set("freezePlayer", false);
			});
		});

		entities.player.onCollide("tv", () => {
			state.set("tvCollision", true);
			state.set("itemsToPickup", "key");
			if (state.current().isFirstTimeInteracting) {
				displayHint(() => {
					state.set("freezePlayer", false);
				});
			}
			if (state.current().tvCollision) {
				kaBoom.onKeyPress("e", () => {
					console.log(state.current().itemsToPickup);
					if (entities.tv!.status === "open") {
						entities.tv!.play("closed");
						entities.tv!.status = "closed";
						entities.key!.play("hide");
					} else {
						entities.tv!.play("open");
						entities.tv!.status = "open";
						if (!state.current().hasKey) {
							entities.key!.play("show");
						}
					}
				});
			}
		});
		entities.player.onCollideEnd("tv", () => {
			state.set("tvCollision", false);
		});

		entities.player.onCollide("hallway", () => {
			if (state.current().currentScene === "hallwayScene") return;
			else if (!getItem("key")) {
				displayDialogue(dialogueData["keyMissing"], () => {
					state.set("freezePlayer", false);
				});
			} else {
				kaBoom.go("hallwayScene", previousSceneData);
			}
		});

		kaBoom.onKeyPress("w", () => {
			console.log("w key pressed");
			state.set("freezePlayer", true);

			destroy(entities.key!);
			state.set("freezePlayer", false);
			addToBackpack("key");

			// const itemArray = get(state.current().itemsToPickup);
			// const item = itemArray.find((items) =>
			// 	items.is(state.current().itemsToPickup)
			// );
			// pickUpItem(item!);
		});

		function pickUpItem(item: GameObj) {
			console.log(item);
			destroy(item);
			state.set("freezePlayer", false);
			state.set("itemsToPickup", "null");
			return;
		}
	}
	setPlayerMovement(kaBoom, entities.player!);

	// setCamScale(kaBoom);

	// kaBoom.onResize(() => {
	//   setCamScale(kaBoom);
	// });
}
