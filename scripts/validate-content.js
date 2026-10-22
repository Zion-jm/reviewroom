import {readFileSync} from 'node:fs';
import {validateContent} from '../server/content.js';
const c=validateContent(JSON.parse(readFileSync(new URL('../data/content.json',import.meta.url),'utf8')));
console.log(`Content valid: ${c.subjects.length} subject, ${c.lessons.length} lessons, ${c.questions.length} questions, ${c.assessments.length} assessments.`);
