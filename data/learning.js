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
 atlas:{title:"Naturraum und Arbeitsplatz",extras:["solar","logistics","coast"],steps:[{
  id:"atlas-evidence",title:"Zwei unterschiedliche Spuren",photos:["atlas"],schema:"vehicles",source:"renault",
  text:"Das Atlasfoto zeigt Schnee im Gebirge. In einem Werk bei Tanger werden Fahrzeuge hergestellt: Das ist Industrie.",
  questions:[
   {key:"nature",label:"Welche Spur zeigt einen Naturraum?",options:[option("cars","Fahrzeugproduktion"),option("snow","Schnee im Gebirge")],answer:"snow"},
   {key:"work",label:"Welche Spur zeigt einen Arbeitsplatz?",options:[option("cars","Fahrzeugproduktion"),option("snow","Schnee im Gebirge")],answer:"cars"},
  ],explanation:"In Marokko gibt es unterschiedliche Landschaften und Arbeitsplätze. Der Schnee widerspricht „überall ganzjährig heiß“. Schnee hängt von Ort und Jahreszeit ab. Eine Fabrik kann auch in einer trockenen Landschaft liegen und belegt keinen Wohlstand für alle.",
 }]},
 city:{title:"Arbeit und Leben in einer Stadt",extras:["film","digital"],steps:[
  {id:"city-trade",title:"Verschiedene Arbeiten",photos:["trade","mine","farm","factory"],
   text:"Auf dem Balogun-Markt in Lagos werden Stoffe verkauft. Die anderen Fotos zeigen Bergbau, Landwirtschaft und einen Industriebetrieb.",
   questions:[{key:"job",label:"Welche Arbeit gehört zum Stofffoto aus Lagos?",options:[option("health","Menschen behandeln"),option("trade","Stoffe verkaufen"),option("cars","Autos herstellen")],answer:"trade"}],
   explanation:"Bergbau, Anbau, Industrie und Handel sind verschiedene Bereiche der Wirtschaft. Keiner davon ist allein ein Zeichen für „rückständig“ oder „wohlhabend“.",
   checks:[{claims:["work"],finding:"„Nur Landwirtschaft“ ist falsch. Die Fotos und das Beispiel aus Tanger belegen auch Bergbau, Industrie und Handel. Wie häufig die Arbeiten sind, bleibt offen."}]},
  {id:"city-observe",title:"Zwei Bilder – eine Stadt?",photos:["lagos","housing"],anonymousPhotos:true,showYears:true,
   text:"Schaut genau hin. Was ist auf den beiden Fotos sichtbar verschieden?",
   questions:[{key:"visible",label:"Welche Beobachtung könnt ihr am Bild prüfen?",options:[option("income","Wie viel Geld jede Familie bekommt"),option("perspective","Die Gebäude und die Blickrichtung"),option("origin","Die Herkunft aller Menschen")],answer:"perspective"}],
   explanation:"Bild A zeigt hohe Gebäude von der Seite; Bild B viele Dächer von oben. Auch die Blickrichtung verändert den Eindruck. Geld und Herkunft kann man daraus nicht ablesen."},
  {id:"city-hypothesis",title:"Eure Vermutung",photos:["lagos","housing"],anonymousPhotos:true,showYears:true,
   text:"Könnten beide Orte in derselben Stadt liegen? Eure Vermutung wird nicht bewertet.",
   questions:[{key:"sameCity",label:"Was vermutet ihr?",options:[option("yes","Ja"),option("no","Nein"),option("unknown","Das wissen wir noch nicht")],any:true}],
   explanation:"Beide Fotos stammen aus Lagos: Bild A von Lagos Island (2016), Bild B aus Makoko (2019). Die Orte und Jahre unterscheiden sich. Die Fotos beweisen nicht, wie schnell eine Stadt wächst."},
  {id:"city-context",title:"Orte und Lebensbedingungen",photos:[],map:"city",source:"housing",
   text:"Lagos Island und Makoko liegen in Lagos. Lest die zwei kurzen Karten.",
   cards:[{title:"Wohnen",text:"Menschen können unterschiedlich wohnen. Geld beeinflusst die Möglichkeiten. Die Fotos verraten uns aber nicht das Einkommen einzelner Familien."},{title:"Wasser, Schule und Behandlung",text:"Auch Straßen, Wasserleitungen, Schulen und medizinische Angebote sind wichtig. Geld allein erklärt die Unterschiede nicht."}],
   questions:[{key:"conditions",label:"Welche Aussage passt?",options:[option("same","In derselben Stadt leben alle gleich."),option("different","In derselben Stadt können Menschen unterschiedlich leben."),option("income","Wir kennen das Einkommen aller Menschen auf den Fotos.")],answer:"different"}],
   explanation:"Auch innerhalb einer Stadt können sich die Lebensbedingungen stark unterscheiden. Gute Wege, Wasserleitungen und öffentliche Angebote spielen dabei eine Rolle.",
   checks:[{claims:["income","homes"],finding:"Die Bilder zeigen verschiedene Gebäude. Ob Menschen arm sind, folgt nicht allein aus Bauweise oder Kleidung. Für Aussagen über ihr Geld und ihre Versorgung brauchen wir weitere Angaben."}]},
  {id:"city-everyday",title:"Weitere Orte und Wohnformen",photos:["trade","rural"],
   text:"Die Fotos zeigen den Markt in Lagos und Lehmhäuser in Ghana. Markt und Dorf sind verschiedene Orte. Ein Strohdach ist kein Beweis für Armut.",
   questions:[{key:"limit",label:"Was können diese wenigen Bilder zeigen?",options:[option("sample","Einige Orte, Wohnformen und Arbeiten"),option("all","Wie alle Menschen leben und wie viel Geld sie haben")],answer:"sample"}],
   explanation:"Die Aufnahmen zeigen einzelne Orte. Sie teilen Menschen nicht in zwei einheitliche Gruppen „arm“ und „reich“ ein. Die Marktaufnahme belegt keine Einkommensgruppe."},
 ]},
 cocoa:{title:"Vom Anbau zum Produkt",extras:["productionNeeds"],steps:[{
  id:"cocoa-chain",title:"Anbauen, verarbeiten und handeln",photos:["cocoa","economy"],schema:"cocoa",source:"cpc",
  chain:["Anbau und Ernte","Bohnen aufbereiten und verarbeiten","Produkte herstellen","Handeln und verkaufen"],
  text:"In Ghana wird Kakao angebaut und verarbeitet, etwa bei der Cocoa Processing Company in Tema. Das Betriebsfoto zeigt keinen Arbeitsablauf. Dafür nutzt ihr das Schema.",
  questions:[
   {key:"trade",label:"Handeln und verkaufen: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"4"},
   {key:"harvest",label:"Kakaofrüchte anbauen und ernten: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"1"},
   {key:"manufacture",label:"Produkte herstellen: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"3"},
   {key:"prepare",label:"Bohnen aufbereiten und verarbeiten: welcher Schritt?",options:[option("1","1"),option("2","2"),option("3","3"),option("4","4")],answer:"2"},
  ],explanation:"1 Anbau/Ernte → 2 Bohnen aufbereiten/verarbeiten → 3 Produkte herstellen → 4 handeln/verkaufen. Das Schema vereinfacht. Nicht die ganze Ernte wird in Ghana verarbeitet. Mehr Verarbeitung bedeutet nicht automatisch mehr Geld oder gute Arbeitsbedingungen für alle.",
 }]},
 education:{title:"Schule, Behandlung und Wasser",steps:[
  {id:"education-health",title:"Lernen und medizinische Versorgung",photos:["classroom","school","healthpost","clinic"],
   text:"Vergleicht Klassenraum und Universität. Vergleicht dann Gesundheitsstation und Krankenhaus. Was zeigen die Beispiele?",
   questions:[
    {key:"education",label:"Was belegen Klassenraum und Universität?",options:[option("none","Es gibt keine Schulbildung."),option("places","Es gibt unterschiedliche Orte zum Lernen."),option("all","Alle haben überall gleich guten Zugang.")],answer:"places"},
    {key:"health",label:"Was belegen Station und Krankenhaus?",options:[option("count","Wie viele Krankenhäuser in jedem Land fehlen."),option("care","An den gezeigten Orten gibt es medizinische Einrichtungen."),option("equal","Alle Menschen können sie gleich gut erreichen.")],answer:"care"},
   ],explanation:"Es gibt unterschiedliche Einrichtungen. Nicht alle Menschen haben die gleichen Möglichkeiten, sie zu nutzen. Die Fotos allein zeigen weder Lernqualität noch Ausstattung aller Räume. Auch über Finanzierung und Zusammenarbeit sagen sie wenig.",
   checks:[{claims:["education"],finding:"Der Klassenraum ist ein Lernort, auch mit einfachen Möbeln. Die Universität ist ein weiteres Bildungsbeispiel. Beides sagt noch nicht, wie gut Bildung überall erreichbar ist."},{claims:["health"],finding:"Station und Krankenhaus belegen zwei Einrichtungen. Ob anderswo Krankenhäuser fehlen, ist damit nicht geklärt. Dafür wären weitere Angaben nötig."}]},
  {id:"water-access",title:"Wasser tragen und speichern",photos:["carry","supply"],
   text:"Ein Foto zeigt Wassertransport in Uganda, das andere einen Wassertank in Kenia. Wasser zu tragen braucht Arbeit. Wege können verschieden sein.",
   questions:[{key:"water",label:"Was können wir belegen?",options:[option("dirty","Das Wasser ist überall schmutzig."),option("ways","Wasser wird getragen und gespeichert."),option("rich","Alle Menschen mit einem Tank sind reich.")],answer:"ways"}],
   explanation:"Einzelne Versorgungswege können aufwendig sein. Wie weit der Weg ist und ob das Wasser trinkbar ist, zeigen diese Fotos nicht. Ein Kanister ist kein Armutsbeweis; ein Tank ist kein Reichtumsbeweis.",
   checks:[{claims:["water"],finding:"Die Bilder zeigen unterschiedliche Wege, Wasser zu bekommen. Die Behauptung über sauberes Wasser „überall“ ist durch sie nicht belegt. Wasserqualität muss eigens geprüft werden."}]},
 ]},
 reflection:{title:"Zurück zu eurer ersten Auswahl",steps:[{
  id:"reflection",title:"Welche Spur ergänzt eure Auswahl?",photos:[],reflection:true,
  text:"Wählt einen Bild- oder Belegverweis. Wenige Wörter oder ein gesprochener Satz genügen. Auch „Das wussten wir schon“ oder eine offene Frage ist möglich.",
  explanation:"Eure Vorstellungen werden nicht nach richtig oder falsch bewertet. Belege können eine Vorstellung ergänzen, bestätigen oder eine Frage öffnen.",
 }]},
};
export const extraSpurs = {
 solar:{title:"Energie: Spiegel statt Solarzellen",photos:["solar"],text:"Die Noor-Anlage nutzt Spiegel für Solarthermie. Wer hat Nutzen, wer kann sie nutzen, und welche Folgen hat sie für die Umwelt? Solarenergie ist kein automatisches Gütesiegel."},
 logistics:{title:"Wege zum Betrieb",text:"Wie kommen Materialien zur Fabrik und Produkte zu Kundinnen und Kunden? Eine Fabrik allein belegt keinen Wohlstand für alle."},
 coast:{title:"Ein weiterer Naturraum: Sansibar",photos:["coast"],text:"Diese Küste liegt auf Unguja in Tansania. Sie ist ein weiterer Ort auf dem Kontinent; kein Bild steht für alle Landschaften oder Lebensbedingungen."},
 film:{title:"Filmwirtschaft in Nigeria",source:"film",text:"Nigeria hat eine Filmwirtschaft, oft Nollywood genannt. Welche Arbeiten stecken hinter einem Film? Die Produktionen liegen nicht alle in Lagos."},
 digital:{title:"Digitale Dienstleistungen",text:"Welche Arbeit ist nötig, damit zum Beispiel digitales Bezahlen funktioniert? Sammelt Fragen zu Wissen, Technik und Zugang – ohne zusätzliche Punkte."},
 productionNeeds:{title:"Was braucht ein Betrieb?",photos:["factory"],text:"Was braucht ein Betrieb: Energie, Wissen, Maschinen oder Transport? Mehr Produktion bedeutet nicht automatisch mehr Geld für alle."},
};
