import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type { ContactNotifier } from '../email/contactNotification.js';
import { createContactHandler, publicController } from '../controllers/publicController.js';

const formLimit = () => rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many submissions. Please try again later.' } });

export function createPublicRoutes(options:{notifyContact?:ContactNotifier}={}) {
const router = Router();
router.get('/cars', publicController.listCars);
router.get('/cars/:id', publicController.getCar);
router.get('/articles', publicController.listArticles);
router.get('/articles/:slug', publicController.getArticle);
router.get('/pages/:key', publicController.getPage);
router.post('/contact', formLimit(), createContactHandler(options.notifyContact));
router.post('/newsletter', formLimit(), publicController.subscribe);

return router;
}
