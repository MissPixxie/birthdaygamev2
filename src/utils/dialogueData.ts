import { state } from "../stateManager/globalStateManager";
import { getItem } from "./backpack";

export const dialogueData = {
	firstPrompt:
		"Grattis på födelsedagen älskling!" +
		"<br>" +
		"<br>" +
		"Du kan vara lite svår att köpa present till ibland men du tycker om klurigheter så jag gjorde en spel till dig som du måste ta dig igenom för att hitta din slutgiltiga present." +
		"<br>" +
		"<br>" +
		"Jag älskar dig ♥︎",
	secondPrompt: "hello",
	computer: "Biip boop...",
	ekko: "Promenad? ♥︎ ",
	ahri: "Vad är din favorit aktivitet?",
	tv:
		"<i>" +
		"History channel." +
		"<br>" +
		"<br>" +
		"Blaise de Vigenère, född 5 april 1523, död 1596, var en fransk diplomat och...." +
		"</i>",
	livingRoom: "OH NO!" + "<br>" + "Ekko och Ahri har blivit kidnappade",
	help: "Detta är en hjälp sida",
	keyMissing: "Dörren är låst....",
	passPhrase: "Vad är det hemliga ordet?",
	enterPassPhrase: "slå in lösenord",
	riddle: "......",
	outOfGameRiddle:
		"Här tar spelet paus ett tag, nu krävs en handling - inget drag." +
		"<br>" +
		"Vad som väntar ser du ej här, sök i din värld, för svaret är där" +
		"<br>" +
		"Men glöm ej spelet, din resa är lång - när du har funnit, fortsätt där du en gång kom ifrån",
};

// export const neighborDialogue = [
// 	"Ughm....",
// 	"Våra hundar har blivit kidnappade, har du sett något?",
// 	"Jag snackar inte gratis mannen...",
// ];

// export const neighborDialogue2 = [
// 	"Vad har du åt mig?",
// 	"Sa ju att jag inte snackar gratis bror",
// 	getItem("duck")
// 		? "Jag såg Torsten med dom vid en stor gräsplätt där Carl bor, kommer inte ihåg helt va rätt bäng"
// 		: "Kom tillbaka när du har något vettigt åt mig",
// ];

// export const neighborDialogue3 = ["Gräsplätt...Carl...ugh..."];

export const neighborDialogue = {
	firstDialogue: [
		"Ughm....",
		"Våra hundar har blivit kidnappade, har du sett något?",
		"Jag snackar inte gratis mannen...",
	],
	secondDialogueNoDuck: [
		"Vad har du åt mig?",
		"Sa ju att jag inte snackar gratis bror",
		"Kom tillbaka när du har något vettigt åt mig",
	],
	secondDialogueGotDuck: [
		"Vad har du åt mig?",
		"FUUUUUCK YEAAAHH, okej såhär",
		"Jag såg Torsten med dom vid en stor gräsplätt där Carl bor, '<br>' kommer inte ihåg helt va rätt bäng",
	],
	thirdDialogue: ["Gräsplätt...Carl...ugh..."],
};
