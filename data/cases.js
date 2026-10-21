export const cases = [
  {
    id: 1,
    name: "Der verschwundene Titel",
    subtitle: "Vier Fotos. Ein fehlender Titel.",
    time: "etwa 10 Min.",
    max: 5,
    icon: "search",
  },
  {
    id: 2,
    name: "Die Bilder im Kopf",
    subtitle: "Wählt Bilder. Prüft eine Nachricht.",
    time: "etwa 20 Min.",
    max: 5,
    icon: "pictures",
  },
  {
    id: 3,
    name: "Ein Kontinent, viele Gesichter",
    subtitle: "Drei Orte. Drei kleine Rätsel.",
    time: "etwa 26 Min.",
    max: 15,
    icon: "map",
  },
  {
    id: 4,
    name: "Der letzte Ermittlungsbericht",
    subtitle: "Vergleicht Bilder. Zieht eure Schlüsse.",
    time: "etwa 9 Min.",
    max: 5,
    icon: "report",
  },
  {
    id: 5,
    name: "Die Spur in die Zukunft",
    subtitle: "Vier Nachrichten warten auf euch.",
    time: "10–15 Min.",
    max: 5,
    icon: "compass",
    bonus: true,
  },
];
// IDs and motifs are shared by cases 002, 004 and the paper materials.
export const photos = [
  {
    id: 1,
    key: "savanna",
    title: "Savanne mit Wildtieren",
    location: "Kenia",
    motif: "Weite Graslandschaft mit Wildtieren",
  },
  {
    id: 2,
    key: "desert",
    title: "Wüste",
    location: "Namib, Namibia",
    motif: "Hohe Sanddünen",
  },
  {
    id: 3,
    key: "forest",
    title: "Tropischer Regenwald",
    location: "Kongobecken",
    motif: "Dichter, grüner Wald",
  },
  {
    id: 4,
    key: "lagos",
    title: "Moderne Großstadt",
    location: "Lagos, Nigeria",
    motif: "Hohe Häuser und Straßen",
  },
  {
    id: 5,
    key: "farm",
    title: "Landwirtschaft",
    location: "Ghana",
    motif: "Landwirtschaftliche Arbeit auf einem Feld",
  },
  {
    id: 6,
    key: "atlas",
    title: "Verschneites Gebirge",
    location: "Atlasgebirge, Marokko",
    motif: "Schnee auf hohen Bergen",
  },
  {id:7,key:"rural",title:"Lehmhäuser mit Strohdächern",location:"Ghana",motif:"Wohnhäuser aus Lehm mit Strohdächern"},
  {id:8,key:"mine",title:"Bergbau",location:"Phalaborwa, Südafrika",motif:"Ein Tagebau mit stufenförmigen Hängen"},
  {id:9,key:"classroom",title:"Schule mit einfacher Ausstattung",location:"Nigeria",motif:"Ein Klassenraum mit einfachen Möbeln"},
  {
    id: 10,
    key: "market",
    title: "Alltag in der Stadt",
    location: "Accra, Ghana",
    motif: "Menschen auf einem Markt",
  },
  { id:11,key:"carry",title:"Wasser holen und transportieren",location:"Uganda",motif:"Wasser wird in einem Kanister getragen" },
  { id:12,key:"healthpost",title:"Gesundheitsstation",location:"Dankh Sene, Senegal",motif:"Eine kleine medizinische Einrichtung" },
];
// Fictional editorial claims are deliberately distinct from factual photo titles.
export const editorialClaims = [
 {id:"income",text:"In Afrika leben alle Menschen in Armut."},
 {id:"homes",text:"Dort wohnen alle Menschen in einfachen Hütten."},
 {id:"work",text:"In Afrika arbeiten Menschen nur in der Landwirtschaft."},
 {id:"education",text:"In Afrika gibt es keine Schulbildung."},
 {id:"health",text:"Krankenhäuser gibt es dort kaum."},
 {id:"water",text:"Überall fehlt sauberes Wasser."},
];
export const clues = [
  {key:"water", name:"Wasser und Regen", text:"Eine Gruppe plant den Anbau. Sie fragt: Wie viel Wasser brauchen die Pflanzen, und wann regnet es?", motif:"Ein abgeerntetes Hirsefeld in der Trockenzeit", location:"Sahelzone, Niger", questionId:"nature"},
  {key:"people", name:"Mehr Menschen in der Stadt", text:"Eine Stadt plant neue Wohnungen und Schulen für zuziehende Menschen. Welche Chancen und welcher zusätzliche Bedarf entstehen?", motif:"Hochhäuser einer Großstadt", location:"Nairobi, Kenia", questionId:"population"},
  {key:"economy", name:"Kakao verarbeiten", text:"Ein Betrieb prüft, welche Produkte er aus Kakaobohnen herstellen und verkaufen kann. Was braucht er dafür?", motif:"Ein Betrieb für Kakaoverarbeitung", location:"Ghana", questionId:"economy"},
  {key:"solar", name:"Stromversorgung abwägen", text:"Ein Ort sucht eine Stromversorgung. Wer kann sie nutzen, wer bezahlt sie, und welche Folgen hat sie für Menschen und Natur?", motif:"Ein Solarkraftwerk mit Spiegeln", location:"Marokko", questionId:"future"},
];
// Presentation order deliberately differs from the clues. Use stable IDs, never index equality.
export const futureQuestions = [
  {id:"economy", text:"Welche Verarbeitung und welcher Handel sind möglich?"},
  {id:"future", text:"Wie lassen sich Nutzen, Teilhabe und Umweltfolgen abwägen?"},
  {id:"nature", text:"Wie beeinflussen Regen und Wasser den Anbau?"},
  {id:"population", text:"Welche Chancen und welcher Bedarf entstehen, wenn eine Stadt wächst?"},
];
export const caseTasks = {
  1: ["title"],
  2: ["selection"],
  3: ["atlas", "city", "cocoa"],
  4: ["headline"],
  5: ["future"],
};
