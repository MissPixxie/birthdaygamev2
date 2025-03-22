import { GameState } from "../utils/types";

export default function globalStateManager() {
	let instance: ReturnType<typeof createInstance> | null = null;

	const gameState: GameState = {
		freezePlayer: false,
		previousScene: "null",
		currentScene: "null",
		hp: 5,
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
