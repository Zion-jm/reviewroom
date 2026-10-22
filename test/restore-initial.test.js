import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openDatabase,migrate} from '../server/db.js';
import {needsInitialRestore,restoreInitialDatabase,restoredVersion} from '../server/restore-initial.js';
const initial=JSON.parse(readFileSync(new URL('../data/content.json',import.meta.url),'utf8'));
for(const style of ['vocab','source'])test(`restores ${style} expansion once, backs up content, and preserves user records`,async()=>{
 const db=await openDatabase({path:':memory:'});await migrate(db);
 try{
  const expanded=structuredClone(initial);
  if(style==='source')expanded.bundleVersion='source-wording-v1';
  const expandedQ={...expanded.questions[0],id:style==='source'?'source-term-example':'lesson-1-vocab-1',prompt:'Expansion question'};
  expanded.questions=[expandedQ];expanded.lessons[0].notes[0].body='Expanded reviewer';expanded.lessons[0].terms=[{id:'old-term',term:'Old expanded term'}];
  expanded.assessments=expanded.assessments.map(a=>({...a,selection:'all',count:1,minutes:0,version:4}));
  expanded.lessons.push({...structuredClone(initial.lessons[0]),id:'custom-lesson',title:'Custom lesson'});
  expanded.questions.push({...initial.questions[0],id:'custom-question',lessonId:'custom-lesson'});
  const before=JSON.stringify(expanded);
  await db.query('INSERT INTO rr_content(id,revision,body) VALUES($1,$2,$3)',['main',9,before]);
  await db.query('INSERT INTO rr_students(id,name,recovery_hash,created_at) VALUES($1,$2,$3,$4)',['student','Saved Student','hash',1]);
  await db.query('INSERT INTO rr_sessions(token_hash,student_id,is_admin,expires_at) VALUES($1,$2,$3,$4)',['session','student',0,9999999999999]);
  await db.query('INSERT INTO rr_attempts(id,student_id,assessment_id,version,title,mode,questions,answers,started_at,deadline,total,revision,result,score,completed_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',['attempt','student','midterm',4,'Saved exam','ranked',JSON.stringify([expandedQ]),'{"answer":0}',1,2,1,0,'{"score":1}',1,2]);
  const attemptBefore=(await db.query('SELECT * FROM rr_attempts')).rows;
  assert.equal(await restoreInitialDatabase(db,initial),true);
  const rows=(await db.query('SELECT * FROM rr_content')).rows;assert.equal(rows.length,2);
  assert.equal(rows.find(r=>r.id.startsWith('before-initial-restore-')).body,before);
  const main=rows.find(r=>r.id==='main'),restored=JSON.parse(main.body);assert.equal(main.revision,10);assert.equal(restored.bundleVersion,restoredVersion);
  for(const l of initial.lessons)assert.deepEqual(restored.lessons.find(x=>x.id===l.id),l);
  assert.equal(restored.questions.length,81);assert.ok(restored.questions.some(q=>q.id==='custom-question'));assert.ok(!restored.questions.some(q=>q.id===expandedQ.id));
  assert.deepEqual(restored.assessments.map(a=>a.count),[12,20,20,40]);assert.deepEqual(restored.assessments.map(a=>a.minutes),[12,20,20,40]);assert.ok(restored.assessments.every(a=>a.version===5));
  assert.deepEqual((await db.query('SELECT * FROM rr_attempts')).rows,attemptBefore);assert.equal((await db.query('SELECT * FROM rr_students')).rows.length,1);assert.equal((await db.query('SELECT * FROM rr_sessions')).rows.length,1);
  assert.equal(await restoreInitialDatabase(db,initial),false);assert.equal((await db.query('SELECT * FROM rr_content')).rows.length,2);
 }finally{await db.close();}
});
test('initial content needs no migration and contains the original coverage',()=>{
 assert.equal(needsInitialRestore(initial),false);assert.equal(initial.questions.length,80);assert.equal(initial.lessons.reduce((n,l)=>n+l.flashcards.length,0),38);
});
