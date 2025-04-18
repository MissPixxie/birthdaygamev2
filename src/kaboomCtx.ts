import kaboom from "kaboom";

export const kaBoom = kaboom({
	global: true,
	touchToMouse: true,
	canvas: document.getElementById("game") as HTMLCanvasElement,
});

export type Kaboom = typeof kaBoom;
