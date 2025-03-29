import { kaBoom } from "./src/kaboomCtx.ts";
import apartmentScene from "./src/scenes/apartmentScene.ts";
import firstScene from "./src/scenes/firstScene.js";
import { background } from "./src/constants.ts";
import apartmentMapData from "./public/map2.json";
import hallwayMapData from "./public/map3.json";
import basementMapData from "./public/map4.json";
import hallwayScene from "./src/scenes/hallwayScene.ts";
import { loadSprites } from "./src/ui/loadSprites.ts";
import basementScene from "./src/scenes/basementScene.ts";

kaBoom.scene("apartmentScene", (previousSceneData) => {
	apartmentScene(kaBoom, apartmentMapData, previousSceneData);
});

kaBoom.scene("hallwayScene", (previousSceneData) => {
	hallwayScene(kaBoom, hallwayMapData, previousSceneData);
});

kaBoom.scene("basementScene", (previousSceneData) => {
	basementScene(kaBoom, basementMapData, previousSceneData);
});

loadSprites().then(() => {
	kaBoom.go("apartmentScene");
});
// const scenes = {
// 	firstScene,
// 	apartmentScene,
// 	hallwayScene,
// };

// for (const sceneName in scenes) {
// 	kaBoom.setBackground(kaBoom.Color.fromHex(background));
// 	kaBoom.scene(sceneName, () =>
// 		scenes[sceneName as keyof typeof scenes](kaBoom)
// 	);
// }

//kaBoom.go("apartmentScene");
