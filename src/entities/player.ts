import { GameObj, Vec2 } from "kaboom";
import { Kaboom } from "../kaboomCtx";
import { playAnimIfNotPlaying, keysPressed } from "../utils.ts";
import { state } from "../stateManager/globalStateManager.ts";

export default function createPlayer(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("spritesheet", { anim: "idle-down" }),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.body(),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		kaBoom.opacity(),
		kaBoom.health(5),
		kaBoom.z(1),
		{
			speed: 70,
			direction: "down",
			isInDialogue: false,
			isAttacking: false,
			lastHorizontalDirection: "right",
		},
		"player",
	];
}

export function setPlayerMovement(kaBoom: Kaboom, player: GameObj) {
	kaBoom.onKeyDown((key) => {
		if (["left"].includes(key) && !keysPressed(kaBoom, ["up", "down"])) {
			player.flipX = true;
			if (!player.isAttacking) {
				playAnimIfNotPlaying(player, "walk-side");
			} else {
				playAnimIfNotPlaying(player, "battle-walk-side");
			}
			player.move(-player.speed, 0);
			player.direction = "left";
			player.lastHorizontalDirection = "left";
			return;
		}
		if (["right"].includes(key) && !keysPressed(kaBoom, ["up", "down"])) {
			player.flipX = false;
			if (!player.isAttacking) {
				playAnimIfNotPlaying(player, "walk-side");
			} else {
				playAnimIfNotPlaying(player, "battle-walk-side");
			}
			player.move(player.speed, 0);
			player.direction = "right";
			player.lastHorizontalDirection = "right";
			return;
		}
		if (["up"].includes(key)) {
			if (!player.isAttacking) {
				playAnimIfNotPlaying(player, "walk-up");
			} else {
				playAnimIfNotPlaying(player, "battle-walk-up");
			}
			player.move(0, -player.speed);
			player.direction = "up";
			return;
		}
		if (["down"].includes(key)) {
			if (!player.isAttacking) {
				playAnimIfNotPlaying(player, "walk-down");
			} else {
				playAnimIfNotPlaying(player, "battle-walk-down");
			}
			player.move(0, player.speed);
			player.direction = "down";
			return;
		}
	});

	kaBoom.onKeyRelease(() => {
		player.stop();
		if (player.direction === "down") {
			player.play("idle-down");
			return;
		}
		if (player.direction === "up") {
			player.play("idle-up");
			return;
		} else {
			player.play("idle-side");
		}
	});
}

export function playShootAnimation(player: GameObj) {
	if (
		["left", "right"].includes(player.direction) ||
		["left", "right"].includes(player.lastHorizontalDirection)
	) {
		playAnimIfNotPlaying(player, "battle-idle-side");
	} else if (player.direction === "up") {
		playAnimIfNotPlaying(player, "battle-idle-up");
	} else if (player.direction === "down") {
		playAnimIfNotPlaying(player, "battle-idle-down");
	}
}
