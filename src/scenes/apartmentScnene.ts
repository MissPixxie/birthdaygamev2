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
import { GameObj } from "kaboom";

export type Entities = {
	player: GameObj | null;
	ahri: GameObj | null;
	ekko: GameObj | null;
	balloon: GameObj | null;
};

const entities: Entities = {
	player: null,
	ahri: null,
	ekko: null,
	balloon: null,
};

const mapData = (await import("../../public/map2.json")).default;

export type Layers = (typeof mapData)["layers"];

export default async function apartmentScene(kaBoom: Kaboom) {
	const previousScene = gameState.getPreviousScene();
	gameState.setCurrentScene("apartmentScene");
	const currentScene = gameState.getCurrentScene();

	colorizeBackground(kaBoom, 76, 170, 255);

	kaBoom.loadSprite("map", "../map2.png");

	const map = kaBoom.add([
		kaBoom.sprite("map"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = mapData.layers;

	// BOUNDARIES //
	for (const layer of layers) {
		if (layer.name === "boundaries") {
			drawBoundaries(kaBoom, map, layer);
			continue;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				if (
					entity.name === "playerPuzzle" &&
					previousScene === "puzzleScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (
					entity.name === "player" &&
					previousScene !== "puzzleScene"
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
				if (entity.name === "ekko") {
					entities.ekko = map.add(
						createEkko(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "ahri") {
					entities.ahri = map.add(
						createAhri(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
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

		entities.player.onCollide("ekko", () => {
			displayDialogue(dialogueData["ekko"], () => {
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

		entities.player.onCollide("puzzle", () => {
			if (currentScene === "puzzleScene") return;
			else {
				kaBoom.go("puzzleScene");
			}
		});
	}
	setPlayerMovement(kaBoom, entities.player!);

	// setCamScale(kaBoom);

	// kaBoom.onResize(() => {
	//   setCamScale(kaBoom);
	// });
}
