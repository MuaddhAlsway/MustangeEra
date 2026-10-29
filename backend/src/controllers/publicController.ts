import type { RequestHandler } from 'express';
import { sendContactNotification, type ContactNotifier, type NotificationResult } from '../email/contactNotification.js';
import { z } from 'zod';
import { Article, Car, Inquiry, Page, Subscriber } from '../models/index.js';
import { HttpError } from '../middleware/httpError.js';
import {
  contactSchema,
  consentText,
  newsletterSchema,
  pageKey,
  pagination,
} from '../validation.js';
import { publicArticle, publicCar } from './contentController.js';

const ensure = (condition: unknown, status: number, message: string) => {
  if (!condition) throw new HttpError(status, message);
};
const literal = (query: string) => new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
export function createContactHandler(notify:ContactNotifier=sendContactNotification):RequestHandler {
  return async(req,res)=>{
    const data=contactSchema.parse(req.body);
    if(data.carId)ensure(await Car.exists({id:data.carId,status:'Listed'}),404,'This car is no longer listed.');
    // Save the inquiry first. Email-provider trouble must not lose the visitor's message.
    const inquiry=await Inquiry.create({...data,notification:{status:'Pending'}});
    let notification:NotificationResult;
    try{notification=await notify({id:String(inquiry._id),...data});}
    catch{notification={status:'Unconfirmed',error:'Contact notification could not be confirmed. The inquiry is saved.'};}
    try{await Inquiry.updateOne({_id:inquiry._id},{$set:{notification:{...notification,attemptedAt:new Date()}}});}
    catch{console.error('Contact notification metadata could not be saved. Inquiry remains in inbox.');}
    res.status(201).json({message:'Your inquiry has been received by the garage.'});
  };
}

export const publicController = {
  listCars: (async (req, res) => {
    const { page, limit, q } = pagination.parse(req.query);
    const filter = { status: 'Listed', ...(q ? { $or: [{ make: literal(q) }, { model: literal(q) }] } : {}) };
    const [items, total] = await Promise.all([
      Car.find(filter).sort({ id: 1 }).skip((page - 1) * limit).limit(limit),
      Car.countDocuments(filter),
    ]);
    res.json({ items: items.map(publicCar), total, page, limit });
  }) satisfies RequestHandler,
  getCar: (async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const car = await Car.findOne({ id, status: 'Listed' });
    ensure(car, 404, 'Machine not found.');
    res.json(publicCar(car!));
  }) satisfies RequestHandler,
  listArticles: (async (req, res) => {
    const { page, limit } = pagination.parse(req.query);
    const filter = { status: 'Published' };
    const [items, total] = await Promise.all([
      Article.find(filter).sort({ createdAt: 1, _id: 1 }).skip((page - 1) * limit).limit(limit),
      Article.countDocuments(filter),
    ]);
    res.json({ items: items.map((item, index) => publicArticle(item, (page - 1) * limit + index)), total, page, limit });
  }) satisfies RequestHandler,
  getArticle: (async (req, res) => {
    const slug = z.string().max(160).parse(req.params.slug);
    const article = await Article.findOne({ slug, status: 'Published' });
    ensure(article, 404, 'Story not found.');
    res.json(publicArticle(article!));
  }) satisfies RequestHandler,
  getPage: (async (req, res) => {
    const key = pageKey.parse(req.params.key);
    const page = await Page.findOne({ key, published: { $ne: null } });
    ensure(page, 404, 'No published page content.');
    res.json(page!.get('published'));
  }) satisfies RequestHandler,
  submitContact: createContactHandler(),
  subscribe: (async (req, res) => {
    const data = newsletterSchema.parse(req.body);
    const consent = { accepted: true, text: consentText, version: data.consentVersion, source: 'public-newsletter', at: new Date() };
    try {
      await Subscriber.updateOne({ email: data.email }, { $setOnInsert: { email: data.email, name: data.name, status: 'Subscribed', consent } }, { upsert: true });
    } catch (error) {
      if ((error as { code?: number }).code !== 11000) throw error;
    }
    res.json({ message: 'Your signup request has been recorded. Existing subscription preferences are preserved.' });
  }) satisfies RequestHandler,
};
