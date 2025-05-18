import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
import { playAnimIfNotPlaying, keysPressed } from "../utils.ts";
import { state } from "../stateManager/globalStateManager.ts";

export default function createBoss(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("boss", { anim: "idle" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.body(),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		kaBoom.opacity(),
		kaBoom.health(50),
		kaBoom.z(1),
		kaBoom.state("idle", [
			"initial",
			"alert",
			"chase",
			"patrol-left",
			"patrol-right",
			"attack",
			"retreat",
		]),
		{
			speed: 70,
			direction: "down",
			isInDialogue: false,
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

	// kaBoom.onUpdate(() => {
	// 	const distance = boss.pos.dist(player.pos);
	// 	if (distance > boss.range) {
	// 		boss.enterState("initial");
	// 	}
	// });
	boss.onStateUpdate("initial", () => {
		if (boss.pos.dist(player.pos) < boss.range) {
			boss.play("initial");
		}
	});

	// boss.onStateEnter("idle", () => {
	// 	if (boss.pos.dist(player.pos) < boss.range) {
	// 		boss.enterState("initial");
	// 		boss.play("initial");
	// 	}
	// });
	boss.onCollide("player", () => {
		boss.hurt(1);
	});
}
