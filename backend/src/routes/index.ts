import express, { type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { Resend } from 'resend';
import type { ContactNotifier } from '../email/contactNotification.js';
import { Car, Counter, Article, Page, Subscriber, Inquiry, EmailReply, Media, User, models } from '../models/index.js';
import { carSchema, articleSchema, pageSchema, replySchema, objectId, pageKey, pagination, sectionsFromText } from '../validation.js';
import { adminAuthentication } from '../middleware/adminAuth.js';
import { HttpError } from '../middleware/httpError.js';
import { renderReplyEmail } from '../email/replyTemplate.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../controllers/contentController.js';
import { createPublicRoutes } from './publicRoutes.js';
import { clerkUserAuthentication } from '../middleware/adminAuth.js';
const ensure=(condition:unknown,status:number,message:string)=>{if(!condition)throw new HttpError(status,message);};
const literal=(q:string)=>new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');
const emailReady=()=>Boolean(process.env.RESEND_API_KEY&&process.env.RESEND_FROM_EMAIL);
const mediaReady=()=>mongoose.connection.readyState===1;
const log=logActivity;
export function createApp(options:{authenticate?:RequestHandler[];notifyContact?:ContactNotifier;sendEmail?:(input:{to:string;subject:string;text:string;html:string},key:string)=>Promise<{id:string}>}={}) {
 const app=express();app.disable('x-powered-by');app.set('query parser','simple');
 app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
 const origins=(process.env.CLIENT_URL??'http://localhost:5173').split(',').map(v=>v.trim()).filter(Boolean);
 if(process.env.NODE_ENV==='production'&&(!process.env.CLIENT_URL||origins.includes('*')))throw new Error('Set explicit CLIENT_URL origins in production.');
 app.use(cors({origin:(origin,cb)=>cb(null,!origin||origins.includes(origin)),methods:['GET','POST','PUT','PATCH','DELETE'],allowedHeaders:['Content-Type','Authorization']}));
  app.use(express.json({limit:'150kb'}));
  app.get('/media/uploads/:id',async(req,res)=>{const fileId=new mongoose.Types.ObjectId(objectId.parse(req.params.id));const file=await mongoose.connection.db!.collection('media.files').findOne({_id:fileId});ensure(file,404,'Image not found.');res.setHeader('Content-Type',String(file!.metadata?.contentType??'application/octet-stream'));res.setHeader('Content-Disposition','inline');res.setHeader('Cache-Control','public, max-age=31536000, immutable');const bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db!,{bucketName:'media'});bucket.openDownloadStream(fileId).on('error',()=>{if(!res.headersSent)res.status(404).end();}).pipe(res);});
  app.use('/media',express.static(fileURLToPath(new URL('../../public/media',import.meta.url)),{fallthrough:false,maxAge:'1d'}));
  app.get('/api/health',(_req,res)=>res.status(mongoose.connection.readyState===1?200:503).json({status:mongoose.connection.readyState===1?'ready':'unavailable'}));
  app.use('/api/public',createPublicRoutes({notifyContact:options.notifyContact}));
  const accountRoutes=express.Router();accountRoutes.use(...clerkUserAuthentication());accountRoutes.post('/sync',async(_req,res)=>{const profile=res.locals.clerkProfile as {id:string;email:string;name:string;imageUrl:string;role:'user'|'admin'};await User.findOneAndUpdate({clerkUserId:profile.id},{$set:{email:profile.email,name:profile.name,imageUrl:profile.imageUrl,role:profile.role,lastLoginAt:new Date()},$setOnInsert:{clerkUserId:profile.id}},{upsert:true,new:true,runValidators:true});res.json({ok:true});});app.use('/api/auth',accountRoutes);
 const admin=express.Router(); admin.use(...(options.authenticate??adminAuthentication()));
 admin.get('/me',(_req,res)=>res.json({authorized:true,mediaEnabled:mediaReady(),emailEnabled:emailReady()}));
 admin.get('/subscribers/export',async(req,res)=>{const q=z.string().max(200).parse(req.query.q??'');const filter=q?{$or:[{email:literal(q)},{name:literal(q)}]}:{};const cell=(v:unknown)=>`"${String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')}"`;res.setHeader('Content-Disposition','attachment; filename="mustang-garage-subscribers.csv"');res.type('text/csv');res.write('\uFEFFName,Email,Status,Consent version,Consent time\r\n');for await(const row of Subscriber.find(filter).sort({_id:1}).cursor()){res.write([row.get('name'),row.get('email'),row.get('status'),row.get('consent.version'),row.get('consent.at')].map(cell).join(',')+'\r\n');}res.end();});
 for(const [resource,Model] of Object.entries(models)) {
  admin.get(`/${resource}`,async(req,res)=>{const {page,limit,q,status}=pagination.parse(req.query);const fields:Record<string,string[]>={cars:['make','model'],articles:['title','slug'],subscribers:['name','email'],inquiries:['name','email','subject'],media:['name','alt'],users:['name','email'],pages:['title'],activity:['text']};const filter={...(q?{$or:fields[resource].map(field=>({[field]:literal(q)}))}:{}),...(status?{status}:{})};const [rows,total]=await Promise.all([Model.find(filter).sort(resource==='cars'?{id:1}:{createdAt:-1,_id:-1}).skip((page-1)*limit).limit(limit),Model.countDocuments(filter)]);const items=await Promise.all(rows.map(async row=>{const item=row.toJSON();if(resource==='pages'){item.id=item.key;delete item.published;}if(resource==='activity')item.time=String(item.createdAt);if(resource==='inquiries'){item.received=String(item.createdAt);item.replies=(await EmailReply.find({inquiryId:row._id}).sort({createdAt:1})).map(reply=>reply.toJSON());item.reply=(item.replies as unknown[]).at(-1);}if(resource==='media')item.references=await mediaReferences(String(item.src));return item;}));res.json({items,total,page,limit});});
 }
 admin.get('/cars/:id',async(req,res)=>{const car=await Car.findOne({id:z.coerce.number().int().positive().parse(req.params.id)});ensure(car,404,'Machine not found.');res.json(car);});
 admin.post('/cars',async(req,res)=>{const data=carSchema.parse(req.body);const count=await Counter.findOneAndUpdate({_id:'cars'},{$inc:{seq:1}},{upsert:true,new:true});const car=await Car.create({...data,id:count!.seq});await log(res.locals.actor,`Created car ${car.get('id')} / ${data.status}`);res.status(201).json(car);});
 admin.put('/cars/:id',async(req,res)=>{const id=z.coerce.number().int().positive().parse(req.params.id);const data=carSchema.parse(req.body);const car=await Car.findOneAndUpdate({id},{$set:data},{new:true,runValidators:true});ensure(car,404,'Machine not found.');await log(res.locals.actor,`Updated car ${id} / ${data.status}`);res.json(car);});
 admin.delete('/cars/:id',async(req,res)=>{const id=z.coerce.number().int().positive().parse(req.params.id);ensure(await Car.findOneAndDelete({id}),404,'Machine not found.');await log(res.locals.actor,`Deleted car ${id}`);res.json({ok:true});});
 admin.post('/articles',async(req,res)=>{const data=articleSchema.parse(req.body);const article=await Article.create({...data,sections:sectionsFromText(data.body)});await log(res.locals.actor,`Created article ${data.slug} / ${data.status}`);res.status(201).json(article);});
 admin.put('/articles/:id',async(req,res)=>{const data=articleSchema.parse(req.body);const article=await Article.findByIdAndUpdate(objectId.parse(req.params.id),{$set:{...data,sections:sectionsFromText(data.body)}},{new:true,runValidators:true});ensure(article,404,'Story not found.');await log(res.locals.actor,`Updated article ${data.slug} / ${data.status}`);res.json(article);});
 admin.delete('/articles/:id',async(req,res)=>{ensure(await Article.findByIdAndDelete(objectId.parse(req.params.id)),404,'Story not found.');await log(res.locals.actor,'Deleted journal article');res.json({ok:true});});
 admin.put('/pages/:key',async(req,res)=>{const key=pageKey.parse(req.params.key);const data=pageSchema.parse(req.body);const update:Record<string,unknown>={...data};if(data.status==='Published')update.published={id:key,...data};const page=await Page.findOneAndUpdate({key},{$set:update},{upsert:true,new:true,runValidators:true});await log(res.locals.actor,`Saved ${key} page / ${data.status}`);res.json(page);});
 admin.patch('/subscribers/:id',async(req,res)=>{const status=z.enum(['Unsubscribed','Bounced']).parse(req.body.status);ensure(await Subscriber.findByIdAndUpdate(objectId.parse(req.params.id),{$set:{status,unsubscribedAt:new Date()}}),404,'Subscriber not found.');await log(res.locals.actor,`Subscriber marked ${status}`);res.json({ok:true});});
 admin.delete('/subscribers/:id',async(req,res)=>{ensure(await Subscriber.findByIdAndDelete(objectId.parse(req.params.id)),404,'Subscriber not found.');await log(res.locals.actor,'Removed subscriber');res.json({ok:true});});
 admin.patch('/inquiries/:id',async(req,res)=>{const status=z.enum(['Read','Unread','Archived']).parse(req.body.status);ensure(await Inquiry.findByIdAndUpdate(objectId.parse(req.params.id),{$set:{status}}),404,'Inquiry not found.');res.json({ok:true});});
 admin.post('/inquiries/:id/drafts',async(req,res)=>{const id=objectId.parse(req.params.id);ensure(await Inquiry.exists({_id:id}),404,'Inquiry not found.');const data=replySchema.parse(req.body);let draft=await EmailReply.findOne({inquiryId:id,status:{$in:['Draft','Failed']}}).sort({createdAt:-1});if(draft){const changed=['recipient','subject','message'].some(field=>draft!.get(field)!==data[field as keyof typeof data]);draft.set({...data,status:'Draft',error:null,...(changed?{key:randomUUID()}: {})});await draft.save();}else draft=await EmailReply.create({...data,inquiryId:id,actor:res.locals.actor,key:randomUUID()});await log(res.locals.actor,'Saved inquiry reply draft');res.status(201).json(draft);});
  admin.post('/replies/:id/send',async(req,res)=>{
  ensure(emailReady()||options.sendEmail,503,'Email is unavailable. Configure Resend and a verified sender. Your draft is preserved.');
  const id=objectId.parse(req.params.id);const existing=await EmailReply.findById(id);ensure(existing,404,'Draft not found.');ensure(existing!.get('status')!=='Sent',409,'This reply has already been sent.');
  const draft=await EmailReply.findOneAndUpdate({_id:id,status:{$in:['Draft','Failed']}},{$set:{status:'Sending',attemptedAt:new Date()}},{new:true});ensure(draft,409,'Reply is already being sent. Review its status before retrying.');
  try {
    const subject=String(draft!.get('subject'));const message=String(draft!.get('message'));
    const input={to:String(draft!.get('recipient')),subject,text:message,html:renderReplyEmail(subject,message)};
   let provider:{id:string};
   if(options.sendEmail)provider=await options.sendEmail(input,String(draft!.get('key')));
     else {const from=process.env.RESEND_FROM_EMAIL!;const result=await new Resend(process.env.RESEND_API_KEY).emails.send({from,...input},{idempotencyKey:String(draft!.get('key'))});if(result.error||!result.data){console.error('Resend rejected an inquiry reply',{type:result.error?.name??'ProviderError'});const reason=from.includes('onboarding@resend.dev')?'Resend test sender can only deliver to the email address registered to your Resend account.':'Verify the Resend API key, sender domain, and recipient.';await EmailReply.updateOne({_id:id,status:'Sending'},{$set:{status:'Failed',providerStatus:'rejected',error:`${reason} Your draft is preserved.`}});throw new HttpError(502,`Resend rejected this email. ${reason} Your reply draft is preserved.`);}provider=result.data;}
   draft!.set({status:'Sent',sentAt:new Date(),providerId:provider.id,providerStatus:'accepted',error:null});await draft!.save();await Inquiry.updateOne({_id:draft!.get('inquiryId')},{$set:{status:'Replied'}});await log(res.locals.actor,'Sent inquiry reply / provider accepted');res.json(draft);
   }catch(error){if(error instanceof HttpError)throw error;await EmailReply.updateOne({_id:id,status:'Sending'},{$set:{status:'Failed',providerStatus:'error',error:'Sending could not be confirmed. Review provider history before retrying.'}});throw new HttpError(502,'Email delivery could not be confirmed. Your reply draft is preserved. Check Resend email logs before retrying to avoid a duplicate.');}
  });
  const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024,files:1,fields:2}});
  admin.post('/media',upload.single('image'),async(req,res)=>{ensure(mediaReady(),503,'Media storage is unavailable.');ensure(req.file,400,'Select an image.');const kind=await fileTypeFromBuffer(req.file!.buffer);ensure(kind&&['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(kind.mime),400,'Unsupported image content.');const alt=z.string().trim().min(1).max(250).parse(req.body.alt);const bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db!,{bucketName:'media'});const fileId=await new Promise<mongoose.Types.ObjectId>((resolve,reject)=>{const stream=bucket.openUploadStream(req.file!.originalname.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,180),{metadata:{alt,contentType:kind!.mime,uploadedBy:res.locals.actor}});stream.once('error',reject);stream.once('finish',()=>resolve(stream.id));stream.end(req.file!.buffer);});try{const src=`/media/uploads/${fileId.toString()}`;const media=await Media.create({name:req.file!.originalname.slice(0,250),src,alt,contentType:kind!.mime,fileId,publicId:`gridfs:${fileId.toString()}`,origin:'MongoDB GridFS'});await log(res.locals.actor,'Uploaded image to MongoDB media storage');res.status(201).json(media);}catch(error){await bucket.delete(fileId).catch(()=>undefined);throw error;}});
  admin.delete('/media/:id',async(req,res)=>{const media=await Media.findById(objectId.parse(req.params.id));ensure(media,404,'Image not found.');const fileId=media!.get('fileId') as mongoose.Types.ObjectId|undefined;ensure(fileId,409,'Project image files are part of the application and cannot be deleted here.');const refs=await mediaReferences(String(media!.get('src')));ensure(!refs.length,409,`Image is used by published content: ${refs.join(', ')}`);const bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db!,{bucketName:'media'});await bucket.delete(fileId!);await media!.deleteOne();await log(res.locals.actor,'Deleted uploaded image from MongoDB media storage');res.json({ok:true});});
 async function mediaReferences(src:string){const [cars,articles,pages]=await Promise.all([Car.find({status:'Listed',image:src}).select('id model'),Article.find({status:'Published',image:src}).select('slug'),Page.find({published:{$ne:null}}).select('key published')]);return [...cars.map(c=>`car:${c.get('id')}`),...articles.map(a=>`article:${a.get('slug')}`),...pages.filter(p=>JSON.stringify(p.get('published')).includes(src)).map(p=>`page:${p.get('key')}`)];}
 app.use('/api/admin',admin);
 app.use((_req,res)=>res.status(404).json({error:'Route not found.'}));
  app.use(errorHandler);
 return app;
}
