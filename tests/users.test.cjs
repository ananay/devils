const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');const {load}=require('./load-ts.cjs');
let identity=null,calls=[];
const db={user:{findMany:async args=>{calls.push(args);return[]},findUnique:async args=>{calls.push(args);return{id:7}},update:async args=>{calls.push(args);return{id:7}},delete:async args=>{calls.push(args)}}};
const mocks={'@/lib/auth':{getCurrentUser:async()=>identity},'@/lib/db':{prisma:db}};
const list=load(path.resolve('src/app/api/internal/users/route.ts'),mocks);const profile=load(path.resolve('src/app/api/users/[id]/route.ts'),mocks);
const params=id=>({params:Promise.resolve({id:String(id)})});const request=body=>({json:async()=>body});
test('export rejects anonymous and customer access before querying',async()=>{
 for(const user of [null,{userId:7,role:'customer'}]){identity=user;calls=[];assert.equal((await list.GET()).status,user?403:401);assert.equal(calls.length,0)}
});
test('admin export returns only approved fields',async()=>{
 identity={userId:1,role:'admin'};calls=[];assert.equal((await list.GET()).status,200);assert.deepEqual(Object.keys(calls[0].select).sort(),['createdAt','email','id','name','role']);
});
test('cross-account reads/writes and customer deletion cannot reach database',async()=>{
 identity={userId:7,role:'customer'};
 for(const [method,id] of [['GET',8],['PUT',8],['DELETE',7]]){calls=[];assert.equal((await profile[method](request({name:'New'}),params(id))).status,403);assert.equal(calls.length,0)}
});
test('customer profile works but role/password/reset-token injection is rejected',async()=>{
 identity={userId:7,role:'customer'};
 assert.equal((await profile.GET(request({}),params(7))).status,200);
 assert.equal((await profile.PUT(request({name:'New',email:'new@example.test',bio:null,avatarUrl:'https://example.test/a.png'}),params(7))).status,200);
 for(const body of [{role:'admin'},{password:'x'},{resetToken:'x'},{id:8},{name:{set:'bad'}},[]]){calls=[];assert.equal((await profile.PUT(request(body),params(7))).status,400);assert.equal(calls.length,0)}
});
test('admin can assign supported roles; malformed IDs are rejected',async()=>{
 identity={userId:1,role:'admin'};assert.equal((await profile.PUT(request({role:'admin'}),params(7))).status,200);
 assert.equal((await profile.PUT(request({role:'superadmin'}),params(7))).status,400);
 for(const id of ['7junk','0','-1','1.5','9007199254740992'])assert.equal((await profile.GET(request({}),params(id))).status,400);
});
