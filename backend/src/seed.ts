import './environment.js';
import mongoose from 'mongoose';
import { readFile,readdir } from 'node:fs/promises';
import { basename } from 'node:path';
import { Car,Counter,Article,Page,Media } from './models/index.js';
const input=JSON.parse(await readFile(new URL('./seed-data.json',import.meta.url),'utf8'));
if(!process.env.MONGODB_URI)throw new Error('Configure MONGODB_URI before seeding.');
const publish=process.argv.includes('--publish');
try{await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
 // Preserve existing collections; this command never drops or overwrites business records.
 if(await Car.countDocuments()===0){await Car.insertMany(input.cars.map((car:Record<string,unknown>)=>({...car,status:publish?'Listed':'Draft'})));console.info('Existing frontend inventory copied into MongoDB. Review supplied vehicle facts before publication.');}
 const max=await Car.findOne().sort({id:-1});await Counter.updateOne({_id:'cars'},{$max:{seq:max?.get('id')??0}},{upsert:true});
 if(await Article.countDocuments()===0){await Article.insertMany(input.articles.map((article:{body:{heading:string;paragraphs:string[]}[]})=>({...article,sections:article.body,body:article.body.map(section=>`## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`).join('\n\n'),status:publish?'Published':'Draft'})));console.info('Existing labeled sample editorial copied into MongoDB.');}
  for(const page of input.pages){
   await Page.updateOne({key:page.key},{$setOnInsert:{...page,status:'Draft'}},{upsert:true});
   const existing=await Page.findOne({key:page.key});if(!existing)continue;
   const set:Record<string,unknown>={};
   const currentHero=(existing.get('hero') as Record<string,unknown>|undefined)??{};
   if(page.hero)for(const [field,value] of Object.entries(page.hero)){if(!currentHero[field])set[`hero.${field}`]=value;}
   if(page.key==='home'&&page.hero?.slides&&(!Array.isArray(currentHero.slides)||(currentHero.slides as unknown[]).length!==3))set['hero.slides']=page.hero.slides;
   const current=(existing.get('sections') as {id:string}[]|undefined)??[];const missing=(page.sections as {id:string}[]).filter(section=>!current.some(item=>item.id===section.id));
   if(missing.length)set.sections=[...current,...missing];
   if(Object.keys(set).length)await Page.updateOne({key:page.key},{$set:set});
  }
  const assetFiles=await readdir(new URL('../public/media/',import.meta.url));
  for(const name of assetFiles.filter(file=>/\.(png|jpe?g|webp|gif|avif)$/i.test(file))){const src=`/media/${name}`;await Media.updateOne({src},{$setOnInsert:{name:basename(name),src,alt:`Mustang Garage collection image ${basename(name,'.png').replace(/[-_]/g,' ')}`,publicId:`project:${name}`,origin:'Project asset'}},{upsert:true});}
 console.info('Seed completed without replacing existing records.');
}catch{console.error('Seed could not complete. Check MongoDB access and configuration.');process.exitCode=1;}finally{await mongoose.disconnect();}
