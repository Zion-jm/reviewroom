import { randomInt } from 'node:crypto';

export function validateContent(c) {
  const fail=m=>{throw new Error(m);};
  if (!c || c.schemaVersion!==1) fail('Content must use schemaVersion 1.');
  for(const k of ['subjects','lessons','questions','assessments']) {
    if(!Array.isArray(c[k]) || c[k].length>10000) fail(`Invalid ${k} collection.`);
    const ids=new Set();
    for(const x of c[k]) {if(!x || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(x.id) || ids.has(x.id)) fail(`Invalid or duplicate ID in ${k}.`); ids.add(x.id);}
  }
  const text=(v,label,max=20000)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(`Invalid ${label}.`);};
  const subjects=new Set(c.subjects.map(x=>x.id)); const lessons=new Map(c.lessons.map(x=>[x.id,x]));
  for(const s of c.subjects) {text(s.title,'subject title',150);text(s.code,'subject code',20);text(s.description,'subject description',1000);}
  for(const l of c.lessons) {
    if(!subjects.has(l.subjectId))fail('Lesson references an unknown subject.');
    text(l.title,'lesson title',150);text(l.source,'lesson source',250);text(l.description,'lesson description');
    if(typeof l.published!=='boolean')fail('Lesson published must be true or false.');
    for(const key of ['notes','flashcards'])if(!Array.isArray(l[key])||l[key].length>500)fail(`Invalid ${key}.`);
    for(const n of l.notes){text(n.title,'note title',200);text(n.body,'note body');text(n.ref,'source reference',200);}
    for(const f of l.flashcards){text(f.front,'flashcard front');text(f.back,'flashcard back');text(f.ref,'source reference',200);}
  }
  for(const q of c.questions){
    if(!lessons.has(q.lessonId))fail('Question references an unknown lesson.');
    text(q.prompt,'question',2000);text(q.explanation,'explanation',4000);text(q.ref,'source reference',200);
    if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4)fail('Questions need four different answer options.');
    q.options.forEach(v=>text(v,'answer option',1000));
    if(!Number.isInteger(q.answer)||q.answer<0||q.answer>3)fail('Answer must be an index from 0 to 3.');
  }
  for(const a of c.assessments){
    text(a.title,'assessment title',150);
    if(!subjects.has(a.subjectId)||!['quiz','midterm','final'].includes(a.type))fail('Invalid assessment subject or type.');
    if(!Array.isArray(a.coverage)||!a.coverage.length||new Set(a.coverage).size!==a.coverage.length||a.coverage.some(id=>lessons.get(id)?.subjectId!==a.subjectId))fail('Choose unique lessons from the assessment subject.');
    if(!Number.isInteger(a.count)||a.count<1||a.count>100)fail('Question count must be 1–100.');
    if(!Number.isInteger(a.minutes)||a.minutes<0||a.minutes>180)fail('Time limit must be 0–180 minutes.');
    if(!Number.isInteger(a.maxAttempts)||a.maxAttempts<0||a.maxAttempts>100)fail('Attempt limit must be 0–100 (0 means unlimited).');
    if(typeof a.published!=='boolean'||!Number.isInteger(a.version)||a.version<1)fail('Invalid assessment publication or version.');
    if(a.published&&(a.coverage.some(id=>!lessons.get(id).published)||c.questions.filter(q=>a.coverage.includes(q.lessonId)).length<a.count))fail('Published assessment needs published lessons and enough questions.');
  }
  return c;
}
export function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function selectQuestions(content,coverage,count){
  const groups=shuffle(coverage).map(id=>shuffle(content.questions.filter(q=>q.lessonId===id)));
  const chosen=[];
  while(chosen.length<count&&groups.some(g=>g.length))for(const g of groups)if(g.length&&chosen.length<count)chosen.push(g.pop());
  return shuffle(chosen).map(q=>{
    const indices=shuffle([0,1,2,3]); const l=content.lessons.find(l=>l.id===q.lessonId);
    return {...q,source:l.source,lessonTitle:l.title,options:indices.map(i=>q.options[i]),answer:indices.indexOf(q.answer)};
  });
}
export function publicQuestions(qs){return qs.map(({answer,explanation,...q})=>q);}
export function grade(qs,answers){
  const review=qs.map(q=>({...q,selected:answers[q.id]??null,correct:answers[q.id]===q.answer}));
  const score=review.filter(q=>q.correct).length;
  return {score,total:qs.length,percentage:Math.round(score/qs.length*100),review};
}
export function publicCatalog(c){return {...c,questions:undefined,lessons:c.lessons.filter(l=>l.published).map(l=>({...l,questionCount:c.questions.filter(q=>q.lessonId===l.id).length})),assessments:c.assessments.filter(a=>a.published)};}
export function versionContent(next,previous){
  for(const a of next.assessments){
    const old=previous.assessments.find(x=>x.id===a.id);
    if(!old){a.version=1;continue;}
    const signature=(c,x)=>JSON.stringify({subject:x.subjectId,title:x.title,type:x.type,coverage:x.coverage,count:x.count,minutes:x.minutes,maxAttempts:x.maxAttempts,questions:c.questions.filter(q=>x.coverage.includes(q.lessonId))});
    a.version=old.version+(signature(next,a)!==signature(previous,old)?1:0);
  }
  return next;
}
