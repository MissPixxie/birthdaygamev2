import { kaBoom } from "./src/kaboomCtx.ts";
import apartmentScene from "./src/scenes/apartmentScnene.ts";
import firstScene from "./src/scenes/firstScene.js";
import { background } from "./src/constants.ts";

kaBoom.loadSprite("spritesheet", "../spritesheet.png", {
	sliceX: 39,
	sliceY: 31,
	anims: {
		"idle-down": 870,
		"walk-down": { from: 871, to: 872, loop: true, speed: 8 },
		"idle-side": 873,
		"walk-side": { from: 874, to: 875, loop: true, speed: 8 },
		"idle-up": 876,
		"walk-up": { from: 877, to: 878, loop: true, speed: 8 },
		balloonmove: { from: 713, to: 712, loop: true, speed: 2 },
		ekkomove: { from: 792, to: 793, loop: true, speed: 3 },
	},
});

kaBoom.loadSprite("ahri", "../ahri.png", {
	sliceX: 2,
	sliceY: 2,
	anims: {
		idle: { from: 0, to: 1, loop: true, speed: 0.7 },
		awake: { from: 2, to: 3, loop: true, speed: 1 },
	},
});

const scenes = {
	firstScene,
	apartmentScene,
};

for (const sceneName in scenes) {
	kaBoom.setBackground(kaBoom.Color.fromHex(background));
	kaBoom.scene(sceneName, () =>
		scenes[sceneName as keyof typeof scenes](kaBoom)
	);
}

kaBoom.go("firstScene");
