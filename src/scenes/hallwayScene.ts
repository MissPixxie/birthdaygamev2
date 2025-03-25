import { scaleFactor } from "../constants";
import createPlayer, { setPlayerMovement } from "../entities/player";
import { drawBoundaries } from "../utils/boundaries";
import { Kaboom } from "../kaboomCtx";
import { Entities, GameState, MapData } from "../utils/types";
import { state } from "../stateManager/globalStateManager";

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
	state.changeScene("hallwayScene");
	console.log(state.current());

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
					entity.name === "playerHallway" &&
					state.current().previousScene === "apartmentScene"
				) {
					// const player = map.add(
					// 	makePlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					// );
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					break;
				}
				if (
					entity.name === "playerStreet" &&
					state.current().previousScene === "streetScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					break;
				}
				if (
					entity.name === "playerBasement" &&
					state.current().previousScene === "basementScene"
				) {
					entities.player = map.add(
						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
					);
					break;
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

		entities.player.onCollide("apartment", () => {
			if (state.current().currentScene === "apartmentScene") return;
			else {
				kaBoom.go("apartmentScene");
			}
		});
	}
	setPlayerMovement(kaBoom, entities.player!);
}
