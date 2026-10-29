import { Activity, Article, Car } from '../models/index.js';
import { sectionsFromText } from '../validation.js';

export async function logActivity(actor: string, text: string) {
  await Activity.create({ actor, text });
}

export function publicCar(doc: InstanceType<typeof Car>) {
  const value = doc.toJSON();
  const { id, year, make, model, trim, price, miles, power, type, color, image, tag, location, description } = value;
  return { id, year, make, model, trim, price, miles, power, type, color, image, tag, location, description };
}

export function publicArticle(doc: InstanceType<typeof Article>, index = 0) {
  const value = doc.toJSON();
  const body = value.sections ?? sectionsFromText(value.body as string);
  const words = (value.body as string).split(/\s+/).length;
  return {
    slug: value.slug,
    title: value.title,
    category: value.category,
    excerpt: value.excerpt,
    image: value.image,
    imageAlt: value.imageAlt || value.title,
    number: String(index + 1).padStart(2, '0'),
    readTime: `${Math.max(1, Math.ceil(words / 220))} MIN READ`,
    body,
  };
}
