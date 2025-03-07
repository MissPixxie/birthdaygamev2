export default function globalStateManager() {
	let instance: ReturnType<typeof createInstance> | null = null;

	function createInstance() {
		let freezePlayer = false;
		let previousScene = "null";
		let currentScene = "null";
		return {
			setFreezePlayer(value: boolean) {
				freezePlayer = value;
			},
			getFreezePlayer: () => freezePlayer,
			setPreviousScene(sceneName: string) {
				previousScene = sceneName;
			},
			getPreviousScene: () => {
				return previousScene;
			},
			setCurrentScene(sceneName: string) {
				currentScene = sceneName;
			},
			getCurrentScene: () => {
				return currentScene;
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
