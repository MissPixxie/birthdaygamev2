import { kaBoom } from "../kaboomCtx";

export async function loadSprites() {
	console.log("Laddar sprites...");
	try {
		console.log("Laddar spritesheet...");
		await kaBoom.loadSprite("spritesheet", "../spritesheet.png", {
			sliceX: 39,
			sliceY: 31,
			anims: {
				"idle-down": 870,
				"walk-down": { from: 871, to: 872, loop: true, speed: 8 },
				"idle-side": 873,
				"walk-side": { from: 874, to: 875, loop: true, speed: 8 },
				"idle-up": 876,
				"walk-up": { from: 877, to: 878, loop: true, speed: 8 },
				"battle-idle-down": 881,
				"battle-walk-down": {
					from: 882,
					to: 883,
					loop: true,
					speed: 8,
				},
				"battle-idle-side": 879,
				"battle-walk-side": {
					from: 880,
					to: 881,
					loop: true,
					speed: 8,
				},
				"battle-idle-up": 884,
				"battle-walk-up": {
					from: 885,
					to: 886,
					loop: true,
					speed: 8,
				},
				balloonmove: { from: 713, to: 712, loop: true, speed: 2 },
				ekkomove: { from: 792, to: 793, loop: true, speed: 3 },
			},
		});
		console.log("Spritesheet laddad!");

		console.log("Laddar ahri sprite...");
		await kaBoom.loadSprite("ahri", "../ahri.png", {
			sliceX: 2,
			sliceY: 2,
			anims: {
				idle: { from: 0, to: 1, loop: true, speed: 0.7 },
				awake: { from: 2, to: 3, loop: true, speed: 1 },
			},
		});
		console.log("Ahri sprite laddad!");

		console.log("Laddar ghost sprite...");
		await kaBoom.loadSprite("ghost", "../ghostMovement.png", {
			sliceX: 7,
			anims: {
				move: {
					from: 0,
					to: 2,
					loop: true,
					speed: 2,
					pingpong: true,
				},
				alert: 3,
				attack: {
					from: 4,
					to: 6,
					loop: true,
					speed: 2,
					pingpong: true,
				},
			},
		});
		console.log("Ghost sprite laddad!");

		console.log("Laddar maps...");
		await kaBoom.loadSprite("apartmentMap", "../map2.png");
		await kaBoom.loadSprite("hallwayMap", "../map3.png");
		await kaBoom.loadSprite("basementMap", "../map4.png");
		console.log("map sprites laddade!");

		console.log("Laddar bullet sprite...");
		await kaBoom.loadSprite("bullet", "../bullet.png");

		await kaBoom.loadSprite("tv", "../tvAnim.png", {
			sliceX: 1,
			sliceY: 2,
			anims: {
				closed: 0,
				open: 1,
			},
		});

		await kaBoom.loadSprite("key", "../key.png", {
			sliceX: 2,
			sliceY: 1,
			anims: {
				show: 0,
				hide: 1,
			},
		});

		await kaBoom.loadSprite("duck", "../duck.png", {
			sliceX: 2,
			sliceY: 1,
			anims: {
				show: 0,
				hide: 1,
			},
		});

		await kaBoom.loadSprite("neighborDoor", "../doorAnim.png", {
			sliceX: 4,
			sliceY: 2,
			anims: {
				closed: 0,
				open: { from: 4, to: 7, loop: true, speed: 1 },
			},
		});

		await kaBoom.loadSprite("eyes", "../eyes.png", {
			sliceX: 2,
			sliceY: 1,
			anims: {
				show: 0,
				hide: 1,
			},
		});

		console.log("Alla resurser är laddade!");
	} catch (error) {
		console.error("Fel vid laddning av resurser:", error);
	}
}
