import { GameState } from "../utils/types";

function initStateManager() {
	const gameState: GameState = {
		freezePlayer: false,
		previousScene: "null",
		currentScene: "null",
		playerHp: 5,
		playerIsInFightMode: false,
		hasEnteredLivingRoom: false,
	};

	return {
		current() {
			return { ...gameState };
		},
		set<T extends keyof GameState>(property: T, value: GameState[T]) {
			gameState[property] = value;
		},
		changeScene(newScene: string) {
			gameState.previousScene = gameState.currentScene;
			gameState.currentScene = newScene;
		},
	};
}

export const state = initStateManager();

export default function globalStateManager() {
	let instance: ReturnType<typeof createInstance> | null = null;

	const gameState: GameState = {
		freezePlayer: false,
		previousScene: "null",
		currentScene: "null",
		playerHp: 5,
		playerIsInFightMode: false,
		hasEnteredLivingRoom: false,
	};

	function createInstance() {
		// let freezePlayer = false;
		// let previousScene = "null";
		// let currentScene = "null";
		return {
			setFreezePlayer(value: boolean) {
				gameState.freezePlayer = value;
			},
			getFreezePlayer: () => gameState.freezePlayer,
			setPreviousScene(sceneName: string) {
				gameState.previousScene = sceneName;
			},
			getPreviousScene: () => {
				return gameState.previousScene;
			},
			setCurrentScene(sceneName: string) {
				gameState.currentScene = sceneName;
			},
			getCurrentScene: () => {
				return gameState.currentScene;
			},
		};
	}

	return {
		getInstance() {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		},
	};
}
