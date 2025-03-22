// import { kaBoom } from "../kaboomCtx";
// import { scaleFactor } from "../constants.ts";
// import { drawBoundaries } from "../utils/boundaries.ts";
// import apartmentMapData from "../../public/map4.json";
// import hallwayMapData from "../../public/map3.json";
// import { MapData } from "../utils/types.ts";

// const apartmentMap = kaBoom.add([
// 	kaBoom.sprite("apartmentMap"),
// 	kaBoom.pos(0),
// 	kaBoom.scale(scaleFactor),
// ]);

// const hallwayMap = kaBoom.add([
// 	kaBoom.sprite("hallwayMap"),
// 	kaBoom.pos(0),
// 	kaBoom.scale(scaleFactor),
// ]);

// // BOUNDARIES //
// function drawSprites(map: MapData) {
// 	for (const layer of map.layers) {
// 		if (layer.name === "boundaries") {
// 			drawBoundaries(kaBoom, map, layer);
// 			continue;
// 		}
// 		if (layer.name === "spawnpoint") {
// 			for (const entity of layer.objects!) {
// 				if (
// 					entity.name === "playerHallway" &&
// 					previousScene === "hallwayScene"
// 				) {
// 					entities.player = map.add(
// 						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
// 					);
// 					continue;
// 				}
// 				if (
// 					entity.name === "player" &&
// 					previousScene !== "hallwayScene"
// 				) {
// 					entities.player = map.add(
// 						createPlayer(kaBoom, kaBoom.vec2(entity.x, entity.y))
// 					);
// 					continue;
// 				}
// 				if (entity.name === "balloon") {
// 					entities.balloon = map.add(
// 						createBalloon(kaBoom, kaBoom.vec2(entity.x, entity.y))
// 					);
// 					continue;
// 				}
// 				if (entity.name === "ekko") {
// 					entities.ekko = map.add(
// 						createEkko(kaBoom, kaBoom.vec2(entity.x, entity.y))
// 					);
// 					continue;
// 				}
// 				if (entity.name === "ahri") {
// 					entities.ahri = map.add(
// 						createAhri(kaBoom, kaBoom.vec2(entity.x, entity.y))
// 					);
// 					continue;
// 				}
// 			}
// 		}
// 	}
// }
