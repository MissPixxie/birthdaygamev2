import { kaBoom } from "./src/kaboomCtx.ts";
import apartmentScene from "./src/scenes/apartmentScene.ts";
import firstScene from "./src/scenes/firstScene.js";
import { background } from "./src/constants.ts";
import apartmentMapData from "./public/map2.json";
import hallwayMapData from "./public/map3.json";
import basementMapData from "./public/map4.json";
import basementRoom1MapData from "./public/map5.json";
import hallwayScene from "./src/scenes/hallwayScene.ts";
import { loadSprites } from "./src/ui/loadSprites.ts";
import basementScene from "./src/scenes/basementScene.ts";
import "./src/utils/sidePanelLogic.ts";
import basementRoom1Scene from "./src/scenes/basementRoom1Scene.ts";
// import { getCurrentActivePanel } from "./src/utils/uiManager.ts";
// import { closeBackpack, closeHelp } from "./src/utils/sidePanelLogic.ts";
// import { closeDialogue } from "./src/utils/dialogueLogic.ts";

kaBoom.scene("apartmentScene", (previousSceneData) => {
	apartmentScene(kaBoom, apartmentMapData, previousSceneData);
});

kaBoom.scene("hallwayScene", (previousSceneData) => {
	hallwayScene(kaBoom, hallwayMapData, previousSceneData);
});

kaBoom.scene("basementScene", (previousSceneData) => {
	basementScene(kaBoom, basementMapData, previousSceneData);
});

kaBoom.scene("basementRoom1Scene", (previousSceneData) => {
	basementRoom1Scene(kaBoom, basementRoom1MapData, previousSceneData);
});

loadSprites().then(() => {
	console.log("resurser laddade");
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
