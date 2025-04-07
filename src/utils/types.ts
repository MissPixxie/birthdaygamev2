import { GameObj } from "kaboom";

export type GameState = {
	freezePlayer: boolean;
	previousScene: string;
	currentScene: string;
	playerHp: number;
	playerIsInFightMode: boolean;
	hasEnteredLivingRoom: boolean;
};

export type Entities = {
	player: GameObj | null;
	ahri: GameObj | null;
	ekko: GameObj | null;
	balloon: GameObj | null;
	ghost: GameObj | null;
	livingRoom: GameObj | null;
};

export const entities: Entities = {
	player: null,
	ahri: null,
	ekko: null,
	balloon: null,
	ghost: null,
	livingRoom: null,
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
