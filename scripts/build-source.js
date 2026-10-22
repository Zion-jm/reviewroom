import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const previous=read('content.json'),sources=read('source-text.json'),records=read('source-terms.json');
const aliases={'computer hardware':'hardware','system administrators':'system administrator','user accounts':'user account','users':'user','devices':'device','servers':'server','services':'service','resources':'resource','networks':'network','systems':'system','files':'file','printers':'printer','applications':'application','databases':'database','programs':'program','permissions':'permission','routers':'router','switches':'switch','firewalls':'firewall','backups':'backup','back up':'backup','restores':'restore','configure':'configuration','communication skills':'communication','organisational skills':'organization','virtual private networks':'vpn','v p n':'vpn','network intrusion':'network intrusion detection','cloud-based communities':'cloud-based community','online communities':'online community','cpu fans':'cpu fan','sodimm':'so-dimm','speakers':'speaker','heatsinks':'heatsink','magnetic platters':'magnetic platter','learning platforms':'learning platform','online learning platforms':'learning platform','user management':'user account','security updates':'security update','software updates':'software update'};
const normalized=s=>s.toLowerCase().replace(/\s+/g,' ').trim();
const canon=r=>r.canonical||aliases[normalized(r.term)]||normalized(r.term);
const entries=new Map();
for(const r of records){
 const page=sources[r.lessonId].pages.find(p=>p.page===r.page);
 if(!page?.text.includes(r.excerpt))throw new Error('Excerpt not found in source: '+r.term);
 if(!r.excerpt.toLowerCase().includes(r.term.toLowerCase()))throw new Error('Missing answer: '+r.term);
 const key=canon(r),existing=entries.get(key);
 if(existing){if(!existing.lessonIds.includes(r.lessonId))existing.lessonIds.push(r.lessonId);existing.references.push({lessonId:r.lessonId,page:r.page});}
 else entries.set(key,{...r,lessonIds:[r.lessonId],references:[{lessonId:r.lessonId,page:r.page}]});
}
const lessons=previous.lessons.map(l=>{
 const pages=sources[l.id].pages.filter(p=>p.text&&p.page>=3&&!((l.id==='lesson-2'&&p.page>=45)||(l.id==='lesson-3'&&p.page===21)||(l.id==='communities'&&p.page>=25)||(l.id==='diagnostics'&&p.page===27)));
 return {...l,description:'Original source wording, fixed term questions, and complete coverage.',terms:[],flashcards:[],notes:pages.map(p=>({title:`${l.id.startsWith('lesson-')?'Slide':'Page'} ${p.page}`,body:p.text,ref:`${l.id.startsWith('lesson-')?'Slide':'Page'} ${p.page}`}))};
});
const all=[...entries.entries()].map(([key,r])=>({...r,id:'term-'+createHash('sha256').update(key).digest('hex').slice(0,16)}));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const questions=all.map((t,index)=>{
 let prompt=t.excerpt;
 for(const answer of [t.term,...(t.redactAlso||[])].sort((a,b)=>b.length-a.length))prompt=prompt.replace(new RegExp('(?<![\\p{L}\\p{N}])'+escape(answer)+'(?![\\p{L}\\p{N}])','giu'),'_____');
 if(!t.visual&&!prompt.includes('_____'))throw new Error('No blank: '+t.term);
 const ref=`${t.lessonId.startsWith('lesson-')?'Slide':'Page'} ${t.page}`;
 const peers=all.filter(x=>x.id!==t.id&&x.lessonIds.some(id=>t.lessonIds.includes(id))&&normalized(x.term)!==normalized(t.term));
 const same=peers.filter(x=>x.topic===t.topic);const pool=same.length>=3?same:peers;
 const wrong=[];for(let i=0;wrong.length<3&&i<pool.length;i++){const name=pool[(index*7+i)%pool.length].term;if(!wrong.includes(name))wrong.push(name);}
 if(wrong.length!==3)throw new Error('Not enough distinct choices');
 const q={id:'source-'+t.id,lessonId:t.lessonId,lessonIds:t.lessonIds,termId:t.id,topic:t.topic,prompt:t.visual?'Identify the item shown in the source diagram.':prompt,options:[t.term,...wrong],answer:0,explanation:t.excerpt,ref,difficulty:'source-recall',...(t.visual?{visual:t.visual}:{})};
 for(const id of t.lessonIds){const l=lessons.find(l=>l.id===id);l.terms.push({id:t.id,term:t.term,definition:t.excerpt,topic:t.topic,ref,source:sources[t.lessonId].file,sourceLessonId:t.lessonId,...(t.visual?{visual:t.visual}:{})});l.flashcards.push({front:q.prompt,back:t.excerpt,ref,termId:t.id,...(t.visual?{visual:t.visual}:{})});}
 return q;
});
const assessments=previous.assessments.filter(a=>['quiz-1','quiz-2','quiz-3','midterm'].includes(a.id)).map(a=>({...a,selection:'all',count:questions.filter(q=>q.lessonIds.some(id=>a.coverage.includes(id))).length,minutes:0,version:1}));
const content={schemaVersion:1,bundleVersion:'source-wording-v1',subjects:previous.subjects,lessons,questions,assessments};
writeFileSync(new URL('../data/content.json',import.meta.url),JSON.stringify(content,null,2)+'\n');
console.log(`${questions.length} unique terms, one fixed source question each. ${assessments.map(a=>a.id+': '+a.count).join(', ')}`);
