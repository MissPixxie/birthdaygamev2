import kaboom from "kaboom";

export type Kaboom = typeof kaBoom;

export const kaBoom = kaboom({
	global: false,
	touchToMouse: true,
	canvas: document.getElementById("game") as HTMLCanvasElement,
});
