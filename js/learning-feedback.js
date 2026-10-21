// Unscored explanations; personal hypotheses and reflections are never graded.
export function learningFeedback(step,answers={}) {
 if(step.reflection)return [{kind:"personal",text:"Euer Rückblick bleibt persönlich. Es gibt dafür keine Punkte."}];
 return step.questions.map(q=>{
  const selected=q.options.find(o=>o.id===answers[q.key]);
  if(!selected)return {key:q.key,kind:"missing",text:"Wählt bitte eine Antwort."};
  if(q.any)return {key:q.key,kind:"personal",text:`Eure Vermutung „${selected.label}“ ist notiert. Sie wird nicht als richtig oder falsch bewertet.`};
  if(selected.id===q.answer)return {key:q.key,kind:"correct",text:`Richtig. ${q.evidence}`};
  return {key:q.key,kind:"explain",text:`Ihr habt „${selected.label}“ gewählt. Das passt nicht, weil ${selected.why}. ${q.evidence}`};
 });
}
