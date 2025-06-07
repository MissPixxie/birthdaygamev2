import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { playAnimIfNotPlaying, keysPressed } from "../utils.ts";
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
			speed: 50,
			direction: "down",
			isAttacking: false,
			range: 70,
		},
		"boss",
	];
}

export function setBossMovement(boss: GameObj | null) {
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
			fightModeMovement(boss);
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

	// boss.onStateEnter("fightMode", async () => {
	// 	await kaBoom.wait(0.1);
	// 	state.set("finalFightActive", true);
	// 	boss.flipX = false;
	// 	const hiddenDoor2 = kaBoom.get("hiddenDoor", { recursive: true })[0];
	// 	boss.pos = hiddenDoor2.pos;
	// 	boss.play("fightMode");
	// });

	// boss.onStateUpdate("fightMode", () => {
	// 	boss.move(-boss.speed, 0);
	// 	if (boss.hp() < 0) {
	// 		boss.destroy();
	// 		state.set("finalFightActive", false);
	// 		state.set("isBossDead", true);
	// 	}
	// });

	// boss.onStateEnter("fightMode-left", async () => {
	// 	await kaBoom.wait(7);
	// 	if (boss.state === "fightMode-left") boss.enterState("fightMode-right");
	// });
	// boss.onStateUpdate("fightMode-left", () => {
	// 	if (boss.isHurting) return;
	// 	boss.flipX = true;
	// 	boss.move(-boss.speed, 0);
	// });
	// boss.onStateEnter("fightMode-right", async () => {
	// 	await kaBoom.wait(3);
	// 	if (boss.state === "fightMode-right") boss.enterState("fightMode-left");
	// });
	// boss.onStateUpdate("fightMode-right", () => {
	// 	if (boss.isHurting) return;
	// 	boss.flipX = false;
	// 	boss.move(boss.speed, 0);
	// });

	function fightModeMovement(boss: GameObj) {
		if (!state.current().finalFightActive) {
			return;
		}
		boss.enterState("fightMode");
		boss.onStateEnter("fightMode", async () => {
			await kaBoom.wait(0.1);
			state.set("finalFightActive", true);
			boss.flipX = false;
			const hiddenDoor2 = kaBoom.get("hiddenDoor", {
				recursive: true,
			})[0];
			boss.pos = hiddenDoor2.pos;
			boss.play("fightMode");
		});

		boss.onStateUpdate("fightMode", () => {
			boss.move(-boss.speed, 0);
			if (boss.hp() < 0) {
				boss.destroy();
				state.set("finalFightActive", false);
				state.set("isBossDead", true);
			}
		});

		boss.onStateEnter("fightMode-left", async () => {
			await kaBoom.wait(7);
			if (boss.state === "fightMode-left")
				boss.enterState("fightMode-right");
		});
		boss.onStateUpdate("fightMode-left", () => {
			if (boss.isHurting) return;
			boss.flipX = true;
			boss.move(-boss.speed, 0);
		});
		boss.onStateEnter("fightMode-right", async () => {
			await kaBoom.wait(3);
			if (boss.state === "fightMode-right")
				boss.enterState("fightMode-left");
		});
		boss.onStateUpdate("fightMode-right", () => {
			if (boss.isHurting) return;
			boss.flipX = false;
			boss.move(boss.speed, 0);
		});
	}
	// Removes collision with wall object
	boss.onBeforePhysicsResolve(
		(collision: {
			target: { is: (arg0: string) => any };
			preventResolution: () => void;
		}) => {
			if (collision.target.is("hiddenDoor")) {
				collision.preventResolution();
			}
		}
	);
}
