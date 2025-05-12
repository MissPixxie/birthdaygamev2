import { GameObj, Vec2 } from "kaboom";
import { kaBoom, Kaboom } from "../kaboomCtx";

export function createSparkleEffect(kaBoom: Kaboom, pos: Vec2) {
	return [
		kaBoom.sprite("particle"),
		kaBoom.area({ shape: new kaBoom.Rect(kaBoom.vec2(3, 4), 1, 12) }),
		kaBoom.pos(pos),
		kaBoom.body({ isStatic: true }),
		kaBoom.anchor("center"),
		kaBoom.scale(0.1),
		"particle",
	];
}

export function createGlowEffect(kaBoom: Kaboom, pos: Vec2) {
	// Skapa en "glödande" sprite genom att duplicera och ändra färgen
	return [
		kaBoom.sprite("particle"), // Samma spritebild
		kaBoom.pos(pos), // Samma position som den ursprungliga
		kaBoom.anchor("center"), // Ursprung i mitten
		kaBoom.scale(1.5), // Större för att skapa glöd-effekten
		kaBoom.color(255, 255, 255), // Högsta ljusstyrka (vit)
		kaBoom.opacity(0.3), // Minska opaciteten för en glödande effekt
		kaBoom.z(5), // Lägre z-index än den ursprungliga spriten så den ligger bakom den
	];
}
