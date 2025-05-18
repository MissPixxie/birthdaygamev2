import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import { colorizeBackground } from "../utils";
import createBoss, { setBossMovement } from "../entities/boss";

export default function bossScene(
	kaBoom: Kaboom,
	bossMapData: MapData,
	previousSceneData: GameState
) {
	colorizeBackground(kaBoom, "#50585e");
	//state.changeScene("basementRoom1Scene");
	console.log("current scene " + state.current().currentScene);
	console.log("previous scene " + state.current().previousScene);

	const map = kaBoom.add([
		kaBoom.sprite("bossMap"),
		kaBoom.pos(0),
		kaBoom.scale(scaleFactor),
	]);

	const layers = bossMapData.layers;

	// BOUNDARIES //
	for (const layer of layers) {
		if (layer.name === "boundaries") {
			drawBoundaries(kaBoom, map, layer);
			continue;
		}
		if (layer.name === "spawnpoint") {
			for (const entity of layer.objects!) {
				if (entity.name === "playerBoss") {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					continue;
				}
				if (entity.name === "boss") {
					entities.boss = map.add(
						createBoss(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					entities.boss.play("idle");
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
			if (state.current().currentScene === "basementScene") return;
			else {
				state.changeScene("basementScene");
				kaBoom.go("basementScene", previousSceneData);
			}
		});
	}

	setPlayerMovement(kaBoom, entities.player!);
	setBossMovement(entities.boss!);
}
