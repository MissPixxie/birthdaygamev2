import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager.ts";
import { displayDialogue } from "../utils/dialogueLogic.ts";
import { dialogueData } from "../utils/dialogueData.ts";

export default function createBoss(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("boss", { anim: "idle" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.body(),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		kaBoom.opacity(1),
		kaBoom.health(5),
		kaBoom.z(1),
		kaBoom.state("idle", [
			"idle",
			"alert",
			"fightMode-left",
			"fightMode-right",
			"attack",
			"retreat",
			"walk",
			"fightMode",
			"OutOfVision",
		]),
		{
			speed: 40,
			direction: "down",
			isAttacking: false,
			range: 70,
		},
		"boss",
	];
}

// export function createFightModeBoss(kaBoom: Kaboom, pos: Vec2) {
// 	return [
// 		kaBoom.sprite("boss", { anim: "fightMode" }),
// 		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
// 		kaBoom.body(),
// 		kaBoom.pos(pos),
// 		kaBoom.anchor("center"),
// 		kaBoom.opacity(1),
// 		kaBoom.health(5),
// 		kaBoom.z(1),
// 		kaBoom.state("idle", [
// 			"idle",
// 			"alert",
// 			"fightMode-left",
// 			"fightMode-right",
// 			"attack",
// 			"retreat",
// 			"walk",
// 			"fightMode",
// 			"OutOfVision",
// 		]),
// 		{
// 			speed: 50,
// 			direction: "down",
// 			isAttacking: false,
// 			range: 70,
// 		},
// 		"boss",
// 	];
// }

export function setBossMovement(boss: GameObj | null, map: GameObj) {
	const player = kaBoom.get("player", { recursive: true })[0]; // Hämta spelaren
	if (!boss || !player) {
		console.error("Can't find boss or player");
		return;
	}
	boss.enterState("idle");

	boss.onStateEnter("idle", () => {
		boss.play("idle");
	});

	boss.onStateUpdate("idle", () => {
		if (boss.pos.dist(player.pos) < boss.range) {
			boss.enterState("alert");
			displayDialogue(dialogueData["boss"], () => {
				state.set("freezePlayer", false);
				boss.enterState("walk");
			});
			return;
		}
	});

	boss.onStateEnter("walk", () => {
		boss.flipX = true;
		boss.play("walk");
	});

	boss.onStateUpdate("walk", () => {
		boss.move(boss.speed, 0);
		const hiddenDoor = kaBoom.get("hiddenDoor", { recursive: true })[0];

		if (Math.floor(boss.pos.x) === Math.floor(hiddenDoor.pos.x)) {
			state.set("finalFightActive", true);
			fightModeMovement(boss, map);
			boss.enterState("fightMode");
		}
	});

	boss.onStateEnter("alert", () => {
		boss.play("alert");
	});

	boss.onStateUpdate("alert", () => {
		if (boss.pos.dist(player.pos) > boss.range) {
			boss.enterState("idle");
			return;
		}
	});

	// FIGHT MOVEMENT
	function fightModeMovement(boss: GameObj, map: GameObj) {
		if (!state.current().finalFightActive) {
			return;
		}
		//boss.enterState("fightMode");
		boss.onStateEnter("fightMode", async () => {
			await kaBoom.wait(0.1);
			boss.flipX = false;
			// const hiddenDoor2 = kaBoom.get("hiddenDoor", {
			// 	recursive: true,
			// })[0];
			// boss.pos = hiddenDoor2.pos;
			boss.play("fightMode");
		});

		boss.onStateUpdate("fightMode", () => {
			console.log(boss.pos.y);
			kaBoom.tween(
				kaBoom.camScale(),
				kaBoom.vec2(1.0), // eller 0.8 för ännu mer utzoom
				0.5,
				(newScale) => {
					kaBoom.camScale(newScale);
				},
				kaBoom.easings.easeOutSine
			);
			kaBoom.wait(3, () => {
				dropCigarettes(map);
			});
			boss.pos.y = 300;
			if (Math.floor(boss.pos.x) <= 280) {
				boss.flipX = true;
				boss.move(boss.speed, 0);
			} else if (Math.floor(boss.pos.x) >= 500) {
				boss.flipX = false;
				boss.move(-boss.speed, 0);
			} else {
				if (boss.flipX) {
					boss.move(boss.speed, 0);
				} else {
					boss.move(-boss.speed, 0);
				}
			}
			if (boss.hp() < 0) {
				boss.destroy();
				state.set("finalFightActive", false);
				state.set("isBossDead", true);
			}
		});

		// boss.onStateEnter("fightMode-left", () => {
		// 	if (boss.state === "fightMode-left")
		// 		boss.enterState("fightMode-right");
		// });
		// boss.onStateUpdate("fightMode-left", () => {
		// 	if (boss.isHurting) return;
		// 	if (
		// 		boss.onCollide("leftWall", () => {
		// 			boss.enterState("fightMode-right");
		// 		})
		// 	)
		// 		boss.flipX = true;
		// 	boss.move(-boss.speed, 0);
		// });
		// boss.onStateEnter("fightMode-right", () => {
		// 	if (boss.state === "fightMode-right")
		// 		boss.enterState("fightMode-left");
		// });
		// boss.onStateUpdate("fightMode-right", () => {
		// 	if (boss.isHurting) return;
		// 	if (
		// 		boss.onCollide("rightWall", () => {
		// 			boss.enterState("fightMode-left");
		// 		})
		// 	)
		// 		boss.flipX = false;
		// 	boss.move(boss.speed, 0);
		// });
		// boss.onBeforePhysicsResolve((collision) => {
		// 	if (collision.target.is("player")) {
		// 		collision.preventResolution();
		// 	}
		// });
	}

	// Removes collision with wall object
	boss.onBeforePhysicsResolve(
		(collision: {
			target: { is: (arg0: string) => any };
			preventResolution: () => void;
		}) => {
			if (collision.target.is("rightWall")) {
				collision.preventResolution();
			}
		}
	);
}

export function dropCigarettes(map: GameObj) {
	const player = kaBoom.get("player", { recursive: true })[0];
	const boss = kaBoom.get("boss", { recursive: true })[0];
	const cigaretteXPOS = boss.pos.x;
	const cigaretteYPOS = boss.pos.y;

	const cigarette = map.add(createCigarette(cigaretteXPOS, cigaretteYPOS));

	// Bullet movement
	cigarette.onUpdate(() => {
		cigarette.pos.y += cigarette.speed * kaBoom.dt();
	});

	// Removes collision with boss object
	cigarette.onBeforePhysicsResolve((collision) => {
		if (collision.target.is("boss")) {
			collision.preventResolution();
		}
	});

	cigarette.onCollide((object) => {
		if (object.is("boss")) {
			return;
		}
		if (object.is("player")) {
			player.hurt(1);
			console.log(player.hp());
			if (player.hp() === 0) {
				player.destroy();
			}
			cigarette.destroy();
		} else {
			cigarette.destroy();
		}
	});
}

// Create bullet object
function createCigarette(posX: number, posY: number) {
	return [
		kaBoom.sprite("cigarette"),
		kaBoom.area({
			shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12),
		}),
		kaBoom.body(),
		kaBoom.pos(posX, posY + 1),
		kaBoom.offscreen({ destroy: true }),
		kaBoom.anchor("center"),
		kaBoom.z(10),
		kaBoom.scale(0.3),
		{
			speed: 80,
		},
		"cigarette",
	];
}
