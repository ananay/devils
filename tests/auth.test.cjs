const {test}=require('node:test'); const assert=require('node:assert/strict');
const path=require('node:path');const jwt=require('jsonwebtoken');const {load}=require('./load-ts.cjs');
const key='a'.repeat(64);process.env.JWT_SECRET=key;
let cookieValues={},record={id:7,email:'customer@example.test',name:'Customer',role:'customer'};
const auth=load(path.resolve('src/lib/auth.ts'),{'next/headers':{cookies:async()=>({get:k=>cookieValues[k]===undefined?undefined:{value:cookieValues[k]}})},'./db':{prisma:{user:{findUnique:async()=>record}}}});
const claims={userId:7,email:record.email,name:record.name,role:'admin'};
test('signed login and session cookies work; current database role wins',async()=>{
 const token=auth.generateToken(claims);assert.equal(auth.verifyToken(token).userId,7);
 cookieValues={token};assert.equal((await auth.getCurrentUser()).role,'customer');
 cookieValues={session:auth.createSession(claims)};assert.equal((await auth.getCurrentUser()).userId,7);
});
test('reject unsigned JWTs, unsigned sessions, wrong signatures and expired tokens',()=>{
 assert.equal(auth.verifyToken(jwt.sign(claims,'',{algorithm:'none'})),null);
 assert.equal(auth.parseSession(Buffer.from(JSON.stringify(claims)).toString('base64')),null);
 const opts={algorithm:'HS256',audience:'devils-advocate',issuer:'devils-advocate:v2',expiresIn:'1h'};
 assert.equal(auth.verifyToken(jwt.sign(claims,'b'.repeat(64),opts)),null);
 assert.equal(auth.verifyToken(jwt.sign(claims,key,{...opts,expiresIn:-1})),null);
 assert.equal(auth.verifyToken(jwt.sign(claims,key,{...opts,issuer:'old'})),null);
 assert.equal(auth.verifyToken(jwt.sign({...claims,userId:-1},key,opts)),null);
});
test('invalid primary cookie cannot fall back; removed accounts cannot log in',async()=>{
 cookieValues={token:'invalid',session:auth.createSession(claims)};assert.equal(await auth.getCurrentUser(),null);
 cookieValues={token:auth.generateToken(claims)};const old=record;record=null;assert.equal(await auth.getCurrentUser(),null);record=old;
});
test('missing or weak keys fail closed',()=>{
 for(const value of ['', 'devil666']){process.env.JWT_SECRET=value;assert.throws(()=>auth.generateToken(claims));assert.equal(auth.verifyToken('bad'),null);}process.env.JWT_SECRET=key;
});
test('public signup cannot choose admin role and sets HttpOnly cookies',async()=>{
 let inserted;const route=load(path.resolve('src/app/api/auth/register/route.ts'),{
 '@/lib/auth':auth,
 '@/lib/db':{prisma:{user:{findUnique:async()=>null,create:async({data})=>{inserted=data;return{id:8,...data}}}}},
 });
 const r=await route.POST({json:async()=>({email:'new@example.test',password:'long-test-password',name:'New',role:'admin'})});
 assert.equal(r.status,200);assert.equal(inserted.role,'customer');assert.match(r.headers.get('set-cookie'),/HttpOnly/);
});
