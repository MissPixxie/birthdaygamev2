import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";
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
		kaBoom.health(state.current().playerHp),
		kaBoom.z(1),
		{
			speed: 70,
			direction: "down",
			isInDialogue: false,
			isAttacking: false,
		},
		"player",
	];
}

export function setPlayerMovement(kaBoom: Kaboom, player: GameObj) {
	kaBoom.onKeyDown((key) => {
		if (state.current().freezePlayer) return;

		if (["left"].includes(key) && !keysPressed(kaBoom, ["up", "down"])) {
			player.flipX = true;
			playAnimIfNotPlaying(player, "walk-side");

			player.move(-player.speed, 0);
			player.direction = "left";
			return;
		}
		if (["right"].includes(key) && !keysPressed(kaBoom, ["up", "down"])) {
			player.flipX = false;
			playAnimIfNotPlaying(player, "walk-side");
			player.move(player.speed, 0);
			player.direction = "right";
			return;
		}
		if (["up"].includes(key)) {
			playAnimIfNotPlaying(player, "walk-up");
			player.move(0, -player.speed);
			player.direction = "up";
			return;
		}
		if (["down"].includes(key)) {
			playAnimIfNotPlaying(player, "walk-down");
			player.move(0, player.speed);
			player.direction = "down";
			return;
		}
	});

	kaBoom.onKeyRelease(() => {
		player.stop();
		if (player.direction === "down") {
			if (state.current().playerIsInFightMode) {
				player.play("battle-idle-down");
			} else {
				player.play("idle-down");
			}
			return;
		}
		if (player.direction === "up") {
			if (state.current().playerIsInFightMode) {
				player.play("battle-idle-up");
			} else {
				player.play("idle-up");
			}
			return;
		} else {
			if (state.current().playerIsInFightMode) {
				player.play("battle-idle-side");
			} else {
				player.play("idle-side");
			}
		}
	});

	kaBoom.onKeyPress("shift", () => {
		if (state.current().playerIsInFightMode) {
			state.set("playerIsInFightMode", false);
		} else {
			state.set("playerIsInFightMode", true);
		}
	});

	kaBoom.onKeyPress("space", () => {
		if (!state.current().playerIsInFightMode) {
			return;
		}
		console.log("space pressed");
		state.set("freezePlayer", true);
		if (state.current().freezePlayer)
			kaBoom.add(generateBullet(kaBoom.vec2(player.pos.x, player.pos.y)));
		kaBoom.wait(0.1, () => {
			state.set("freezePlayer", false);
		});
	});
}

function generateBullet(pos: Vec2) {
	return [
		kaBoom.sprite("bullet"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(0, 0), 5, 1) }),
		kaBoom.body({ isStatic: false }),
		kaBoom.pos(pos),
		kaBoom.anchor("center"),
		{
			speed: 70,
		},
		"bullet",
	];
}
