import {validateContent,versionContent,questionsInCoverage} from './content.js';
import {randomUUID} from 'node:crypto';
export const restoredVersion='initial-reviewer-restored-v1';
export function needsInitialRestore(content){
 return content.bundleVersion!==restoredVersion&&(content.bundleVersion==='source-wording-v1'||content.questions.some(q=>/^(lesson-[123]|diagnostics|communities)-vocab-\d+$/.test(q.id)));
}
export function restoreInitial(current,initial){
 const next=structuredClone(current),lessonIds=new Set(initial.lessons.map(l=>l.id));
 const replace=(key)=>{const ids=new Set(initial[key].map(x=>x.id));next[key]=next[key].filter(x=>!ids.has(x.id)).concat(structuredClone(initial[key]));};
 replace('subjects');replace('lessons');replace('assessments');
 const originalIds=new Set(initial.questions.map(q=>q.id));
 next.questions=next.questions.filter(q=>!originalIds.has(q.id)&&!(lessonIds.has(q.lessonId)&&(/^(lesson-[123]|diagnostics|communities)-vocab-\d+$/.test(q.id)||q.id.startsWith('source-term-')))).concat(structuredClone(initial.questions));
  for(const q of next.questions)if(q.termId&&!next.lessons.find(l=>l.id===q.lessonId)?.terms?.some(t=>t.id===q.termId))delete q.termId;
 // Keep unrelated/custom assessments usable after removing expanded questions.
 for(const a of next.assessments){const available=questionsInCoverage(next,a.coverage).length;if(a.selection==='all')a.count=available;else a.count=Math.min(a.count,Math.max(available,1));if(!available)a.published=false;}
 next.bundleVersion=restoredVersion;
 return validateContent(versionContent(next,current));
}
export async function restoreInitialDatabase(db,initial){
 return db.transaction(async tx=>{
  const lock=db.kind==='PostgreSQL'?' FOR UPDATE':'';
  const row=(await tx.query('SELECT * FROM rr_content WHERE id=$1'+lock,['main'])).rows[0];
  const current=JSON.parse(row.body);if(!needsInitialRestore(current))return false;
  const next=restoreInitial(current,initial);
  // Content-only backup; students, sessions, and saved attempts are untouched.
  const backupId='before-initial-restore-'+randomUUID();
  await tx.query('INSERT INTO rr_content(id,revision,body) VALUES($1,$2,$3)',[backupId,row.revision,row.body]);
  await tx.query('UPDATE rr_content SET body=$1,revision=revision+1 WHERE id=$2',[JSON.stringify(next),'main']);
  return true;
 });
}
