import { before, after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { readFile } from 'node:fs/promises';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { notificationEmail } from '../src/email/contactNotification.js';
import { Car,Article,Page,Subscriber,Inquiry,EmailReply,Media,Activity,Counter } from '../src/models/index.js';
process.env.NODE_ENV='test';process.env.CLIENT_URL='http://localhost:5173';
let mongo:MongoMemoryServer;
const authenticated=[(_req:unknown,res:{locals:Record<string,string>},next:()=>void)=>{res.locals.actor='test_admin';next();}];
const app=()=>createApp({authenticate:authenticated,notifyContact:async()=>({status:'Unavailable',error:'Notifications disabled in this test.'})});
const vehicle={year:1969,make:'Ford',model:'Test machine',trim:'Not provided',price:100,miles:'Not provided',power:'Not provided',type:'Test',color:'Test',image:'https://example.test/car.jpg',tag:'Test',location:'Test',description:'Test record, not a real sale listing.',status:'Draft'};
const story={slug:'test-story',title:'Test story',category:'Test',excerpt:'Test editorial',image:'https://example.test/cover.jpg',body:'## Opening\n\nTest article content.',status:'Draft'};
before(async()=>{mongo=await MongoMemoryServer.create({binary:{version:'7.0.14'}});await mongoose.connect(mongo.getUri());await Promise.all([Car,Article,Page,Subscriber,Inquiry,EmailReply,Media,Activity,Counter].map(model=>model.init()));});
beforeEach(async()=>{await Promise.all(Object.values(mongoose.connection.collections).map(collection=>collection.deleteMany({})));await Promise.all(['media.files','media.chunks'].map(name=>mongoose.connection.db!.collection(name).deleteMany({})));});
after(async()=>{await mongoose.disconnect();await mongo?.stop();});
test('all admin resources fail closed without configured Clerk; public cannot read inbox',async()=>{const previous=process.env.CLERK_SECRET_KEY;delete process.env.CLERK_SECRET_KEY;const secure=createApp();for(const route of ['me','cars','articles','pages','media','subscribers','subscribers/export','inquiries','activity'])await request(secure).get(`/api/admin/${route}`).expect(503);await request(secure).post('/api/admin/cars').send(vehicle).expect(503);await request(secure).delete('/api/admin/cars/1').expect(503);await request(secure).get('/api/public/inquiries').expect(404);if(previous)process.env.CLERK_SECRET_KEY=previous;});
test('cars persist, draft visibility is enforced, pagination and deletion work',async()=>{const api=app();const created=await request(api).post('/api/admin/cars').send(vehicle).expect(201);assert.equal(created.body.id,1);assert.equal((await request(api).get('/api/public/cars')).body.total,0);await request(api).get('/api/public/cars/1').expect(404);await request(api).put('/api/admin/cars/1').send({...vehicle,status:'Listed'}).expect(200);const listed=await request(api).get('/api/public/cars?limit=1&page=1&q=Ford').expect(200);assert.equal(listed.body.total,1);assert.equal(listed.body.items[0].model,'Test machine');assert.equal(listed.body.items[0].status,undefined);await request(api).get('/api/public/cars/1').expect(200);await request(api).get('/api/admin/cars?limit=1000').expect(400);await request(api).get('/api/admin/cars/invalid').expect(400);await request(api).delete('/api/admin/cars/1').expect(200);assert.equal(await Car.countDocuments(),0);assert.ok(await Activity.countDocuments()>=3);});
test('journal unique slugs and public publication state',async()=>{const api=app();const first=await request(api).post('/api/admin/articles').send(story).expect(201);await request(api).post('/api/admin/articles').send(story).expect(409);await request(api).get('/api/public/articles/test-story').expect(404);await request(api).put(`/api/admin/articles/${first.body.id}`).send({...story,status:'Published'}).expect(200);const published=await request(api).get('/api/public/articles/test-story').expect(200);assert.equal(published.body.body[0].heading,'Opening');assert.equal(published.body.status,undefined);await request(api).delete(`/api/admin/articles/${first.body.id}`).expect(200);await request(api).get('/api/public/articles/test-story').expect(404);});
test('page drafts preserve the last published version and unknown keys are rejected',async()=>{const api=app();const page={title:'Home',intro:'Published introduction',sections:[{id:'intro',heading:'Heading',body:'Approved copy'}],status:'Published'};await request(api).put('/api/admin/pages/home').send(page).expect(200);await request(api).put('/api/admin/pages/home').send({...page,status:'Draft',intro:'Private draft'}).expect(200);const response=await request(api).get('/api/public/pages/home').expect(200);assert.equal(response.body.intro,'Published introduction');const privatePage=await request(api).get('/api/admin/pages').expect(200);assert.equal(privatePage.body.items[0].intro,'Private draft');await request(api).get('/api/public/pages/unknown').expect(400);});
test('newsletter requires consent, deduplicates, preserves opt-outs, and exports safely',async()=>{const api=app();const data={email:'reader@example.test',name:'=formula',consent:true,consentVersion:'newsletter-v1'};await request(api).post('/api/public/newsletter').send({...data,consent:false}).expect(400);await request(api).post('/api/public/newsletter').send(data).expect(200);await request(api).post('/api/public/newsletter').send({...data,email:'READER@example.test'}).expect(200);assert.equal(await Subscriber.countDocuments(),1);const subscriber=await Subscriber.findOne();assert.equal(subscriber!.get('consent.version'),'newsletter-v1');await request(api).patch(`/api/admin/subscribers/${subscriber!._id}`).send({status:'Unsubscribed'}).expect(200);await request(api).post('/api/public/newsletter').send(data).expect(200);assert.equal((await Subscriber.findOne())!.get('status'),'Unsubscribed');const csv=await request(api).get('/api/admin/subscribers/export').expect(200);assert.ok(csv.text.includes("'=formula"));await request(api).delete(`/api/admin/subscribers/${subscriber!._id}`).expect(200);assert.equal(await Subscriber.countDocuments(),0);});
test('contact persists car inquiries and validates before writing',async()=>{const api=app();await request(api).post('/api/public/contact').send({name:'Reader',email:'bad',subject:'Inquiry',message:'A full message for the garage.'}).expect(400);await request(api).post('/api/public/contact').send({name:'Reader',email:'reader@example.test',subject:'Inquiry',message:'A full message for the garage.'}).expect(201);assert.equal(await Inquiry.countDocuments(),1);const inquiry=await Inquiry.findOne();await request(api).patch(`/api/admin/inquiries/${inquiry!._id}`).send({status:'Archived'}).expect(200);assert.equal((await Inquiry.findOne())!.get('status'),'Archived');});
test('drafts never send; failed explicit send retains draft, retries idempotently, and sends escaped HTML',async()=>{let sends=0;const keys:string[]=[];let capturedHtml='';const api=createApp({authenticate:authenticated,sendEmail:async(input,key)=>{sends++;keys.push(key);capturedHtml=input.html;if(sends===1)throw new Error('Simulated provider failure');return {id:'provider-test-only'};}});const inquiry=await Inquiry.create({name:'Reader',email:'reader@example.test',subject:'Question',message:'Testing reply persistence.'});const reply={recipient:'reader@example.test',subject:'Re: Question',message:'Hello <script>alert(1)</script> & goodbye.'};const draft=await request(api).post(`/api/admin/inquiries/${inquiry._id}/drafts`).send(reply).expect(201);assert.equal(sends,0);await request(api).post(`/api/admin/replies/${draft.body.id}/send`).expect(502);assert.equal((await EmailReply.findById(draft.body.id))!.get('status'),'Failed');await request(api).post(`/api/admin/inquiries/${inquiry._id}/drafts`).send(reply).expect(201);await request(api).post(`/api/admin/replies/${draft.body.id}/send`).expect(200);assert.equal(keys[0],keys[1]);assert.ok(capturedHtml.includes('MUSTANG GARAGE'));assert.ok(capturedHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt; &amp; goodbye.'));assert.ok(!capturedHtml.includes('<script>alert(1)</script>'));await request(api).post(`/api/admin/replies/${draft.body.id}/send`).expect(409);assert.equal(sends,2);assert.equal((await Inquiry.findById(inquiry._id))!.get('status'),'Replied');assert.equal((await EmailReply.findById(draft.body.id))!.get('providerId'),'provider-test-only');});
test('project media paths work and image uploads persist in MongoDB GridFS',async()=>{const api=app();await request(api).get('/media/Collection010.png').expect('Content-Type',/image\/png/).expect(200);const image=await readFile(new URL('../public/media/Collection010.png',import.meta.url));const uploaded=await request(api).post('/api/admin/media').field('alt','Test upload image').attach('image',image,'test-upload.png').expect(201);assert.equal(uploaded.body.origin,'MongoDB GridFS');assert.match(uploaded.body.src,/^\/media\/uploads\/[a-f\d]{24}$/i);await request(api).get(uploaded.body.src).expect('Content-Type',/image\/png/).expect(200);const car=await Car.create({...vehicle,id:1,image:uploaded.body.src,status:'Listed'});await request(api).delete(`/api/admin/media/${uploaded.body.id}`).expect(409);await car.updateOne({status:'Draft'});await request(api).delete(`/api/admin/media/${uploaded.body.id}`).expect(200);await request(api).get(uploaded.body.src).expect(404);assert.ok(await Activity.countDocuments()>=2);});
test('security headers, restricted CORS, validation and public form rate limit',async()=>{const api=app();const response=await request(api).get('/api/public/cars').set('Origin','https://untrusted.example').expect(200);assert.equal(response.headers['access-control-allow-origin'],undefined);assert.ok(response.headers['x-content-type-options']);const allowed=await request(api).get('/api/public/cars').set('Origin','http://localhost:5173').expect(200);assert.equal(allowed.headers['access-control-allow-origin'],'http://localhost:5173');for(let n=0;n<8;n++)await request(api).post('/api/public/contact').send({}).expect(400);await request(api).post('/api/public/contact').send({}).expect(429);});


test('contact notification targets the configured owner with the visitor as Reply-To',async()=>{
 let calls=0;
 const api=createApp({authenticate:authenticated,notifyContact:async(data)=>{
  calls++;
  assert.ok(await Inquiry.exists({_id:data.id}),'Inquiry must be persisted before attempting email.');
  const payload=notificationEmail(data,'muaddhalsway@gmail.com','Mustang Garage <onboarding@resend.dev>');
  assert.equal(payload.to,'muaddhalsway@gmail.com');
  assert.equal(payload.replyTo,'visitor@example.test');
  assert.ok(payload.html.includes('CONTACT INQUIRY / ADMIN INBOX'));
  assert.ok(payload.html.includes('&lt;script&gt;'));
  assert.ok(!payload.html.includes('<script>'));
  return {status:'Accepted',providerId:'notification-test-only'};
 }});
 const response=await request(api).post('/api/public/contact').send({name:'Visitor',email:'visitor@example.test',subject:'A garage question',message:'Hello <script>not executable</script>',to:'attacker@example.test'}).expect(201);
 assert.equal(calls,1);
 assert.equal(response.body.notification,undefined,'Private delivery metadata must not be exposed.');
 const inquiry=await Inquiry.findOne();
 assert.equal(inquiry!.get('status'),'Unread');
 assert.equal(inquiry!.get('notification.status'),'Accepted');
 assert.equal(inquiry!.get('notification.providerId'),'notification-test-only');
 assert.ok(inquiry!.get('notification.attemptedAt'));
});

test('notification rejection preserves the inquiry and its failure status',async()=>{
 const api=createApp({authenticate:authenticated,notifyContact:async()=>({status:'Failed',error:'Provider rejected this notification.'})});
 await request(api).post('/api/public/contact').send({name:'Visitor',email:'visitor@example.test',subject:'A garage question',message:'Keep this message if email fails.'}).expect(201);
 const inquiry=await Inquiry.findOne();
 assert.equal(inquiry!.get('message'),'Keep this message if email fails.');
 assert.equal(inquiry!.get('notification.status'),'Failed');
 assert.equal(inquiry!.get('status'),'Unread');
 assert.equal((await request(api).get('/api/admin/inquiries').expect(200)).body.total,1);
});

test('notification network errors and invalid form input cannot lose or send an invalid inquiry',async()=>{
 let calls=0;
 const api=createApp({authenticate:authenticated,notifyContact:async()=>{calls++;throw new Error('Simulated network problem.');}});
 await request(api).post('/api/public/contact').send({name:'Visitor',email:'invalid',subject:'Question',message:'Invalid address must not trigger a send.'}).expect(400);
 assert.equal(calls,0);
 assert.equal(await Inquiry.countDocuments(),0);
 await request(api).post('/api/public/contact').send({name:'Visitor',email:'visitor@example.test',subject:'Question',message:'A valid inquiry remains in the inbox.'}).expect(201);
 assert.equal(calls,1);
 assert.equal((await Inquiry.findOne())!.get('notification.status'),'Unconfirmed');
});
