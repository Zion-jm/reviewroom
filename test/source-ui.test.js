import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const content=JSON.parse(readFileSync(new URL('../data/content.json',import.meta.url),'utf8'));
test('all source image windows exist and stay inside the original image',()=>{
 for(const q of content.questions.filter(q=>q.visual)){const v=q.visual;assert.ok(existsSync(new URL('../public'+v.asset,import.meta.url)));assert.ok(v.crop[0]+v.crop[2]<=v.width);assert.ok(v.crop[1]+v.crop[3]<=v.height);assert.ok(v.crop[2]>10&&v.crop[3]>10);}
});
test('glossary renders distinct terms and image questions render a source figure',()=>{
 const script=readFileSync(new URL('../public/app.js',import.meta.url),'utf8').replace(/route\(\);\s*$/,'');
 const context=vm.createContext({document:{addEventListener(){}},window:{addEventListener(){}},content});
 vm.runInContext(script,context);vm.runInContext('state.catalog=content;state.lesson=null;',context);
 assert.equal(vm.runInContext('glossaryEntries().length',context),content.questions.length);
 const html=vm.runInContext('glossary()',context);assert.ok(html.includes('Practice every term'));assert.ok(!html.includes('sample the larger bank'));
 const q=content.questions.find(q=>q.visual);context.question=q;
 const figure=vm.runInContext('sourceFigure(question.visual)',context);assert.ok(figure.includes('<svg'));assert.ok(figure.includes(q.visual.asset));assert.ok(!figure.includes(q.options[q.answer]));
 const page=vm.runInContext("state.attempt={id:'demo',title:'Quiz',mode:'practice',questions:[question],answers:{},result:null};quiz()",context);assert.ok(page.includes('<svg'));assert.ok(page.includes(q.prompt));
});
