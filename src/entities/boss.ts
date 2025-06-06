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
				boss.enterState("fightMode");
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

	boss.onStateEnter("fightMode", () => {
		boss.play("fightMode");
	});

	boss.onStateUpdate("fightMode", () => {
		boss.move(boss.speed, 0);
	});

	// Removes collision with wall object
	boss.onBeforePhysicsResolve(
		(collision: {
			target: { is: (arg0: string) => any };
			preventResolution: () => void;
		}) => {
			if (collision.target.is("hiddenDoor")) {
				collision.preventResolution();
				//fadeOut();
			}
		}
	);

	// boss.onStateUpdate("OutOfVision", () => {
	// 	const startTime = time();
	// 	const startOpacity = boss!.opacity;

	// 	const elapsedTime = time() - startTime;
	// 	const progress = Math.min(elapsedTime / 2, 1);
	// 	boss.opacity = startOpacity * (1 - progress);
	// });

	// function fadeOut() {
	// 	const startTime = time();
	// 	const startOpacity = boss!.opacity;

	// 	boss!.onUpdate(() => {
	// 		const elapsedTime = time() - startTime;
	// 		const progress = Math.min(elapsedTime / 0.2, 1);
	// 		boss!.opacity = startOpacity * (1 - progress);
	// 	});
	// }
}
