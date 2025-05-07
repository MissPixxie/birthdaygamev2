import { state } from "../stateManager/globalStateManager.ts";

export function addToBackpack(item: string) {
	const currentBackpack = state.current().backpack;
	currentBackpack.push(item);
}

export function getItem(item: string) {
	const backpack = state.current().backpack;
	return backpack.includes(item);
}
