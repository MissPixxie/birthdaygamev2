import { kaBoom } from "./src/kaboomCtx.ts";
import apartmentScene from "./src/scenes/apartmentScene.ts";
import firstScene from "./src/scenes/firstScene.js";
import { background } from "./src/constants.ts";
import apartmentMapData from "./public/map2.json";
import hallwayMapData from "./public/map3.json";
import basementMapData from "./public/map4.json";
import basementRoom1MapData from "./public/map5.json";
import basementRoom2MapData from "./public/map6.json";
import basementRoom3MapData from "./public/map7.json";
import basementRoom4MapData from "./public/map8.json";
import bossMapData from "./public/map9.json";
import hallwayScene from "./src/scenes/hallwayScene.ts";
import { loadSprites } from "./src/ui/loadSprites.ts";
import basementScene from "./src/scenes/basementScene.ts";
import "./src/utils/sidePanelLogic.ts";
import basementRoom1Scene from "./src/scenes/basementRoom1Scene.ts";
import basementRoom2Scene from "./src/scenes/basementRoom2Scene.ts";
import basementRoom3Scene from "./src/scenes/basementRoom3Scene.ts";
import basementRoom4Scene from "./src/scenes/basementRoom4Scene.ts";
import bossScene from "./src/scenes/bossScene.ts";
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

kaBoom.scene("basementRoom2Scene", (previousSceneData) => {
	basementRoom2Scene(kaBoom, basementRoom2MapData, previousSceneData);
});

kaBoom.scene("basementRoom3Scene", (previousSceneData) => {
	basementRoom3Scene(kaBoom, basementRoom3MapData, previousSceneData);
});

kaBoom.scene("basementRoom4Scene", (previousSceneData) => {
	basementRoom4Scene(kaBoom, basementRoom4MapData, previousSceneData);
});

kaBoom.scene("bossScene", (previousSceneData) => {
	bossScene(kaBoom, bossMapData, previousSceneData);
});

loadSprites().then(() => {
	console.log("resurser laddade");
	kaBoom.go("bossScene");
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
