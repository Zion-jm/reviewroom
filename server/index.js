import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import {randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {openDatabase,migrate} from './db.js';
import {validateContent,selectQuestions,publicQuestions,publicCatalog,grade,versionContent} from './content.js';
const seed=validateContent(JSON.parse(readFileSync(new URL('../data/content.json',import.meta.url),'utf8')));
const hash=s=>createHash('sha256').update(s).digest('hex');
const safeEqual=(a,b)=>timingSafeEqual(Buffer.from(hash(a)),Buffer.from(hash(b)));
const error=(status,message)=>Object.assign(new Error(message),{status});
const cookie=(req,key)=>req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(key+'='))?.slice(key.length+1);
const year=365*24*60*60*1000;
export async function createApp({db,adminPassword=process.env.ADMIN_PASSWORD,origin=process.env.APP_ORIGIN,production=process.env.NODE_ENV==='production'}={}){
  if(production&&(!origin||!origin.startsWith('https://')))throw new Error('APP_ORIGIN must be your HTTPS Render URL.');
  if(adminPassword&&adminPassword.length<16)throw new Error('ADMIN_PASSWORD must contain at least 16 characters.');
  db??=await openDatabase();await migrate(db);
  await db.query('INSERT INTO rr_content(id,revision,body) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING',['main',1,JSON.stringify(seed)]);
  const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
  app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'"],imgSrc:["'self'",'data:'],connectSrc:["'self'"],fontSrc:["'self'"],objectSrc:["'none'"],frameAncestors:production?["'none'"]:["'self'"],upgradeInsecureRequests:production?[]:null}},strictTransportSecurity:production?undefined:false}));
  app.use('/api',rateLimit({windowMs:60000,limit:240,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Please wait a moment.'}}));
  app.use(express.json({limit:'5mb'}));
  app.use('/api',(req,res,next)=>{
    res.set('Cache-Control','no-store');
    if(!['GET','HEAD'].includes(req.method)){
      if(req.get('X-Reviewroom')!=='1')return res.status(403).json({error:'Please submit from Reviewroom.'});
      const expected=origin||`${req.protocol}://${req.get('host')}`;
      if(req.get('origin')&&req.get('origin')!==expected)return res.status(403).json({error:'This origin is not allowed.'});
      if(!req.is('application/json'))return res.status(415).json({error:'Send JSON content.'});
    }
    next();
  });
  const catalog=async()=>{const r=(await db.query('SELECT * FROM rr_content WHERE id=$1',['main'])).rows[0];return {content:JSON.parse(r.body),revision:r.revision};};
  const session=async(req,admin=false)=>{
    const token=cookie(req,admin?'rr_admin':'rr_session');if(!token)return null;
    return (await db.query('SELECT * FROM rr_sessions WHERE token_hash=$1 AND expires_at>$2 AND is_admin=$3',[hash(token),Date.now(),admin?1:0])).rows[0]??null;
  };
  const student=async req=>{const s=await session(req);if(!s)throw error(401,'Enter your name or recover your profile to continue.');return (await db.query('SELECT id,name FROM rr_students WHERE id=$1',[s.student_id])).rows[0];};
  const admin=async req=>{if(!await session(req,true))throw error(401,'Sign in as administrator first.');};
  const setSession=async(req,res,studentId,isAdmin=false)=>{
    const old=cookie(req,isAdmin?'rr_admin':'rr_session');if(old)await db.query('DELETE FROM rr_sessions WHERE token_hash=$1',[hash(old)]);
    const token=randomBytes(32).toString('hex');const duration=isAdmin?8*60*60*1000:year;
    await db.query('INSERT INTO rr_sessions(token_hash,student_id,is_admin,expires_at) VALUES($1,$2,$3,$4)',[hash(token),studentId,isAdmin?1:0,Date.now()+duration]);
    res.cookie(isAdmin?'rr_admin':'rr_session',token,{httpOnly:true,sameSite:'lax',secure:production,maxAge:duration,path:'/'});
  };
  const authLimit=rateLimit({windowMs:15*60000,limit:15,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many sign-in attempts. Try again in 15 minutes.'}});
  const name=v=>{if(typeof v!=='string'||v.trim().length<2||v.trim().length>32)throw error(400,'Use a display name between 2 and 32 characters.');return v.trim();};
  app.get('/api/health',async(req,res)=>{await db.query('SELECT 1');res.json({ok:true});});
  app.get('/api/catalog',async(req,res)=>{const c=await catalog();res.json({...publicCatalog(c.content),revision:c.revision});});
  app.get('/api/me',async(req,res)=>{const s=await session(req);const u=s?(await db.query('SELECT id,name FROM rr_students WHERE id=$1',[s.student_id])).rows[0]:null;res.json({student:u??null,admin:!!await session(req,true),local:!production});});
  app.post('/api/profile',authLimit,async(req,res)=>{
    if(await session(req))throw error(409,'You already have a profile. Sign out before creating another.');
    const display=name(req.body.name);const code='RR-'+randomBytes(16).toString('hex').toUpperCase();const id=randomUUID();
    await db.query('INSERT INTO rr_students(id,name,recovery_hash,created_at) VALUES($1,$2,$3,$4)',[id,display,hash(code),Date.now()]);
    await setSession(req,res,id);res.status(201).json({student:{id,name:display},recoveryCode:code});
  });
  app.post('/api/recover',authLimit,async(req,res)=>{
    const code=String(req.body.code??'').trim().toUpperCase().replaceAll(' ','');
    const u=(await db.query('SELECT id,name FROM rr_students WHERE recovery_hash=$1',[hash(code)])).rows[0];
    if(!u)throw error(401,'That recovery code was not found. Check it and try again.');
    await setSession(req,res,u.id);res.json({student:u});
  });
  app.patch('/api/profile',async(req,res)=>{const u=await student(req);const n=name(req.body.name);await db.query('UPDATE rr_students SET name=$1 WHERE id=$2',[n,u.id]);res.json({student:{id:u.id,name:n}});});
  app.post('/api/logout',async(req,res)=>{for(const key of ['rr_session','rr_admin']){const token=cookie(req,key);if(token)await db.query('DELETE FROM rr_sessions WHERE token_hash=$1',[hash(token)]);res.clearCookie(key,{path:'/'});}res.json({ok:true});});
  const ownedAttempt=async(req)=>{const u=await student(req);const a=(await db.query('SELECT * FROM rr_attempts WHERE id=$1 AND student_id=$2',[req.params.id,u.id])).rows[0];if(!a)throw error(404,'Attempt not found.');return a;};
  const finish=async(a)=>{
    if(a.result)return a;
    // Database row lock serializes finalization with concurrent answer saves.
    return await db.transaction(async tx=>{
      const lock=db.kind==='PostgreSQL'?' FOR UPDATE':'';
      const fresh=(await tx.query('SELECT * FROM rr_attempts WHERE id=$1'+lock,[a.id])).rows[0];
      if(fresh.result)return fresh;
      const result=grade(JSON.parse(fresh.questions),JSON.parse(fresh.answers));const now=Date.now();
      const duration=Math.max(0,Math.floor((Math.min(now,Number(fresh.deadline))-Number(fresh.started_at))/1000));
      await tx.query('UPDATE rr_attempts SET result=$1,score=$2,duration=$3,completed_at=$4 WHERE id=$5',[JSON.stringify(result),result.score,duration,now,a.id]);
      return {...fresh,result:JSON.stringify(result),score:result.score,duration,completed_at:now};
    });
  };
  const view=a=>({id:a.id,title:a.title,mode:a.mode,version:a.version,assessmentId:a.assessment_id,startedAt:Number(a.started_at),deadline:Number(a.deadline),serverTime:Date.now(),answers:JSON.parse(a.answers),revision:a.revision,questions:publicQuestions(JSON.parse(a.questions)),result:a.result?JSON.parse(a.result):null,duration:a.duration});
  app.post('/api/attempts',async(req,res)=>{
    const u=await student(req);const {content}=await catalog();const practice=req.body.mode==='practice';let assessment;
    if(practice){
      const coverage=req.body.coverage;
      if(!Array.isArray(coverage)||!coverage.length||coverage.some(id=>!content.lessons.some(l=>l.id===id&&l.published)))throw error(400,'Choose valid published lessons.');
      const available=content.questions.filter(q=>coverage.includes(q.lessonId)).length;const count=Number(req.body.count??10);
      if(!Number.isInteger(count)||count<1||count>Math.min(available,100))throw error(400,'Choose a question count available in this coverage.');
      assessment={id:'practice',version:1,title:'Personal practice',coverage,count,minutes:0,maxAttempts:0};
    }else{assessment=content.assessments.find(a=>a.id===req.body.assessmentId&&a.published);if(!assessment)throw error(404,'Assessment not found.');}
    const result=await db.transaction(async tx=>{
      if(db.kind==='PostgreSQL')await tx.query('SELECT id FROM rr_students WHERE id=$1 FOR UPDATE',[u.id]);
      const existing=(await tx.query('SELECT * FROM rr_attempts WHERE student_id=$1 AND assessment_id=$2 AND version=$3 AND result IS NULL AND deadline>$4 ORDER BY started_at DESC',[u.id,assessment.id,assessment.version,Date.now()])).rows[0];
      if(existing&&!practice)return existing;
      if(assessment.maxAttempts){const n=(await tx.query('SELECT COUNT(*) AS n FROM rr_attempts WHERE student_id=$1 AND assessment_id=$2 AND version=$3',[u.id,assessment.id,assessment.version])).rows[0].n;if(Number(n)>=assessment.maxAttempts)throw error(409,'You have used all attempts for this assessment version.');}
      const qs=selectQuestions(content,assessment.coverage,assessment.count);if(!qs.length)throw error(400,'No questions in this coverage yet.');
      const now=Date.now();const id=randomUUID();const deadline=now+(assessment.minutes||7*24*60)*60000;
      const a={id,student_id:u.id,assessment_id:assessment.id,version:assessment.version,title:assessment.title,mode:practice?'practice':'ranked',questions:JSON.stringify(qs),answers:'{}',started_at:now,deadline,result:null,total:qs.length,revision:0};
      await tx.query('INSERT INTO rr_attempts(id,student_id,assessment_id,version,title,mode,questions,answers,started_at,deadline,total,revision) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[id,u.id,a.assessment_id,a.version,a.title,a.mode,a.questions,'{}',now,deadline,qs.length,0]);return a;
    });
    res.status(201).json(view(result));
  });
  app.get('/api/attempts',async(req,res)=>{const u=await student(req);const rows=(await db.query('SELECT id,title,mode,assessment_id,version,started_at,deadline,completed_at,score,total,duration FROM rr_attempts WHERE student_id=$1 ORDER BY started_at DESC LIMIT 100',[u.id])).rows;res.json(rows);});
  app.get('/api/attempts/:id',async(req,res)=>{let a=await ownedAttempt(req);if(!a.result&&Date.now()>=Number(a.deadline))a=await finish(a);res.json(view(a));});
  app.put('/api/attempts/:id/answers',async(req,res)=>{
    const a=await ownedAttempt(req);if(a.result)throw error(409,'This attempt has already been submitted.');
    if(Date.now()>=Number(a.deadline)){const ended=await finish(a);return res.status(409).json({error:'Time is up. Your saved answers were submitted.',attempt:view(ended)});}
    const qs=JSON.parse(a.questions),answers=req.body.answers;
    if(!answers||Array.isArray(answers)||typeof answers!=='object'||Object.entries(answers).some(([key,value])=>!qs.some(q=>q.id===key)||!Number.isInteger(value)||value<0||value>3))throw error(400,'Invalid answers.');
    if(req.body.revision!==a.revision)throw error(409,'This attempt changed in another tab. Reload to continue.');
    const r=await db.query('UPDATE rr_attempts SET answers=$1,revision=revision+1 WHERE id=$2 AND revision=$3 AND result IS NULL AND deadline>$4 RETURNING revision',[JSON.stringify(answers),a.id,a.revision,Date.now()]);
    if(!r.rows.length)throw error(409,'This attempt changed or expired. Reload to continue.');
    res.json({saved:true,revision:r.rows[0].revision});
  });
  app.post('/api/attempts/:id/submit',async(req,res)=>res.json(view(await finish(await ownedAttempt(req)))));
  app.post('/api/attempts/:id/check',async(req,res)=>{const a=await ownedAttempt(req);if(a.mode!=='practice'||a.result)throw error(403,'Answer checks are only available during practice.');const q=JSON.parse(a.questions).find(q=>q.id===req.body.questionId);if(!q)throw error(400,'Question not found.');const selected=JSON.parse(a.answers)[q.id];if(selected===undefined)throw error(400,'Save an answer first.');res.json({answer:q.answer,correct:selected===q.answer,explanation:q.explanation,ref:q.ref});});
  app.get('/api/leaderboard',async(req,res)=>{
    const {content}=await catalog();const a=content.assessments.find(a=>a.id===req.query.assessment&&a.published);if(!a)throw error(404,'Choose an assessment.');
    const rows=(await db.query(`WITH ranked AS (SELECT s.name,s.id AS student_id,a.score,a.total,a.duration,a.completed_at,ROW_NUMBER() OVER(PARTITION BY a.student_id ORDER BY a.score DESC,a.duration ASC,a.completed_at ASC) AS best FROM rr_attempts a JOIN rr_students s ON s.id=a.student_id WHERE a.assessment_id=$1 AND a.version=$2 AND a.mode='ranked' AND a.completed_at IS NOT NULL) SELECT name,student_id,score,total,duration,completed_at FROM ranked WHERE best=1 ORDER BY score DESC,duration ASC,completed_at ASC LIMIT 100`,[a.id,a.version])).rows;
    res.json({assessment:a,rows:rows.map((r,i)=>({...r,rank:i+1}))});
  });
  app.post('/api/admin/login',authLimit,async(req,res)=>{if(!adminPassword)throw error(503,'Set ADMIN_PASSWORD on the server to enable administration.');if(typeof req.body.password!=='string'||!safeEqual(req.body.password,adminPassword))throw error(401,'Incorrect administrator password.');await setSession(req,res,null,true);res.json({ok:true});});
  app.get('/api/admin/content',async(req,res)=>{await admin(req);res.json(await catalog());});
  app.put('/api/admin/content',async(req,res)=>{
    await admin(req);const current=await catalog();if(req.body.revision!==current.revision)throw error(409,'Content changed in another tab. Reload before editing.');
    let next;try{next=validateContent(versionContent(structuredClone(req.body.content),current.content));}catch(e){throw error(400,e.message);}
    const updated=await db.query('UPDATE rr_content SET body=$1,revision=revision+1 WHERE id=$2 AND revision=$3 RETURNING revision',[JSON.stringify(next),'main',current.revision]);
    if(!updated.rows.length)throw error(409,'Content changed. Reload before saving.');res.json({content:next,revision:updated.rows[0].revision});
  });
  app.get('/api/admin/results',async(req,res)=>{await admin(req);res.json((await db.query('SELECT s.name,a.id,a.assessment_id,a.version,a.title,a.mode,a.started_at,a.completed_at,a.score,a.total,a.duration FROM rr_attempts a JOIN rr_students s ON s.id=a.student_id ORDER BY a.started_at DESC')).rows);});
  // A development-only iframe gives the application a real narrow CSS viewport for visual QA.
  if(!production){
    app.get('/_preview/mobile',(req,res)=>{const width=['360','390','430'].includes(req.query.width)?req.query.width:'390';res.type('html').send(`<!doctype html><html><head><title>Reviewroom mobile preview</title><link rel="stylesheet" href="/_preview/frame.css"></head><body><iframe title="Mobile reviewer preview" width="${width}" height="844" src="/"></iframe></body></html>`);});
    app.get('/_preview/frame.css',(req,res)=>res.type('css').send('body{margin:0;min-height:100vh;background:#dbe3dd;display:grid;place-items:center}iframe{border:0;border-radius:20px;box-shadow:0 10px 60px #122b3825}'));
  }
  app.use(express.static(fileURLToPath(new URL('../public',import.meta.url)),{maxAge:production?'1h':0}));
  app.get('/{*path}',(req,res)=>{if(req.path.startsWith('/api/'))return res.status(404).json({error:'Endpoint not found.'});res.sendFile(fileURLToPath(new URL('../public/index.html',import.meta.url)));});
  app.use((err,req,res,next)=>{const status=err.status||500;if(status>=500)console.error('Request failed:',err.code||err.name);res.status(status).json({error:status<500?err.message:'The server could not complete this request. Please try again.'});});
  return {app,db};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const {app,db}=await createApp();const server=app.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log(`Reviewroom ready at http://localhost:${Number(process.env.PORT)||3000}`));
  process.on('SIGTERM',()=>server.close(async()=>{await db.close();process.exit(0);}));
}
