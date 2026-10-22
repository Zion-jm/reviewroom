import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
export async function openDatabase(options={}) {
  // An explicit in-memory test database must never inherit deployment credentials.
  const inMemory=options.path===':memory:';
  const url=inMemory?undefined:(options.url??process.env.DATABASE_URL);
  if(url){
    const connection=new URL(url);
    // Do not allow connection-string SSL options to override certificate validation.
    for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])connection.searchParams.delete(key);
    const ca=process.env.DATABASE_CA_CERT?.replaceAll('\\n','\n');
    const pool=new pg.Pool({connectionString:connection.toString(),ssl:{rejectUnauthorized:true,...(ca?{ca}:{})},max:5,connectionTimeoutMillis:10000,idleTimeoutMillis:30000});
    const wrap=client=>({query:async(sql,args=[])=>{const r=await client.query(sql,args);return {rows:r.rows,changes:r.rowCount};}});
    return {...wrap(pool),kind:'PostgreSQL',transaction:async fn=>{const c=await pool.connect();try{await c.query('BEGIN');const r=await fn(wrap(c));await c.query('COMMIT');return r;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}},close:()=>pool.end()};
  }
  if(process.env.NODE_ENV==='production'&&!inMemory)throw new Error('Production requires DATABASE_URL for Aiven PostgreSQL.');
  const {DatabaseSync}=await import('node:sqlite');
  const path=options.path??resolve('.data/reviewroom.sqlite');
  if(path!==':memory:')mkdirSync(resolve(path,'..'),{recursive:true});
  const db=new DatabaseSync(path);db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  const query=async(sql,args=[])=>{const statement=db.prepare(sql.replace(/\$\d+/g,'?'));if(/^\s*(SELECT|WITH|PRAGMA)/i.test(sql)||/RETURNING/i.test(sql))return {rows:statement.all(...args),changes:0};const r=statement.run(...args);return {rows:[],changes:r.changes};};
  let queue=Promise.resolve();
  return {query,kind:'SQLite (local only)',transaction:fn=>{const task=queue.then(async()=>{db.exec('BEGIN IMMEDIATE');try{const r=await fn({query});db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}});queue=task.catch(()=>{});return task;},close:async()=>db.close()};
}
export async function migrate(db){
  const sql=readFileSync(new URL('../migrations/001-initial.sql',import.meta.url),'utf8');
  await db.transaction(async tx=>{for(const statement of sql.split(';').map(x=>x.trim()).filter(Boolean))await tx.query(statement);});
}
