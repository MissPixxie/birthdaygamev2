import { GameObj, Vec2 } from "kaboom";
import { kaBoom } from "../kaboomCtx";

export function shoot(map: GameObj) {
	const player = kaBoom.get("player", { recursive: true })[0];
	const ghost = kaBoom.get("ghost", { recursive: true })[0];
	const bulletXPOS = player.pos.x;
	const bulletYPOS = player.pos.y;

	let direction: Vec2;
	let offsetX = 0;

	if (player.direction === "left") {
		player.play("battle-idle-side");
		direction = kaBoom.vec2(-1, 0);
		offsetX = -5;
	} else if (player.direction === "right") {
		player.play("battle-idle-side");
		direction = kaBoom.vec2(1, 0);
		offsetX = 6;
	} else if (player.direction === "up") {
		return;
	} else if (player.direction === "down") {
		return;
	} else {
		direction = kaBoom.vec2(0, 0);
		offsetX = 0;
	}

	const bullet = map.add(createBullet(bulletXPOS, bulletYPOS, offsetX));

	bullet.onUpdate(() => {
		bullet.pos.x += direction.x * bullet.speed * kaBoom.dt(); // Rörelse i x-led
		bullet.pos.y += direction.y * bullet.speed * kaBoom.dt(); // Rörelse i y-led
	});

	bullet.onBeforePhysicsResolve((collision) => {
		if (collision.target.is("player")) {
			collision.preventResolution();
		}
	});

	bullet.onCollide((object) => {
		if (object.is("player")) {
			return;
		}
		if (object.is("ghost")) {
			ghost.destroy();
			bullet.destroy();
		} else {
			bullet.destroy();
		}
	});
}

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
