import { GameObj, Key } from "kaboom";
import { Kaboom } from "./kaboomCtx";
import { state } from "./stateManager/globalStateManager";

export function playAnimIfNotPlaying(gameObj: GameObj, animName: string) {
	if (gameObj.curAnim() !== animName) gameObj.play(animName);
}

export function keysPressed(kaBoom: Kaboom, keys: Key[]) {
	for (const key of keys) {
		if (kaBoom.isKeyDown(key)) return true;
	}
	return false;
}

export function colorizeBackground(kaBoom: Kaboom, hexColorCode: string) {
	kaBoom.add([
		kaBoom.rect(kaBoom.width(), kaBoom.height()),
		kaBoom.color(kaBoom.Color.fromHex(hexColorCode)),
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
	if (state.current().finalFightActive) {
		k.camScale(k.vec2(1.2));
	} else {
		k.camScale(k.vec2(1.5));
	}
}
