import { scaleFactor } from "../constants";
import createPlayer, {
	playShootAnimation,
	setPlayerMovement,
} from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import createGhost, { setGhostMovement } from "../entities/ghost";
import { GameObj } from "kaboom";
import { colorizeBackground } from "../utils";
import { shoot } from "../utils/weapon";
import { addToBackpack, getItem } from "../utils/backpack";

export default function basementScene(
	kaBoom: Kaboom,
	basementMapData: MapData,
	previousSceneData: GameState
) {
	colorizeBackground(kaBoom, "#50585e");
	//state.changeScene("basementScene");
	console.log("current scene " + state.current().currentScene);
	console.log("previous scene " + state.current().previousScene);

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
				if (
					entity.name === "playerRoom1" &&
					state.current().previousScene === "basementRoom1Scene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "playerRoom2" &&
					state.current().previousScene === "basementRoom2Scene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "playerRoom3" &&
					state.current().previousScene === "basementRoom3Scene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "playerRoom4" &&
					state.current().previousScene === "basementRoom4Scene"
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
					if (state.current().isGhostDead) {
						entities.ghost.enterState("dead");
						entities.ghost.play("dead");
						entities.ghost = map.add(
							createGhost(
								kaBoom,
								kaBoom.vec2(
									entities.ghost.deathPosX,
									entities.ghost.deathPosY
								)
							)
						);
					}
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

		entities.player.onCollide("basementRoom1", () => {
			if (state.current().currentScene === "basementRoom1Scene") return;
			else {
				state.changeScene("basementRoom1Scene");
				kaBoom.go("basementRoom1Scene", previousSceneData);
			}
		});

		entities.player.onCollide("basementRoom2", () => {
			if (state.current().currentScene === "basementRoom2Scene") return;
			else {
				state.changeScene("basementRoom2Scene");
				kaBoom.go("basementRoom2Scene", previousSceneData);
			}
		});

		// entities.player.onCollide("basementRoom3", () => {
		// 	if (state.current().currentScene === "basementRoom3Scene") return;
		// 	else {
		// 		state.changeScene("basementRoom3Scene");
		// 		kaBoom.go("basementRoom3Scene", previousSceneData);
		// 	}
		// });

		entities.player.onCollide("basementRoom3", () => {
			if (state.current().currentScene === "basementRoom3Scene") return;
			else {
				state.changeScene("basementRoom3Scene");
				kaBoom.go("bossScene", previousSceneData);
			}
		});

		entities.player.onCollide("basementRoom4", () => {
			if (state.current().currentScene === "basementRoom4Scene") return;
			else {
				state.changeScene("basementRoom4Scene");
				kaBoom.go("basementRoom4Scene", previousSceneData);
			}
		});

		entities.player.onCollide("ghost", () => {
			if (entities.player!.hp() === 0) {
				entities.player!.destroy();
				kaBoom.go("hallwayScene");
			} else {
				if (state.current().isGhostDead) return;
				else {
					entities.player!.hurt(1);
				}
			}
		});

		addToBackpack("weapon");
		kaBoom.onKeyPress("f", () => {
			if (!getItem("weapon")) {
				return;
			}
			entities.player!.isAttacking = true;
			playShootAnimation(entities.player!);

			shoot(map, () => {
				entities.player!.isAttacking = false;
				state.set("freezePlayer", false);
			});
		});
		kaBoom.onKeyRelease("f", () => {
			entities.player!.isAttacking = false;
		});

		function checkHealth(player: GameObj) {
			if (entities.player!.hp() === 0) {
				destroy(entities.player!);
				//state.set("playerHp", 5);
				kaBoom.go("hallwayScene", previousSceneData);
			} else {
				let newHp = state.current().playerHp - 1;
				player.hurt(1);
				if (newHp < 0) {
					newHp = 0;
				}
				state.set("playerHp", newHp);
				return;
			}
		}
	}

	setPlayerMovement(kaBoom, entities.player!);
	setGhostMovement(kaBoom, entities.ghost!);
}
