import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";
import { playAnimIfNotPlaying } from "../utils";
import { state } from "../stateManager/globalStateManager";

export default function createGhost(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("ghost", { anim: "move" }),
		kaBoom.area({
			shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 20, 20),
			scale: 1.5,
		}),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: false }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.5),
		kaBoom.offscreen({ distance: 400 }),
		kaBoom.state("patrol-left", [
			"alert",
			"chase",
			"patrol-left",
			"patrol-right",
			"attack",
			"retreat",
			"hurt",
			"dead",
		]),
		{
			speed: 20,
			pursuitSpeed: 50,
			range: 100,
			isHurting: false,
		},
		kaBoom.health(5),
		"ghost",
	];
}

export function setGhostMovement(kaBoom: KaboomCtx, ghost: GameObj) {
	const player = kaBoom.get("player", { recursive: true })[0];

	ghost.onStateEnter("patrol-left", async () => {
		await kaBoom.wait(7);
		if (ghost.state === "patrol-left") ghost.enterState("patrol-right");
	});
	ghost.onStateUpdate("patrol-left", () => {
		if (ghost.isHurting) return;
		if (ghost.pos.dist(player.pos) < ghost.range) {
			ghost.play("alert");
			ghost.enterState("alert");
			return;
		}
		ghost.flipX = true;
		ghost.move(-ghost.speed, 0);
	});
	ghost.onStateEnter("patrol-right", async () => {
		await kaBoom.wait(3);
		if (ghost.state === "patrol-right") ghost.enterState("patrol-left");
	});
	ghost.onStateUpdate("patrol-right", () => {
		if (ghost.isHurting) return;
		if (ghost.pos.dist(player.pos) < ghost.range) {
			ghost.play("alert");
			ghost.enterState("alert");
			return;
		}
		ghost.flipX = false;
		ghost.move(ghost.speed, 0);
	});
	ghost.onStateEnter("alert", async () => {
		await kaBoom.wait(0.1);
		if (ghost.pos.dist(player.pos) < ghost.range) {
			if (ghost.isHurting) {
				ghost.enterState("hurt");
			}
			ghost.enterState("attack");
			ghost.play("attack");
			return;
		}
		ghost.enterState("patrol-left");
	});
	ghost.onStateUpdate("attack", () => {
		if (ghost.isHurting) return;
		if (ghost.pos.dist(player.pos) > ghost.range) {
			ghost.enterState("alert");
			return;
		}
		ghost.flipX = player.pos.x <= ghost.pos.x;
		ghost.moveTo(
			kaBoom.vec2(player.pos.x, player.pos.y + 12),
			ghost.pursuitSpeed
		);
	});

	ghost.onStateEnter("hurt", async () => {
		await kaBoom.wait(0.001);
		ghost.play("hurt");
		await kaBoom.wait(0.09);
		ghost.isHurting = false;
		ghost.enterState("patrol-left");
	});

	ghost.onStateEnter("hurt", async () => {
		await kaBoom.wait(0.001);
		ghost.play("hurt");
		await kaBoom.wait(0.09);
		ghost.isHurting = false;
		ghost.enterState("patrol-left");
	});

	ghost.onStateEnter("dead", () => {
		ghost.play("dead");
		ghost.isHurting = false;
		state.set("isGhostDead", true);
	});

	ghost.onCollide("player", () => {
		ghost.hurt(1);
	});

	ghost.onCollide("bullet", () => {
		console.log(ghost.hp());
		if (ghost.hp() === 0) {
			ghost.enterState("dead");
		} else {
			ghost.hurt(1);
			ghost.isHurting = true;
			ghost.enterState("hurt");
		}
	});
}
