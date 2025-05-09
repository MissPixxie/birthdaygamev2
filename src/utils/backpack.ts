import { state } from "../stateManager/globalStateManager.ts";

export function addToBackpack(item: string) {
	console.log(item);
	const currentBackpack = state.current().backpack;
	currentBackpack.push(item);

	const itemImg = document.getElementById(item) as HTMLElement;

	itemImg.style.display = "block";
}

export function getItem(item: string) {
	const backpack = state.current().backpack;
	return backpack.includes(item);
}
