import { GameObj } from "kaboom";

export type GameState = {
	freezePlayer: boolean;
	previousScene: string;
	currentScene: string;
	playerHp: number;
	hasEnteredLivingRoom: boolean;
	isFirstTimeInteracting: boolean;
	collisionWith: "tv" | "bedTable" | "null";
	isGhostDead: boolean;
	isBossDead: boolean;
	finalFightActive: boolean;
	hasEnteredPassPhrase: boolean;
	itemToPickup: Items;
	hasSeenRiddle: boolean;
	talkedToNeighbor: number;
	handedOverDuck: boolean;
	hasSeenSecondDialogue: boolean;
	backpack: string[];
};

export type Items = "key" | "duck" | "weapon" | "null";

export type Entities = {
	player: GameObj | null;
	ahri: GameObj | null;
	ekko: GameObj | null;
	balloon: GameObj | null;
	ghost: GameObj | null;
	boss: GameObj | null;
	hiddenDoor: GameObj | null;
	hiddenDoor2: GameObj | null;
	livingRoom: GameObj | null;
	tv: GameObj | null;
	bedTable: GameObj | null;
	weapon: GameObj | null;
	key: GameObj | null;
	duck: GameObj | null;
	neighborDoor: GameObj | null;
	eyes: GameObj | null;
	particle: GameObj | null;
	particle2: GameObj | null;
};

export const entities: Entities = {
	player: null,
	ahri: null,
	ekko: null,
	balloon: null,
	ghost: null,
	boss: null,
	hiddenDoor: null,
	hiddenDoor2: null,
	livingRoom: null,
	tv: null,
	bedTable: null,
	weapon: null,
	key: null,
	duck: null,
	neighborDoor: null,
	eyes: null,
	particle: null,
	particle2: null,
};

export type MapData = {
	compressionlevel: number;
	editorsettings?: { export: { format: string; target: string } };
	height: number;
	infinite: boolean;
	layers: (
		| {
				data: number[];
				height: number;
				id: number;
				name: string;
				opacity: number;
				type: string;
				visible: boolean;
				width: number;
				x: number;
				y: number;
				draworder?: undefined;
				objects?: undefined;
		  }
		| {
				draworder: string;
				id: number;
				name: string;
				objects: {
					height: number;
					id: number;
					name: string;
					rotation: number;
					type: string;
					visible: boolean;
					width: number;
					x: number;
					y: number;
				}[];
				opacity: number;
				type: string;
				visible: boolean;
				x: number;
				y: number;
				data?: undefined;
				height?: undefined;
				width?: undefined;
		  }
		| {
				draworder: string;
				id: number;
				name: string;
				objects: {
					height: number;
					id: number;
					name: string;
					point: boolean;
					rotation: number;
					type: string;
					visible: boolean;
					width: number;
					x: number;
					y: number;
				}[];
				opacity: number;
				type: string;
				visible: boolean;
				x: number;
				y: number;
				data?: undefined;
				height?: undefined;
				width?: undefined;
		  }
	)[];
	nextlayerid: number;
	nextobjectid: number;
	orientation: string;
	renderorder: string;
	tiledversion: string;
	tileheight: number;
	tilesets: {
		columns: number;
		firstgid: number;
		image: string;
		imageheight: number;
		imagewidth: number;
		margin: number;
		name: string;
		spacing: number;
		tilecount: number;
		tileheight: number;
		tilewidth: number;
	}[];
	tilewidth: number;
	type: string;
	version: string;
	width: number;
};

const mapData = (await import("../../public/map3.json")).default;

export type Layers = (typeof mapData)["layers"];
