// Short, unscored learning steps. The provided curriculum brief is a local reference,
// not a claim that the blocked original company/official websites were retrieved.
export const evidenceSources = {
  renault: {title:"Renault Group: Werk Tanger",url:"https://www.renaultgroup.com/en/magazine/our-group-news/tangier-factory-the-industrial-and-logistics-hub-where-everything-comes-together/",status:"Im geprüften Projektauftrag benannte Primärquelle; direkter Abruf am 21.10.2026 vom Proxy blockiert. Originalabgleich offen.",local:"sources/auftrag-v2.md",section:"7.1"},
  cpc: {title:"SIGA: Cocoa Processing Company",url:"https://siga.gov.gh/entity/cocoa-processing-company/",status:"Im geprüften Projektauftrag benannte Primärquelle; direkter Abruf am 21.10.2026 vom Proxy blockiert. Ergänzend örtlicher Commons-Beleg des Betriebs in Tema.",local:"sources/auftrag-v2.md",section:"7.4"},
  film: {title:"UNESCO Courier: Nollywood",url:"https://courier.unesco.org/en/articles/nollywoods-streaming-romance",status:"Im Projektauftrag benannte datierte Darstellung; nicht als Beleg einer ausschließlich in Lagos ansässigen Filmwirtschaft verwendet. Direkter Originalabgleich offen.",local:"sources/auftrag-v2.md",section:"7.2"},
  housing: {title:"Kontext: Wohnen und Versorgung",local:"sources/auftrag-v2.md",section:"7.3",status:"Qualitative didaktische Kontextinformation aus dem bereitgestellten geprüften Auftrag. Keine erfundenen Haushalte, Einkommen oder lokalen Versorgungsquoten."},
  curriculum: {title:"Bereitgestellter geprüfter Unterrichtsauftrag",local:"sources/auftrag-v2.md",section:"2",status:"Curriculumbezug aus dem Auftrag; offizielle Originaldateien nicht zusätzlich mitgeliefert. Fachportal-Abruf vom Proxy blockiert; keine aktuelle Rechtsgeltung behauptet."},
};
export const geographyFlow = [
  {task:"atlas"}, {learning:"atlas"}, {task:"city"}, {learning:"city"},
  {task:"cocoa"}, {learning:"cocoa"}, {learning:"education"}, {learning:"reflection"},
];
const option = (id,label) => ({id,label});
export const coreLearning = {
 atlas: {
  title:"Naturraum und Arbeitsplatz", extras:["solar","logistics"],
  steps:[{
   id:"atlas-evidence", title:"Zwei unterschiedliche Spuren", photos:["atlas"], schema:"vehicles", source:"renault",
   text:"Das Atlasfoto zeigt Schnee im Gebirge. In einem Werk bei Tanger werden Fahrzeuge hergestellt: Das ist Industrie.",
   questions:[
    {key:"nature",label:"Welche Spur zeigt einen Naturraum?",options:[option("cars","Fahrzeugproduktion"),option("snow","Schnee im Gebirge")],answer:"snow"},
    {key:"work",label:"Welche Spur zeigt einen Arbeitsplatz?",options:[option("cars","Fahrzeugproduktion"),option("snow","Schnee im Gebirge")],answer:"cars"},
   ],
   explanation:"Marokko hat unterschiedliche Landschaften und Arbeitsplätze. Der Schnee widerspricht „überall ganzjährig heiß“. Schnee ist örtlich und jahreszeitlich begrenzt; eine Fabrik sagt nichts über die Lage in einer trockenen Landschaft oder über den Wohlstand aller Menschen.",
  }],
 },
 city: {
  title:"Arbeit und Leben in einer Stadt",extras:["film","digital"],
  steps:[
   {id:"city-trade",title:"Eine Arbeit in Lagos",photos:["trade"],text:"Der Quellenbeleg nennt den Balogun-Markt in Lagos. Auf dem Foto von 2007 werden Stoffe gehandelt.",questions:[{key:"job",label:"Welche Tätigkeit ist hier belegt?",options:[option("health","Menschen behandeln"),option("trade","Stoffe verkaufen"),option("cars","Autos herstellen")],answer:"trade"}],explanation:"Handel ist ein Bereich der Wirtschaft. Das Foto belegt diesen Markt – keine Einkommen oder Arbeitsbedingungen aller Menschen in Lagos."},
   {id:"city-observe",title:"Zwei Bilder – eine Stadt?",photos:["lagos","housing"],anonymousPhotos:true,showYears:true,text:"Schaut genau hin. Was ist auf den beiden Fotos sichtbar verschieden?",questions:[{key:"visible",label:"Welche Beobachtung könnt ihr am Bild prüfen?",options:[option("income","Das Einkommen jeder Familie"),option("perspective","Bebauung und Blickrichtung der Aufnahme"),option("origin","Die Staatsangehörigkeit aller Menschen")],answer:"perspective"}],explanation:"Bild A zeigt hohe Gebäude von der Seite; Bild B viele Dächer von oben. Auch die Aufnahmeperspektive beeinflusst den Eindruck. Einkommen und Herkunft kann man daraus nicht ablesen."},
   {id:"city-hypothesis",title:"Eure Vermutung",photos:["lagos","housing"],anonymousPhotos:true,showYears:true,text:"Könnten beide Orte in derselben Stadt liegen? Es gibt keine Punkte für eure Vermutung.",questions:[{key:"sameCity",label:"Was vermutet ihr?",options:[option("yes","Ja"),option("no","Nein"),option("unknown","Das wissen wir noch nicht")],any:true}],explanation:"Die Quellen lösen es auf: Beide Fotos stammen aus Lagos – Bild A von Lagos Island (2016), Bild B aus Makoko (2019). Verschiedene Jahre und Orte belegen keinen zeitlichen Wachstumstrend."},
   {id:"city-context",title:"Orte und Lebensbedingungen",photos:[],map:"city",source:"housing",text:"Die Quellen verorten Lagos Island und Makoko in Lagos. Lest die zwei kurzen Kontextkarten.",cards:[
    {title:"Wohnen",text:"Wohnraum ist unterschiedlich. Finanzielle Möglichkeiten beeinflussen, wo und wie Menschen wohnen können; die Fotos zeigen keine Haushaltseinkommen."},
    {title:"Versorgung",text:"Zugang zu Wasser, Schulen und medizinischer Versorgung hängt auch von Infrastruktur und öffentlichen Angeboten ab. Geld ist ein Faktor, aber nicht die einzige Ursache."},
   ],questions:[{key:"conditions",label:"Welche Aussage passt zu den Belegen und Kontextkarten?",options:[option("same","In derselben Stadt leben alle gleich."),option("different","In derselben Stadt können Menschen unterschiedlich leben."),option("income","Wir kennen die Einkommen der Menschen auf den Fotos.")],answer:"different"}],explanation:"Menschen können in derselben Stadt sehr unterschiedlich leben. Aus Gebäuden folgen weder Einkommen noch eine Erklärung durch Fleiß; Infrastruktur und öffentliche Versorgung prägen die Möglichkeiten mit."},
   {id:"city-everyday",title:"Noch ein Blick auf den Alltag",photos:["trade"],text:"Der Balogun-Markt ist ein weiterer Blick auf Lagos (Aufnahme 2007). Es gibt mehr als zwei einheitliche Gruppen „arm“ und „reich“.",questions:[{key:"limit",label:"Was können diese wenigen Bilder zeigen?",options:[option("sample","Einige konkrete Orte und Tätigkeiten"),option("all","Alle Lebensbedingungen und ihre Häufigkeit")],answer:"sample"}],explanation:"Die Aufnahmen zeigen einzelne Stadträume und Tätigkeiten. Die Marktaufnahme belegt keine statistische Mittelschicht; Einzelbilder zeigen keine Einkommensverteilung."},
  ],
 },
 cocoa: {
  title:"Vom Anbau zum Produkt",extras:["productionNeeds"],
  steps:[{
   id:"cocoa-chain",title:"Anbauen, verarbeiten und handeln",photos:["cocoa","economy"],schema:"cocoa",source:"cpc",
   chain:["Anbau und Ernte", "Bohnen aufbereiten und verarbeiten", "Produkte herstellen", "Handeln und verkaufen"],
   text:"In Ghana gibt es neben Kakaoanbau auch Verarbeitung und Produktherstellung, etwa die Cocoa Processing Company in Tema. Die Betriebsfassade zeigt keinen Produktionsablauf; dafür dient das vereinfachte Schema.",
   questions:[
    {key:"trade",label:"Handeln und verkaufen: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"4"},
    {key:"harvest",label:"Kakaofrüchte anbauen und ernten: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"1"},
    {key:"manufacture",label:"Produkte herstellen: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"3"},
    {key:"prepare",label:"Bohnen aufbereiten und verarbeiten: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"2"},
   ],explanation:"1 Anbau/Ernte → 2 Bohnen aufbereiten/verarbeiten → 3 Produkte herstellen → 4 handeln/verkaufen. Das Schema vereinfacht. Nicht die gesamte Ernte wird vor Ort verarbeitet; Verarbeitung garantiert weder Gewinne noch gute Arbeitsbedingungen.",
  }],
 },
 education: {
  title:"Bildung und Gesundheit",steps:[{
   id:"education-health",title:"Was zeigen diese Beispiele?",photos:["school","clinic"],
   text:"Die Fotos belegen eine Universität in Accra und ein Krankenhaus in Butaro. Was wissen wir dadurch – und was noch nicht?",
   questions:[{key:"evidence",label:"Welche Aussage ist durch diese Beispiele gedeckt?",options:[option("all","Alle haben überall den gleichen Zugang."),option("places","An diesen Orten gibt es Lernmöglichkeiten und medizinische Versorgung."),option("independent","Internationale Zusammenarbeit spielt nirgends eine Rolle.")],answer:"places"}],
   explanation:"Die Einrichtungen sind örtlich belegt. Zugang, Qualität und Finanzierung sind damit nicht für alle Menschen geklärt. Eine örtlich getragene Einrichtung kann zugleich international unterstützt sein.",
  }],
 },
 reflection: {
  title:"Zurück zu eurer ersten Auswahl",steps:[{
   id:"reflection",title:"Welche Spur ergänzt eure Auswahl?",photos:[],reflection:true,
   text:"Wählt einen Bild- oder Belegverweis. Notiert dazu wenige Wörter oder sprecht einen Partnersatz; auch „Das wussten wir schon“ oder eine offene Frage ist möglich.",
   explanation:"Eure Vorstellungen werden nicht nach richtig oder falsch bewertet. Belege können eine Vorstellung ergänzen, bestätigen oder eine neue Frage öffnen.",
  }],
 },
};
export const extraSpurs = {
 solar:{title:"Energie: Spiegel statt Solarzellen",photos:["solar"],text:"Die Noor-Anlage nutzt Spiegel für Solarthermie. Wer profitiert, wer hat Zugang, und welche Umweltfolgen sind zu prüfen? Solarenergie ist kein automatisches Nachhaltigkeitssiegel."},
 logistics:{title:"Logistik: Wege zum Betrieb",text:"Wie kommen Materialien zu einer Fabrik und Produkte zu Kundinnen und Kunden? Betrachtet Transportwege als weitere Frage; eine Fabrik allein belegt noch keinen allgemeinen Wohlstand."},
 film:{title:"Filmwirtschaft in Nigeria",source:"film",text:"Nigeria hat eine Filmwirtschaft, oft Nollywood genannt. Welche Tätigkeiten stecken hinter einem Film? Das ist eine landesweite Perspektive, keine Behauptung, alle Produktionen lägen in Lagos."},
 digital:{title:"Digitale Dienstleistungen",text:"Welche Arbeit ist nötig, damit zum Beispiel ein digitales Bezahlsystem funktioniert? Sammelt Fragen zu Kenntnissen, Technik und Zugang – keine zusätzlichen Punkte."},
 productionNeeds:{title:"Was braucht ein Betrieb?",photos:["factory"],text:"Was braucht ein Betrieb für die Herstellung: Energie, Kenntnisse, Maschinen oder Transport? Das sind Untersuchungsfragen; mehr Produktion bedeutet nicht automatisch mehr Wohlstand für alle."},
};
