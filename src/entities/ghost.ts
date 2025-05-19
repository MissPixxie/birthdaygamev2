import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";

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
		]),
		{
			speed: 20,
			pursuitSpeed: 50,
			range: 100,
		},
		kaBoom.health(10),
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
		console.log(ghost.state);
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
		console.log(ghost.state);
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
			ghost.enterState("attack");
			ghost.play("attack");
			return;
		}
		ghost.enterState("patrol-left");
	});
	ghost.onStateUpdate("attack", () => {
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
	// play hurt anim
	// check last movement state
	// play that state after hurt anim
	ghost.onStateEnter("hurt", async () => {
		await kaBoom.wait(0.1);
		if (ghost.pos.dist(player.pos) < ghost.range) {
			ghost.enterState("attack");
			ghost.play("attack");
			return;
		}
		ghost.enterState("patrol-left");
	});

	ghost.onCollide("player", () => {
		ghost.hurt(1);
	});

	ghost.onCollide("bullet", () => {
		ghost.play("hurt");
	});
}
