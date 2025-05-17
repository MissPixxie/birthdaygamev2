import { scaleFactor } from "../constants.ts";
import createPlayer from "../entities/player.js";
// import createAhri from "../entities/ahri.js";
// import createEkko from "../entities/ekko.js";
import createBalloon from "../entities/balloon.js";
import { setPlayerMovement } from "../entities/player.ts";
import { dialogueData } from "../utils/dialogueData.ts";
import { drawBoundaries } from "../utils/boundaries.ts";
import { displayDialogue } from "../utils/dialogueLogic.ts";

import { colorizeBackground } from "../utils.ts";
import { Kaboom } from "../kaboomCtx.ts";
import { GameState, MapData, entities } from "../utils/types.ts";
import { state } from "../stateManager/globalStateManager.ts";
import { GameObj } from "kaboom";
import createTv, { displayHint } from "../entities/tv.ts";
import createKey from "../entities/key.ts";
import { addToBackpack, getItem } from "../utils/backpack.ts";
import createDuck from "../entities/duck.ts";
import createBedTable from "../entities/bedTable.ts";
import createWeapon from "../entities/weapon.ts";

export default function apartmentScene(
	kaBoom: Kaboom,
	apartmentMapData: MapData,
	previousSceneData: GameState
) {
	state.changeScene("apartmentScene");

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
				if (entity.name === "bedTable") {
					entities.bedTable = map.add(
						createBedTable(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "weapon") {
					entities.weapon = map.add(
						createWeapon(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					entities.weapon.play("hide");
					entities.weapon.status = "hidden";
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
				if (entity.name === "duck") {
					entities.duck = map.add(
						createDuck(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					entities.duck.play("show");
					continue;
				}
				// if (entity.name === "sparkle") {
				// 	console.log(entity.name);
				// 	const sparkle = createSparkleEffect(
				// 		kaBoom,
				// 		kaBoom.vec2(entity.x, entity.y)
				// 	);
				// 	const glow = createGlowEffect(
				// 		kaBoom,
				// 		kaBoom.vec2(entity.x, entity.y)
				// 	);
				// 	// kaBoom.onUpdate(() => {
				// 	// 	glow.pos.x = sprite.pos.x; // Uppdatera position för glödande effekt
				// 	// 	glow.pos.y = sprite.pos.y;
				// 	// });
				// 	continue;
				// }
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
				displayDialogue(dialogueData["ahri"], () => {
					state.set("freezePlayer", false);
					entities.ahri!.play("idle");
					entities.ahri!.status = "idle";
				});
			}
		});

		entities.player.onCollide("bedTable", () => {
			console.log("bedTable");
			state.set("collisionWith", "bedTable");
			state.set("itemToPickup", "weapon");
			if (state.current().isFirstTimeInteracting) {
				displayHint(() => {
					state.set("freezePlayer", false);
				});
			}
			console.log(state.current().collisionWith);
			if (state.current().collisionWith === "bedTable") {
				kaBoom.onKeyPress("o", () => {
					if (entities.bedTable!.status === "open") {
						entities.bedTable!.play("closed");
						entities.bedTable!.status = "closed";
						entities.weapon!.play("hide");
					} else {
						entities.bedTable!.play("open");
						entities.bedTable!.status = "open";
						if (!getItem("weapon")) {
							entities.weapon!.play("show");
						}
					}
				});
			}
		});

		entities.player.onCollideEnd("bedTable", () => {
			state.set("collisionWith", "null");
		});

		entities.player.onCollide("livingRoom", async (livingRoom: GameObj) => {
			state.set("freezePlayer", true);
			if (state.current().hasEnteredLivingRoom) {
				destroy(livingRoom);
				return;
			}
			await displayDialogue(dialogueData["livingRoom"], () => {
				state.set("freezePlayer", false);
				state.set("hasEnteredLivingRoom", true);
			});
		});

		entities.player.onCollide("computer", () => {
			displayDialogue(dialogueData["computer"], () => {
				state.set("freezePlayer", false);
			});
		});

		entities.player.onCollide("duck", () => {
			console.log("duck collide");
			state.set("itemToPickup", "duck");
		});

		entities.player.onCollide("tv", () => {
			state.set("collisionWith", "tv");
			state.set("itemToPickup", "key");
			if (state.current().isFirstTimeInteracting) {
				displayHint(() => {
					state.set("freezePlayer", false);
				});
			}
			if (state.current().collisionWith === "tv") {
				kaBoom.onKeyPress("o", () => {
					console.log(state.current().itemToPickup);
					if (entities.tv!.status === "open") {
						entities.tv!.play("closed");
						entities.tv!.status = "closed";
						entities.key!.play("hide");
					} else {
						entities.tv!.play("open");
						entities.tv!.status = "open";
						if (!getItem("key")) {
							entities.key!.play("show");
						}
					}
				});
			}
		});
		entities.player.onCollideEnd("tv", () => {
			state.set("collisionWith", "null");
		});

		entities.player.onCollide("hallway", () => {
			if (state.current().currentScene === "hallwayScene") return;
			//else if (!getItem("key")) {
			// displayDialogue(dialogueData["keyMissing"], () => {
			// 	state.set("freezePlayer", false);
			// });
			//}
			else {
				kaBoom.go("hallwayScene", previousSceneData);
			}
		});

		kaBoom.onKeyPress("e", () => {
			state.set("freezePlayer", true);

			const itemArray = get(state.current().itemToPickup, {
				recursive: true,
			});
			const item = itemArray.find((items) =>
				items.is(state.current().itemToPickup)
			);

			if (!item) {
				console.warn("Item does not exist.");
				state.set("freezePlayer", false);
				return;
			}
			addToBackpack(state.current().itemToPickup);
			destroy(item!);
			state.set("freezePlayer", false);
			state.set("itemToPickup", "null");
		});
	}
	setPlayerMovement(kaBoom, entities.player!);
}
