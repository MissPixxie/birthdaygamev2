let currentActivePanel: "dialogue" | "help" | "backpack" | null = null;

export function setCurrentActivePanel(panel: typeof currentActivePanel) {
	currentActivePanel = panel;
}

export function getCurrentActivePanel() {
	return currentActivePanel;
}
