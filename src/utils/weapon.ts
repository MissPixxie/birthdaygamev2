import { GameObj, Vec2 } from "kaboom";
import { kaBoom } from "../kaboomCtx";
import { state } from "../stateManager/globalStateManager";

export function shoot(map: GameObj, onShootEnd: CallableFunction) {
	const player = kaBoom.get("player", { recursive: true })[0];
	const ghost = kaBoom.get("ghost", { recursive: true })[0];
	const boss = kaBoom.get("boss", { recursive: true })[0];
	const bulletXPOS = player.pos.x;
	const bulletYPOS = player.pos.y;

	let direction: Vec2;
	let offsetX = 0;

	// Check player direction so bullet moves in right direction
	if (player.direction === "left") {
		direction = kaBoom.vec2(-1, 0);
		offsetX = -5;
	} else if (player.direction === "right") {
		direction = kaBoom.vec2(1, 0);
		offsetX = 6;
	} else if (player.direction === "up") {
		direction =
			player.lastHorizontalDirection === "left"
				? kaBoom.vec2(-1, 0)
				: kaBoom.vec2(1, 0);
		offsetX = player.lastHorizontalDirection === "left" ? -5 : 6;
	} else if (player.direction === "down") {
		direction =
			player.lastHorizontalDirection === "left"
				? kaBoom.vec2(-1, 0)
				: kaBoom.vec2(1, 0);
		offsetX = player.lastHorizontalDirection === "left" ? -5 : 6;
	} else {
		direction = kaBoom.vec2(0, 0);
		offsetX = 0;
	}
	const bullet = map.add(createBullet(bulletXPOS, bulletYPOS, offsetX));

	// Bullet movement
	bullet.onUpdate(() => {
		bullet.pos.x += direction.x * bullet.speed * kaBoom.dt();
		bullet.pos.y += direction.y * bullet.speed * kaBoom.dt();
	});

	// Removes collision with player object
	bullet.onBeforePhysicsResolve((collision) => {
		if (collision.target.is("player")) {
			collision.preventResolution();
		}
	});

	// Removes ghost and bullet objects in case of collision
	bullet.onCollide((object) => {
		if (object.is("player")) {
			return;
		}
		if (object.is("ghost")) {
			ghost.destroy();
			bullet.destroy();
			state.set("isGhostDead", true);
		} else if (object.is("boss")) {
			boss.destroy();
			bullet.destroy();
			state.set("isBossDead", true);
		} else {
			bullet.destroy();
		}
	});

	onShootEnd();
}

// Create bullet object
function createBullet(posX: number, posY: number, offsetX: number) {
	return [
		kaBoom.sprite("bullet"),
		kaBoom.area({
			shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12),
		}),
		kaBoom.body(),
		kaBoom.pos(posX + offsetX, posY + 1),
		kaBoom.offscreen({ destroy: true }),
		kaBoom.anchor("center"),
		kaBoom.z(10),
		{
			speed: 80,
		},
		"bullet",
	];
}
