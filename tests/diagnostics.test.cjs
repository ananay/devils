const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');const {load}=require('./load-ts.cjs');
test('removed diagnostics never reads or executes command input',async()=>{
 const route=load(path.resolve('src/app/api/internal/diagnostics/route.ts'),{'@/lib/server-utils':{executeCommand:()=>{throw new Error('must not execute')}}});
 for(const command of ['uptime','echo test; id','$(id)','']){
   let parsed=false;const r=await route.POST({json:async()=>{parsed=true;return{command}}});
   assert.equal(r.status,410);assert.equal(parsed,false);assert.match((await r.json()).error,/removed/);
 }
});
test('server utilities no longer export shell execution',()=>{
 const utils=load(path.resolve('src/lib/server-utils.ts'));assert.equal(utils.executeCommand,undefined);assert.equal(typeof utils.fetchUrl,'function');assert.equal(typeof utils.parseXml,'function');
});
