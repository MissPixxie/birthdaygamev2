import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { GameState, MapData, entities } from "../utils/types";
import { state } from "../stateManager/globalStateManager";
import { gameState } from "../stateManager/stateManager";
import createGhost, { setGhostMovement } from "../entities/ghost";
import { GameObj } from "kaboom";
import { colorizeBackground } from "../utils";

export default function basementScene(
	kaBoom: Kaboom,
	basementMapData: MapData,
	previousSceneData: GameState
) {
	colorizeBackground(kaBoom, "#a2aed5");
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
					if (state.current().isGhostDead) {
						return;
					}
					entities.ghost = map.add(
						createGhost(kaBoom, kaBoom.vec2(entity.x, entity.y))
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
		entities.player.onCollide("hallway", () => {
			gameState.setFreezePlayer(true);
			if (state.current().currentScene === "hallwayScene") return;
			else {
				kaBoom.go("hallwayScene", previousSceneData);
			}
		});

		entities.player.onCollide("ghost", () => {
			if (entities.player) checkHealth(entities.player);
			//if (entities.player && entities.ghost)
			//	handleBounceAnim(entities.player, entities.ghost);
		});

		// entities.player.onCollide("ghost", async () => {
		// 	if (!entities.player) {
		// 		return;
		// 	}
		// 	checkHealth();
		// 	if (entities.ghost)
		// 		handleBounceAnim(entities.player, entities.ghost);
		// });

		// 	function handleBounceAnim(player: GameObj, enemy: GameObj) {
		// 		if (!player || !enemy) return;

		// 		const horizontalDiff = player.pos.x - enemy.pos.x;
		// 		const verticalDiff = player.pos.y - enemy.pos.y;

		// 		let targetPos = null;

		// 		if (Math.abs(horizontalDiff) > Math.abs(verticalDiff)) {
		// 			const direction = horizontalDiff > 0 ? 1 : -1;
		// 			targetPos = vec2(player.pos.x + 30 * direction, player.pos.y);
		// 		} else {
		// 			const verticalDirection = verticalDiff > 0 ? -1 : 1;
		// 			targetPos = vec2(
		// 				player.pos.x,
		// 				player.pos.y + 30 * verticalDirection
		// 			);
		// 		}
		// 		if (targetPos && entities.player) {
		// 			handleOpacityChange(entities.player);
		// 			tween(
		// 				entities.player.pos,
		// 				targetPos,
		// 				0.5,
		// 				(newPos) => {
		// 					if (entities.player) entities.player.pos = newPos;
		// 				},
		// 				easings.easeInOutBounce
		// 			);
		// 		}
		// 	}

		// 	async function handleOpacityChange(player: GameObj) {
		// 		await tween(
		// 			player.opacity,
		// 			0,
		// 			1,
		// 			(val) => {
		// 				player.opacity = val;
		// 			},
		// 			easings.linear
		// 		);
		// 		tween(
		// 			player.opacity,
		// 			1,
		// 			0,
		// 			(val) => {
		// 				player.opacity = val;
		// 			},
		// 			easings.linear
		// 		);
		// 		// wait(0.1, () => {
		// 		// 	if (entities.player) entities.player.opacity = 1;
		// 		// });
		// 	}

		function checkHealth(player: GameObj) {
			console.log(state.current().playerHp);
			if (state.current().playerHp === 0) {
				if (entities.player) destroy(entities.player);
				state.set("playerHp", 5);
				kaBoom.go("hallwayScene", previousSceneData);
			} else {
				let newHp = state.current().playerHp - 1;
				player.hurt(1);
				if (newHp < 0) {
					newHp = 0;
				}
				state.set("playerHp", newHp);
				console.log(state.current().playerHp);
				return;
			}
		}
	}

	setPlayerMovement(kaBoom, entities.player!);
	setGhostMovement(kaBoom, entities.ghost!);
}
