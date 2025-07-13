import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import {
	displayDialogue,
	displayRiddleDialogue,
	startNeighborDialogue,
} from "../utils/dialogueLogic";
import { dialogueData, neighborDialogue } from "../utils/dialogueData";
import createNeighborDoor, { closeDoor } from "../entities/neighborDoor";
import createEyes from "../entities/eyes";
import { colorizeBackground } from "../utils";
import { getItem, removeItemFromBackpack } from "../utils/backpack";
import displayLetter from "../utils/letterLogic";

export default function hallwayScene(
	kaBoom: Kaboom,
	hallwayMapData: MapData,
	previousSceneData: GameState
) {
	colorizeBackground(kaBoom, "#50585e");
	state.changeScene("hallwayScene");
	console.log("current scene " + state.current().currentScene);
	console.log("previous scene " + state.current().previousScene);

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
				if (entity.name === "neighborDoor") {
					entities.neighborDoor = map.add(
						createNeighborDoor(
							kaBoom,
							kaBoom.vec2(entity.x, entity.y)
						)
					);
					continue;
				}
				if (entity.name === "eyes") {
					entities.eyes = map.add(
						createEyes(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					entities.eyes.play("hide");
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

		// FIX DIALOGUE
		entities.player.onCollide("neighborDoor", () => {
			if (entities.neighborDoor!.status === "open") return;

			entities.neighborDoor!.play("open");
			entities.neighborDoor!.status = "open";
			entities.eyes!.play("show");
			const hasDuck = getItem("duck");

			if (state.current().talkedToNeighbor >= 1 && hasDuck) {
				if (state.current().hasSeenSecondDialogue) {
					startNeighborDialogue(
						neighborDialogue.thirdDialogue,
						() => {
							state.set("freezePlayer", false);
						}
					);
				} else {
					startNeighborDialogue(
						neighborDialogue.secondDialogueGotDuck,
						() => {
							state.set("freezePlayer", false);
							state.set("hasSeenSecondDialogue", true);
							state.set("handedOverDuck", true);
							entities.duck!.destroy();
							removeItemFromBackpack("duck");
						}
					);
				}
			} else if (
				state.current().hasSeenSecondDialogue &&
				state.current().handedOverDuck
			) {
				startNeighborDialogue(neighborDialogue.thirdDialogue, () => {
					state.set("freezePlayer", false);
				});
			} else if (state.current().talkedToNeighbor >= 1 && !hasDuck) {
				startNeighborDialogue(
					neighborDialogue.secondDialogueNoDuck,
					() => {
						state.set("freezePlayer", false);
					}
				);
			} else {
				startNeighborDialogue(neighborDialogue.firstDialogue, () => {
					state.set("freezePlayer", false);
				});
			}
			let newTalkedToNeighbor = state.current().talkedToNeighbor + 1;
			state.set("talkedToNeighbor", newTalkedToNeighbor);
		});

		entities.player.onCollide("wallHanging", () => {
			displayLetter(() => {
				state.set("freezePlayer", false);
			});
			state.set("hasSeenRiddle", true);
		});

		entities.player.onCollide("basement", () => {
			state.set("hasEnteredPassPhrase", true);
			state.set("hasSeenRiddle", true);
			if (
				state.current().hasSeenRiddle &&
				state.current().hasEnteredPassPhrase
			) {
				state.changeScene("basementScene");
				kaBoom.go("basementScene", previousSceneData);
			} else if (!state.current().hasSeenRiddle) {
				displayDialogue(dialogueData["passPhrase"], () => {
					state.set("freezePlayer", false);
				});
			} else {
				const riddle = displayRiddleDialogue(
					dialogueData["enterPassPhrase"],
					() => {
						state.set("freezePlayer", false);
					}
				);
				if (riddle) {
					kaBoom.go("basementScene", previousSceneData);
				}
			}
		});
	}

	setPlayerMovement(kaBoom, entities.player!);
	closeDoor(entities.neighborDoor, entities.eyes);
}
