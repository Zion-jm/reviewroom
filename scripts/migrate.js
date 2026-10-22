import {openDatabase,migrate} from '../server/db.js';
const db=await openDatabase();try{await migrate(db);console.log('Database schema is ready.');}finally{await db.close();}
