import { GameObj, Key } from "kaboom";
import { Kaboom } from "./kaboomCtx";

export function playAnimIfNotPlaying(gameObj: GameObj, animName: string) {
	if (gameObj.curAnim() !== animName) gameObj.play(animName);
}

export function keysPressed(kaBoom: Kaboom, keys: Key[]) {
	for (const key of keys) {
		console.log(key);
		if (kaBoom.isKeyDown(key)) return true;
	}
	return false;
}

export function colorizeBackground(
	kaBoom: Kaboom,
	r: number,
	g: number,
	b: number
) {
	kaBoom.add([
		kaBoom.rect(kaBoom.width(), kaBoom.height()),
		kaBoom.color(r, g, b),
		kaBoom.fixed(),
	]);
}

// CAMERA //
export function setCamScale(k: Kaboom) {
	const resizeFactor = k.width() / k.height();
	if (resizeFactor < 1) {
		k.camScale(k.vec2(1));
		return;
	}

	k.camScale(k.vec2(1.5));
}
