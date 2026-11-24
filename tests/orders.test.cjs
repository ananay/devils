const {test}=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');const {load}=require('./load-ts.cjs');
let identity=null,calls=[];const order={id:21,userId:7,trackingCode:'CODE',status:'pending',total:40,shippingName:'Customer',shippingAddress:'Private address'};
const db={order:{findFirst:async args=>{calls.push(args);return (args.where.userId===undefined||args.where.userId===order.userId)&&(!args.where.trackingCode||args.where.trackingCode===order.trackingCode)?order:null},updateMany:async args=>{calls.push(args);return{count:args.where.id===21?1:0}},deleteMany:async args=>{calls.push(args);return{count:args.where.id===21?1:0}}}};
const mocks={'@/lib/auth':{getCurrentUser:async()=>identity},'@/lib/db':{prisma:db}};
const routes=load(path.resolve('src/app/api/orders/[id]/route.ts'),mocks);const lookup=load(path.resolve('src/app/api/orders/lookup/route.ts'),mocks);
const params=id=>({params:Promise.resolve({id:String(id)})});const request=(body={},code='CODE')=>({json:async()=>body,nextUrl:new URL('http://localhost/api/orders/lookup?'+new URLSearchParams({code}))});
test('anonymous requests never query or mutate orders',async()=>{identity=null;for(const method of ['GET','PUT','DELETE']){calls=[];assert.equal((await routes[method](request({status:'shipped'}),params(21))).status,401);assert.equal(calls.length,0)}assert.equal((await lookup.GET(request())).status,401)});
test('customers can read their own order but not someone else’s by ID or tracking code',async()=>{
 identity={userId:7,role:'customer'};assert.equal((await routes.GET(request(),params(21))).status,200);const r=await lookup.GET(request());assert.equal(r.status,200);assert.equal((await r.json()).order.tracking_code,'CODE');
 identity={userId:8,role:'customer'};assert.equal((await routes.GET(request(),params(21))).status,404);assert.equal((await lookup.GET(request())).status,404);
});
test('even owners cannot change fulfillment or delete an order',async()=>{identity={userId:7,role:'customer'};for(const method of ['PUT','DELETE']){calls=[];assert.equal((await routes[method](request({status:'shipped'}),params(21))).status,403);assert.equal(calls.length,0)}});
test('admin can read, change status and delete; arbitrary fields cannot be written',async()=>{
 identity={userId:1,role:'admin'};assert.equal((await routes.GET(request(),params(21))).status,200);
 assert.equal((await routes.PUT(request({status:'shipped'}),params(21))).status,200);
 for(const body of [{status:'shipped',userId:1},{total:0},{status:{set:'shipped'}},{status:'unknown'}]){calls=[];assert.equal((await routes.PUT(request(body),params(21))).status,400);assert.equal(calls.length,0)}
 assert.equal((await routes.DELETE(request(),params(21))).status,200);assert.equal((await routes.DELETE(request(),params(22))).status,404);
});
test('malformed IDs are rejected and tracking input remains a parameter',async()=>{
 identity={userId:7,role:'customer'};for(const id of ['21x','0','-2','2.5'])assert.equal((await routes.GET(request(),params(id))).status,400);
 calls=[];const injection="' OR 1=1 --";assert.equal((await lookup.GET(request({},injection))).status,404);assert.equal(calls[0].where.trackingCode,injection);assert.equal(calls[0].where.userId,7);
});
